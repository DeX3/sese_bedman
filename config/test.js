var winston = require( "winston" );
var expressWinston = require( "express-winston" );
var path = require( "path" );

var isCoverageEnabled = !!process.env.COVERAGE;
if( isCoverageEnabled ) {
    var istanbul = require( "istanbul-middleware" );
    
    console.log( "Enabling code coverage for " + path.join(__dirname, ".." ) );
    istanbul.hookLoader( path.join(__dirname, "..") );
}

module.exports = {
    logger: expressWinston.logger( {
        transports: [
            new winston.transports.File( {
                filename: "test/reports/tests.log",
                colorize: true
            } )
        ]
    } ),
    db: {
        connection: {
            database: "bedman_test"
        }
    },
};


if( isCoverageEnabled ) {
    module.exports.additionalMiddleware = {
        "/coverage": istanbul.createHandler()
    }
}
