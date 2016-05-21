$.extend(Keller.prototype, {

    eventHandlers: function() {
        this._addEvent(document, 'keydown', this._bind(this.getKeyEvent, this));
        this._addEvent(window, 'gamepadconnected', this._bind(this.gamepadConnected, this));
        this._addEvent(window, 'gamepaddisconnected', this._bind(this.gamepadDisconnected, this));
    },

    eventListeners: function() {
        this._onEvent(document, 'settings:font-size', this._bind(this.changeFontSize, this));
        this._onEvent(document, 'settings:letter-spacing', this._bind(this.changeLetterSpacing, this));
        this._onEvent(document, 'settings:line-height', this._bind(this.changeLineHeight, this));
        this._onEvent(document, 'settings:contrast', this._bind(this.changeContrast, this));
        this._onEvent(document, 'settings:show-images', this._bind(this.changeShowImages, this));
        //this._onEvent(document, 'controls:showwidget', this._bind(this.showSidebarWidget, this));
        this._onEvent(document, 'keyboard:writetext', this._bind(this.selectKey, this));
    },

    navigateHandler: function(action, focus) {
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
        } else if ((action === 'up') || (action === 'down')) {
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
