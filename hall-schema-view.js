class HallSchemaView {
	constructor() {
		this._context = null;
	}

	set context(context) {
		this._context = context;
	}

	renderSelection({x: startX, y: startY}, {x: endX, y: endY}) {
		const width = endX - startX;
		const height = endY - startY;

		const selection = new Path2D(`
			M ${startX},${startY}
			h ${width}
			v ${height}
			h ${-width}
			v ${-height}
		`);

		this._context.lineWidth = 1;
		this._context.fillStyle = 'rgba(74, 144, 226, 0.2)';
		this._context.fill(selection);
		this._context.strokeStyle = 'rgb(74, 144, 226)';
		this._context.stroke(selection);
	}

	renderRows(rows, sizes) {
		rows.forEach((row) => {
			this._context.textBaseline = 'middle';
			this._context.textAlign = 'center';
			this._context.fillStyle = 'rgba(0, 0, 0, 0.6)';
			this._context.font = '14px sans-serif';
			this._context.fillText(row.title, sizes.rowWidth / 2, row.y + sizes.seatHeight / 2);
			this._context.fillText(row.title, sizes.canvasWidth - sizes.rowWidth / 2, row.y + sizes.seatHeight / 2);
		});
	}

	renderScreen(sizes) {
		const lineWidth = 4;
		this._context.lineWidth = lineWidth;
		this._context.strokeStyle = 'rgba(0, 0, 0, 0.4)';
		this._context.fillStyle = 'rgba(0, 0, 0, 0.4)';

		this._context.stroke(new Path2D(`
			M ${sizes.rowWidth} ${sizes.screenHeight}
			Q ${sizes.canvasWidth / 2} 0 ${sizes.canvasWidth - sizes.rowWidth} ${sizes.screenHeight}
		`));
		this._context.textBaseline = 'bottom';
		this._context.textAlign = 'center';
		this._context.font = '14px sans-serif';
		this._context.fillText('ЭКРАН', sizes.canvasWidth / 2, sizes.screenHeight);
	}

	renderSeats(
		seats = [],
		selectedSeats = new Set(),
		sizes = {seatWidth: 0, seatHeight: 0},
	) {
		if (!this._context) return;

		seats.forEach((seat) => {
			if (selectedSeats.has(seat.id)) {
				this._context.fillStyle = '#FFC700';
			} else {
				this._context.fillStyle = '#A4CE36';
			}
			this._context.fillRect(seat.x, seat.y, sizes.seatWidth, sizes.seatHeight);
			if (seat.color) {
				this._context.strokeStyle = `#${seat.color}`;
				const lineWidth = 4;
				const halfLineWidth = lineWidth / 2;
				this._context.lineWidth = lineWidth;
				this._context.strokeRect(seat.x + halfLineWidth, seat.y + halfLineWidth, sizes.seatWidth - lineWidth, sizes.seatHeight - lineWidth);
			}
			this._context.textBaseline = 'middle';
			this._context.textAlign = 'center';
			this._context.fillStyle = 'black';
			this._context.font = '16px sans-serif';
			this._context.fillText(seat.title, seat.x + sizes.seatWidth / 2, seat.y + sizes.seatWidth / 2);
		});
	}
}
