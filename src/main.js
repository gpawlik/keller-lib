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
        speechLanguage: "Google UK English Male"
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
    this.datesModule = [5];
}
$.extend(Keller.prototype, {
    init: function() {        
        this.showSidebar();
        this.eventHandlers();
        this.generateVoiceCommands({
            'Barcelona': '(Barcelona)',
            'Mallorca': '(Mallorca)(Mayorga)',
            'Berlin': '(Berlin)',
            '22/04/2016': '(next week)',
            '17/04/2016': '(this weekend)'
        });
        speech.OnVoiceReady = _.bind(function() {
            this.readModuleHeaders();
        }, this);
        this.generateVoiceCommands();
    }
});
$.extend(Keller.prototype, {

    eventHandlers: function () {
        $(document).on('keydown', _.bind(this.getKeyEvent, this));
        $(window).on('gamepadconnected', _.bind(this.gamepadConnected, this));
        $(window).on('gamepaddisconnected', _.bind(this.gamepadDisconnected, this));
    },
    
    navigateHandler: function (action, focus) {
        if ((action === 'right') || (action === 'left')) {
            switch (focus) {
                case 'input':
                    if (_.contains(this.datesModule, this.currentModuleId)) {
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
            if (_.contains(this.datesModule, this.currentModuleId)) {
                this.navigateDates(focus, action);
            } else {
                this.navigateSettings(action);
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
        this.removeClass(keyboard.querySelectorAll('li'), 'active');   
        this.addClass(keyboard.querySelector('li[data-id="' + nextItem + '"]'), 'active');              
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
                this.addClass(modules[i], 'active');                
            }
            else {
                this.removeClass(modules[i], 'active');
            }
        }

        this.currentModuleId = nextItem;        
        this.readModuleHeaders();
    },

    navigateSettings: function (action) {
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
            nextControlId = currentControlId;
        }
        
        for (var i = 0; i < controls.length; i++) {            
            if (parseInt(controls[i].getAttribute('data-ue-control-id'), 10) === nextControlId) {
                this.addClass(controls[i], 'show');                
            }
            else {
                this.removeClass(controls[i], 'show');
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
                this.addClass(sidebarWidgets[i], 'show');
            }
            else {                 
                this.removeClass(sidebarWidgets[i], 'show');  
            }            
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
$.extend(Keller.prototype, {
    
    createSettings: function () {
        var settingsFields,
            settings;
            
        settingsFields = [
            {
                'label': 'Something',
                'type': ''
            },
            {
                'label': 'Letter spacing',
                'type': 'switch'
            },
            {
                'label': 'Font enhancer',
                'type': 'stepper'
            },
            {
                'label': 'Event logger',
                'type': 'logger'
            }
        ];
        
        settings = document.createElement('div');        
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(this.createSetting(settingsFields[i].label, settingsFields[i].type));
        }
        return settings;
    },
    
    createSetting: function (label, type) {
        var wrapper, 
            labelbox;
        
        wrapper = document.createElement('div');
        wrapper.className = 'ue-settings-row';
        
        labelbox = document.createElement('div');
        labelbox.className = 'ue-settings-label';
        labelbox.innerHTML = label;
        
        wrapper.appendChild(labelbox);
        wrapper.appendChild(this.createSettingButton(type));        
        
        return wrapper;
    },
    
    createSettingButton: function (type) {
        var wrapper,            
            button,            
            buttonSubtract, 
            buttonAdd;
            
        wrapper = document.createElement('div');   
        button = document.createElement('div');                 
        
        switch (type) {
            case 'switch':                
                button.className = "ue-settings-voice-switch";
                wrapper = false;
                break;
            case 'stepper':                                        
                buttonSubtract = document.createElement('span');                
                buttonSubtract.setAttribute("data-step", "subtract");                
                buttonAdd = document.createElement('span');                
                buttonAdd.setAttribute("data-step", "add");                   
                wrapper.appendChild(buttonSubtract);
                wrapper.appendChild(buttonAdd); 
                wrapper.className = "ue-settings-stepper";                
                break;
            case 'logger':                
                button.className = "ue-logger-box";
                wrapper.className = "ue-settings-logger";             
                break;
        }    
        
        if(wrapper) {
            wrapper.appendChild(button);
        }                                                  
        
        return wrapper || button; 
    }
    
});
$.extend(Keller.prototype, {

    gamepadConnected: function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
        // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
        console.log("Gamepad connected.");
        var repGP = window.setInterval(_.bind(this.checkGamepad, this),200);
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

    activateVoice: function () {
        voice.start();
    },

    deActivateVoice: function () {
        voice.stop();
    },

    debugVoice: function () {
        voice.addCallback("resultMatch", function(n, a, o) {
            console.log("said: " + n + ", cmd: " + a + ", phrases: " + o);
        });
        voice.debug();
    },

    generateVoiceCommands: function (commands) {
        var commandTriggers = _.object(_.map(commands, function(command, trigger){
            return [command,
                    _.bind(function () {
                        this.fillOutInput(trigger);
                    }, this)
            ];
        }, this));
        voice.addCommands(commandTriggers);
        this.debugVoice();
        voice.start();
    }
    
});        
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
$.extend(Keller.prototype, {

    getKeyEvent: function (e) {            
            //  direction;
        e.preventDefault();
        switch (e.keyCode) {
            case 13:
                if (_.contains(this.datesModule, this.currentModuleId)) {
                    var $moduleWithFocus = $('[data-ue-module="' + this.currentModuleId + '"]');
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
        var $moduleWithFocus = $('[data-ue-module="' + this.currentModuleId + '"]');
        switch (this.focusOnModule) {
            case 1:
                var valueDay = parseInt($moduleWithFocus.find('input[data-day]').attr('data-day'));
                this.changeDay(valueDay, action, $moduleWithFocus);
                break;
            case 2:
                var valueMonth = parseInt($moduleWithFocus.find('input[data-month]').attr('data-month'));
                var valueYear = parseInt($moduleWithFocus.find('input[data-year]').attr('data-year'));
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
        module.find('input[data-month]').attr('data-month', valueMonth);
        module.find('input[data-year]').attr('data-year', valueYear);
        module.find('[data-ue-focus=2]').val(this.getMonthText(valueMonth).toUpperCase() + ', ' + valueYear);
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
            if (valueDay !== 1) {
                valueDay -= 1;
            }
        }
        module.find('input[data-day]').attr('data-day', valueDay);
        module.find('[data-ue-focus=1]').val(valueDay);
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
        var valueDay = parseInt(moduleWithFocus.find('input[data-day]').attr('data-day')),
            valueMonth = parseInt(moduleWithFocus.find('input[data-month]').attr('data-month')),
            valueYear = parseInt(moduleWithFocus.find('input[data-year]').attr('data-year'));

        var dateToValidate = new Date (valueYear, valueMonth - 1, valueDay);
        var validator = (!dateToValidate || dateToValidate.getFullYear() === valueYear && dateToValidate.getMonth() === (valueMonth - 1) && dateToValidate.getDate() === valueDay);
        return validator;
    }
    
});
$.extend(Keller.prototype, {
        
    writeText: function () {
        var $currentInputValue = $(this.getCurrentModule()).find('input').val(),
            currentChar = $(this.element).find('.ue-keyboard li.active').text().toLowerCase();
        this.fillOutInput($currentInputValue + currentChar);
    },

    removeText: function () {
        var $input = $('input[name="test"]'),
            currentValue = $input.val();
        $input.val(currentValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        $(this.getCurrentModule()).find('input').val(text);
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