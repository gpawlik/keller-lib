Keller.prototype.voice = function() {

    var _this = this,
        _ = _this.utils();

    var initVoiceRecognition = function() {
        if (!('webkitSpeechRecognition' in window)) {
            _this.voiceRecognition = false;
            console.log('Speech recognition not supported');
        } else {
            _this.voiceRecognition = new webkitSpeechRecognition();
            _this.voiceRecognition.continuous = true;
            _this.voiceRecognition.interimResults = true;
            processRecognizedText(_this.voiceRecognition);
        }
    };

    var voiceStart = function() {
        if (_this.voiceRecognition) {
            _this.voiceRecognition.start();
        }
    };

    var voiceStop = function() {
        if (_this.voiceRecognition) {
            _this.voiceRecognition.stop();
        }
    };

    var processRecognizedText = function(recognition) {

        recognition.onresult = function(event) {
            var finalTranscript = '',
                interimTranscript = '';

            if (typeof(event.results) === 'undefined') {
                recognition.stop();
                console.log('There was a problem receiving results');
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            console.log('final transcript', finalTranscript);
            console.log('iterim transcript', interimTranscript);
        };
        recognition.onerror = function(event) {
            if (event.error === 'no-speech') {
                console.log('Speech recognition error: no speech.');
            }
            if (event.error === 'audio-capture') {
                console.log('Speech recognition error: no microphone.');
            }
            if (event.error === 'not-allowed') {
                console.log('Speech recognition not allowed.');
            }
        };
        recognition.onstart = function() {
            console.log('Speech recognition started, speak now!');
        };
        recognition.onend = function() {
            console.log('Speech recognition ended!');
            //recognition.start(); // TODO: allow continuous listening
        };
        recognition.onnomatch = function() {
            console.log('Sorry! There was no match...');
        };
    };

    var createVoiceWidget = function() {
        var widget = document.createElement('div');
        _.addEvent(widget, 'click', _.bind(activateVoiceOption, _this));
        _.addClass(widget, 'widget-icon');
        _.addClass(widget, 'voice-widget-icon');
        widget.innerHTML = '1';
        return widget;
    };

    var activateVoiceOption = function(e) {
        _this.isVoiceOn = !_this.isVoiceOn;
        _.toggleClass(e.currentTarget, 'active', _this.isVoiceOn);

        if (_this.isVoiceOn) {
            voiceStart();
        } else {
            voiceStop();
        }
    };

    return {
        init: initVoiceRecognition,
        createWidget: createVoiceWidget
    };
};
