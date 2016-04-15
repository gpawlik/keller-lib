module.exports = function( grunt ) {

	grunt.initConfig( {

		// Import package manifest
		pkg: grunt.file.readJSON( "package.json" ),

		// Banner definitions
		meta: {
			banner: "/*\n" +
				" *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
				" *  <%= pkg.description %>\n" +
				" *  <%= pkg.homepage %>\n" +
				" *\n" +
				" *  Made by <%= pkg.author.name %>\n" +
				" *  Under <%= pkg.license %> License\n" +
				" */\n"
		},

		// Concat definitions
		concat: {
			options: {
				banner: "<%= meta.banner %>"
			},
			dist: {
				src: [ "src/invisible-edreams.js" ],
				dest: "dist/invisible-edreams.js"
			}
		},

		// Lint definitions
		jshint: {
			files: [ "src/invisible-edreams.js", "test/**/*" ],
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
				src: [ "dist/invisible-edreams.js" ],
				dest: "dist/invisible-edreams.min.js"
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
                    'dist/invisible-edreams.css': 'style/style.scss',
                    'dist/edreams-core.css': 'style/core/main.scss'
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
	grunt.loadNpmTasks( "grunt-jscs" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-contrib-coffee" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks( "grunt-karma" );
    grunt.loadNpmTasks( "grunt-serve" );

	grunt.registerTask( "travis", [ "jshint", "karma:travis" ] );
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "build", [ "concat", "uglify" ] );
	grunt.registerTask( "default", [ "jshint", "sass", "build" ] );
};
