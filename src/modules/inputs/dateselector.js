Keller.prototype.dateinput = function() {

    var _this = this,
        $elem = _this.element;

    var modifyDates = function(action, focus) {
        var $moduleWithFocus = $elem.querySelector('[data-ue-module="' + _this.currentModuleId + '"]');

        switch (_this.focusOnModule) {
            case 1:
                var valueDay = parseInt($moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10);
                changeDay(valueDay, action, $moduleWithFocus);
                break;
            case 2:
                var valueMonth = parseInt($moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10);
                var valueYear = parseInt($moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);
                changeMonth(valueMonth, valueYear, action, $moduleWithFocus);
                break;
        }
    };

    var changeMonth = function(valueMonth, valueYear, action, module) {
        if (action === 'right') {
            if (valueMonth === 12) {
                valueMonth = 1;
                valueYear += 1;
            } else {
                valueMonth += 1;
            }
        } else {
            if (valueMonth === 1) {
                valueMonth = 12;
                valueYear -= 1;
            } else {
                valueMonth -= 1;
            }
        }
        module.querySelector('input[data-month]').setAttribute('data-month', valueMonth);
        module.querySelector('input[data-year]').setAttribute('data-year', valueYear);
        module.querySelector('[data-ue-focus="2"]').value = getMonthText(valueMonth).toUpperCase() + ', ' + valueYear;
    };

    var getMonthText = function(valueMonth) {
        var months = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[valueMonth - 1];
    };

    var changeDay = function(valueDay, action, module) {
        if (action === 'right') {
            if (valueDay < 31) {
                valueDay += 1;
            }
        } else {
            if (valueDay > 1) {
                valueDay -= 1;
            }
        }
        module.querySelector('input[data-day]').setAttribute('data-day', valueDay);
        module.querySelector('[data-ue-focus="1"]').value = valueDay;
    };

    var navigateDates = function(focus, action) {
        if (action === 'up') {
            switch (_this.focusOnModule) {
            case 1:
                _this.focusOnModule = 1;
                _this.navigation().modules('left');
                break;
            case 2:
                _this.focusOnModule -= 1;
                break;
            }
        } else if (_this.focusOnModule === 1) {
            _this.focusOnModule += 1;
        }
    };

    var errorValidate = function(moduleWithFocus) {

    };

    var validateDates = function(moduleWithFocus) {
        var valueDay = parseInt(moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10),
            valueMonth = parseInt(moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10),
            valueYear = parseInt(moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);

        var dateToValidate = new Date(valueYear, valueMonth - 1, valueDay);
        var validator = (!dateToValidate || dateToValidate.getFullYear() === valueYear && dateToValidate.getMonth() === (valueMonth - 1) && dateToValidate.getDate() === valueDay);
        return validator;
    };

    return {
        modify: modifyDates,
        navigate: navigateDates,
        validate: validateDates,
        errorValidate: errorValidate
    };
};
