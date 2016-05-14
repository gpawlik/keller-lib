$.extend(Keller.prototype, {
        
    createSettings: function () {
        var settingsFields,
            settings;
            
        settingsFields = [
            {
                'label': 'Something',
                'type': '',
                'name': 'something'
            },
            {
                'label': 'Letter spacing',
                'type': 'switch',
                'name': 'letter-spacing'
            },
            {
                'label': 'Font enhancer',
                'type': 'stepper',
                'name': 'font-enhancer'
            },
            {
                'label': 'Event logger',
                'type': 'logger',
                'name': 'event-logger'
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
        button.className = 'ue-settings-button ue-settings-button-' + field.type;  
        button.setAttribute('data-name', field.name);                   
        
        switch (field.type) {
            case 'stepper':                                        
                var buttonAdd = document.createElement('span'), 
                    buttonSubtract = document.createElement('span');  
                buttonAdd.setAttribute("data-step", "add");                                 
                buttonSubtract.setAttribute("data-step", "subtract");                                                               
                button.appendChild(buttonSubtract);
                button.appendChild(buttonAdd);               
                break;
        }                                                                              
        return button; 
    },
    
    changeSettings: function () {
        
    }  
});