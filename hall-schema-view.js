class HallSchemaView {
	constructor() {
		this._context = null;
		this._limit = 1;
		this._images = {
			'standart': 'data:image/png;base64,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',
			'comfort': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMBQTFRF/////v7+/Pz8+/v7+fn5/f399vb27+/v9/f39fX15ubm+vr61dXV8PDw+Pj46urq4+PjwsLC3NzcwMDA5+fn4uLiz8/P39/f0NDQ29vb5eXl8/Pz6Ojozs7OysrKv7+/9PT02dnZ7e3t8fHx8vLy6+vrxMTE7Ozs7u7uxcXF5OTkyMjI2tra6enp0tLS3d3d09PTx8fHw8PDzc3N2NjYxsbGwcHB0dHR4eHh1NTU4ODg3t7e1tbWycnJ19fX////MjgTMAAAAEB0Uk5T////////////////////////////////////////////////////////////////////////////////////AMJ7sUQAAAj7SURBVHja7J3ndqO6GkBDbwZc4wJ2MMW49ySOxwnv/1ZHcu6ZhXCjCPBZV3vmF6FtVNEn5JcXAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIPxfQVEUx3H0LcDfwB5P78DRDKMoLAv+Xwf8EfxjaKjzvBYMVAA3efceKYqmzzvSz+gCLaAEF/fWfvd/NheQoxSNZZLeE3RhnkjlV4NOdSzNagrHUc+jwaU+HqrQ5acKLBuaxmU6BzgBU3aigORgRSbzWVix5EQBySFmTI7/5S9Ro8tLFNAgKDyL6VyaWFr2gtmKZ7CdjuWVckyAhybRGE+oSGwZBQW7R0km0MO64WG/1t42g1uM3kZ744aJBUwKL+c30uOn0beDR8izWu85TICHcaWcC9slF8TD2AyunFcr2ISiWeOy3tUacpCE1ysqvFVk3UVxisVfbP3uBknZDS9ObUjFtSegPZeM6MWcbZACqxHtF9AuaBkLEgEVlqNEtp3mQTpmfjSDukUVE1BAXCmybaIGadl3I+dyCyomoIBITiTxR1yQHrsSqYPVYjIXxWiqiNEDmJzQ0xmFZC5YYznopk42jyComuiLlsAXkCQUIwoasuXgB1lZoo2S6+SfJBTHGmPkIswyyM4bmiRjKfckAQkytpAtbxg8AnqJnFPNP0lACbGRzmKbxyESzJHsKtp5lxLQWVRVZMsswMMHchnbZfNtS0DnxEd6WRVMHoFtIx2e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',
			'sofa': 'data:image/png;base64,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',
			'bed': 'data:image/png;base64,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',
		};
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

	renderSeats(
		seats = [],
		selectedSeats = new Set(),
		hoveredSeat = [],
		sizes = {seatWidth: 0, seatHeight: 0},
	) {
		if (!this._context) return;

		var seatStandartImg = new Image(),
			seatComfortImg = new Image(),
			seatSofaImg = new Image(),
			seatBedImg = new Image(),
		    seatImg = null;

	    seatStandartImg.src = this._images.standart;
	    seatComfortImg.src = this._images.comfort;
	    seatSofaImg.src = this._images.sofa;
	    seatBedImg.src = this._images.bed;

		var group = 0;

		seats.forEach((seat) => {

			if (selectedSeats.has(seat.id)) {
				this._context.fillStyle = '#80dd4c'; // Выбранный
			} else if(selectedSeats.size >= this._limit) { // При достижении лимита
				this._context.fillStyle = '#cccccc';
			} else if(hoveredSeat.includes(seat.id)) {
				this._context.fillStyle = '#fab200'; // При наведении
			} else {
				this._context.fillStyle = '#fbca12'; // Желтый
			}

			const padding = 5;

			/* Размер места */
			let factor = 1;
			if(seat.type == 'sofa') {
				factor = 2;
			} else if(seat.type == 'bed') {
				if(!selectedSeats.has(seat.id)) {
					this._context.fillStyle = '#4cb5ab'; // Аскона
				}
				factor = 1.5;
			}

			const left = seat.x,
				  top = seat.y,
				  width = sizes.seatWidth * factor,
				  height = sizes.seatHeight;


			if(!seat.available) {
				this._context.fillStyle = '#cccccc'; // Неактивный
			} else if(seat.occupied) {
				this._context.fillStyle = '#fc8a66'; // Соцдистанция
			}

			/* для двойных мест */
			if(seat.group_id) {
				if(!selectedSeats.has(seat.id) && selectedSeats.size >= this._limit - 1) {
					this._context.fillStyle = '#cccccc'; // При достижении лимита
				}
				seats.forEach((find) => {
					if(find.group_id == seat.group_id) {
						if(group == 0) {
							if(seat.id == find.id) {
								this._context.fillRect(left + padding, top + padding, width - padding * 2, height - padding * 2);
								if(find.type == 'sofa') { /* Диваны */
									seatImg = seatSofaImg;
								} else if(find.type == 'bed') { /* Кровать */
									seatImg = seatBedImg;
								}
								if(seatImg) {
									this._context.drawImage(seatImg, left, top, width, height);
								}
							}
							group = find.group_id;
						} else {
							group = 0;
						}
					}
				});
			} else { /* для остальных мест */

				this._context.fillRect(left + padding, top + padding, width - padding * 2, height - padding * 2);

				if(seat.type == 'standart') { /* Стандарт */
					seatImg = seatStandartImg;
				} else if(seat.type == 'comfort') { /* Комфорт */
					seatImg = seatComfortImg;
				}
				if(seatImg) {
					this._context.drawImage(seatImg, left, top, width, height);
				}
			}

			if(this._context.fillStyle == '#cccccc' || this._context.fillStyle == '#fc8a66') {
				seat.unactive = true;
			} else seat.unactive = false;
		});
	}
}
