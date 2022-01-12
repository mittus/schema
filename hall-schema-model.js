class HallSchemaModel {
	static get selectionModes() {
		return {
			select: 'select',
			unselect: 'unselect',
		};
	}

	constructor() {
		this._subscribers = [];
		this._weakMemo = new WeakMap();

		this._sizes = {
			seatWidth: 40,
			seatHeight: 40,
			rowWidth: 40,
			screenHeight: 50,
			screenMargin: 50,
			canvasWidth: 0,
			canvasHeight: 0,
		};
		this._DPR = window.devicePixelRatio || 1;

		this._seats = [];
		this._selectedSeats = new Set();
		this._seatsToSelect = new Set();
		this._seatsToUnselect = new Set();
		this._rows = [];

		this._cursor = {x: 0, y: 0};
		this._proportion = {vertical: 1, horizontal: 1};
		this._selectStart = {x: 0, y: 0};

		this._isMouseDown = false;
		this._mode = HallSchemaModel.selectionModes.select;
	}

	get selectedSeats() {
		let selectedSeats = this._selectedSeats;
		if (this._seatsToUnselect.size) {
			selectedSeats = new Set();
			this._selectedSeats.forEach((seatId) => {
				if (!this._seatsToUnselect.has(seatId)) {
					selectedSeats.add(seatId);
				}
			});
		} else if (this._seatsToSelect.size) {
			selectedSeats = new Set([
				...this._selectedSeats,
				...this._seatsToSelect,
			]);
		}

		return selectedSeats;
	}
	get cursor() {
		return {
			x: this._cursor.x / this._DPR,
			y: this._cursor.y / this._DPR,
		};
	}
	get sizes() { return this._sizes; };
	get sizesWithDPR() {
		return {
			...this._sizes,
			canvasHeight: this._sizes.canvasHeight * this._DPR,
			canvasWidth: this._sizes.canvasWidth * this._DPR,
		};
	};
	get proportion() { return this._proportion; }
	get seats() {
		if (!this._weakMemo.has(this._seats)) {
			this._weakMemo.set(this._seats, this._seats.map((seat) => ({
				...seat,
				x: seat.x + this.offset.x,
				y: seat.y + this.offset.y,
			})));
		}
		return this._weakMemo.get(this._seats)
	}
	get rows() {
		return this._rows.map((row) => ({
			...row,
			y: row.y + this.offset.y,
		}));
	}
	get isMouseDown() { return this._isMouseDown; }
	get selectStart() { return this._selectStart; }
	get seatUnderCursor() {
		return this.seats.find((seat) => (
			seat.x <= this.cursor.x
			&& (seat.x + this._sizes.seatWidth) >= this.cursor.x
			&& seat.y <= this.cursor.y
			&& (seat.y + this._sizes.seatHeight) >= this.cursor.y
		));
	}
	get offset() {
		return {
			x: this._sizes.rowWidth,
			y: this._sizes.screenHeight + this._sizes.screenMargin,
		};
	};
	get DPR() { return this._DPR; }

	set state({
		seats,
		rows,
		cursor,
		proportion,
		isMouseDown,
		isMouseInsideWorkspace,
	}) {
		if (seats) {
			this._seats = seats;
			this._selectedSeats = new Set();
			this._seatsToSelect = new Set();
			this._seatsToUnselect = new Set();
			this._sizes = {
				...this._sizes,
				...this._calculateCanvasSizes(),
			}
		}
		if (rows) this._rows = rows;
		if (proportion) this._proportion = proportion;
		if (cursor) this._changeCursor(cursor);
		if (typeof isMouseDown === 'boolean') {
			this._isMouseDown = isMouseDown;
			if (isMouseDown) {
				this._selectStart = this.cursor;
				this._setMode();
			} else if (typeof isMouseInsideWorkspace === 'boolean'
				? isMouseInsideWorkspace
				: !isMouseInsideWorkspace
			) this._handleMouseUp();
		};
		if (
			this._isMouseDown && cursor
			&& (typeof isMouseInsideWorkspace === 'boolean'
				? isMouseInsideWorkspace
				: !isMouseInsideWorkspace
			)
		) {
			this._selectOrUnselectSeatsUnderSelection();
		}

		this._notify();
	}

	subscribeForUpdates(callback) {
		this._subscribers.push(callback);
	}

	_setMode() {
		const {seatUnderCursor} = this;
		if (seatUnderCursor && this._selectedSeats.has(seatUnderCursor.id)) {
			this._mode = HallSchemaModel.selectionModes.unselect;
		} else this._mode = HallSchemaModel.selectionModes.select;
	}

	_calculateCanvasSizes() {
		const canvasSizes = this._seats.reduce((accumulator, seat) => {
			accumulator.canvasWidth = Math.max(accumulator.canvasWidth, seat.x + this._sizes.seatWidth);
			accumulator.canvasHeight = Math.max(accumulator.canvasHeight, seat.y + this._sizes.seatHeight);

			return accumulator;
		}, {canvasWidth: 0, canvasHeight: 0});
		canvasSizes.canvasWidth += this._sizes.rowWidth * 2;
		canvasSizes.canvasHeight += this._sizes.screenHeight + this._sizes.screenMargin;

		return canvasSizes;
	}

	_handleMouseUp() {
		if (this._seatsToSelect.size) {
			this._seatsToSelect.forEach((seatId) => {
				this._selectedSeats.add(seatId);
			});
			this._seatsToSelect.clear();
		} else if (this._seatsToUnselect.size) {
			this._seatsToUnselect.forEach((seatId) => {
				this._selectedSeats.delete(seatId);
			});
			this._seatsToUnselect.clear();
		} else {
			const {seatUnderCursor} = this;
			if (seatUnderCursor) {
				const {select, unselect} = HallSchemaModel.selectionModes;
	
				if (this._mode === select) {
					this._selectedSeats.add(seatUnderCursor.id);
				} else if (this._mode === unselect) {
					this._selectedSeats.delete(seatUnderCursor.id);
				}
			}
		}
	}

	_checkHasIntersectionWithSelection(seat) {
		return getHasIntersection(
			{
				x1: seat.x,
				y1: seat.y,
				x2: seat.x + this._sizes.seatWidth,
				y2: seat.y + this._sizes.seatHeight,
			},
			getNormalizedRect({
				x1: this._selectStart.x,
				y1: this._selectStart.y,
				x2: this.cursor.x,
				y2: this.cursor.y,
			})
		)
	}

	_selectOrUnselectSeatsUnderSelection() {
		const {unselect} = HallSchemaModel.selectionModes;
		let field = '_seatsToSelect';
		if (this._mode === unselect) {
			field = '_seatsToUnselect';
		}

		this.seats.forEach((seat) => {
			if (this._checkHasIntersectionWithSelection(seat)) {
				this[field].add(seat.id);
			} else this[field].delete(seat.id);
		});
	}

	_notify() {
		this._subscribers.forEach((callback) => {
			callback(this);
		});
	}

	_changeCursor(cursor) {
		this._cursor = {
			x: cursor.x * this._proportion.horizontal,
			y: cursor.y * this._proportion.vertical,
		};
	}
}
