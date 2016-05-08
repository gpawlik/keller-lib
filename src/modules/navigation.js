$.extend(Keller.prototype, {

    navigateKeyboard: function (action) {
        var keyboard = this.element.querySelector('.ue-keyboard'),            
            activeItem = keyboard.querySelector('li.active'),
            currentItem = activeItem ? parseInt(activeItem.getAttribute('data-id'), 10) : 0,
            allItemsLength = keyboard.querySelectorAll('li').length,
            nextItem;        

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
        this.removeClass(keyboard.querySelectorAll('li'), 'active');   
        this.addClass(keyboard.querySelector('li[data-id="' + nextItem + '"]'), 'active');              
    },

    navigateModules: function (action) {

        var modules = this.element.querySelectorAll('.ue-module'),
            currentItem = this.currentModuleId || 0,
            nextItem;

        if (action === 'right') {
            nextItem = ((currentItem + 1) > modules.length - 1) ? 0 : currentItem + 1;            
        }
        else if (action === 'left') {
            nextItem = ((currentItem - 1) < 0) ? modules.length - 1 : currentItem - 1;                      
        }                     

        for (var i = 0; i < modules.length; i++) {            
            if (parseInt(modules[i].getAttribute('data-ue-module'), 10) === nextItem) {
                this.addClass(modules[i], 'active');                
            }
            else {
                this.removeClass(modules[i], 'active');
            }
        }

        this.currentModuleId = nextItem;        
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