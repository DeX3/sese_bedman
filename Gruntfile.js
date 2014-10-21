"use strict";

// prevent jshint flagging the node_env parameter of express
/* jshint camelcase: false */

module.exports = function( grunt ) {

    grunt.loadNpmTasks( "grunt-express-server" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-jshint" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-mocha-test" );
    grunt.loadNpmTasks( "grunt-curl" );
    grunt.loadNpmTasks( "grunt-zip" );
    grunt.loadNpmTasks( "grunt-jsdoc" );
    grunt.loadNpmTasks( "grunt-env" );
    grunt.loadNpmTasks( "grunt-knex-migrate" );
    grunt.loadNpmTasks( "grunt-open" );

    grunt.initConfig( {
        watch: {
            /* 
             * Takes care of restarting the express server when a file is
             * changed. Note that restarting the server will trigger linting as
             * well.
             */
            express: {
                files: ["app.js",
                        "app/*.js",
                        "app/models/*.js",
                        "app/controllers/*.js"],
                tasks: ["lint", "express:development"],
                options: { spawn: false }
            },
            public: {
                files: ["app/views/**/*.html",
                        "app/views/**/*.ejs",
                        "app/public/**/*.html",
                        "app/public/**/*.css",
                        "app/public/**/*.js"],
                options: { livereload: true }
            }
        },
        express: {
            /* 
             * Starts server in environment according to sub-task.
             * express:development for development environment,
             * express:test for test environment and
             * express:production for production.
             */
            options: {
                script: "app.js"
            },
            development: { options: { node_env: "development" }    },
            production: { options: { node_env: "production" } },
            test: {
                options: {
                    node_env: "test",
                    output: "Listening on port.*"
                }
            },
        },
        env: {
            options: {},
            development: { NODE_ENV: "development" },
            test: { NODE_ENV: "test" },
            production: { NODE_ENV: "production" },
            coverage: { COVERAGE: "true" }
        },
        knexmigrate: {
            config: function( cb ) {

                var config = require( "config" );
                var db = config.get( "db" );


                var cfg = {
                    directory: "app/migrations",
                    tableName: "knex_migrations",
                    database: {
                        client: db.client,
                        connection: {
                            user: db.connection.user,
                            password: db.connection.password,
                            database: db.connection.database
                        }
                    }
                };
                
                cb( null, cfg );
            }
        },
        jshint: {
            all: ["app.js",
                  "app/**/*.js",
                  "test/**/*.js",
                  "!test/coverage/**/*.js"],
            options: {
                ignores: ["node_modules/**/*",
                          "app/public/bower_components/**/*"
                         ],
                jshintrc: true
            }
        },
        mochaTest: {
            test: {
                options: { },
                src: ["test/**/*.test.js"]
            }
        },
        curl: {
            coverage: {
                dest: "test/reports/coverage.zip",
                src: "http://localhost:3001/coverage/download"
            }
        },
        unzip: {
            coverage: {
                dest: "test/reports/",
                src: "test/reports/coverage.zip"
            }
        },
        clean: {
            coverageZip: ["test/reports/coverage.zip"],
            doc: ["doc/**/*"]
        },
        jsdoc: {
            dist: {
                src: ["app.js",
                      "app/**/*.js",
                      "test/**/*.js",
                      "README.md"],
                options: {
                    destination: "doc"
                }
            }
        },
        open: {
            coverage: {
                path: "test/reports/lcov-report/index.html"
            }
        }
    } );

    //simple alias
    grunt.registerTask( "lint", "jshint" );
    grunt.registerTask( "doc", "jsdoc" );

    var envs = ["development", "test", "production"];
    var knexCommands = ["latest", "rollback", "currentVersion"];

    //register migration tasks
    knexCommands.forEach( function(cmd) {
        envs.forEach( function(env) {
            grunt.registerTask( "migrate:" + env + ":" + cmd,
                                [ "env:" + env, "knexmigrate:" + cmd ] );
        } );
    } );

    //register make migration task (this one doesn't need an environment)
    grunt.registerTask( "migrate:make",
                        "Create migration",
                        function( name ) {
        if( !name ) {
            throw new Error( "No migration name given! Specify like this: " + 
                             "migrate:make:<migration_name>" );
        }

        grunt.task.run( "knexmigrate:make:" + name );
    } );


    //lint once, then start server and watch for changes
    grunt.registerTask( "server", ["lint", "express:development", "watch"] );

    //start the server in test setup and then run the tests
    grunt.registerTask( "test", ["express:test", "mochaTest"] );

    grunt.registerTask( "test:coverage", ["env:coverage",
                                          "express:test",
                                          "mochaTest",
                                          "curl:coverage",
                                          "unzip:coverage",
                                          "clean:coverageZip",
                                          "open:coverage"] );

};
