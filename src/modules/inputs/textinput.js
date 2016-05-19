$.extend(Keller.prototype, {

    selectKey: function(e) {
        this._stopPropagation(e);
        var key = e.constructor === CustomEvent ? e.detail.key : e.target;

        this.activateKey(key, 'active');
        this.writeText(key);
    },

    writeText: function(key) {
        var currentInput = this.getCurrentModule().querySelector('input[type="text"]');
        if (currentInput) {
            currentInput.value = currentInput.value + key.innerHTML.toLowerCase();
        }
    },

    removeText: function() {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value;
        this.fillOutInput(currentInputValue.slice(0, -1));
    },

    fillOutInput: function(text) {
        this.getCurrentModule().querySelector('input').value = text;
    }

});
