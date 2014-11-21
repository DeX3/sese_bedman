"use strict";

var app = angular.module( "bedman" );

app.service( "dialogs", function( $modal ) {

    var baseOptions = {
        "confirm": {
            modalOptions: {
                backdrop: "static",
                keyboard: true,
                modalFade: true,
                templateUrl: "public/views/partials/confirm.html"
            },
            scope: {
                cancelText: "No, cancel",
                confirmText: "Yes, continue",
                title: "Confirm",
                text: "Are you sure?"
            }
        }
    };

    var dialogs = this;

    var methodNames = Object.keys( baseOptions );

    methodNames.forEach( function( methodName ) {

        var options = baseOptions[methodName];
        var modalOptions = angular.extend( {}, options.modalOptions );
        var scope = angular.extend( {}, options.scope );

        dialogs[methodName] = function( customOptions ) {
            
            customOptions = customOptions || {};
            if( typeof customOptions === "string" ) {
                customOptions = { text: customOptions };
            }

            angular.extend( scope, customOptions );

            console.dir( scope );

            modalOptions.controller = function( $scope, $modalInstance ) {
                angular.extend( $scope, scope );

                $scope.ok = function() {
                    $modalInstance.close( true );
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss( "cancel" );
                };
            };

            return $modal.open( modalOptions ).result;
        };
    } );


} );
