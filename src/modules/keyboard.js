$.extend(Keller.prototype, {

    showKeyboard: function() {        
        this.element.getElementsByClassName('ue-keyboard')[0].appendChild(this.createAlphabet());
    },

    createAlphabet: function () {
        var template = document.createElement("ul"),
            character,
            number;

        // Create an array with the letters and numbers
        for (var i = 'a'.charCodeAt(0); i <= 'z'.charCodeAt(0); i++) {
            character = document.createElement("li");
            character.setAttribute("data-id", String.fromCharCode(i));
            character.setAttribute("data-type", "letter");
            character.innerHTML = String.fromCharCode(i); 
            template.appendChild(character);                          
        }
        for(var j = 0; j < 10; j++) {
            number = document.createElement("li");
            number.setAttribute("data-id", j);
            number.setAttribute("data-type", "number");
            number.innerHTML = j;    
            template.appendChild(number);  
        }                 

        return template;
    }
    
});        