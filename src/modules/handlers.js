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
                    if (this._contains(this.datesModule, this.currentModuleId)) {
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
            if (this._contains(this.datesModule, this.currentModuleId)) {
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