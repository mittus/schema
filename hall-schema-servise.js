class HallSchemaService {
	getHallSchemaSeats(schemeId) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function() {
				resolve(JSONHallSchema(xhr.response.places));
				/*
				const parser = new DOMParser();
				const xml = parser.parseFromString(xhr.responseText, 'application/xml');
				resolve(XMLHallSchemaToJSON(
					xml.documentElement.getElementsByTagName('places')[0]
				));
				*/
			}
			xhr.onerror = function() {
				reject('Error while getting XML.');
			}
			xhr.open('GET', `performance2.php?get_performance=${schemeId}`);
			xhr.responseType = 'json';
			xhr.send();
		});
	}
}