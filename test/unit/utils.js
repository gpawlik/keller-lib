var Keller = require('../../dist/js/keller-lib'),
    keller = new Keller("body");

module.exports = function () {
    describe('Utils testing', function() {
        
        var utils = keller.utils();
        
        it("getFocus is a function", function() {
            expect(utils.getFocus).to.be.a.function;
        }); 
        
        it("setFocus is a function", function() {
            expect(utils.setFocus).to.be.a.function;
        });
        
        it("getCurrentModule is a function", function() {
            expect(utils.getCurrentModule).to.be.a.function;
        });
        
        it("removeClass is a function", function() {
            expect(utils.removeClass).to.be.a.function;
        });
        
        it("removeClass removes class of the element", function() {
            document.body.classList.add('foo');
            expect(document.body.className).to.contain('foo');
            utils.removeClass(document.body, 'foo');
            expect(document.body.className).to.not.contain('foo');
        });        
        
        it("addClass is a function", function() {
            expect(utils.addClass).to.be.a.function;
        });
        
        it("addClass adds class to the element", function() {
            utils.addClass(document.body, 'bar');
            expect(document.body.className).to.contain('bar');
        });
        
        it("toggleClass is a function", function() {
            expect(utils.toggleClass).to.be.a.function;
        });
        
        it("toggleClass toggles class of the element", function() {
            document.body.classList.add('foo');
            expect(document.body.className).to.contain('foo');
            utils.toggleClass(document.body, 'foo');
            expect(document.body.className).to.not.contain('foo');
        });
        
        it("activateItem is a function", function() {
            expect(utils.activateItem).to.be.a.function;
        });
        
        it("stopPropagation is a function", function() {
            expect(utils.stopPropagation).to.be.a.function;
        });
        
        it("addEvent is a function", function() {
            expect(utils.addEvent).to.be.a.function;
        });
        
        it("onEvent is a function", function() {
            expect(utils.onEvent).to.be.a.function;
        });
        
        it("triggerEvent is a function", function() {
            expect(utils.triggerEvent).to.be.a.function;
        });
        
        it("bind is a function", function() {
            expect(utils.bind).to.be.a.function;
        });
        
        it("extend is a function", function() {        
            expect(utils.extend).to.be.a.function;
        });
        
        it("extend method works correctly", function() {        
            var obj1 = { foo: "bar" },
                obj2 = { bar: "baz" }
            expect(utils.extend(obj1, obj2)).to.deep.equal({ foo: "bar", bar: "baz" });
        });
        
        it("contains is a function", function() {
            expect(utils.contains).to.be.a.function;
        });
        
        it("contains method works correctly", function() {
            var foo = [0,3,5,9],
                bar = 3,
                baz = 4
            expect(utils.contains(foo, bar)).to.be.true;
            expect(utils.contains(foo, baz)).to.be.false;
        });
            
    });     
};