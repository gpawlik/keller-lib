Keller.prototype.handlers = function() {

    var _this = this,
        navigation = _this.navigation(),
        settings = _this.settings(),
        _ = _this.utils();

    var eventHandlers = function() {
        _.addEvent(document, 'keydown', _.bind(_this.keys().getEvent, _this));
        _.addEvent(window, 'gamepadconnected', _.bind(_this.gamepad().isConnected, _this));
        _.addEvent(window, 'gamepaddisconnected', _.bind(_this.gamepad().isDisconnected, _this));
    };

    var eventListeners = function() {
        _.onEvent(document, 'settings:font-size', _.bind(settings.changeFontSize, _this));
        _.onEvent(document, 'settings:letter-spacing', _.bind(settings.changeLetterSpacing, _this));
        _.onEvent(document, 'settings:line-height', _.bind(settings.changeLineHeight, _this));
        _.onEvent(document, 'settings:contrast', _.bind(settings.changeContrast, _this));
        _.onEvent(document, 'settings:show-images', _.bind(settings.changeShowImages, _this));
        _.onEvent(document, 'controls:showwidget', _.bind(_this.sidebar().showWidget, this));
        _.onEvent(document, 'keyboard:writetext', _.bind(_this.textinput().selectKey, _this));
    };

    var navigateHandler = function(action, focus) {
        if ((action === 'right') || (action === 'left')) {
            switch (focus) {
                case 'input':
                    if (_.getCurrentModule().hasAttribute('data-ue-dateselector')) {
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
            if (_.getCurrentModule().hasAttribute('data-ue-dateselector')) {
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
    };
};
