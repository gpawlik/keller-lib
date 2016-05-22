Keller.prototype.handlers = function() {

    var _this = this,
        navigation = _this.navigation.call(_this),
        settings = _this.settings.call(_this),
        utils = _this.utils.call(_this);

    var eventHandlers = function() {
        utils._addEvent(document, 'keydown', utils._bind(_this.keys().getEvent, _this));
        utils._addEvent(window, 'gamepadconnected', utils._bind(_this.gamepad().isConnected, _this));
        utils._addEvent(window, 'gamepaddisconnected', utils._bind(_this.gamepad().isDisconnected, _this));
    };

    var eventListeners = function() {
        utils._onEvent(document, 'settings:font-size', utils._bind(settings.changeFontSize, _this));
        utils._onEvent(document, 'settings:letter-spacing', utils._bind(settings.changeLetterSpacing, _this));
        utils._onEvent(document, 'settings:line-height', utils._bind(settings.changeLineHeight, _this));
        utils._onEvent(document, 'settings:contrast', utils._bind(settings.changeContrast, _this));
        utils._onEvent(document, 'settings:show-images', utils._bind(settings.changeShowImages, _this));
        //utils._onEvent(document, 'controls:showwidget', utils._bind(this.showSidebarWidget, this));
        utils._onEvent(document, 'keyboard:writetext', utils._bind(_this.textinput().selectKey, _this));
    };

    var navigateHandler = function(action, focus) {
        if ((action === 'right') || (action === 'left')) {
            switch (focus) {
                case 'input':
                    if (utils.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                        _this.dateinput().modify(action, focus);
                    } else {
                        navigation.modules(action);
                    }
                    break;
                case 'controls':
                    navigation.controls(action);
                    break;
                case 'settings':
                    navigation.keyboard(action);
                    break;
            }
        } else if ((action === 'up') || (action === 'down')) {
            if (utils.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                _this.dateinput().navigate(focus, action);
            } else {
                navigation.focusAreas(action);
            }
        } else if (action === 'enter') {
            switch (focus) {
                case 'controls':
                    navigation.controls(action);
                    break;
                case 'settings':
                    navigation.keyboard(action);
                    break;
            }
        }
    };

    return {
        eventHandlers: eventHandlers,
        eventListeners: eventListeners,
        navigateHandler: navigateHandler
    }
};
