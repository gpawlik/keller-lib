$.extend(Keller.prototype, {
    
    modifyDates: function (action, focus) {
        var $moduleWithFocus = $('[data-ue-module="' + this.currentModuleId + '"]');
        switch (this.focusOnModule) {
            case 1:
                var valueDay = parseInt($moduleWithFocus.find('input[data-day]').attr('data-day'));
                this.changeDay(valueDay, action, $moduleWithFocus);
                break;
            case 2:
                var valueMonth = parseInt($moduleWithFocus.find('input[data-month]').attr('data-month'));
                var valueYear = parseInt($moduleWithFocus.find('input[data-year]').attr('data-year'));
                this.changeMonth(valueMonth, valueYear, action, $moduleWithFocus);
                break;
        }
    },

    changeMonth: function (valueMonth, valueYear, action, module) {
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
        module.find('input[data-month]').attr('data-month', valueMonth);
        module.find('input[data-year]').attr('data-year', valueYear);
        module.find('[data-ue-focus=2]').val(this.getMonthText(valueMonth).toUpperCase() + ', ' + valueYear);
    },

    getMonthText: function(valueMonth) {
        var months = ['January', 'February', 'March', 'April', 'May', 'Juny', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[valueMonth - 1];
    },

    changeDay: function (valueDay, action, module) {
        if (action === 'right') {
            if (valueDay < 31) {
                valueDay += 1;
            }
        } else {
            if (valueDay !== 1) {
                valueDay -= 1;
            }
        }
        module.find('input[data-day]').attr('data-day', valueDay);
        module.find('[data-ue-focus=1]').val(valueDay);
    },

    navigateDates: function (focus, action) {
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

    errorValidate: function (moduleWithFocus) {

    },

    validateDates: function (moduleWithFocus) {
        var valueDay = parseInt(moduleWithFocus.find('input[data-day]').attr('data-day')),
            valueMonth = parseInt(moduleWithFocus.find('input[data-month]').attr('data-month')),
            valueYear = parseInt(moduleWithFocus.find('input[data-year]').attr('data-year'));

        var dateToValidate = new Date (valueYear, valueMonth - 1, valueDay);
        var validator = (!dateToValidate || dateToValidate.getFullYear() === valueYear && dateToValidate.getMonth() === (valueMonth - 1) && dateToValidate.getDate() === valueDay);
        return validator;
    }
    
});