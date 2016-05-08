$.extend(Keller.prototype, {    

    getFocus: function () {
        return this.currentFocus;
    },

    setFocus: function (idx) {
        this.currentFocus = this.settings.focusAreas[idx];
    },

    getCurrentModule: function () {        
        return document.querySelector('[data-ue-module="' + this.currentModuleId + '"]');
    },
    
    removeClass: function (elements, className) {
        if(elements && Array === elements.constructor) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.remove(className);
            }             
        }
        else {
            elements.classList.remove(className);
        }
    },
    
    addClass: function (elements, className) {
        if(elements && Array === elements.constructor) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.add(className);
            }             
        }
        else {
            elements.classList.add(className);
        }
    }
    
});        