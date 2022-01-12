class HallSchemaService {
	getHallSchemaSeats(schemeId) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function() {
				const parser = new DOMParser();
				const xml = parser.parseFromString(xhr.responseText, 'application/xml');
				resolve(XMLHallSchemaToJSON(
					xml.documentElement.getElementsByTagName('places')[0]
				));
			}
			xhr.onerror = function() {
				reject('Error while getting XML.');
			}
			xhr.open('GET', `/performance.php?schemeId=${schemeId}`);
			xhr.responseType = 'text';
			xhr.send();
		});
	}
}
