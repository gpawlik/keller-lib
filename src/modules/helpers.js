$.extend(Keller.prototype, {
    
    testFunction: function( text ) {
        //$( this.element ).text( text );
        console.log(text, this.settings.propertyName);
    },

    getFocus: function () {
        return this.currentFocus;
    },

    setFocus: function (idx) {
        this.currentFocus = this.settings.focusAreas[idx];
    },

    getCurrentModule: function () {
        return $('[data-ue-module="' + this.currentModuleId + '"]');
    }
    
});        