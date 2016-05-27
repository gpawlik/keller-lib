Keller.prototype.settings = function() {

    var _this = this,
        settingsFields,
        _ = _this.utils();

    settingsFields = [
        {
            'label': 'Contrast',
            'type': 'switch',
            'name': 'contrast',
            'value': true
        },
        {
            'label': 'Font size',
            'type': 'stepper',
            'name': 'font-size',
            'value': 10
        },
        {
            'label': 'Letter spacing',
            'type': 'stepper',
            'name': 'letter-spacing',
            'value': 0
        },
        {
            'label': 'Line height',
            'type': 'stepper',
            'name': 'line-height',
            'value': 5
        },
        {
            'label': 'Show images',
            'type': 'switch',
            'name': 'show-images',
            'value': true
        }
    ];

    var createSettings = function() {
        var settings = document.createElement('div');
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(createSetting(settingsFields[i]));
        }
        return settings;
    };

    var createSetting = function(field) {
        var wrapper,
            labelbox,
            button;

        wrapper = document.createElement('div');
        wrapper.className = 'ue-settings-row';

        labelbox = document.createElement('div');
        labelbox.className = 'ue-settings-label';
        labelbox.innerHTML = field.label;

        wrapper.appendChild(labelbox);

        button = createSettingButton(field);
        wrapper.appendChild(button);

        _.addEvent(button, 'click', _.bind(changeSettings, _this));

        return wrapper;
    };

    var createSettingButton = function(field) {
        var cachedValue = loadSettings(field),
            settingvalue = (cachedValue !== null) ? cachedValue : field.value,
            button;

        button = document.createElement('div');
        button.className = 'ue-settings-button';
        button.setAttribute('data-name', field.name);
        button.setAttribute('data-type', field.type);
        button.setAttribute('data-value', settingvalue);

        switch (field.type) {
            case 'stepper':
                var buttonAdd = document.createElement('span'),
                    buttonSubtract = document.createElement('span');
                buttonAdd.setAttribute('data-step', 'add');
                buttonSubtract.setAttribute('data-step', 'subtract');
                buttonAdd.innerHTML = '+';
                buttonSubtract.innerHTML = '-';
                button.appendChild(buttonSubtract);
                button.appendChild(buttonAdd);
                break;
        }
        _.triggerEvent(document, 'settings:' + field.name, { value: settingvalue });

        return button;
    };

    var changeSettings = function(e) {
        e.stopPropagation();

        var el = e.currentTarget,
            settingName = el.getAttribute('data-name'),
            settingType = el.getAttribute('data-type'),
            currentValue = JSON.parse(el.getAttribute('data-value')),
            newValue;

        switch (settingType) {
            case 'stepper':
                if (e.target.getAttribute('data-step') === 'add') {
                    newValue = currentValue + 1;
                } else {
                    newValue = currentValue - 1;
                }
                break;
            default:
                newValue = !currentValue;
                break;
        }
        if (typeof newValue !== 'undefined') {
            el.setAttribute('data-value', newValue);
            storeSettings(settingName, newValue);
            _.triggerEvent(document, 'settings:' + settingName, { value: newValue });
        }
    };

    var storeSettings = function(item, value) {
        localStorage.setItem(item, value);
    };

    var getSettings = function(item) {
        return localStorage.getItem(item);
    };

    var loadSettings = function(setting) {
        var cachedSetting = getSettings(setting.name);

        if (cachedSetting !== null) {
            switch (typeof setting.value) {
                case 'number':
                    cachedSetting = parseInt(cachedSetting, 10);
                    break;
                case 'boolean':
                    cachedSetting = JSON.parse(cachedSetting);
                    break;
            }
        }
        return cachedSetting;
    };

    var changeContrast = function(e) {
        _.toggleClass(document.body, 'reversed', e.detail.value);
    };

    var changeFontSize = function(e) {
        document.body.style.fontSize = parseInt(e.detail.value, 10) / 10 + 'em';
    };

    var changeLetterSpacing = function(e) {
        document.body.style.letterSpacing = parseInt(e.detail.value, 10) / 10 + 'px';
    };

    var changeLineHeight = function(e) {
        document.body.style.lineHeight = 100 + parseInt(e.detail.value, 10) * 10 + '%';
    };

    var changeShowImages = function(e) {
        _.toggleClass(document.body, 'hide-images', !e.detail.value);
    };

    return {
        create: createSettings,
        changeContrast: changeContrast,
        changeFontSize: changeFontSize,
        changeLetterSpacing: changeLetterSpacing,
        changeLineHeight: changeLineHeight,
        changeShowImages: changeShowImages
    };
};
