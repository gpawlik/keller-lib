$.extend(Keller.prototype, {

    readText: function (text) {        
        this.speak(text);
    },

    readModuleHeaders: function () {
        var moduleHeaders = this.getCurrentModule().querySelectorAll('[data-ue-speech]');
        
        for (var i = 0; i < moduleHeaders.length; i++) {            
            this.readText(moduleHeaders[i].getAttribute('data-ue-speech'));
        }        
    },
    
    initSpeechSynthesis: function () {
        if (typeof window.speechSynthesis === 'undefined') {
            console.log('Speach synthesis is not supported...');
            return false;                        
        } 
        // "onvoiceschanged" event fires when voices are ready                       
        window.speechSynthesis.onvoiceschanged = _.bind(function() {
            this.cachedVoice = this.loadVoice(this.settings.speech.voice)
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
        msg.volume = this.settings.speech.volume;
        msg.rate = this.settings.speech.rate;
        msg.pitch = this.settings.speech.pitch;
        msg.voice = this.cachedVoice || this.loadVoice(this.settings.speech.voice);
        msg.text = text;                 
                        
        msg.onerror = function () {
            console.log('An error occured while generating:', msg.text);
        };            
        
        window.speechSynthesis.speak(msg);
    }            
});        