class HallSchemaController {
	constructor() {
		this._handleResize = this._handleResize.bind(this);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);
		this._handleMouseEnterOrLeave = this._handleMouseEnterOrLeave.bind(this);
		this._handleModelChange = this._handleModelChange.bind(this);
	}

	set hallSchemaView(hallSchemaView) {
		this._hallSchemaView = hallSchemaView;
	}

	set hallSchemaModel(hallSchemaModel) {
		this._hallSchemaModel = hallSchemaModel;
	}

	run(root) {
		this._canvas = document.createElement('canvas');
		this._canvas.style.width = '100%';
		this._canvas.style.userSelect = 'none';

		this._context = this._canvas.getContext('2d');
		this._hallSchemaView.context = this._context;

		this._initHandlers();

		root.append(this._canvas);

		this._hallSchemaModel.subscribeForUpdates(this._handleModelChange);
		this._handleModelChange();
	}

	_initHandlers() {
		if (ResizeObserver) {
			const resizeObserver = new ResizeObserver(this._handleResize);
			resizeObserver.observe(this._canvas);
		} else {
			document.addEventListener('resize', this._handleResize);
			let prevSizes = this._canvas.getBoundingClientRect();
			setInterval(() => {
				const currentSizes = this._canvas.getBoundingClientRect();
				if (['width', 'height', 'left', 'top'].some((field) => (
						prevSizes[field] !== currentSizes[field]
				))) this._handleResize();
				prevSizes = currentSizes;
			}, 1000);
		}

		this._canvas.addEventListener('mousemove', this._handleMouseMove, false);
		this._canvas.addEventListener('mousedown', this._handleMouseDown);
		this._canvas.addEventListener('mouseup', this._handleMouseUp);
		this._canvas.addEventListener('mouseenter', this._handleMouseEnterOrLeave);
		this._canvas.addEventListener('mouseleave', this._handleMouseEnterOrLeave);
	}

	_handleResize() {
		const {width, height} = this._canvas.getBoundingClientRect();
		let {scale} = this._canvas.parentElement.dataset;
		scale = scale ? +scale : 1;

		this._hallSchemaModel.state = {
			proportion: {
				horizontal: this._canvas.width / width * scale,
				vertical: this._canvas.height / height * scale,
			}
		}
	}

	_handleMouseMove(event) {
		if(this._hallSchemaModel.hoveredSeat.length) {
			this._canvas.style.cursor = 'pointer';
		} else {
			this._canvas.style.cursor = 'auto';
		}
		this._hallSchemaModel.state = {
			isMouseMove: true,
			cursor: {
				x: event.offsetX,
				y: event.offsetY,
			},
		};
	}

	_handleMouseDown(event) {
		this._hallSchemaModel.state = {
			isMouseDown: true,
			cursor: {
				x: event.offsetX,
				y: event.offsetY,
			},
		};
	}

	_handleMouseUp(event) {
		this._hallSchemaModel.state = {
			isMouseDown: false,
			cursor: {
				x: event.offsetX,
				y: event.offsetY,
			},
		};
	}

	_handleMouseEnterOrLeave() {
		this._hallSchemaModel.state = {
			isMouseInsideWorkspace: false,
			isMouseDown: false,
			isMouseMove: false,
		};
	}

	_handleModelChange() {
		const {
			sizes, sizesWithDPR, DPR, seats, selectedSeats, hoveredSeat, rows, legend, isMouseDown, isMouseMove, selectStart, cursor,
		} = this._hallSchemaModel;

		if (!seats.length) return;

		this._canvas.width = sizesWithDPR.canvasWidth;
		this._canvas.height = sizesWithDPR.canvasHeight;
		this._context.scale(DPR, DPR);
		this._context.clearRect(0, 0, sizesWithDPR.canvasWidth, sizesWithDPR.canvasHeight);

		this._hallSchemaView.renderScreen(sizes);
		this._hallSchemaView.renderSeats(seats, selectedSeats, hoveredSeat, sizes);
		this._hallSchemaView.renderRows(rows, sizes);
		this._hallSchemaView.renderLegend(sizes, legend);
	}
}
