Keller.prototype.gamepad = function() {

    var _this = this,
        _ = _this.utils();

    var gamepadConnected = function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
        // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
        console.log('Gamepad connected.');
        var repGP = window.setInterval(_.bind(checkGamepad, _this), 200);
    };

    var gamepadDisconnected = function() {
        console.log('Gamepad disconnected!');
    };

    var checkGamepad = function() {
        var gp = navigator.getGamepads()[0];

        if (gp.buttons[1].pressed) {
            _this.navigation().keyboard('right');
        }
        if (gp.buttons[2].pressed) {
            _this.navigation().keyboard('left');
        }
        if (gp.buttons[4].pressed) {
            _this.textinput().removeText();
        }
        if (gp.buttons[5].pressed) {
            _this.textinput().writeText();
        }
    };

    return {
        isConnected: gamepadConnected,
        isDisconnected: gamepadDisconnected
    };
};
