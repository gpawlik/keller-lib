Keller.prototype.keys = function() {

    var _this = this,
        _ = _this.utils();

    var getKeyEvent = function(e) {
        //  direction;
        e.preventDefault();
        switch (e.keyCode) {
            case 13:
                if (_.getCurrentModule().hasAttribute('data-ue-dateselector')) {
                    var $moduleWithFocus = _.getCurrentModule();
                    if (_this.dateinput().validate($moduleWithFocus)) {
                        _this.focusOnModule = 1;
                        _this.navigation().modules('right');
                    } else {
                        _this.dateinput().errorValidate($moduleWithFocus);
                    }
                } else {
                    _this.handlers().navigateHandler('enter', _this.currentFocus);
                }
                break;
            case 39:
                _this.handlers().navigateHandler('right', _this.currentFocus);
                break;
            case 37:
                _this.handlers().navigateHandler('left', _this.currentFocus);
                break;
            case 38:
                _this.handlers().navigateHandler('up');
                break;
            case 40:
                _this.handlers().navigateHandler('down');
                break;
        }
    };

    return {
        getEvent: getKeyEvent
    };
};
