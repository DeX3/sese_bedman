var winston = require( "winston" );
var expressWinston = require( "express-winston" );

module.exports = {
    logger: expressWinston.logger( {
        transports: [
            new winston.transports.File( {
                filename: "tests.log",
                colorize: true
            } )
        ]
    } ),
    db: {
        connection: {
            database: "bedman_test"
        }
    }
};
