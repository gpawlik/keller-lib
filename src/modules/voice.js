$.extend(Keller.prototype, {

    initVoiceRecognition: function () {
        if(!('webkitSpeechRecognition' in window)) {            
            this.voiceRecognition = false;
            console.log('Speech recognition not supported');
        }
        else {
            this.voiceRecognition = new webkitSpeechRecognition();
            this.voiceRecognition.continuous = true;
            this.voiceRecognition.interimResults = true;  
            this.processRecognizedText(this.voiceRecognition);   
            //this.voiceStart();       
        }
    },

    voiceStart: function () {
        if (this.voiceRecognition) {
            this.voiceRecognition.start();            
        }
    },
    
    voiceStop: function () {        
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();            
        }        
    },
    
    processRecognizedText: function (recognition) { 
            
        recognition.onresult = function(event) {
            var final_transcript = '',
                interim_transcript = '';
                            
            if (typeof(event.results) === 'undefined') {
                recognition.stop();
                console.log('There was a problem receiving results');
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            console.log('final transcript', final_transcript);
            console.log('iterim transcript', interim_transcript);
        }; 
        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                console.log('Speech recognition error: no speech.');                
            }
            if (event.error == 'audio-capture') {
                console.log('Speech recognition error: no microphone.');                
            }
            if (event.error == 'not-allowed') {              
                console.log('Speech recognition not allowed.');           
            }
        };
        recognition.onstart = function () {
            console.log('Speech recognition started, speak now!');            
        };
        recognition.onend = function () {
            console.log('Speech recognition ended!');
            //recognition.start(); // TODO: allow continuous listening        
        }; 
        recognition.onnomatch = function () {
            console.log('Sorry! There was no match...');
        };                        
    }    
});    