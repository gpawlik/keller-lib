$.extend(Keller.prototype, {
    
    showSettings: function () {        
        this.element.getElementsByClassName('ue-settings')[0].appendChild(this.createSettings());        
    },
    
    createSettings: function () {
        var settingsFields,
            settings;
            
        settingsFields = [
            {
                'label': 'Something',
                'type': ''
            },
            {
                'label': 'Letter spacing',
                'type': 'switch'
            },
            {
                'label': 'Font enhancer',
                'type': 'stepper'
            },
            {
                'label': 'Event logger',
                'type': 'logger'
            }
        ];
        
        settings = document.createElement('div');        
        for (var i = 0; i < settingsFields.length; i++) {
            settings.appendChild(this.createSetting(settingsFields[i].label, settingsFields[i].type));
        }
        return settings;
    },
    
    createSetting: function (label, type) {
        var wrapper, 
            labelbox;
        
        wrapper = document.createElement('div');
        wrapper.className = 'ue-settings-row';
        
        labelbox = document.createElement('div');
        labelbox.className = 'ue-settings-label';
        labelbox.innerHTML = label;
        
        wrapper.appendChild(labelbox);
        wrapper.appendChild(this.createSettingButton(type));        
        
        return wrapper;
    },
    
    createSettingButton: function (type) {
        var wrapper,            
            button,            
            buttonSubtract, 
            buttonAdd;
            
        wrapper = document.createElement('div');   
        button = document.createElement('div');                 
        
        switch (type) {
            case 'switch':                
                button.className = "ue-settings-voice-switch";
                wrapper = false;
                break;
            case 'stepper':                                        
                buttonSubtract = document.createElement('span');                
                buttonSubtract.setAttribute("data-step", "subtract");                
                buttonAdd = document.createElement('span');                
                buttonAdd.setAttribute("data-step", "add");                   
                wrapper.appendChild(buttonSubtract);
                wrapper.appendChild(buttonAdd); 
                wrapper.className = "ue-settings-stepper";                
                break;
            case 'logger':                
                button.className = "ue-logger-box";
                wrapper.className = "ue-settings-logger";             
                break;
        }    
        
        if(wrapper) {
            wrapper.appendChild(button);
        }                                                  
        
        return wrapper || button; 
    }
    
});