$.extend(Keller.prototype, {

    getKeyEvent: function (e) {            
            //  direction;
        e.preventDefault();
        switch (e.keyCode) {
            case 13:
                if (this.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                    var $moduleWithFocus = this.getCurrentModule();
                    if (this.validateDates($moduleWithFocus)) {
                        this.focusOnModule = 1;
                        this.navigateModules('right');
                    } else {
                        this.errorValidate($moduleWithFocus);
                    }
                } else {
                    this.navigateHandler('enter', this.currentFocus);
                }
                break;
            case 39:
                this.navigateHandler('right', this.currentFocus);
                break;
            case 37:
                this.navigateHandler('left', this.currentFocus);
                break;
            case 38:
                this.navigateHandler('up');
                break;
            case 40:
                this.navigateHandler('down');
                break;
        }

    }
    
});        