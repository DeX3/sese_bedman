"use strict";

var app = angular.module( "bedman" );

app.factory( "Reservation", function( $Model, $filter ) {
    return $Model.extend( {
        url: "/api/reservations",
        dates: ["from", "to"]
    }, {
        initialize: function() {
            this.from = new Date();
            this.to = new Date();
        },
        // Gets duration in days
        duration: function() {
            return (this.to - this.from)/(1000 * 60 * 60 * 24) + 1;
        },
        quickInfoString: function() {
            var sb = [ "#", this.id, ": " ];
            var datefilter = $filter( "date" );
            var duration = this.duration();

            if( this.rooms ) {
                sb.push( this.rooms.length );
                if( this.rooms.length === 1 ) {
                    sb.push( " room" );
                } else {
                    sb.push( " rooms" );
                }
            }
            sb.push( " for ", duration, " " );
            
            if( duration === 1 ) {
                sb.push( "day" );
            } else {
                sb.push( "days" );
            }

            sb.push( " (" );
            sb.push( datefilter(this.from) );
            sb.push( " - " );
            sb.push( datefilter(this.to) );
            sb.push( ")" );


            return sb.join( "" );
        }
    } );
} );
