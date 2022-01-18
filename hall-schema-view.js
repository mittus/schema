class HallSchemaView {
	constructor() {
		this._context = null;
		this._limit = false;
		this._limit = false;
	}

	set context(context) {
		this._context = context;
	}

	renderRows(rows, sizes) {
		rows.forEach((row) => {
			this._context.textBaseline = 'middle';
			this._context.textAlign = 'center';
			this._context.fillStyle = 'rgba(0, 0, 0, 0.4)';
			this._context.font = '20px sans-serif';
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
		this._context.font = '18px sans-serif';
		this._context.fillText('ЭКРАН', sizes.canvasWidth / 2, sizes.screenHeight);
	}

	renderLegend(sizes) {
		// console.log(sizes)
		this._context.textBaseline = 'middle';
		this._context.textAlign = 'center';
		this._context.fillStyle = 'rgba(0, 0, 0, 0.4)';
		this._context.font = '20px sans-serif';

		// this._context.stroke(new Path2D(`
		// 	M ${sizes.rowWidth} ${sizes.screenHeight}
		// 	Q ${sizes.canvasWidth / 2} 0 ${sizes.canvasWidth - sizes.rowWidth} ${sizes.screenHeight}
		// `));

		this._context.fillText('Легенда с описанием и назначением мест', sizes.canvasWidth / 2, sizes.canvasHeight - sizes.legendMargin);
	}

	renderSeats(
		seats = [],
		selectedSeats = new Set(),
		hoveredSeat = [],
		sizes = {seatWidth: 0, seatHeight: 0},
	) {
		if (!this._context) return;

		var seatImg = null,
			group = 0,
			keys = Object.keys(this._images);

		seats.forEach((seat) => {
			/* Раскраска */
			let color = '#fbca12'; // Стандартный
			if(!selectedSeats.has(seat.id)) {
				if(seat.type == 'bed') {
					color = '#4cb5ab'; // Аскона
				} else if(seat.type == 'massage') {
					color = '#ed3024'; // Ямагучи
				}
			} 
			if (selectedSeats.has(seat.id)) {
				color = '#80dd4c'; // Выбранный
			} else if(this._limit && selectedSeats.size >= this._limit) { // При достижении лимита
				color = '#cccccc';
			} else if(hoveredSeat.includes(seat.id)) {
				color = shadeColor(color, -5) // При наведении
			}

			/* Размер места */
			const padding = 5;
			let factor = 1;
			if(seat.type == 'sofa') {
				factor = 2;
			} else if(seat.type == 'bed') {
				factor = 1.5;
			}

			const left = seat.x,
				  top = seat.y,
				  width = sizes.seatWidth * factor,
				  height = sizes.seatHeight;


			if(!seat.available) {
				color = '#cccccc'; // Неактивный
			} else if(seat.occupied) {
				color = '#fc8a66'; // Соцдистанция
			}

			/* для двойных мест */
			if(seat.group_id) {
				if(!selectedSeats.has(seat.id) && this._limit && selectedSeats.size >= this._limit - 1 && !seat.occupied) {
					color = '#cccccc'; // При достижении лимита
				}
				seats.forEach((find) => {
					if(find.group_id == seat.group_id) {
						if(group == 0) {
							if(seat.id == find.id) {
								this._context.fillStyle = color;
								this._context.fillRect(left + padding, top + padding, width - padding * 2, height - padding * 2);
								if(keys.indexOf(find.type) !== -1) {
									this._context.drawImage(this._images[find.type], left, top, width, height);
								}
							}
							group = find.group_id;
						} else {
							group = 0;
						}
					}
				});
			} else { /* для обычных мест */
				this._context.fillStyle = color;
				this._context.fillRect(left + padding, top + padding, width - padding * 2, height - padding * 2);

				if(keys.indexOf(seat.type) !== -1) {
					this._context.drawImage(this._images[seat.type], left, top, width, height);
				}
			}

			if(color == '#cccccc' || color == '#fc8a66') {
				seat.unactive = true;
			} else seat.unactive = false;


			if(this._names) {
				this._context.textBaseline = 'top';
				this._context.textAlign = 'center';
				this._context.fillStyle = 'rgba(0, 0, 0, 0.5)';
				this._context.font = '15px sans-serif';
				this._context.fillText(seat.title, left + sizes.seatWidth/2, top + sizes.seatHeight - padding);
			}

		});
	}
}
