Keller.prototype.utils = function() {

    var _this = this;

    return {

        getFocus: function() {
            return _this.currentFocus;
        },

        setFocus: function(idx) {
            _this.currentFocus = _this.options.focusAreas[idx];
        },

        getCurrentModule: function() {
            return document.querySelector('[data-ue-module="' + _this.currentModuleId + '"]');
        },

        removeClass: function(elements, className) {
            if (!elements) {
                return;
            }
            if (elements.constructor === NodeList) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.remove(className);
                }
            } else {
                elements.classList.remove(className);
            }
        },

        addClass: function(elements, className) {
            if (!elements) {
                return;
            }
            if (elements.constructor === NodeList) {
                for (var i = 0; i < elements.length; i++) {
                    elements[i].classList.add(className);
                }
            } else {
                elements.classList.add(className);
            }
        },

        toggleClass: function(elements, className, force) {
            if (force === true) {
                this.addClass(elements, className);
            } else if (force === false) {
                this.removeClass(elements, className);
            } else {
                if (elements && elements.constructor === NodeList) {
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].classList.toggle(className);
                    }
                } else {
                    elements.classList.toggle(className);
                }
            }
        },

        activateItem: function(elements, id, value, className) {
            if (!elements) {
                return;
            }
            for (var i = 0; i < elements.length; i++) {
                this.toggleClass(elements[i], className, elements[i].getAttribute(id) === value.toString());
            }
        },

        stopPropagation: function(event) {
            event = event || window.event;

            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        },

        addEvent: function(element, type, callback, bubble) {
            if (!element) {
                return;
            }
            if (document.addEventListener) {
                return element.addEventListener(type, callback, bubble || false);
            }
            // fallback for <IE8
            return element.attachEvent('on' + type, callback);
        },

        onEvent: function(element, type, callback, bubble) {
            if (!element) {
                return;
            }
            if (document.addEventListener) {
                document.addEventListener(type, function(event) {
                    if (event.target === element || event.target.id === element) {
                        callback.apply(event.target, [event]);
                    }
                }, bubble || false);
            } else {
                // fallback for <IE8
                document.attachEvent('on' + type, function(event) {
                    if (event.srcElement === element || event.srcElement.id === element) {
                        callback.apply(event.target, [event]);
                    }
                });
            }
        },

        triggerEvent: function(el, eventName, options) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, { detail: options });
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, options);
            }
            el.dispatchEvent(event);
        },

        bind: function(func, thisValue) {
            if (typeof func !== 'function') {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError('bind - what is trying to be bound is not callable');
            }
            return function() {
                return func.apply(thisValue, arguments);
            };
        },

        extend: function() {
            for (var i = 1; i < arguments.length; i++) {
                for (var key in arguments[i]) {
                    if (arguments[i].hasOwnProperty(key)) {
                        arguments[0][key] = arguments[i][key];
                    }
                }
            }
            return arguments[0];
        },

        contains: function(obj, item) {
            return obj.indexOf(item) >= 0;
        }
    };
};
