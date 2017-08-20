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
                    "src/modules/settings.js",
                    "src/modules/gamepad.js",
                    "src/modules/voice.js",
                    "src/modules/video.js",
                    "src/modules/speech.js",
                    "src/modules/keys.js",
                    "src/modules/inputs/dateselector.js",
                    "src/modules/inputs/textinput.js",
                    "src/modules/helpers.js"
                ],
				dest: "dist/js/keller-lib.js"
			}
		},

        umd: {
            all: {
                options: {
                    src: 'dist/js/keller-lib.js',
                    dest: 'dist/js/keller-lib.js',
                    objectToExport: 'Keller',
                    globalAlias: 'Keller'
                }
            }
        },

		// Lint definitions
		jshint: {
			files: [ "src/modules/*.js", "test/tests.js" ],
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

		mocha_casperjs: {
            options: {
                width: 900,
                height: 900,
                verbose: true
            },
			files: {
				src: [
					'test/**/*.js'
				]
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

		watch: {
			files: [ "src/modules/*", "src/modules/*/*", "style/*", "style/core/*", "test/**/*" ],
			tasks: [ "default" ]
		}

	} );

	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-mocha-casperjs" );
  grunt.loadNpmTasks( "grunt-umd" );
	grunt.loadNpmTasks( "grunt-jscs" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-sass" );
	grunt.loadNpmTasks( "grunt-karma" );
  grunt.loadNpmTasks( "grunt-serve" );

	grunt.registerTask( "travis", [ "jshint", "karma:travis" ] );
	grunt.registerTask( "test", [ "mocha_casperjs:files" ] );
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "build", [ "concat", "umd:all", "uglify" ] );
	grunt.registerTask( "default", [ "jshint", "sass", "build", "serve" ] );
};
