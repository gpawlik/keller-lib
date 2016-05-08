// Create the defaults once
var pluginName = "keller",
    defaults = {
        propertyName: "value",
        focusAreas: ['input', 'controls', 'settings'],
        speech: {
            voice: "Google UK English Male",
            volume: 1,
            pitch: 1,
            rate: 1            
        }
        
    };

// The actual plugin constructor
function Keller (element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.currentModuleId = 0;
    this.focusOnModule = 1;
    this.currentFocus = this.settings.focusAreas[0];
    this.init();
    this.datesModule = [5];
}
$.extend(Keller.prototype, {
    init: function() {        
        this.showSidebar();
        this.eventHandlers();
        this.generateVoiceCommands({
            'Barcelona': '(Barcelona)',
            'Mallorca': '(Mallorca)(Mayorga)',
            'Berlin': '(Berlin)',
            '22/04/2016': '(next week)',
            '17/04/2016': '(this weekend)'
        });
        this.initSpeechSynthesis();
        /*speech.OnVoiceReady = _.bind(function() {
            this.readModuleHeaders();
        }, this);*/
        this.generateVoiceCommands();
    }
});