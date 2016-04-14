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
            propertyName: "value"
        };

    // The actual plugin constructor
    function UniversalEdreams (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.currentModuleId = 1;
        this.currentFocus = 'input';
        this.init();
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
            $(this.element).find('.ue-keyboard').html(alphabet);
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

        navigateKeyboard: function (direction) {
            var $keyboard = $('.ue-keyboard'),
                allItemsLength = $keyboard.find('li').length,
                currentItem = $keyboard.find('li.active').data('id') || 0,
                nextItem;

            if (direction === 'right') {
                nextItem = ((currentItem + 1) > allItemsLength) ? 0 : currentItem + 1;
            }
            else if (direction === 'left') {
                nextItem = ((currentItem - 1) < 0) ? allItemsLength - 1 : currentItem - 1;
            }
            $keyboard.find('li').removeClass('active');
            $keyboard.find('li[data-id="' + nextItem + '"]').addClass('active');

        },

        navigateModules: function (direction) {

            var $modules = $(this.element).find('.ue-module'),
                currentItem = $modules.filter('.active').data('ue-module') || 1,
                nextItem;

            if (direction === 'right') {
                nextItem = ((currentItem + 1) > $modules.length) ? 0 : currentItem + 1;
            }
            else if (direction === 'left') {
                nextItem = ((currentItem - 1) < 0) ? $modules.length - 1 : currentItem - 1;
            }

            $modules.removeClass('active');
            $modules.filter('[data-ue-module="' + nextItem + '"]').addClass('active');
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
            var $currentModule = $('[data-ue-module="' + this.currentModuleId + '"]'),
                direction;

            switch (e.keyCode) {
                case 39:
                    if(this.currentFocus === 'input') {
                        //$(document).trigger($currentModule.data('ueRight'));
                        this.navigateModules('right');
                    }
                    else {
                        this.navigateKeyboard('right');
                    }
                    break;
                case 37:
                    if(this.currentFocus === 'input') {
                        //$(document).trigger($currentModule.data('ueLeft'));
                        this.navigateModules('right');
                    }
                    else {
                        this.navigateKeyboard('left');
                    }
                    break;
                case 38:
                    direction = 'up';
                    console.log('switching: SETTINGS');
                    if(this.currentFocus === 'input') {
                        this.currentFocus = 'settings';
                    }
                    break;
                case 40:
                    direction = 'down';
                    console.log('switching: INPUT');
                    if(this.currentFocus === 'settings') {
                        this.currentFocus = 'input';
                    }
                    break;
                case 13:
                    this.writeText();
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
