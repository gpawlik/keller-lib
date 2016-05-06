$.extend(Keller.prototype, {

    readText: function (text) {
        speech.speak(text);
    },

    readModuleHeaders: function () {
        var $moduleHeaders = this.getCurrentModule().find('h3[data-ue-speech], h4[data-ue-speech]');
        _.each($moduleHeaders, function(header){
            this.readText($(header).data('ue-speech'));
        }, this);
    }
    
});        