$.extend(Keller.prototype, {
    
    createVideoWidget: function () {
        var widget = document.createElement('div');        
        this._addEvent(widget, 'click', this._bind(this.activateVideoOption, this));        
        this._addClass(widget, 'widget-icon');
        this._addClass(widget, 'video-widget-icon');        
        widget.innerHTML = '0';                
        return widget; 
    },
    
    activateVideoOption: function (e) {
        this._toggleClass(e.currentTarget, 'active');
    }  
    
});