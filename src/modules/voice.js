$.extend(Keller.prototype, {

    activateVoice: function () {
        voice.start();
    },

    deActivateVoice: function () {
        voice.stop();
    },

    debugVoice: function () {
        voice.addCallback("resultMatch", function(n, a, o) {
            console.log("said: " + n + ", cmd: " + a + ", phrases: " + o);
        });
        voice.debug();
    },

    generateVoiceCommands: function (commands) {
        var commandTriggers = _.object(_.map(commands, function(command, trigger){
            return [command,
                    _.bind(function () {
                        this.fillOutInput(trigger);
                    }, this)
            ];
        }, this));
        voice.addCommands(commandTriggers);
        this.debugVoice();
        voice.start();
    }
    
});        