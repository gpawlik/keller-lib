$.extend(Keller.prototype, {
    
    showSidebar: function () {        
        this.element.appendChild(this.createSidebar());   
    },
    
    createSidebar: function () {
        var sidebar, 
            sidebarWidgets, 
            sidebarControls,
            widgets;
        
        sidebar = document.createElement('div');
        sidebar.id = "ue-sidebar";   
        sidebar.className = "active";     
        
        sidebarWidgets = document.createElement('ul');
        sidebarWidgets.className = "ue-sidebar-widgets";
        
        sidebarControls = document.createElement('ul');
        sidebarControls.className = "ue-sidebar-controls";
        
        widgets = [
            { name: "settings", alias: "set", icon: "J" },
            { name: "video", alias: "vid", icon: "0" },            
            { name: "microphone", alias: "mic", icon: "1" },            
            { name: "sound", alias: "sou", icon: "3" },
            { name: "keyboard", alias: "key", icon: "2" }
        ]; 
        
        for (var i = 0; i < widgets.length; i++) {
            sidebarWidgets.appendChild(this.createSidebarWidget(widgets[i].name, widgets[i].alias, i));
            sidebarControls.appendChild(this.createSidebarControls(widgets[i].alias, widgets[i].icon, i));
        }   
        
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
        
        return controlItem;                             
    },
    
    showSidebarWidget: function (page_name) {        
        var sidebarWidgets = this.element.querySelectorAll('.ue-sidebar-widgets > li');                
        
        for (var i = 0; i < sidebarWidgets.length; i++) {            
            if(sidebarWidgets[i].getAttribute('data-widget-name') === page_name) {                
                this.addClass(sidebarWidgets[i], 'show');
            }
            else {                 
                this.removeClass(sidebarWidgets[i], 'show');  
            }            
        }                        
    }
    
});        