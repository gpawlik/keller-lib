$.extend(Keller.prototype, {

    showSidebarWidget: function (page_name) {
        console.log('pn', page_name);
        var $settingsPages = $('.ue-sidebar-widgets');
        $settingsPages.find('li').removeClass('show');
        $settingsPages.find('li[data-widget-name="' + page_name + '"]').addClass('show');
    }
    
});        