Keller.prototype.video = function() {

    var _this = this;

    var createVideoWidget = function() {
        var widget = document.createElement('div');
        _this._addEvent(widget, 'click', _this._bind(activateVideoOption, _this));
        _this._addClass(widget, 'widget-icon');
        _this._addClass(widget, 'video-widget-icon');
        widget.innerHTML = '0';
        return widget;
    };

    var activateVideoOption = function(e) {
        _this._toggleClass(e.currentTarget, 'active');
    };
    
    return {
        createWidget: createVideoWidget
    }
};
