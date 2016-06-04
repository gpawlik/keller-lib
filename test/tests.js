var config = require('./config'),
    sidebar = require('./functional/sidebar'),
    widgets = require('./functional/widgets'),
    settings = require('./functional/settings'),
    utils = require('./unit/utils'),
    screenshots_path = 'test/screenshots/';

describe('Functional testing', function() {
 	before(function() {
        localStorage.clear();
        sessionStorage.clear();   
		casper.start(config.URL.dev);
	});  
    sidebar();
    widgets();
    settings();         
});

describe('Unit testing', function() {    
    utils();        
});  