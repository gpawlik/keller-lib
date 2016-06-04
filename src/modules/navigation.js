Keller.prototype.navigation = function() {

    var _this = this,
        $elem = _this.element,
        _ = _this.utils();

    var navigateKeyboard = function(action) {
        var keyboard = $elem.querySelector('.ue-keyboard'),
            activeItem = keyboard.querySelector('li.active'),
            currentItemId = activeItem ? parseInt(activeItem.getAttribute('data-id'), 10) : 0,
            currentItem = keyboard.querySelector('li[data-id="' + currentItemId + '"]'),
            allItemsLength = keyboard.querySelectorAll('li').length,
            nextItemId;

        if (action === 'right') {
            nextItemId = ((currentItemId + 1) > allItemsLength) ? 0 : currentItemId + 1;
        } else if (action === 'left') {
            nextItemId = ((currentItemId - 1) < 0) ? allItemsLength - 1 : currentItemId - 1;
        } else if (action === 'enter') {
            _.triggerEvent(document, 'keyboard:writetext', { key: currentItem });
        }

        if (typeof nextItemId !== 'undefined') {
            _this.keyboard().activateKey(keyboard.querySelector('li[data-id="' + nextItemId + '"]'), 'active');
        }
    };

    var navigateModules = function(action) {
        var modules = $elem.querySelectorAll('.ue-module'),
            currentItem = _this.currentModuleId || 0,
            nextItem;

        if (action === 'right') {
            nextItem = ((currentItem + 1) > modules.length - 1) ? 0 : currentItem + 1;
        } else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? modules.length - 1 : currentItem - 1;
        }

        for (var i = 0; i < modules.length; i++) {
            _.toggleClass(modules[i], 'active', parseInt(modules[i].getAttribute('data-ue-module'), 10) === nextItem);
        }

        _this.currentModuleId = nextItem;
        _this.speech().readModuleHeaders();
    };

    var navigateFocusAreas = function(action) {
        var focusAreas = _this.options.focusAreas,
            currentFocusIndex = focusAreas.indexOf(_.getFocus());

        if (action === 'up' && ((currentFocusIndex + 1) < focusAreas.length)) {
            _.setFocus(currentFocusIndex + 1);
        } else if (action === 'down' && ((currentFocusIndex - 1) >= 0)) {
            _.setFocus(currentFocusIndex - 1);
        }
    };

    var navigateControls = function(action) {
        var controls = $elem.querySelectorAll('.ue-sidebar-controls li'),
            currentControl = $elem.querySelector('.ue-sidebar-controls li.show'),
            currentControlName = currentControl.getAttribute('data-ue-control-name') || 'key',
            currentControlId = parseInt(currentControl.getAttribute('data-ue-control-id'), 10) || 0,
            nextControlId;

        if (action === 'right') {
            nextControlId = ((currentControlId + 1) >= controls.length) ? 0 : currentControlId + 1;
        } else if (action === 'left') {
            nextControlId = ((currentControlId - 1) < 0) ? controls.length - 1 : currentControlId - 1;
        } else if (action === 'enter') {
            _.triggerEvent(document, 'controls:showwidget', { pageName: currentControlName });
        }

        if (typeof nextControlId !== 'undefined') {
            _.activateItem(controls, 'data-ue-control-id', nextControlId, 'show');
        }
    };

    return {
        keyboard: navigateKeyboard,
        modules: navigateModules,
        focusAreas: navigateFocusAreas,
        controls: navigateControls
    };
};
