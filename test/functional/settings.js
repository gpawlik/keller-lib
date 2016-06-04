var locators = require('../constants').locators,
    utils = require('../functions');

module.exports = function () {
    describe('Settings testing', function () {
        
        it('changes contrast', function() {
            casper.then(function() { 
                expect(this.getElementAttribute('body', 'class')).to.include('reversed');            
            })
            .wait(150)
            .thenClick('.ue-settings-button[data-name="contrast"]')
            .wait(150)
            .then(function() { 
                expect(this.getElementAttribute('body', 'class')).to.not.include('reversed');
            });
        });

        it("number of controls should equal number of widgets", function() {
            expect(utils.getElement('controls_area').childNodes.length).to.equal(utils.getElement('widgets_area').childNodes.length);
        }); 
        
        it("only one control should be active", function() {
            expect(utils.getElement('controls_area').querySelectorAll(".show[data-ue-control-name]").length).to.equal(1);
        });        
                    
    });
};