/*
 *  Keller Library - v1.0.0
 *  jQuery library for better web accessilibity
 *
 *  Author Grzegorz Pawlik
 *  Under MIT License
 */
// Create the defaults once
var pluginName = "keller",
    defaults = {
        propertyName: "value",
        focusAreas: ['input', 'controls', 'settings'],
        enableAudio: false,
        speech: {
            voice: "Google UK English Male",
            volume: 1,
            pitch: 1,
            rate: 1            
        }            
    };

// The actual plugin constructor
function Keller (element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.currentModuleId = 0;
    this.focusOnModule = 1;
    this.currentFocus = this.settings.focusAreas[0];
    this.init();
}

$.extend(Keller.prototype, {
    init: function() {        
        this.showSidebar();
        this.eventHandlers();
        this.initSpeechSynthesis();
        this.initVoiceRecognition();
    }
});
$.extend(Keller.prototype, {

    eventHandlers: function () {        
        this._addEvent(document, 'keydown', this._bind(this.getKeyEvent, this));        
        this._addEvent(window, 'gamepadconnected', this._bind(this.gamepadConnected, this));        
        this._addEvent(window, 'gamepaddisconnected', this._bind(this.gamepadDisconnected, this));
    },
    
    navigateHandler: function (action, focus) {
        if ((action === 'right') || (action === 'left')) {
            switch (focus) {
                case 'input':
                    if (this.getCurrentModule().hasAttribute('data-ue-dateselector')) { 
                        this.modifyDates(action, focus);
                    } else {
                        this.navigateModules(action);
                    }
                    break;
                case 'controls':
                    this.navigateControls(action);
                    break;
                case 'settings':
                    this.navigateKeyboard(action);
                    break;
            }
        }
        else if ((action === 'up') || (action === 'down')) {
            if (this.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                this.navigateDates(focus, action);
            } else {
                this.navigateFocusAreas(action);
            }
        } else if (action === 'enter') {
            switch (focus) {
                case 'controls':
                    this.navigateControls(action);
                    break;
                case 'settings':
                    this.navigateKeyboard(action);
                    break;
            }
        }
    }
    
});           
$.extend(Keller.prototype, {

    navigateKeyboard: function (action) {
        var keyboard = this.element.querySelector('.ue-keyboard'),            
            activeItem = keyboard.querySelector('li.active'),
            currentItem = activeItem ? parseInt(activeItem.getAttribute('data-id'), 10) : 0,
            allItemsLength = keyboard.querySelectorAll('li').length,
            nextItem;        

        if (action === 'right') {
            nextItem = ((currentItem + 1) > allItemsLength) ? 0 : currentItem + 1;
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? allItemsLength - 1 : currentItem - 1;
        }
        else if (action === 'enter') {
            this.writeText();
            nextItem = currentItem;
        }
        this._removeClass(keyboard.querySelectorAll('li'), 'active');   
        this._addClass(keyboard.querySelector('li[data-id="' + nextItem + '"]'), 'active');              
    },

    navigateModules: function (action) {
        var modules = this.element.querySelectorAll('.ue-module'),
            currentItem = this.currentModuleId || 0,
            nextItem;

        if (action === 'right') {
            nextItem = ((currentItem + 1) > modules.length - 1) ? 0 : currentItem + 1;            
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? modules.length - 1 : currentItem - 1;                      
        }                     

        for (var i = 0; i < modules.length; i++) {            
            if (parseInt(modules[i].getAttribute('data-ue-module'), 10) === nextItem) {
                this._addClass(modules[i], 'active');                
            }
            else {
                this._removeClass(modules[i], 'active');
            }
        }

        this.currentModuleId = nextItem;        
        this.readModuleHeaders();
    },

    navigateFocusAreas: function (action) {
        var focusAreas = this.settings.focusAreas,
            currentFocusIndex = focusAreas.indexOf(this.getFocus());

        if (action === 'up' && ((currentFocusIndex + 1) < focusAreas.length)) {
            this.setFocus(currentFocusIndex + 1);
        }
        else if (action === 'down' && ((currentFocusIndex - 1) >= 0)) {
            this.setFocus(currentFocusIndex - 1);
        }
    },

    navigateControls: function (action) {
        var controls = this.element.querySelectorAll('.ue-sidebar-controls li'),
            currentControl = this.element.querySelector('.ue-sidebar-controls li.show'),
            currentControlName = currentControl.getAttribute('data-ue-control-name') || 'key',
            currentControlId = parseInt(currentControl.getAttribute('data-ue-control-id'), 10) || 0,            
            nextControlId;

        if (action === 'right') {
            nextControlId = ((currentControlId + 1) >= controls.length) ? 0 : currentControlId + 1;
        }
        else if (action === 'left') {
            nextControlId = ((currentControlId - 1) < 0) ? controls.length - 1 : currentControlId - 1;
        }
        else if (action === 'enter') {                        
            this.showSidebarWidget(currentControlName);            
        }
        
        if (typeof nextControlId !== 'undefined') {
            for (var i = 0; i < controls.length; i++) {            
                if (parseInt(controls[i].getAttribute('data-ue-control-id'), 10) === nextControlId) {
                    this._addClass(controls[i], 'show');                
                }
                else {
                    this._removeClass(controls[i], 'show');
                }
            }
        }
    }
    
});        
$.extend(Keller.prototype, {
    
    showSidebar: function () {        
        this.element.appendChild(this.createSidebar());   
    },
    
    createSidebar: function () {
        var sidebar, 
            sidebarWidgets, 
            sidebarControls,
            widgets;
        
        sidebar = document.createElement('div');
        sidebar.id = "ue-sidebar";   
        sidebar.className = "active";     
        
        sidebarWidgets = document.createElement('ul');
        sidebarWidgets.className = "ue-sidebar-widgets";
        
        sidebarControls = document.createElement('ul');
        sidebarControls.className = "ue-sidebar-controls";
        
        widgets = [
            { name: "settings", alias: "set", icon: "J" },
            { name: "video", alias: "vid", icon: "0" },            
            { name: "microphone", alias: "mic", icon: "1" },            
            { name: "sound", alias: "sou", icon: "3" },
            { name: "keyboard", alias: "key", icon: "2" }
        ]; 
        
        for (var i = 0; i < widgets.length; i++) {
            sidebarWidgets.appendChild(this.createSidebarWidget(widgets[i].name, widgets[i].alias, i));
            sidebarControls.appendChild(this.createSidebarControls(widgets[i].alias, widgets[i].icon, i));
        }   
        
        sidebar.appendChild(sidebarWidgets);
        sidebar.appendChild(sidebarControls); 
        
        return sidebar;          
    },
    
    createSidebarWidget: function (name, alias, index) {
        var widgetHolder, widget;
        
        widgetHolder = document.createElement('li');
        widgetHolder.setAttribute('data-widget-name', alias);
        if (index === 0) {
            widgetHolder.className = 'show';
        }     
        
        widget = document.createElement('div');
        widget.className = 'ue-' + name;   
        
        switch (name) {
            case 'keyboard':
                widget.appendChild(this.createAlphabet());
                break;
            case 'settings':
                widget.appendChild(this.createSettings());
                break;            
        }
        
        widgetHolder.appendChild(widget);
        
        return widgetHolder;
    },
    
    createSidebarControls: function (alias, icon, index) {
        var controlItem = document.createElement('li');
        
        controlItem.setAttribute('data-ue-control-id', index);
        controlItem.setAttribute('data-ue-control-name', alias);
        controlItem.className = 'control-icon-' + alias;
        controlItem.innerHTML = icon;        
        if (index === 0) {
            controlItem.classList.add('show');
        }
        
        return controlItem;                             
    },
    
    showSidebarWidget: function (page_name) {        
        var sidebarWidgets = this.element.querySelectorAll('.ue-sidebar-widgets > li');                
        
        for (var i = 0; i < sidebarWidgets.length; i++) {            
            if(sidebarWidgets[i].getAttribute('data-widget-name') === page_name) {                
                this._addClass(sidebarWidgets[i], 'show');
            }
            else {                 
                this._removeClass(sidebarWidgets[i], 'show');  
            }            
        }  
        // Temporary voice activation 
        if(page_name === 'mic') {
            this.voiceStart();
        }  
        else {
            this.voiceStop();
        }                   
    }
    
});        
$.extend(Keller.prototype, {
    
    createAlphabet: function () {
        var template = document.createElement('ul'),
            firstCharCode = 'a'.charCodeAt(0),
            lastCharCode = 'z'.charCodeAt(0),
            firstNumber = 0,
            lastNumber = 9,         
            currentCharacter,
            currentNumber;
        
        for (var i = 0; i <= lastCharCode - firstCharCode; i++) {
            currentCharacter = document.createElement('li');
            currentCharacter.setAttribute('data-id', i);
            currentCharacter.setAttribute('data-type', 'letter');
            currentCharacter.innerHTML = String.fromCharCode(firstCharCode + i); 
            if (i === 0) {
                currentCharacter.className = 'active';
            }
            template.appendChild(currentCharacter);                          
        }
        for(var j = firstNumber; j <= lastNumber; j++) {
            currentNumber = document.createElement('li');
            currentNumber.setAttribute('data-id', i + j);
            currentNumber.setAttribute('data-type', 'number');
            currentNumber.innerHTML = j;    
            template.appendChild(currentNumber);  
        }                 
        return template;
    }
    
});        
/* global ; */
$.extend(Keller.prototype, {
        
    createSettings: function () {
        var settingsFields,
            settings;                        
            
        settingsFields = [
            {
                'label': 'Contrast',
                'type': 'switch',
                'name': 'contrast',
                'value': this.getSettings('contrast') || true
            },
            {
                'label': 'Letter spacing',
                'type': 'switch',
                'name': 'letter-spacing',
                'value': this.getSettings('letter-spacing') || false
            },
            {
                'label': 'Font enhancer',
                'type': 'stepper',
                'name': 'font-enhancer',
                'value': this.getSettings('font-enhancer') || 5
            },
            {
                'label': 'Event logger',
                'type': 'logger',
                'name': 'event-logger',
                'value': this.getSettings('event-logger') || 2
            }
        ];
        
        settings = document.createElement('div');        
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(this.createSetting(settingsFields[i]));
        }
        return settings;
    },
    
    createSetting: function (field) {
        var wrapper, 
            labelbox,
            button;
        
        wrapper = document.createElement('div');
        wrapper.className = 'ue-settings-row';
        
        labelbox = document.createElement('div');
        labelbox.className = 'ue-settings-label';
        labelbox.innerHTML = field.label;
        
        wrapper.appendChild(labelbox);
        
        button = this.createSettingButton(field);
        wrapper.appendChild(button);
        
        this._addEvent(button, 'click', this._bind(this.changeSettings, this));
                                
        return wrapper;
    },
    
    createSettingButton: function (field) {    
        var button;
        
        button = document.createElement('div');
        button.className = 'ue-settings-button';  
        button.setAttribute('data-name', field.name);
        button.setAttribute('data-type', field.type);
        button.setAttribute('data-value', field.value);                     
        
        switch (field.type) {
            case 'stepper':                                        
                var buttonAdd = document.createElement('span'), 
                    buttonSubtract = document.createElement('span');  
                buttonAdd.setAttribute("data-step", "add"); 
                buttonSubtract.setAttribute("data-step", "subtract");    
                buttonAdd.innerHTML = "+";                                             
                buttonSubtract.innerHTML = "-";                                                              
                button.appendChild(buttonSubtract);
                button.appendChild(buttonAdd);               
                break;
        }                                                                              
        return button; 
    },
    
    changeSettings: function (e) {
        e.stopPropagation();
        
        var el = e.currentTarget,
            settingName = el.getAttribute('data-name'),
            settingType = el.getAttribute('data-type'),
            currentValue = JSON.parse(el.getAttribute('data-value')),
            newValue;             
            
        switch (settingType) {
            case 'stepper':
                if (e.target.getAttribute('data-step') === 'add') {
                    newValue = currentValue + 1;
                }
                else {
                    newValue = currentValue - 1;
                }                
                break;
            default:
                newValue = !currentValue;
                break;
        }
        if (typeof newValue !== 'undefined') {
            el.setAttribute('data-value', newValue);        
            this.storeSettings(settingName, newValue);              
        }  
    },
    
    storeSettings: function (item, value) {
        localStorage.setItem(item, value);
    },
    
    getSettings: function (item) {
        return localStorage.getItem(item);
    }
});
$.extend(Keller.prototype, {

    gamepadConnected: function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
        // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
        console.log("Gamepad connected.");
        var repGP = window.setInterval(this._bind(this.checkGamepad, this), 200);
    },

    gamepadDisconnected: function () {
        console.log("Gamepad disconnected!");
    },

    checkGamepad: function() {
        var gp = navigator.getGamepads()[0];

        if(gp.buttons[0].pressed) {
        }
        if(gp.buttons[1].pressed) {
            this.navigateKeyboard('right');
        }
        if(gp.buttons[2].pressed) {
            this.navigateKeyboard('left');
        }
        if(gp.buttons[3].pressed) {
        }
        if(gp.buttons[4].pressed) {
            this.removeText();
        }
        if(gp.buttons[5].pressed) {
            this.writeText();
        }
    }

});        
$.extend(Keller.prototype, {

    initVoiceRecognition: function () {
        if(!('webkitSpeechRecognition' in window)) {            
            this.voiceRecognition = false;
            console.log('Speech recognition not supported');
        }
        else {
            this.voiceRecognition = new webkitSpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;  
            this.processRecognizedText(this.voiceRecognition);                   
        }
    },

    voiceStart: function () {
        if (this.voiceRecognition) {
            this.voiceRecognition.start();            
        }
    },
    
    voiceStop: function () {        
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();            
        }        
    },
    
    processRecognizedText: function (recognition) { 
            
        recognition.onresult = function(event) {
            var final_transcript = '',
                interim_transcript = '';
                            
            if (typeof(event.results) === 'undefined') {
                recognition.stop();
                console.log('There was a problem receiving results');
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            console.log('final transcript', final_transcript);
            console.log('iterim transcript', interim_transcript);
        }; 
        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                console.log('Speech recognition error: no speech.');                
            }
            if (event.error == 'audio-capture') {
                console.log('Speech recognition error: no microphone.');                
            }
            if (event.error == 'not-allowed') {              
                console.log('Speech recognition not allowed.');           
            }
        };
        recognition.onstart = function () {
            console.log('Speech recognition started, speak now!');            
        };
        recognition.onend = function () {
            console.log('Speech recognition ended!');
            //recognition.start(); // TODO: allow continuous listening        
        }; 
        recognition.onnomatch = function () {
            console.log('Sorry! There was no match...');
        };                        
    }    
});    
$.extend(Keller.prototype, {

    readText: function (text) { 
        if (this.settings.enableAudio) {
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
$.extend(Keller.prototype, {

    getKeyEvent: function (e) {            
            //  direction;
        e.preventDefault();
        switch (e.keyCode) {
            case 13:
                if (this.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                    var $moduleWithFocus = this.getCurrentModule();
                    if (this.validateDates($moduleWithFocus)) {
                        this.focusOnModule = 1;
                        this.navigateModules('right');
                    } else {
                        this.errorValidate($moduleWithFocus);
                    }
                } else {
                    this.navigateHandler('enter', this.currentFocus);
                }
                break;
            case 39:
                this.navigateHandler('right', this.currentFocus);
                break;
            case 37:
                this.navigateHandler('left', this.currentFocus);
                break;
            case 38:
                this.navigateHandler('up');
                break;
            case 40:
                this.navigateHandler('down');
                break;
        }

    }
    
});        
$.extend(Keller.prototype, {
    
    modifyDates: function (action, focus) {
        var $moduleWithFocus = this.element.querySelector('[data-ue-module="' + this.currentModuleId + '"]');
        console.log('focus on module', this.focusOnModule);
        switch (this.focusOnModule) {
            case 1:            
                var valueDay = parseInt($moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10);
                this.changeDay(valueDay, action, $moduleWithFocus);
                break;
            case 2:
                var valueMonth = parseInt($moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10);
                var valueYear = parseInt($moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);
                this.changeMonth(valueMonth, valueYear, action, $moduleWithFocus);
                break;
        }        
    },

    changeMonth: function (valueMonth, valueYear, action, module) {
        if (action === 'right') {
            if (valueMonth === 12) {
                valueMonth = 1;
                valueYear += 1;
            } else {
                valueMonth += 1;
            }
        } else {
            if (valueMonth === 1) {
                valueMonth = 12; 
                valueYear -= 1;
            } else {
                valueMonth -= 1;
            }
        }
        module.querySelector('input[data-month]').setAttribute('data-month', valueMonth);
        module.querySelector('input[data-year]').setAttribute('data-year', valueYear);
        module.querySelector('[data-ue-focus="2"]').value = this.getMonthText(valueMonth).toUpperCase() + ', ' + valueYear;
    },

    getMonthText: function(valueMonth) {
        var months = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[valueMonth - 1];
    },

    changeDay: function (valueDay, action, module) {
        if (action === 'right') {
            if (valueDay < 31) {
                valueDay += 1;
            }
        } else {
            if (valueDay > 1) {
                valueDay -= 1;
            }
        }        
        module.querySelector('input[data-day]').setAttribute('data-day', valueDay);
        module.querySelector('[data-ue-focus="1"]').value = valueDay;
    },

    navigateDates: function (focus, action) {
        if (action === 'up') {
            switch (this.focusOnModule) {
            case 1:
                this.focusOnModule = 1;
                this.navigateModules('left');
                break;
            case 2:
                this.focusOnModule -= 1;
                break;
            }
        } else if (this.focusOnModule === 1) {
            this.focusOnModule += 1;
        }
    },

    errorValidate: function (moduleWithFocus) {

    },

    validateDates: function (moduleWithFocus) {
        var valueDay = parseInt(moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10),
            valueMonth = parseInt(moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10),
            valueYear = parseInt(moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);

        var dateToValidate = new Date (valueYear, valueMonth - 1, valueDay);
        var validator = (!dateToValidate || dateToValidate.getFullYear() === valueYear && dateToValidate.getMonth() === (valueMonth - 1) && dateToValidate.getDate() === valueDay);
        return validator;
    }
    
});
$.extend(Keller.prototype, {
        
    writeText: function () {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value,
            currentChar = this.element.querySelector('.ue-keyboard li.active').innerHTML.toLowerCase();
        this.fillOutInput(currentInputValue + currentChar);
    },

    removeText: function () {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value;   
        this.fillOutInput(currentInputValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        this.getCurrentModule().querySelector('input').value = text;
    }
    
});        
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
        
    _addEvent: function(element, type, callback, bubble) { 
        if(document.addEventListener) { 
            return element.addEventListener(type, callback, bubble || false); 
        }
        // fallback for <IE8
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
            // fallback for <IE8
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
    },
    
    _contains: function(obj, item) {        
        return obj.indexOf(item) >= 0;
    }  
    
});        
// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations
$.fn[pluginName] = function(options) {
    return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
            $.data(this, "plugin_" +
                pluginName, new Keller(this, options));
        }
    } );
};