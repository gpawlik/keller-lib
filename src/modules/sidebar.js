$.extend(Keller.prototype, {
    
    createSidebar: function () {
        var sidebar, 
            sidebarWidgets, 
            widgets;
        
        sidebar = document.createElement('div');
        sidebar.id = "ue-sidebar";
        sidebar.className = "active";
        
        sidebarWidgets = document.createElement('ul');
        sidebarWidgets.className = "ue-sidebar-widgets";
        
        widgets = [
            { name: "settings", alias: "set" },
            { name: "video", alias: "vid" },            
            { name: "microphone", alias: "mic" },            
            { name: "sound", alias: "set" },
            { name: "keyboard", alias: "key" }
        ];  
        
        for (var i = 0; i < widgets.length; i++) {
            sidebarWidgets.appendChild(this.createSidebarWidget(widgets[i].name, widgets[i].alias));
        }   
        
        sidebar.appendChild(sidebarWidgets); 
        
        return sidebar;  
        
    },
    
    createSidebarWidget: function (name, alias) {
        var widgetHolder, widget;
        
        widgetHolder = document.createElement('li');
        widgetHolder.setAttribute('data-widget-name', alias);     
        
        widget = document.createElement('div');
        widget.className = 'ue-' + name;   
        
        widgetHolder.appendChild(widget);
        
        return widgetHolder;
    },
    
    showSidebarWidget: function (page_name) {        
        var sidebarWidgetsList = this.element.getElementsByClassName('ue-sidebar-widgets')[0],
            sidebarWidgets = sidebarWidgetsList.getElementsByTagName('li');
        
        for (var i = 0; i < sidebarWidgets.length; i++) {            
            if(sidebarWidgets[i].getAttribute('data-widget-name') === page_name) {
                sidebarWidgets[i].classList.add('show');
            }
            else {
                sidebarWidgets[i].classList.remove('show');    
            }            
        }                        
    },
    
});        