$.extend(Keller.prototype, {

    showKeyboard: function() {
        var alphabet = this.createAlphabet();
        $(this.element).find('.ue-keyboard').append(alphabet);
    },

    createAlphabet: function () {
        var letters,
            template;

            //Create an array with the letters
            letters = _.map(_.range(
                'a'.charCodeAt(0),
                'z'.charCodeAt(0) + 1
            ),
            function(value) {
                return String.fromCharCode(value);
            });

        for(var j = 0; j < 10; j++) {
            letters.push(j);
        }

        template = '<ul>';
        for(var i = 0; i < letters.length; i++) {
            template += '<li data-id="' + i + '">' + letters[i] + '</li>';
        }
        template += '</ul>';

        return template;
    }
    
});        