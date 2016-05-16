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
        if(elements && elements.constructor === NodeList) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.remove(className);
            }             
        }
        else {
            elements.classList.remove(className);
        }
    },
    
    _addClass: function (elements, className) {
        if(elements && elements.constructor === NodeList) {
            for(var i = 0; i < elements.length; i++) {
                elements[i].classList.add(className);
            }             
        }
        else {
            elements.classList.add(className);
        }
    },
    
    _toggleClass: function (elements, className, force) {
        if (force === true) {
            this._addClass(elements, className);
        }
        else if (force === false) {
            this._removeClass(elements, className);
        }
        else {
            if(elements && elements.constructor === NodeList) {
                for(var i = 0; i < elements.length; i++) {
                    elements[i].classList.toggle(className);
                }             
            }
            else {
                elements.classList.toggle(className);
            }            
        }
    },
    
    _stopPropagation: function (event) {
        event = event || window.event;
        
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        else {
            event.cancelBubble = true;
        }
    },
        
    _addEvent: function (element, type, callback, bubble) { 
        if(document.addEventListener) { 
            return element.addEventListener(type, callback, bubble || false); 
        }
        // fallback for <IE8
        return element.attachEvent('on' + type, callback); 
    },
    
    _onEvent: function (element, type, callback, bubble) { 
        if(document.addEventListener) { 
            document.addEventListener(type, function(event){ 
                if(event.target === element || event.target.id === element) { 
                    callback.apply(event.target, [event]); 
                }
            }, bubble || false);
        } else {
            // fallback for <IE8
            document.attachEvent('on' + type, function(event){  
                if(event.srcElement === element || event.srcElement.id === element) { 
                    callback.apply(event.target, [event]); 
                }
            });
        }
    },
    
    _triggerEvent: function (el, eventName, options) {
        var event;        
        if (window.CustomEvent) {
            event = new CustomEvent(eventName, { detail: options });
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventName, true, true, options);
        }
        el.dispatchEvent(event); 
    },

    _bind: function (func, thisValue) {
        if (typeof func !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("bind - what is trying to be bound is not callable");
        }
        return function() {
            return func.apply(thisValue, arguments);
        }
    },
    
    _contains: function (obj, item) {        
        return obj.indexOf(item) >= 0;
    }  
    
});        