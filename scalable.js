class Scalable {
	static get modes() {
		return {
			move: 'move',
			interact: 'interact',
		}
	}

	static get styles() {
		return `
			.scalable__scale-area {
			    flex-grow: 1;
			    overflow: hidden;
			    border: 1px solid #f0f0f0;
			}
		`;
	}

	constructor(wrappedElement) {
		this._wrappedElement = wrappedElement;
		this._handlePlusClick = this._handlePlusClick.bind(this);
		this._handleMinusClick = this._handleMinusClick.bind(this);
		this._handleResetClick = this._handleResetClick.bind(this);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleMouseDown = this._handleMouseDown.bind(this);
		this._handleMouseUp = this._handleMouseUp.bind(this);

		this._initScaleWrapper();

		this._step = 0.2;
		this._minZoom = 1;
		this._maxZoom = 3;
		this._zoom = 1;
		this._offset = {x: 0, y: 0};
		this._lastCursorPosition = {x: 0, y: 0};
		this._mode = Scalable.modes.interact;
		this._isMouseDown = false;

		this._plusButton.addEventListener('click', this._handlePlusClick);
		this._minusButton.addEventListener('click', this._handleMinusClick);
		this._resetButton.addEventListener('click', this._handleResetClick);

		this._handleStateChange();
	}

	_initScaleWrapper() {
		this._hasElements = document.getElementsByClassName('scalable');

		if(this._hasElements.length) {
			this._scaleWrapper = this._hasElements[0];
		} else {
			this._scaleWrapper = document.createElement('div');
			this._scaleWrapper.classList.add('scalable');
		}

		if(this._hasElements.length) {
			this._scaleArea = document.getElementsByClassName('scalable__scale-area')[0];
		} else {
			this._scaleArea = document.createElement('div');
			this._scaleArea.classList.add('scalable__scale-area');
		}

		this._initPlusButtonElement();
		this._initMinusButtonElement();
		this._initResetButtonElement();

		if(!this._hasElements.length) {
			this._scaleWrapper.insertAdjacentHTML('afterbegin', `<style>${Scalable.styles}</style>`)
			this._scaleWrapper.append(this._scaleArea);
		}
	}

	_initPlusButtonElement() {
		this._plusButton = document.querySelector('[data-control="2"]');
	}

	_initMinusButtonElement() {
		this._minusButton = document.querySelector('[data-control="0"]');
	}

	_initResetButtonElement() {
		this._resetButton = document.querySelector('[data-control="1"]');
	}

	_handlePlusClick() {
		const {move, interact} = Scalable.modes;
		if (this._mode === interact) {
			this._mode = move;
			this._manageListenersOnScaleArea('addEventListener');
		}
		this._zoom += this._step;
		if (this._zoom > this._maxZoom) this._zoom = this._maxZoom;
		if (this._zoom <= 1) this._offset = {x: 0, y: 0};
		this._handleStateChange();
	}

	_handleMinusClick() {
		const {move, interact} = Scalable.modes;
		this._zoom -= this._step;
		if (this._zoom < this._minZoom) this._zoom = this._minZoom;
		if (this._zoom <= 1) {
			if (this._mode === move) {
				this._mode = interact;
				this._manageListenersOnScaleArea('removeEventListener');
			}
			this._offset = {x: 0, y: 0};
		}
		this._handleStateChange();
	}

	_handleResetClick() {
		const {move, interact} = Scalable.modes;
		this._zoom = this._minZoom;
		if (this._mode === move) {
			this._mode = interact;
			this._manageListenersOnScaleArea('removeEventListener');
		}
		this._offset = {x: 0, y: 0};
		this._handleStateChange();
	}

	_handleMouseMove(event) {
		if (this._isMouseDown) {
			event.preventDefault();
			this._wrappedElement.style.pointerEvents = 'none';
			this._scaleArea.style.cursor = 'move';
			const deltaX = (event.layerX - this._lastCursorPosition.x) / this._zoom;
			const deltaY = (event.layerY - this._lastCursorPosition.y) / this._zoom;

			this._lastCursorPosition = {
				x: event.layerX,
				y: event.layerY,
			};

			this._offset = {
				x: this._offset.x + deltaX,
				y: this._offset.y + deltaY,
			};

			this._handleStateChange();
		} else {
			this._wrappedElement.style.pointerEvents = 'all';
			this._scaleArea.style.cursor = 'auto';
		}
	}

	_handleMouseDown(event) {
		this._isMouseDown = true;
		this._lastCursorPosition = {
			x: event.layerX,
			y: event.layerY,
		};
		this._handleStateChange();
	}

	_handleMouseUp() {
		this._isMouseDown = false;
		this._handleStateChange();
	}

	_handleTouchMove(event) {
		
	}

	_manageListenersOnScaleArea(method) {
		this._scaleArea[method]('touchmove', this._handleMouseMove);
		this._scaleArea[method]('mousemove', this._handleMouseMove);

		this._scaleArea[method]('touchstart', this._handleMouseDown);
		this._scaleArea[method]('mousedown', this._handleMouseDown);

		this._scaleArea[method]('touchend', this._handleMouseUp);
		this._scaleArea[method]('mouseup', this._handleMouseUp);

		this._scaleArea[method]('mouseenter', this._handleMouseUp);
		this._scaleArea[method]('mouseleave', this._handleMouseUp);
	}

	_handleModeChangeClick() {
		const {move, interact} = Scalable.modes;

		if (this._mode === interact) {
			this._mode = move;
			this._manageListenersOnScaleArea('addEventListener');
		} else if (this._mode === move) {
			this._mode = interact;
			this._manageListenersOnScaleArea('removeEventListener');
		}
		this._handleStateChange();
	}

	_handleStateChange() {
		const {move, interact} = Scalable.modes;

		if (this._zoom === this._maxZoom) this._plusButton.setAttribute('disabled', true);
		else this._plusButton.removeAttribute('disabled');
		if (this._zoom === this._minZoom) this._minusButton.setAttribute('disabled', true);
		else this._minusButton.removeAttribute('disabled');

		this._wrappedElement.dataset.scale = this._zoom;
		this._wrappedElement.style.transform = `
			scale(${this._zoom})
			translate(${this._offset.x}px, ${this._offset.y}px)
		`;
	}

	init() {
		if(!this._hasElements.length) {
			this._wrappedElement.before(this._scaleWrapper);
			this._scaleArea.append(this._wrappedElement);
		}
	}
}