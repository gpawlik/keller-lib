Keller.prototype.textinput = function() {

    var _this = this,
        _ = _this.utils();

    var selectKey = function(e) {
        _.stopPropagation(e);
        var key = e.constructor === CustomEvent ? e.detail.key : e.target;

        _this.keyboard().activateKey(key, 'active');
        writeText(key);
    };

    var writeText = function(key) {
        var currentInput = _.getCurrentModule().querySelector('input[type="text"]');
        if (currentInput) {
            currentInput.value = currentInput.value + key.innerHTML.toLowerCase();
        }
    };

    var removeText = function() {
        var currentInputValue = _.getCurrentModule().querySelector('input[type="text"]').value;
        fillOutInput(currentInputValue.slice(0, -1));
    };

    var fillOutInput = function(text) {
        _.getCurrentModule().querySelector('input').value = text;
    };

    return {
        selectKey: selectKey,
        writeText: writeText,
        removeText: removeText
    };
};
