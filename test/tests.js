var expect = chai.expect,
    keller = new Keller('body');

describe('DOM tests', function() {
    var sidebar = document.getElementById('ue-sidebar'),
        controls = document.querySelector('.ue-sidebar-controls'),
        widgets = document.querySelector('.ue-sidebar-widgets');
    
    it("sidebar is in the DOM", function () {
        expect(sidebar).to.not.equal(null);
    });   
    
    it("sidebar is a child of the body", function () {
        expect(sidebar.parentElement).to.equal(document.body);
    });
    
    it("sidebar contains controls", function () {
        expect(controls.parentElement).to.equal(sidebar);
    });
    
    it("sidebar contains widgets", function () {
        expect(widgets.parentElement).to.equal(sidebar);
    });
  
});