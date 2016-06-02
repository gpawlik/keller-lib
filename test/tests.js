var Keller = require("../dist/js/keller-lib");

describe('Sidebar elements', function() {
 	before(function() {
		casper.start('http://localhost:9000/demo/index.html');
	});

    it('sidebar should exist in DOM', function() {
		casper.waitForSelector('#ue-sidebar', function(sidebar) {
			expect('#ue-sidebar').to.be.inDOM;
		});
	});     
    
    it('changes widgets', function() {
        casper.then(function() { 
            expect('[data-widget-name="vid"]').to.be.not.visible 
        })
        .wait(150)
        .thenClick('.control-icon-vid', function(e) {
            this.captureSelector('test_widget.png', '[data-widget-name="vid"]');
        })
        .wait(150)
        .then(function() { 
            expect('[data-widget-name="vid"]').to.be.visible 
        });
    }); 
    
    it('changes contrast', function() {
        casper.then(function() { 
            expect('body').to.have.attr('class').and.include('reversed');            
        })
        .wait(150)
        .thenClick('.ue-settings-button[data-name="contrast"]')
        .wait(150)
        .then(function() { 
            expect('body').to.have.attr('class').and.not.include('reversed') 
        });
    }); 
    
    /*
    it("sidebar is a child of the body", function () {
        expect(sidebar.parentElement).to.equal(document.body);
    });
        
    it("sidebar contains a header", function () {
        expect(sidebar_header.parentElement).to.equal(sidebar);
    });
    
    it("sidebar contains controls", function () {
        expect(controls_area.parentElement).to.equal(sidebar);
    });
    
    it("sidebar contains widgets", function () {
        expect(widgets_area.parentElement).to.equal(sidebar);
    });
    
    it("controls area should contain at least one control", function() {
        expect(controls_area.childNodes.length).to.not.be.null;
    });
    
    it("widgets area should contain at least one widget", function() {
        expect(widgets_area.childNodes.length).to.not.be.null;
    });
    
    it("number of controls should equal number of widgets", function() {
        expect(controls_area.childNodes.length).to.equal(widgets_area.childNodes.length);
    }); 
    
    it("only one control should be active", function() {
        expect(controls_area.querySelectorAll(".show[data-ue-control-name]").length).to.equal(1);
    });
    
    it("only one widget should be active", function() {
        expect(widgets_area.querySelectorAll(".show[data-widget-name]").length).to.equal(1);
    });*/
});

describe('Utils tests', function() {
    
    var keller = new Keller("body"),
        utils = keller.utils();
    
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
    
    it("addClass is a function", function() {
        expect(utils.addClass).to.be.a.function;
    });
    
    it("toggleClass is a function", function() {
        expect(utils.toggleClass).to.be.a.function;
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