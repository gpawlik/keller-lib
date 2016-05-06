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