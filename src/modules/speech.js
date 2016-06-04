Keller.prototype.speech = function() {

    var _this = this,
        _ = _this.utils();

    var initSpeechSynthesis = function() {
        if (!('speechSynthesis' in window)) {
            console.log('Speach synthesis is not supported...');
            return false;
        }
        // "onvoiceschanged" event fires when voices are ready
        window.speechSynthesis.onvoiceschanged = _.bind(function() {
            _this.cachedVoice = loadVoice(_this.options.speech.voice);
        }, _this);
    };

    var readModuleHeaders = function() {
        var moduleHeaders = _.getCurrentModule().querySelectorAll('[data-ue-speech]');

        for (var i = 0; i < moduleHeaders.length; i++) {
            readText(moduleHeaders[i].getAttribute('data-ue-speech'));
        }
    };

    var readText = function(text) {
        if (_this.options.enableAudio) {
            speak(text);
        }
    };

    var loadVoice = function(voiceName) {
        return window.speechSynthesis.getVoices().filter(function(voice) {
            return voice.name === voiceName;
        })[0];
    };

    var speak = function(text) {
        // TODO: check character limit, split long texts into chunks
        var msg = new SpeechSynthesisUtterance();
        msg.volume = _this.options.speech.volume;
        msg.rate = _this.options.speech.rate;
        msg.pitch = _this.options.speech.pitch;
        msg.voice = _this.cachedVoice || loadVoice(_this.options.speech.voice);
        msg.text = text;

        msg.onerror = function() {
            console.log('An error occured while generating:', msg.text);
        };

        window.speechSynthesis.speak(msg);
    };

    var createSpeechWidget = function() {
        var widget = document.createElement('div');
        _.addEvent(widget, 'click', _.bind(activateSpeechOption, _this));
        _.addClass(widget, 'widget-icon');
        _.addClass(widget, 'speech-widget-icon');
        widget.innerHTML = '3';
        return widget;
    };

    var activateSpeechOption = function(e) {
        _this.options.enableAudio = !_this.options.enableAudio;
        _.toggleClass(e.currentTarget, 'active', _this.options.enableAudio);
    };

    return {
        init: initSpeechSynthesis,
        readModuleHeaders: readModuleHeaders,
        createWidget: createSpeechWidget
    };
};
