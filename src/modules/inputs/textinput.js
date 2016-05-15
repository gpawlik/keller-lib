$.extend(Keller.prototype, {
        
    writeText: function (e) {
        this._stopPropagation(e);
        
        var currentInput = this.getCurrentModule().querySelector('input[type="text"]'),
            currentChar = e.constructor === CustomEvent ? e.detail.keyValue : e.target.innerHTML;
            
        currentInput.value = currentInput.value + currentChar.toLowerCase();
    },

    removeText: function () {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value;   
        this.fillOutInput(currentInputValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        this.getCurrentModule().querySelector('input').value = text;
    }
    
});        