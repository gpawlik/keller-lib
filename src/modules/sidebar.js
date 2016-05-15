$.extend(Keller.prototype, {
    
    showSidebar: function () {        
        this.element.appendChild(this.createSidebar());   
    },
    
    createSidebar: function () {
        var sidebar, 
            sidebarHeader,
            sidebarHeaderClose,
            sidebarWidgets, 
            sidebarControls,
            widgets;
        
        sidebar = document.createElement('div');
        sidebar.id = 'ue-sidebar';   
        sidebar.className = 'active';     
        
        sidebarHeader = document.createElement('div');
        sidebarHeader.className = 'ui-sidebar-header';
        sidebarHeaderClose = document.createElement('div');
        sidebarHeaderClose.className = 'ui-sidebar-close';
        sidebarHeaderClose.innerHTML = 'r';
        this._addEvent(sidebarHeaderClose, 'click', this._bind(this.toggleSidebar, this));
        sidebarHeader.appendChild(sidebarHeaderClose);
        
        sidebarWidgets = document.createElement('ul');
        sidebarWidgets.className = 'ue-sidebar-widgets';
        
        sidebarControls = document.createElement('ul');
        sidebarControls.className = 'ue-sidebar-controls';
        
        widgets = [
            { name: 'settings', alias: 'set', icon: 'J' },
            { name: 'video', alias: 'vid', icon: '0' },            
            { name: 'microphone', alias: 'mic', icon: '1' },            
            { name: 'sound', alias: 'sou', icon: '3' },
            { name: 'keyboard', alias: 'key', icon: '2' }
        ]; 
        
        for (var i = 0; i < widgets.length; i++) {
            sidebarWidgets.appendChild(this.createSidebarWidget(widgets[i].name, widgets[i].alias, i));
            sidebarControls.appendChild(this.createSidebarControls(widgets[i].alias, widgets[i].icon, i));
        }   
        
        sidebar.appendChild(sidebarHeader);
        sidebar.appendChild(sidebarWidgets);
        sidebar.appendChild(sidebarControls); 
        
        return sidebar;          
    },
    
    createSidebarWidget: function (name, alias, index) {
        var widgetHolder, widget;
        
        widgetHolder = document.createElement('li');
        widgetHolder.setAttribute('data-widget-name', alias);
        if (index === 0) {
            widgetHolder.className = 'show';
        }     
        
        widget = document.createElement('div');
        widget.className = 'ue-' + name;   
        
        switch (name) {
            case 'keyboard':
                widget.appendChild(this.createAlphabet());
                break;
            case 'settings':
                widget.appendChild(this.createSettings());
                break; 
            case 'video':
                widget.appendChild(this.createVideoWidget());
                break; 
            case 'microphone':
                widget.appendChild(this.createVoiceWidget());
                break;  
            case 'sound':
                widget.appendChild(this.createSpeechWidget());
                break;                                          
        }
        
        widgetHolder.appendChild(widget);
        
        return widgetHolder;
    },
    
    createSidebarControls: function (alias, icon, index) {
        var controlItem = document.createElement('li');
        
        controlItem.setAttribute('data-ue-control-id', index);
        controlItem.setAttribute('data-ue-control-name', alias);
        controlItem.className = 'control-icon-' + alias;
        controlItem.innerHTML = icon;        
        if (index === 0) {
            controlItem.classList.add('show');
        }
        this._addEvent(controlItem, 'click', this._bind(this.showSidebarWidget, this));
        
        return controlItem;                             
    },
    
    showSidebarWidget: function (e) { 
        e.stopPropagation(); 
        
        this.toggleSidebar(true);
               
        var sidebarWidgets = this.element.querySelectorAll('.ue-sidebar-widgets > li'),
            pageName = e.constructor === CustomEvent ? e.detail.pageName : e.currentTarget.getAttribute('data-ue-control-name');                
        
        for (var i = 0; i < sidebarWidgets.length; i++) {            
            if(sidebarWidgets[i].getAttribute('data-widget-name') === pageName) {                
                this._addClass(sidebarWidgets[i], 'show');
            }
            else {                 
                this._removeClass(sidebarWidgets[i], 'show');  
            }            
        }  
        // Temporary voice activation 
        if(pageName === 'mic') {
            this.voiceStart();
        }  
        else {
            this.voiceStop();
        }                   
    },
    
    toggleSidebar: function (show) {
        var sidebar = this.element.querySelector('#ue-sidebar'),
            activeClass = 'active';
        
        if (show === true) {
            this._addClass(sidebar, activeClass); 
        }
        else if (show === false) {
            this._removeClass(sidebar, activeClass); 
        } 
        else {
            this._toggleClass(sidebar, activeClass);    
        }        
    }
    
});        