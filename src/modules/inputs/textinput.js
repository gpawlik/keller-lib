Keller.prototype.textinput = function() {

    var _this = this,
        utils = _this.utils.call(_this);

    var selectKey = function(e) {
        utils._stopPropagation(e);
        var key = e.constructor === CustomEvent ? e.detail.key : e.target;

        _this.keyboard().activateKey(key, 'active');
        writeText(key);
    };

    var writeText = function(key) {
        var currentInput = utils.getCurrentModule().querySelector('input[type="text"]');
        if (currentInput) {
            currentInput.value = currentInput.value + key.innerHTML.toLowerCase();
        }
    };

    var removeText = function() {
        var currentInputValue = utils.getCurrentModule().querySelector('input[type="text"]').value;
        fillOutInput(currentInputValue.slice(0, -1));
    };

    var fillOutInput = function(text) {
        utils.getCurrentModule().querySelector('input').value = text;
    };

    return {
        selectKey: selectKey,
        writeText: writeText,
        removeText: removeText
    }
};
