$.extend(Keller.prototype, {

    readText: function (text) { 
        if (this.options.enableAudio) {
            this.speak(text);
        }               
    },

    readModuleHeaders: function () {
        var moduleHeaders = this.getCurrentModule().querySelectorAll('[data-ue-speech]');
        
        for (var i = 0; i < moduleHeaders.length; i++) {            
            this.readText(moduleHeaders[i].getAttribute('data-ue-speech'));
        }        
    },
    
    initSpeechSynthesis: function () {
        if (!('speechSynthesis' in window)) {
            console.log('Speach synthesis is not supported...');
            return false;                        
        } 
        // "onvoiceschanged" event fires when voices are ready                       
        window.speechSynthesis.onvoiceschanged = this._bind(function() {
            this.cachedVoice = this.loadVoice(this.options.speech.voice)
        }, this);     
    },
    
    loadVoice: function (voiceName) {                   
        return window.speechSynthesis.getVoices().filter(function(voice) { 
            return voice.name === voiceName; 
        })[0];  
    },
    
    speak: function (text) { 
        // TODO: check character limit, split long texts into chunks 
        var msg = new SpeechSynthesisUtterance();                   
        msg.volume = this.options.speech.volume;
        msg.rate = this.options.speech.rate;
        msg.pitch = this.options.speech.pitch;
        msg.voice = this.cachedVoice || this.loadVoice(this.options.speech.voice);
        msg.text = text;                 
                        
        msg.onerror = function () {
            console.log('An error occured while generating:', msg.text);
        };            
        
        window.speechSynthesis.speak(msg);
    },
    
    createSpeechWidget: function () {
        var widget = document.createElement('div');   
        this._addEvent(widget, 'click', this._bind(this.activateSpeechOption, this));     
        this._addClass(widget, 'widget-icon');
        this._addClass(widget, 'speech-widget-icon');        
        widget.innerHTML = '3';
        return widget;
    },
    
    activateSpeechOption: function (e) {
        this.options.enableAudio = !this.options.enableAudio;        
        this._toggleClass(e.currentTarget, 'active', this.options.enableAudio);
    } 
                
});        