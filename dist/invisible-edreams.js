/*
 *  invisible-edreams - v4.1.0
 *  
 *  
 *
 *  Made by 
 *  Under MIT License
 */
/*
 *  invisible-edreams - v4.1.0
 *
 *  Made by Invisible/Universal eDreams Team:
 *  * Xavier Garcia Buils
 *  * Amaia Calvo
 *  * Grzegorz Pawlik
 *  * Luis Recuero
 *  * Alejandro Riera
 *
 *  Under MIT License
 */
;(function($, window, document, undefined) {

    "use strict";

    // Create the defaults once
    var pluginName = "invisibleEdreams",
        defaults = {
            propertyName: "value",
            focusAreas: ['input', 'controls', 'settings']
        };

    // The actual plugin constructor
    function UniversalEdreams (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.currentModuleId = 1;
        this.focusOnModule = 1;
        this.currentFocus = this.settings.focusAreas[0];
        this.init();
        this.datesModule = [3, 4];
    }

    // Avoid UniversalEdreams.prototype conflicts
    $.extend( UniversalEdreams.prototype, {
        init: function() {
            this.testFunction( "hello!!!");
            this.showKeyboard();
            this.eventHandlers();
        },

        eventHandlers: function () {
            $(document).on('keydown', _.bind(this.getKeyEvent, this));
            $(window).on('gamepadconnected', _.bind(this.gamepadConnected, this));
            $(window).on('gamepaddisconnected', _.bind(this.gamepadDisconnected, this));
        },

        testFunction: function( text ) {
            //$( this.element ).text( text );
            console.log(text, this.settings.propertyName);
        },

        showKeyboard: function() {
            var alphabet = this.createAlphabet();
            $(this.element).find('.ue-keyboard').append(alphabet);
        },

        createAlphabet: function () {
            var letters,
                template;

                //Create an array with the letters
                letters = _.map(_.range(
                    'a'.charCodeAt(0),
                    'z'.charCodeAt(0) + 1
                ),
                function(value) {
                    return String.fromCharCode(value);
                });

            template = '<ul>';
            for(var i = 0; i < letters.length; i++) {
                template += '<li data-id="' + i + '">' + letters[i] + '</li>';
            }
            template += '</ul>';

            return template;
        },

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
            $keyboard.find('li').removeClass('active');
            $keyboard.find('li[data-id="' + nextItem + '"]').addClass('active');

        },

        navigateModules: function (action) {

            var $modules = $(this.element).find('.ue-module'),
                currentItem = $modules.filter('.active').data('ue-module') || 1,
                nextItem;

            if (action === 'right') {
                nextItem = ((currentItem + 1) > $modules.length) ? 0 : currentItem + 1;
                this.currentModuleId += 1;
            }
            else if (action === 'left') {
                nextItem = ((currentItem - 1) < 0) ? $modules.length - 1 : currentItem - 1;
                this.currentModuleId -= 1;
            }

            $modules.removeClass('active');
            $modules.filter('[data-ue-module="' + nextItem + '"]').addClass('active');
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
                $currentControl = $controls.filter('.active'),
                currentControlId = $currentControl.data('ue-control-id') || 0,
                nextControlId;

            if (action === 'right') {
                nextControlId = ((currentControlId + 1) >= $controls.length) ? 0 : currentControlId + 1;
            }
            else if (action === 'left') {
                nextControlId = ((currentControlId - 1) < 0) ? $controls.length - 1 : currentControlId - 1;
            }
            else if (action === 'enter') {
                $currentControl.toggleClass('active');
                nextControlId = currentControlId;
            }

            $controls.removeClass('active');
            $controls.filter('[data-ue-control-id="' + nextControlId + '"]').addClass('active');

            if (_.contains(this.datesModule, nextControlId)) {
                this.focusOnModule = 1;
            }
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
            }
        },

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
        },

        getFocus: function () {
            return this.currentFocus;
        },

        setFocus: function (idx) {
            this.currentFocus = this.settings.focusAreas[idx];
        },

        writeText: function () {
            var $input = $('input[name="test"]'),
                currentValue = $input.val(),
                currentChar = $(this.element).find('li.active').text().toLowerCase();

            $input.val(currentValue + currentChar);
        },

        removeText: function () {
            var $input = $('input[name="test"]'),
                currentValue = $input.val();

            $input.val(currentValue.slice(0, -1));
        },

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
        },

        getKeyEvent: function (e) {
            //var $currentModule = $('[data-ue-module="' + this.currentModuleId + '"]'),
              //  direction;
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
                        this.writeText();
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

    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new UniversalEdreams(this, options));
            }
        } );
    };

})(jQuery, window, document);
