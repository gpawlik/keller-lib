var locators = require('../constants').locators,
    utils = require('../functions');

module.exports = function () {
    describe('Sidebar testing', function () {
        
        it('sidebar should exist in DOM', function() {
            casper.waitForSelector(locators.sidebar, function(sidebar) {
                expect(locators.sidebar).to.be.inDOM;
            });
        });
            
        it('hides sidebar', function() {
            casper.then(function() { 
                expect(this.getElementAttribute('body', 'class')).to.include('show-sidebar');          
            })
            .wait(150)
            .thenClick(locators.sidebar_close)
            .wait(150)
            .then(function() {             
                expect(this.getElementAttribute('body', 'class')).to.not.include('show-sidebar');    
            });
        });        
                
        it("sidebar is a child of the body", function () {
            expect(utils.getElement('sidebar').parentElement).to.equal(document.body);
        });
            
        it("sidebar contains a header", function () {
            expect(utils.getElement('sidebar_header').parentElement).to.equal(utils.getElement('sidebar'));
        });
        
        it("sidebar contains controls", function () {
            expect(utils.getElement('controls_area').parentElement).to.equal(utils.getElement('sidebar'));
        });
        
        it("sidebar contains widgets", function () {
            expect(utils.getElement('widgets_area').parentElement).to.equal(utils.getElement('sidebar'));
        });                            
              
    });
};