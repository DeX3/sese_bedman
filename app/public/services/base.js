"use strict";

var app = angular.module( "bedman" );

app.factory( "$Model", function( $http ) {

    var Model = function() {

        this.$setNew = function( isNew ) {

            if( arguments.length === 0 ) {
                isNew = true;
            }
            
            Object.defineProperty( this, "$isNew", {
                value: isNew,
                enumerable: false,
                writable: true
            } );
        };
        
        this.$save = function() {

            var url = this.$url;
            var method;
            if( !this.$isNew ) {
                url += "/" + this.id;
                method = "PUT";
            } else {
                method = "POST";
            }

            var self = this;

            return $http( {
                method: method,
                url: url,
                data: this
            } ).then( Model.$unpackResponse ).then( function( data ) {

                if( self.$isNew ) {
                    self.$setNew( false );
                }

                angular.copy( data, self );
                
                return self;
            } );


        }; 

        this.$delete = function() {

            var self = this;
            return $http( {
                method: "DELETE",
                url: this.$url + "/" + this.id
            } ).then( function(response) {

                if( response.status === 200 ) {
                    self.$setNew();
                    return true;
                }

                return new Error( response );
            } );
        };

        this.$setNew();
    };

    Model.$unpackResponse = function( response ) {
        var data = response.data;
        if( (response.status < 200 ||
             response.status > 299 ||
             response.status !== 304) &&
            data ) {
            return data;
        } else { 
            throw new Error( response );
        }
    };

    Model.$makeObjectFromResponse = function( data ) {
        var m = new this();
        angular.copy( data, m );
        m.$setNew( false );

        return m;
    };

    Model.$buildQueryString = function( params ) {
        var ret = this.prototype.$url;

        params = params || {};
        var names = Object.keys(params);
        if( names.length === 0 ) {
            return ret;
        }

        names.forEach( function( name, index ) {
            if( index === 0 ) {
                ret += "?";
            } else {
                ret += "&";
            }

            ret += encodeURIComponent( name );
            ret += "=";
            ret += encodeURIComponent( params[name] );
        } );
        
        return ret;
    };

    Model.$get = function( id ) {

        return $http( {
            method: "GET",
            url: this.prototype.$url + "/" + id
        } ).then( Model.$unpackResponse )
           .then( Model.$makeObjectFromResponse.bind(this) );
    };

    Model.$query = function( params ) {

        var self = this;

        return $http( {
            method: "GET",
            url: this.$buildQueryString( params )
        } ).then( Model.$unpackResponse ).then( function( data ) {

            if( data.constructor === Array ) {
                var ret = data.map( Model.$makeObjectFromResponse.bind(self) );
                ret.$paginated = false;

                return ret;
            } else {
                //expect a paginated collection of the form
                //{
                //  totalCount: Number,
                //  page: Number,
                //  items: Array
                //}

                data.items.map( Model.$makeObjectFromResponse.bind(self) );    
                data.$paginated = true;

                return data;
            }

        } );
    };

    Model.extend = function( options, instanceMethods, classMethods ) {

        var NewModel = function( attributes ) {
            angular.extend( this, attributes );
        };

        angular.extend( NewModel, Model );

        NewModel.prototype = new Model();
        NewModel.prototype.toString = function() {
            return options.name || "Model (" + options.url + ")";
        };

        Object.defineProperty( NewModel.prototype, "$url", {
            writable: false,
            configurable: false,
            enumerable: false,
            value: options.url
        } );

        angular.extend( NewModel.prototype, instanceMethods );
        angular.extend( NewModel, classMethods );

        return NewModel;
    };

    return Model;
} );
