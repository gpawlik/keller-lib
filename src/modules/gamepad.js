$.extend(Keller.prototype, {

    gamepadConnected: function () {
        // https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
        // http://gamedevelopment.tutsplus.com/tutorials/using-the-html5-gamepad-api-to-add-controller-support-to-browser-games--cms-21345
        console.log('Gamepad connected.');
        var repGP = window.setInterval(this._bind(this.checkGamepad, this), 200);
    },

    gamepadDisconnected: function () {
        console.log('Gamepad disconnected!');
    },

    checkGamepad: function () {
        var gp = navigator.getGamepads()[0];

        if (gp.buttons[1].pressed) {
            this.navigateKeyboard('right');
        }
        if (gp.buttons[2].pressed) {
            this.navigateKeyboard('left');
        }
        if (gp.buttons[4].pressed) {
            this.removeText();
        }
        if (gp.buttons[5].pressed) {
            this.writeText();
        }
    }

});  
      