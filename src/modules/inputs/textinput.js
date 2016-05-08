$.extend(Keller.prototype, {
        
    writeText: function () {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value,
            currentChar = this.element.querySelector('.ue-keyboard li.active').innerHTML.toLowerCase();
        this.fillOutInput(currentInputValue + currentChar);
    },

    removeText: function () {
        var currentInputValue = this.getCurrentModule().querySelector('input[type="text"]').value;   
        this.fillOutInput(currentInputValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        this.getCurrentModule().querySelector('input').value = text;
    }
    
});        