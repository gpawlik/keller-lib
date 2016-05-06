module.exports = function( grunt ) {

	grunt.initConfig( {

		// Import package manifest
		pkg: grunt.file.readJSON( "package.json" ),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +				
				" *\n" +
				" *  Author <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {	
                banner: "<%= meta.banner %>",			
                separator: "\n"
			},
			dist: {
				src: [ 
                    "src/modules/init.js",
                    "src/modules/handlers.js",                    
                    "src/modules/navigation.js",
                    "src/modules/sidebar.js",
                    "src/modules/keyboard.js",                                         
                    "src/modules/gamepad.js",
                    "src/modules/voice.js",
                    "src/modules/speech.js",
                    "src/modules/keys.js",
                    "src/modules/inputs/dateselector.js",  
                    "src/modules/inputs/textinput.js",                     
                    "src/modules/helpers.js",                    
                    "src/modules/plugin.js",
                ],
				dest: "src/output.js"
			}
		},
        
        // Wrap final file
        wrap: {
            modules: {
                src: [ "src/output.js" ],
                dest: "dist/js/keller-lib.js",
                options: {
                    wrapper: [';(function($, voice, speech, window, document, undefined) {\n"use strict"\n', '\n}(jQuery, annyang, responsiveVoice, window, document));']    
                }                
            }
        },

		// Lint definitions
		jshint: {
			files: [ "src/keller-lib.js", "test/**/*" ],
			options: {
				jshintrc: ".jshintrc"
			}
		},

		jscs: {
			src: "src/**/*.js",
			options: {
				config: ".jscsrc"
			}
		},

		// Minify definitions
		uglify: {
			dist: {
				src: [ "dist/js/keller-lib.js" ],
				dest: "dist/js/keller-lib.min.js"
			},
			options: {
				banner: "<%= meta.banner %>"
			}
		},

        // Simple server
        serve: {
            'path': './demo'
        },

		// karma test runner
		karma: {
			unit: {
				configFile: "karma.conf.js",
				background: true,
				singleRun: false,
				browsers: [ "PhantomJS", "Firefox" ]
			},

			//continuous integration mode: run tests once in PhantomJS browser.
			travis: {
				configFile: "karma.conf.js",
				singleRun: true,
				browsers: [ "PhantomJS" ]
			}
		},

        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'dist/css/keller-lib.css': 'style/style.scss'                   
                }
            }
        },

		// watch for changes to source
		// Better than calling grunt a million times
		// (call 'grunt watch')
		watch: {
			files: [ "src/*", "style/*", "style/core/*", "test/**/*" ],
			tasks: [ "default" ]
		}

	} );

	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-wrap" );
	grunt.loadNpmTasks( "grunt-jscs" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-coffee" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-sass" );
	grunt.loadNpmTasks( "grunt-karma" );
    grunt.loadNpmTasks( "grunt-serve" );

	grunt.registerTask( "travis", [ "jshint", "karma:travis" ] );
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "build", [ "concat", "wrap:modules", "uglify" ] );
	grunt.registerTask( "default", [ "jshint", "sass", "build" ] );
};
