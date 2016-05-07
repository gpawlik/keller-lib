// Create the defaults once
var pluginName = "keller",
    defaults = {
        propertyName: "value",
        focusAreas: ['input', 'controls', 'settings'],
        speechLanguage: "Google UK English Male"
    };

// The actual plugin constructor
function Keller (element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.currentModuleId = 1;
    this.focusOnModule = 1;
    this.currentFocus = this.settings.focusAreas[0];
    this.init();
    this.datesModule = [5];
}
$.extend(Keller.prototype, {
    init: function() {
        this.testFunction( "hello!!!");
        this.showKeyboard();
        this.showSettings();
        this.eventHandlers();
        this.generateVoiceCommands({
            'Barcelona': '(Barcelona)',
            'Mallorca': '(Mallorca)(Mayorga)',
            'Berlin': '(Berlin)',
            '22/04/2016': '(next week)',
            '17/04/2016': '(this weekend)'
        });
        speech.OnVoiceReady = _.bind(function() {
            this.readModuleHeaders();
        }, this);
        this.generateVoiceCommands();
    }
});