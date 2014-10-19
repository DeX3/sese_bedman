var winston = require( "winston" );
var expressWinston = require( "express-winston" );

module.exports = {
    logger: expressWinston.logger( {
        transports: [
            new winston.transports.File( {
                filename: "bedman.log"
            } )
        ]
    } ),
    db: {
        connection: {
            database: "bedman_production",
        }
    }
};
