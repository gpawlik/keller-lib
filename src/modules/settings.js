/* global ; */
$.extend(Keller.prototype, {

    createSettings: function() {
        var settingsFields,
            settings;

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

        settings = document.createElement('div');
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(this.createSetting(settingsFields[i]));
        }
        return settings;
    },

    createSetting: function(field) {
        var wrapper,
            labelbox,
            button;

        wrapper = document.createElement('div');
        wrapper.className = 'ue-settings-row';

        labelbox = document.createElement('div');
        labelbox.className = 'ue-settings-label';
        labelbox.innerHTML = field.label;

        wrapper.appendChild(labelbox);

        button = this.createSettingButton(field);
        wrapper.appendChild(button);

        this._addEvent(button, 'click', this._bind(this.changeSettings, this));

        return wrapper;
    },

    createSettingButton: function(field) {
        var cachedValue = this.loadSettings(field),
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
        this._triggerEvent(document, 'settings:' + field.name, { value: settingvalue });

        return button;
    },

    changeSettings: function(e) {
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
            this.storeSettings(settingName, newValue);
            this._triggerEvent(document, 'settings:' + settingName, { value: newValue });
        }
    },

    storeSettings: function(item, value) {
        localStorage.setItem(item, value);
    },

    getSettings: function(item) {
        return localStorage.getItem(item);
    },

    loadSettings: function(setting) {
        var cachedSetting = this.getSettings(setting.name);

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
    },

    changeContrast: function(e) {
        this._toggleClass(document.body, 'reversed', e.detail.value);
    },

    changeFontSize: function(e) {
        document.body.style.fontSize = parseInt(e.detail.value, 10) / 10 + 'em';
    },

    changeLetterSpacing: function(e) {
        document.body.style.letterSpacing = parseInt(e.detail.value, 10) / 10 + 'px';
    },

    changeLineHeight: function(e) {
        document.body.style.lineHeight = 100 + parseInt(e.detail.value, 10) * 10 + '%';
    },

    changeShowImages: function(e) {
        this._toggleClass(document.body, 'hide-images', !e.detail.value);
    }

});
