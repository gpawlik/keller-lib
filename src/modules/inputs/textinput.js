$.extend(Keller.prototype, {
        
    writeText: function () {
        var $currentInputValue = this.getCurrentModule().find('input').val(),
            currentChar = $(this.element).find('.ue-keyboard li.active').text().toLowerCase();
        this.fillOutInput($currentInputValue + currentChar);
    },

    removeText: function () {
        var $input = $('input[name="test"]'),
            currentValue = $input.val();
        $input.val(currentValue.slice(0, -1));
    },

    fillOutInput: function (text) {
        this.getCurrentModule().find('input').val(text);
    }
    
});        