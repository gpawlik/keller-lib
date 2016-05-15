$.extend(Keller.prototype, {
    
    createAlphabet: function () {
        var template = document.createElement('ul'),
            firstCharCode = 'a'.charCodeAt(0),
            lastCharCode = 'z'.charCodeAt(0),
            firstNumber = 0,
            lastNumber = 9,         
            currentCharacter,
            currentNumber;
        
        for (var i = 0; i <= lastCharCode - firstCharCode; i++) {
            currentCharacter = document.createElement('li');
            currentCharacter.setAttribute('data-id', i);
            currentCharacter.setAttribute('data-type', 'letter');
            currentCharacter.innerHTML = String.fromCharCode(firstCharCode + i); 
            if (i === 0) {
                currentCharacter.className = 'active';
            }
            template.appendChild(currentCharacter);                          
        }
        for(var j = firstNumber; j <= lastNumber; j++) {
            currentNumber = document.createElement('li');
            currentNumber.setAttribute('data-id', i + j);
            currentNumber.setAttribute('data-type', 'number');
            currentNumber.innerHTML = j;    
            template.appendChild(currentNumber);  
        } 
        this._addEvent(template, 'click', this._bind(this.writeText, this));
                        
        return template;
    }
    
});        