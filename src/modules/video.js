$.extend(Keller.prototype, {
    
    createVideoWidget: function () {
        var widget = document.createElement('div');        
        this._addClass(widget, 'widget-icon');
        this._addClass(widget, 'video-widget-icon');
        this._addClass(widget, 'active');
        widget.innerHTML = '0';
        return widget; 
    }   
    
});