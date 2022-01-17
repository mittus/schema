function XMLHallSchemaToJSON(hallSchema) {
	const rows = [];
	const seats = [];

	for (const row of hallSchema.children) {
		let rowYSum = 0;
		for (const seatElement of row.children) {
			const seat = {
				x: +seatElement.getAttribute('X'),
				y: +seatElement.getAttribute('Y'),
				id: seatElement.getAttribute('id'),
				title: seatElement.getAttribute('title'),
				row: seatElement.getAttribute('row'),
				color: seatElement.getAttribute('colorValue'),
				price: seatElement.getAttribute('price'),
				placeState: seatElement.getAttribute('placeState'),
				type: seatElement.getAttribute('placeType'),
			};
			rowYSum += seat.y;

			seats.push(seat);
		}

		rows.push({
			title: row.getAttribute('title'),
			y: rowYSum / row.childElementCount,
		});
	}

	return {seats, rows};
}

function JSONHallSchema(hallSchema) {
	const rows = [];
	const seats = [];

	hallSchema.sort((a, b) => a.row - b.row);

	let rowYSum = 0;

	for (const [i, item] of hallSchema.entries()) {

		if(i == 0 || rowYSum < item.y) {
			rowYSum = item.y;
			rowItem = item.row;
			rows.push({
				title: item.row,
				y: rowYSum,
			});
		}

		const seat = {
			x: +item.x,
			y: +item.y,
			id: item.id,
			title: item.place,
			row: item.row,
			color: item.color,
			price: item.price,
			place: item.place,
			type: item.type,
			double: item.double,
			available: item.available,
			group_id: item.group_id,
			occupied: item.occupied,
			unactive: false,
		};

		seats.push(seat);
	}

	return {seats, rows};
}

function getNormalizedRect(rect) {
	let {x1, y1, x2, y2} = rect;
	if (x1 > x2) ([x1, x2] = [x2, x1]);
	if (y1 < y2) ([y1, y2] = [y2, y1]);

	return {x1, y1, x2, y2};
}

function getHasIntersection(rect1, rect2) {
	return (
		((rect1.x1 - rect2.x2) * (rect1.x2 - rect2.x1) < 0)
		&& ((rect1.y1 - rect2.y1) * (rect1.y2 - rect2.y2) < 0)
	);
}

function shadeColor(color, percent) {  // deprecated. See below.
    var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}