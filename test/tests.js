var expect = chai.expect,
    keller = new Keller('body');

describe('DOM tests', function() {
    var sidebar = document.getElementById('ue-sidebar'),
        sidebar_header = document.querySelector('.ue-sidebar-header'),
        controls_area = document.querySelector('.ue-sidebar-controls'),
        widgets_area = document.querySelector('.ue-sidebar-widgets');
    
    it("sidebar is in the DOM", function () {
        expect(sidebar).to.not.be.null;
    });   
    
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
    });
  
});