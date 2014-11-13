"use strict";

window.testutils = {
    mockResource: function( $q, mockData ) {

        var Resource = chai.spy( function() {

            this.$save = chai.spy( function() {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            } );

            this.$update = chai.spy( function() {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            } );
        } );

        Resource.get = chai.spy( function() {
            var deferred = $q.defer();
            deferred.resolve( mockData[0] );

            var ret = {};
            ret.$promise = deferred.promise;
            return ret;
        } );

        Resource.query = chai.spy( function() {
            return mockData;
        } );

        return Resource;
    }

};
