// Create the defaults
var defaults = {
    propertyName: 'value',
    focusAreas: ['input', 'controls', 'settings'],
    enableAudio: false,
    speech: {
        voice: 'Google UK English Male',
        volume: 1,
        pitch: 1,
        rate: 1
    }
};

// The actual module constructor
function Keller(element, opts) {
    this.element = document.querySelector(element);
    this.options = this.utils().extend({}, defaults, opts);
    this._defaults = defaults;
    this.currentModuleId = 0;
    this.focusOnModule = 1;
    this.currentFocus = this.options.focusAreas[0];
    this.init();
}

Keller.prototype.init = function() {
    this.handlers().eventHandlers();
    this.handlers().eventListeners();
    this.sidebar().init();
    this.speech().init();
    this.voice().init();
};
