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
    this.currentModuleId = 1;
    this.focusOnModule = 1;
    this.currentFocus = this.settings.focusAreas[0];
    this.init();
    this.datesModule = [5];
}
$.extend(Keller.prototype, {
    init: function() {
        this.testFunction( "hello!!!");
        this.showKeyboard();
        this.showSettings();
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
        var $keyboard = $('.ue-keyboard'),
            allItemsLength = $keyboard.find('li').length,
            currentItem = $keyboard.find('li.active').data('id') || 0,
            nextItem;

        console.log('keys', allItemsLength);

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
        $keyboard.find('li').removeClass('active');
        $keyboard.find('li[data-id="' + nextItem + '"]').addClass('active');

    },

    navigateModules: function (action) {

        var $module_wrapper = $('.ue-wrapper'),
            $modules = $(this.element).find('.ue-module'),
            currentItem = $modules.filter('.active').data('ue-module') || 1,
            nextItem;

        if (action === 'right') {
            nextItem = ((currentItem ) > $modules.length) ? 0 : currentItem + 1;
            this.currentModuleId += 1;
            $module_wrapper.css('left', -(100*(nextItem-1)) + "%");
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? $modules.length - 1 : currentItem - 1;
            this.currentModuleId -= 1;
            $module_wrapper.css('left', -(100*(nextItem-1)) + "%");
        }

        console.log('new pos', $module_wrapper.css('left'), -(100*(nextItem-1)) + "%");

        $modules.removeClass('active');
        $modules.filter('[data-ue-module="' + nextItem + '"]').addClass('active');
        this.currentModuleId = nextItem;

        console.log('current module ID', this.currentModuleId);

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

        var $controls = $(this.element).find('#ue-controls li'),
            $currentControl = $controls.filter('.show'),
            currentControlId = $currentControl.data('ue-control-id') || 0,
            currentControlName = $currentControl.data('ue-control-name') || 'key',
            nextControlId;

        if (action === 'right') {
            nextControlId = ((currentControlId + 1) >= $controls.length) ? 0 : currentControlId + 1;
        }
        else if (action === 'left') {
            nextControlId = ((currentControlId - 1) < 0) ? $controls.length - 1 : currentControlId - 1;
        }
        else if (action === 'enter') {
            console.log('entering');
            $currentControl.toggleClass('show');
            this.showSidebarWidget(currentControlName);
            nextControlId = currentControlId;
        }

        $controls.removeClass('show');
        $controls.filter('[data-ue-control-id="' + nextControlId + '"]').addClass('show');

        if (_.contains(this.datesModule, nextControlId)) {
            this.focusOnModule = 1;
        }
    }
    
});        
$.extend(Keller.prototype, {
    
    createSidebar: function () {
        var sidebar, 
            sidebarWidgets, 
            widgets;
        
        sidebar = document.createElement('div');
        sidebar.id = "ue-sidebar";
        sidebar.className = "active";
        
        sidebarWidgets = document.createElement('ul');
        sidebarWidgets.className = "ue-sidebar-widgets";
        
        widgets = [
            { name: "settings", alias: "set" },
            { name: "video", alias: "vid" },            
            { name: "microphone", alias: "mic" },            
            { name: "sound", alias: "set" },
            { name: "keyboard", alias: "key" }
        ];  
        
        for (var i = 0; i < widgets.length; i++) {
            sidebarWidgets.appendChild(this.createSidebarWidget(widgets[i].name, widgets[i].alias));
        }   
        
        sidebar.appendChild(sidebarWidgets); 
        
        return sidebar;  
        
    },
    
    createSidebarWidget: function (name, alias) {
        var widgetHolder, widget;
        
        widgetHolder = document.createElement('li');
        widgetHolder.setAttribute('data-widget-name', alias);     
        
        widget = document.createElement('div');
        widget.className = 'ue-' + name;   
        
        widgetHolder.appendChild(widget);
        
        return widgetHolder;
    },
    
    showSidebarWidget: function (page_name) {        
        var sidebarWidgetsList = this.element.getElementsByClassName('ue-sidebar-widgets')[0],
            sidebarWidgets = sidebarWidgetsList.getElementsByTagName('li');
        
        for (var i = 0; i < sidebarWidgets.length; i++) {            
            if(sidebarWidgets[i].getAttribute('data-widget-name') === page_name) {
                sidebarWidgets[i].classList.add('show');
            }
            else {
                sidebarWidgets[i].classList.remove('show');    
            }            
        }                        
    },
    
});        
$.extend(Keller.prototype, {

    showKeyboard: function() {        
        this.element.getElementsByClassName('ue-keyboard')[0].appendChild(this.createAlphabet());
    },

    createAlphabet: function () {
        var template = document.createElement("ul"),
            character,
            number;

        // Create an array with the letters and numbers
        for (var i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            character = document.createElement("li");
            character.setAttribute("data-id", String.fromCharCode(i));
            character.setAttribute("data-type", "letter");
            character.innerHTML = String.fromCharCode(i); 
            template.appendChild(character);                          
        }
        for(var j = 0; j < 10; j++) {
            number = document.createElement("li");
            number.setAttribute("data-id", j);
            number.setAttribute("data-type", "number");
            number.innerHTML = j;    
            template.appendChild(number);  
        }                 

        return template;
    }
    
});        
$.extend(Keller.prototype, {
    
    showSettings: function () {        
        this.element.getElementsByClassName('ue-settings')[0].appendChild(this.createSettings());        
    },
    
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
        speech.speak(text);
    },

    readModuleHeaders: function () {
        var $moduleHeaders = this.getCurrentModule().find('h3[data-ue-speech], h4[data-ue-speech]');
        _.each($moduleHeaders, function(header){
            this.readText($(header).data('ue-speech'));
        }, this);
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
        var $currentInputValue = this.getCurrentModule().find('input').val(),
            currentChar = $(this.element).find('.ue-keyboard li.active').text().toLowerCase();
        this.fillOutInput($currentInputValue + currentChar);
    },

    removeText: function () {
        var $input = $('input[name="test"]'),
            currentValue = $input.val();
        $input.val(currentValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        this.getCurrentModule().find('input').val(text);
    }
    
});        
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