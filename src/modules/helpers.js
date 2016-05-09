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
    
    _removeClass: function (elements, className) {
        if(elements && NodeList === elements.constructor) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.remove(className);
            }             
        }
        else {
            elements.classList.remove(className);
        }
    },
    
    _addClass: function (elements, className) {
        if(elements && NodeList === elements.constructor) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.add(className);
            }             
        }
        else {
            elements.classList.add(className);
        }
    },
    
    // Event handlers with fallback for <IE8
    _addEvent: function(element, type, callback, bubble) { 
        if(document.addEventListener) { 
            return element.addEventListener(type, callback, bubble || false); 
        }
        return element.attachEvent('on' + type, callback); 
    },

    _onEvent: function(element, type, callback, bubble) { 
        if(document.addEventListener) { 
            document.addEventListener(type, function(event){ 
                if(event.target === element || event.target.id === element) { 
                    callback.apply(event.target, [event]); 
                }
            }, bubble || false);
        } else {
            document.attachEvent('on' + type, function(event){  
                if(event.srcElement === element || event.srcElement.id === element) { 
                    callback.apply(event.target, [event]); 
                }
            });
        }
    },

    _bind: function(func, thisValue) {
        if (typeof func !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("bind - what is trying to be bound is not callable");
        }
        return function() {
            return func.apply(thisValue, arguments);
        }
    }    
    
});        