"use strict";

module.exports = function( config ) {

    config.set( {
        frameworks: ["mocha"],

        basePath: "../..",

        files: [
            "app/public/bower_components/jquery/dist/jquery.min.js",
            "app/public/bower_components/bootstrap/dist/js/bootstrap.min.js",
            "app/public/bower_components/angular/angular.min.js",
            "app/public/bower_components/angular-route/angular-route.js",
            "app/public/bower_components/angular-resource/angular-resource.js",
            "app/public/bower_components/angular-mocks/angular-mocks.js",
            "app/public/bower_components/angucomplete-alt/angucomplete-alt.js",
            "app/public/bower_components/chai/chai.js",
            "app/public/bower_components/chai-spies/chai-spies.js",
            "app/public/app.js",
            "app/public/routes.js",
            "app/public/controllers/**/*.js",
            "app/public/directives/**/*.js",
            "test/client/**/*.test.js"
        ],

        reporters: ["mocha", "coverage"],

        preprocessors: {
            "app/public/!(bower_components)/**/*.js": "coverage",
        },

        coverageReporter: {
            type: "html",
            dir: "test/reports/client/coverage/client"
        },

        browsers: ["PhantomJS"]

    } );
};
