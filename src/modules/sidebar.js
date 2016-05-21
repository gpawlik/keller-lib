Keller.prototype.sidebar = function() {
    var _this = this,
        $el = _this.element;
           
    var showSidebar = function () {
        $el.appendChild(createSidebar());
        $el.classList.add('show-sidebar');        
    };
    
    var createSidebar = function() {
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
            sidebarWidgets.appendChild(createSidebarWidget(widgets[i].name, widgets[i].alias, i));
            sidebarControls.appendChild(createSidebarControls(widgets[i].alias, widgets[i].icon, i));
        }
        
        _this._addEvent(sidebarHeaderClose, 'click', _this._bind(toggleSidebar, _this));

        sidebar.appendChild(sidebarHeader);
        sidebar.appendChild(sidebarWidgets);
        sidebar.appendChild(sidebarControls);

        return sidebar;
    };

    var createSidebarWidget = function(name, alias, index) {
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
                widget.appendChild(_this.createAlphabet());
                break;
            case 'settings':
                widget.appendChild(_this.createSettings());
                break;
            case 'video':
                widget.appendChild(_this.createVideoWidget());
                break;
            case 'microphone':
                widget.appendChild(_this.createVoiceWidget());
                break;
            case 'sound':
                widget.appendChild(_this.createSpeechWidget());
                break;
        }

        widgetHolder.appendChild(widget);

        return widgetHolder;
    };

    var createSidebarControls = function(alias, icon, index) {
        var controlItem = document.createElement('li');

        controlItem.setAttribute('data-ue-control-id', index);
        controlItem.setAttribute('data-ue-control-name', alias);
        controlItem.className = 'control-icon-' + alias;
        controlItem.innerHTML = icon;
        if (index === 0) {
            controlItem.classList.add('show');
        }
        _this._addEvent(controlItem, 'click', _this._bind(showSidebarWidget, _this));

        return controlItem;
    };

    var showSidebarWidget = function(e) {
        e.stopPropagation();
        var sidebarWidgets = $el.querySelectorAll('.ue-sidebar-widgets > li'),
            controls = $el.querySelectorAll('.ue-sidebar-controls li'),
            pageName = e.constructor === CustomEvent ? e.detail.pageName : e.currentTarget.getAttribute('data-ue-control-name');

        toggleSidebar(true);
        _this._activateItem(sidebarWidgets, 'data-widget-name', pageName, 'show');
        _this._activateItem(controls, 'data-ue-control-name', pageName, 'show');
    };

    var toggleSidebar = function(show) {
        _this._toggleClass($el, 'show-sidebar', show);
    }
    
    return {
        show: showSidebar
    };
       
};
