"use strict";

var app = angular.module( "bedman" );

app.factory( "DateService", function() {

    return {
        parseDate: function( datestr ) {
            if( !datestr ) {
                return;
            }
            var match = datestr.match( /(\d+)-(\d+)-(\d+)/ );
            var date = {
                year: match[1],
                month: match[2],
                day: match[3]
            };

            var ret = new Date( date.year, date.month - 1, date.day);
            ret.setTime( ret.getTime() - ret.getTimezoneOffset() * 60 * 1000 );

            return ret;
        },

        formatDate: function( dateobj ) {
            
            return dateobj.getFullYear() + "-" +
                   (dateobj.getMonth() + 1) + "-" +
                   dateobj.getDate();
        }
    };
} );
