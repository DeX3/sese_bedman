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
        },
        "selectReservation": {
            modalOptions: {
                backdrop: "static",
                keyboard: "false",
                modalFade: true,
                templateUrl: "public/views/partials/selectReservation.html"
            },
            controller: function( $scope, $modalInstance, Reservation ) {
                $scope.perPage = 3;
                $scope.$watchGroup( ["search", "page"], function() {
                    Reservation.$query( {
                        s: $scope.search,
                        perPage: $scope.perPage,
                        page: $scope.page,
                        billed: false
                    } ).then( function( reservations ) {
                        $scope.reservations = reservations;
                    } );
                } );
                $scope.page = 1;

                $scope.select = function( reservation ) {
                    $modalInstance.close( reservation );
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss( "cancel" );
                };
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

            var ctrl = customOptions.controller || options.controller;
            delete customOptions.controller;

            if( !ctrl ) {
                ctrl = function( $scope, $modalInstance ) {
                    angular.extend( $scope, scope );

                    $scope.ok = function() {
                        $modalInstance.close( true );
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss( "cancel" );
                    };
                };
            }

            angular.extend( scope, customOptions );
            modalOptions.controller = ctrl;

            return $modal.open( modalOptions ).result;
        };
    } );


} );
