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
 *  
 *
 *  Made by 
 *  Under MIT License
 */
;( function( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var pluginName = "invisibleEdreams",
        defaults = {
            propertyName: "value"
        };

    // The actual plugin constructor
    function UniversalEdreams ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    // Avoid UniversalEdreams.prototype conflicts
    $.extend( UniversalEdreams.prototype, {
        init: function() {
            this.testFunction( "hello!" );
            this.showKeyboard();
            this.eventHandlers();
        },

        testFunction: function( text ) {
            $( this.element ).text( text );
        },

        showKeyboard: function() {
            var alphabet = this.createAlphabet();
            $(this.element).html(alphabet);
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

        rotate: function (direction) {
            var allItemsLength = $(this.element).find('li').length,
                currentItem = $(this.element).find('li.active').data('id') || 0,
                nextItem;

            if (direction === 'right') {
                nextItem = ((currentItem + 1) > allItemsLength) ? 0 : currentItem + 1;
            }
            else if (direction === 'left') {
                nextItem = ((currentItem - 1) < 0) ? allItemsLength - 1 : currentItem - 1;
            }
            $(this.element).find('li').removeClass('active');
            $(this.element).find('li[data-id="' + nextItem + '"]').addClass('active');

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

        eventHandlers: function () {
            $('body').on('keydown', _.bind(this.getKeyEvent, this));
            $(window).on('gamepadconnected', _.bind(this.gamepadConnected, this));
            $(window).on('gamepaddisconnected', _.bind(this.gamepadDisconnected, this));
        },

        gamepadConnected: function (e) {
            // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
            // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
            console.log("Gamepad connected.");
            var repGP = window.setInterval(_.bind(this.checkGamepad, this),200);
        },

        gamepadDisonnected: function (e) {
            console.log("Gamepad disconnected!");
        },

        checkGamepad: function() {
            var gp = navigator.getGamepads()[0];

            if(gp.buttons[0].pressed) {
            }
            if(gp.buttons[1].pressed) {
                this.rotate('right');
            }
            if(gp.buttons[2].pressed) {
                this.rotate('left');
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
            var direction;
            switch (e.keyCode) {
                case 39:
                    this.rotate('right');
                    break;
                case 37:
                    this.rotate('left');
                    break;
                case 38:
                    direction = 'up';
                    break;
                case 40:
                    direction = 'down';
                    break;
                case 13:
                    this.writeText();
            }

        }

    } );

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function( options ) {
        return this.each( function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" +
                    pluginName, new UniversalEdreams( this, options ) );
            }
        } );
    };

} )( jQuery, window, document );
