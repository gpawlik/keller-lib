$.extend(Keller.prototype, {

    modifyDates: function(action, focus) {
        var $moduleWithFocus = this.element.querySelector('[data-ue-module="' + this.currentModuleId + '"]');
        console.log('focus on module', this.focusOnModule);
        switch (this.focusOnModule) {
            case 1:
                var valueDay = parseInt($moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10);
                this.changeDay(valueDay, action, $moduleWithFocus);
                break;
            case 2:
                var valueMonth = parseInt($moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10);
                var valueYear = parseInt($moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);
                this.changeMonth(valueMonth, valueYear, action, $moduleWithFocus);
                break;
        }
    },

    changeMonth: function(valueMonth, valueYear, action, module) {
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
        module.querySelector('[data-ue-focus="2"]').value = this.getMonthText(valueMonth).toUpperCase() + ', ' + valueYear;
    },

    getMonthText: function(valueMonth) {
        var months = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[valueMonth - 1];
    },

    changeDay: function(valueDay, action, module) {
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
    },

    navigateDates: function(focus, action) {
        if (action === 'up') {
            switch (this.focusOnModule) {
            case 1:
                this.focusOnModule = 1;
                this.navigateModules('left');
                break;
            case 2:
                this.focusOnModule -= 1;
                break;
            }
        } else if (this.focusOnModule === 1) {
            this.focusOnModule += 1;
        }
    },

    errorValidate: function(moduleWithFocus) {

    },

    validateDates: function(moduleWithFocus) {
        var valueDay = parseInt(moduleWithFocus.querySelector('input[data-day]').getAttribute('data-day'), 10),
            valueMonth = parseInt(moduleWithFocus.querySelector('input[data-month]').getAttribute('data-month'), 10),
            valueYear = parseInt(moduleWithFocus.querySelector('input[data-year]').getAttribute('data-year'), 10);

        var dateToValidate = new Date(valueYear, valueMonth - 1, valueDay);
        var validator = (!dateToValidate || dateToValidate.getFullYear() === valueYear && dateToValidate.getMonth() === (valueMonth - 1) && dateToValidate.getDate() === valueDay);
        return validator;
    }

});
