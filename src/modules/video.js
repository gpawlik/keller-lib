Keller.prototype.video = function() {

    var _this = this,
        utils = _this.utils.call(_this);

    var createVideoWidget = function() {
        var widget = document.createElement('div');
        utils._addEvent(widget, 'click', utils._bind(activateVideoOption, _this));
        utils._addClass(widget, 'widget-icon');
        utils._addClass(widget, 'video-widget-icon');
        widget.innerHTML = '0';
        return widget;
    };

    var activateVideoOption = function(e) {
        utils._toggleClass(e.currentTarget, 'active');
    };
    
    return {
        createWidget: createVideoWidget
    }
};
