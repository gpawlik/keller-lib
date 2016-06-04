Keller.prototype.video = function() {

    var _this = this,
        _ = _this.utils();

    var createVideoWidget = function() {
        var widget = document.createElement('div');
        _.addEvent(widget, 'click', _.bind(activateVideoOption, _this));
        _.addClass(widget, 'widget-icon');
        _.addClass(widget, 'video-widget-icon');
        widget.innerHTML = '0';
        return widget;
    };

    var activateVideoOption = function(e) {
        _.toggleClass(e.currentTarget, 'active');
    };

    return {
        createWidget: createVideoWidget
    };
};
