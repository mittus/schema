class HallSchemaView {
	constructor() {
		this._context = null;
	}

	set context(context) {
		this._context = context;
	}

	/*
		// отрисовка квадрата под курсором
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
	*/

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

		var seatStandartImg = new Image(),
			seatComfortImg = new Image(),
			seatSofaImg = new Image(),
			seatBedImg = new Image(),
		    seatImg = null;

	    seatStandartImg.src = "/img/seat-standart-white.png";
	    seatComfortImg.src = "/img/seat-comfort-white.png";
	    seatSofaImg.src = "/img/seat-sofa-white.png";
	    seatBedImg.src = "/img/seat-bed-white.png";
	    // console.log(this.countImagesLoaded);

	    // seatLoveImg.src = "data:image/svg+xml;base64," +
	    //    window.btoa();
		// console.log(selectedSeats);
		var group = 0;

		seats.forEach((seat) => {
			if (selectedSeats.has(seat.id)) {
				this._context.fillStyle = '#80dd4c';
			} else {
				this._context.fillStyle = '#fbca12';
			}


			const lineWidth = 4;
			const halfLineWidth = lineWidth / 2;

			let factor = 1;
			if(seat.type == 'sofa') {
				factor = 2;
			} else if(seat.type == 'bed') {
				if(!selectedSeats.has(seat.id)) {
					this._context.fillStyle = '#4cb5ab';
				}
				factor = 1.5;
			}

			const line2Width = 8;
			const half2LineWidth = line2Width / 2;
			var leftMove = seat.x + halfLineWidth,
				topMove = seat.y + halfLineWidth,
				baseSize = sizes.seatWidth * factor - lineWidth,
				heightSize = sizes.seatHeight - lineWidth;

			var left2Move = seat.x + half2LineWidth,
				top2Move = seat.y + half2LineWidth,
				base2Size = sizes.seatWidth * factor - line2Width,
				height2Size = sizes.seatHeight - line2Width;

			if(!seat.available) {
				this._context.fillStyle = '#cccccc';
			}

			if(seat.group_id) {
					seats.forEach((find) => {
						if(find.group_id == seat.group_id) {
							if(group == 0) {
								if(seat.id == find.id) {
									this._context.fillRect(left2Move, top2Move, base2Size, height2Size);
									if(find.type == 'sofa') { /* Диваны */
										seatSofaImg.addEventListener('load', e => {
											this._context.drawImage(seatSofaImg, leftMove, topMove, baseSize, heightSize);
										});
										seatImg = seatSofaImg;
									} else if(find.type == 'bed') { /* Кровать */
										seatBedImg.addEventListener('load', e => {
											this._context.drawImage(seatBedImg, leftMove, topMove, baseSize, heightSize);
										});
										seatImg = seatBedImg;
									}
									if(seatImg) {
										this._context.drawImage(seatImg, leftMove, topMove, baseSize, heightSize);
									}
								}
								group = find.group_id;
							} else {
								group = 0;
							}
						}
					});
				// } else {

				// }

			} else {

				// this._context.strokeStyle = `#${seat.color}`;

				// this._context.lineWidth = lineWidth;
				// this._context.strokeRect(seat.x + halfLineWidth, seat.y + halfLineWidth, sizes.seatWidth - lineWidth, sizes.seatHeight - lineWidth);


				this._context.fillRect(left2Move, top2Move, base2Size, height2Size);

				if(seat.type == 'standart') {
					seatStandartImg.addEventListener('load', e => {
						this._context.drawImage(seatStandartImg, leftMove, topMove, baseSize, heightSize);
					});
					seatImg = seatStandartImg;
				} else if(seat.type == 'comfort') { /* Комфорт */
					seatComfortImg.addEventListener('load', e => {
						this._context.drawImage(seatComfortImg, leftMove, topMove, baseSize, heightSize);
					});
					// console.log(seat.color);
					seatImg = seatComfortImg;
				}

				if(seatImg) {
					// this._context.fill();
					this._context.drawImage(seatImg, leftMove, topMove, baseSize, heightSize);
					// this._context.rect(leftMove, topMove, baseSize, heightSize);
					// this._context.strokeRect(leftMove, topMove, baseSize, heightSize);
				}

			}




			// this._context.textBaseline = 'middle';
			// this._context.textAlign = 'center';
			// this._context.fillStyle = seat.color;//'black';
			// this._context.font = '16px sans-serif';
			// this._context.fillText(seat.group_id, seat.x + sizes.seatWidth / 2, seat.y + sizes.seatWidth / 2);
		});
	}
}