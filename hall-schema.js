class HallSchema {
	constructor(
		service = new HallSchemaService(),
		model = new HallSchemaModel(),
		view = new HallSchemaView(),
		controller = new HallSchemaController(),
	) {
		this._service = service;
		this._model = model;
		this._view = view;
		this._controller = controller;

		this._controller.hallSchemaView = this._view;
		this._controller.hallSchemaModel = this._model;

		this._fetchingListeners = [];
	}

	set schemeId(schemeId) {
		this._notifyIsFetching(true);
		this._service.getHallSchemaSeats(schemeId)
			.then((hallSchema) => {
				this._notifyIsFetching(false);
				this._model.state = hallSchema;
			})
			.catch((error) => {
				this._notifyIsFetching(false);
				alert(error);
			});
	}

	get selectedSeats() {
		return [...this._model._selectedSeats];
	}

	init(root) {
		this._controller.run(root);
	}

	onFetching(callback) {
		this._fetchingListeners.push(callback);
	}

	_notifyIsFetching(isFetching) {
		this._fetchingListeners.forEach((callback) => {
			callback(isFetching);
		});
	}
}