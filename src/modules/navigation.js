$.extend(Keller.prototype, {

    navigateKeyboard: function (action) {
        var $keyboard = $('.ue-keyboard'),
            allItemsLength = $keyboard.find('li').length,
            currentItem = $keyboard.find('li.active').data('id') || 0,
            nextItem;

        console.log('keys', allItemsLength);

        if (action === 'right') {
            nextItem = ((currentItem + 1) > allItemsLength) ? 0 : currentItem + 1;
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? allItemsLength - 1 : currentItem - 1;
        }
        else if (action === 'enter') {
            this.writeText();
            nextItem = currentItem;
        }
        $keyboard.find('li').removeClass('active');
        $keyboard.find('li[data-id="' + nextItem + '"]').addClass('active');

    },

    navigateModules: function (action) {

        var $module_wrapper = $('.ue-wrapper'),
            $modules = $(this.element).find('.ue-module'),
            currentItem = $modules.filter('.active').data('ue-module') || 1,
            nextItem;

        if (action === 'right') {
            nextItem = ((currentItem ) > $modules.length) ? 0 : currentItem + 1;
            this.currentModuleId += 1;
            $module_wrapper.css('left', -(100*(nextItem-1)) + "%");
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? $modules.length - 1 : currentItem - 1;
            this.currentModuleId -= 1;
            $module_wrapper.css('left', -(100*(nextItem-1)) + "%");
        }

        console.log('new pos', $module_wrapper.css('left'), -(100*(nextItem-1)) + "%");

        $modules.removeClass('active');
        $modules.filter('[data-ue-module="' + nextItem + '"]').addClass('active');
        this.currentModuleId = nextItem;

        console.log('current module ID', this.currentModuleId);

        this.readModuleHeaders();
    },

    navigateSettings: function (action) {
        var focusAreas = this.settings.focusAreas,
            currentFocusIndex = focusAreas.indexOf(this.getFocus());

        if (action === 'up' && ((currentFocusIndex + 1) < focusAreas.length)) {
            this.setFocus(currentFocusIndex + 1);
        }
        else if (action === 'down' && ((currentFocusIndex - 1) >= 0)) {
            this.setFocus(currentFocusIndex - 1);
        }
    },

    navigateControls: function (action) {

        var $controls = $(this.element).find('.ue-sidebar-controls li'),
            $currentControl = $controls.filter('.show'),
            currentControlId = $currentControl.data('ue-control-id') || 0,
            currentControlName = $currentControl.data('ue-control-name') || 'key',
            nextControlId;

        if (action === 'right') {
            nextControlId = ((currentControlId + 1) >= $controls.length) ? 0 : currentControlId + 1;
        }
        else if (action === 'left') {
            nextControlId = ((currentControlId - 1) < 0) ? $controls.length - 1 : currentControlId - 1;
        }
        else if (action === 'enter') {
            console.log('entering');
            $currentControl.toggleClass('show');
            this.showSidebarWidget(currentControlName);
            nextControlId = currentControlId;
        }

        $controls.removeClass('show');
        $controls.filter('[data-ue-control-id="' + nextControlId + '"]').addClass('show');

        if (_.contains(this.datesModule, nextControlId)) {
            this.focusOnModule = 1;
        }
    }
    
});        