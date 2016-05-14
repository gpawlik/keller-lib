/* global ; */
$.extend(Keller.prototype, {
                
    createSettings: function () {
        var settingsFields,
            settings;                        
            
        settingsFields = [
            {
                'label': 'Contrast',
                'type': 'switch',
                'name': 'contrast',
                'value': this.getSettings('contrast') || true
            },
            {
                'label': 'Letter spacing',
                'type': 'switch',
                'name': 'letter-spacing',
                'value': this.getSettings('letter-spacing') || false
            },
            {
                'label': 'Font enhancer',
                'type': 'stepper',
                'name': 'font-enhancer',
                'value': this.getSettings('font-enhancer') || 5
            },
            {
                'label': 'Event logger',
                'type': 'logger',
                'name': 'event-logger',
                'value': this.getSettings('event-logger') || 2
            }
        ];
        
        settings = document.createElement('div');        
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(this.createSetting(settingsFields[i]));
        }
        return settings;
    },
    
    createSetting: function (field) {
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
    
    createSettingButton: function (field) {    
        var button;
        
        button = document.createElement('div');
        button.className = 'ue-settings-button';  
        button.setAttribute('data-name', field.name);
        button.setAttribute('data-type', field.type);
        button.setAttribute('data-value', field.value);                     
        
        switch (field.type) {
            case 'stepper':                                        
                var buttonAdd = document.createElement('span'), 
                    buttonSubtract = document.createElement('span');  
                buttonAdd.setAttribute("data-step", "add"); 
                buttonSubtract.setAttribute("data-step", "subtract");    
                buttonAdd.innerHTML = "+";                                             
                buttonSubtract.innerHTML = "-";                                                              
                button.appendChild(buttonSubtract);
                button.appendChild(buttonAdd);               
                break;
        }                                                                              
        return button; 
    },
    
    changeSettings: function (e) {
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
                }
                else {
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
            this._triggerEvent(document, 'settings:' + settingName);         
        }  
    },
    
    storeSettings: function (item, value) {
        localStorage.setItem(item, value);
    },
    
    getSettings: function (item) {
        return localStorage.getItem(item);
    },
    
    changeFontSize: function () {
        
    },
    
    changeContrast: function () {
        this._toggleClass(document.body, 'reversed');        
    }
});