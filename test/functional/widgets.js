var locators = require('../constants').locators,
    utils = require('../functions');

module.exports = function () {    
    describe('Widgets testing', function () {
        
        it('switching widgets', function() {
            casper.then(function() {
                expect('[data-widget-name="set"]').to.be.visible; 
                expect('[data-widget-name="vid"]').to.be.not.visible;                        
            })
            .wait(150)
            .thenClick('[data-ue-control-name="vid"]')
            .wait(150)
            .then(function() {
                expect('[data-widget-name="set"]').to.be.not.visible;          
                expect('[data-widget-name="vid"]').to.be.visible;
            })
            .wait(150)
            .thenClick('[data-ue-control-name="set"]')
            .wait(150)
            .then(function() {            
                expect('[data-widget-name="set"]').to.be.visible;
                expect('[data-widget-name="vid"]').to.be.not.visible;
            });
        });  
        
        it("controls area should contain at least one control", function() {
            expect(utils.getElement('widgets_area').childNodes.length).to.not.be.null;
        });
        
        it("widgets area should contain at least one widget", function() {
            expect(utils.getElement('widgets_area').childNodes.length).to.not.be.null;
        });
        
        it("only one widget should be active", function() {
            expect(utils.getElement('widgets_area').querySelectorAll(".show[data-widget-name]").length).to.equal(1);
        });        
                       
    });        
};