$.extend(Keller.prototype, {

    readText: function (text) {
        //speech.speak(text);
    },

    readModuleHeaders: function () {
        var moduleHeaders = this.getCurrentModule().querySelectorAll('[data-ue-speech]');
        
        for (var i = 0; i < moduleHeaders.length; i++) {            
            this.readText(moduleHeaders[i].getAttribute('data-ue-speech'));
        }
    }
    
});        