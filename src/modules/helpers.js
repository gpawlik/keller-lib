$.extend(Keller.prototype, {    

    getFocus: function () {
        return this.currentFocus;
    },

    setFocus: function (idx) {
        this.currentFocus = this.settings.focusAreas[idx];
    },

    getCurrentModule: function () {        
        return document.querySelector('[data-ue-module="' + this.currentModuleId + '"]');
    }
    
});        