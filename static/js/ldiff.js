(function(){
        "use strict";
        /* global jQuery */
        /* global angular */
        /* global alertify */

       //TODO support pdf

       //Preprocessing of documents
       var titleRegExp = new RegExp(/<(\/?)title/, 'g');

    var handleTitles = function(text){
        return text.replace(titleRegExp, '<$1uslm-title');
      };

    var processText = function(inputText){
        var processedText = handleTitles(inputText);
        return processedText;
    };
    jQuery.blueimp.fileupload.prototype.processActions.extractText = function(data, options){
                    //setReader here uses the readerFactory-provided setter function
                    var scope = options.setVar().scope;
                    var textSourceName = options.setVar().textSourceName;
                    var file = data.files[data.index],
                    dfd = jQuery.Deferred();
                    var fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        var fileText = event.target.result;
                        //Save fileText to an object

                        scope.$parent.$apply(
                            function($scope){
                                $scope[textSourceName].text= processText(fileText);
                                $scope[textSourceName].text= fileText;
                                $scope[textSourceName].name= file.name;
                            }
                            );
                        };
                    fileReader.readAsText(file);
                    return dfd.resolveWith(this, [data]);
                };

    var app = angular.module('diffDemo', ['ng', 'ui.bootstrap', 'diff-match-patch', 'angular-rich-text-diff', 'blueimp.fileupload']);

    app.config(['$locationProvider', '$httpProvider', 'fileUploadProvider', function($locationProvider, $httpProvider, fileUploadProvider) {

      $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      fileUploadProvider.defaults.redirect = window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                );
    }]);

    app.controller('diffCtrl', ['$scope', '$http', '$q', '$timeout', function($scope, $http, $q, $timeout) {

      $scope.showRichTextDiff = true;
      $scope.showSemanticDiff = true;
      $scope.leftDoc = {'name':'Doc 1','text': 'Loading...'};
      $scope.rightDoc = {'name':'Doc 2', 'text':'Loading...'};

      //For angular-diff-match-patch
      $scope.options = {
        editCost: 4,
        interLineDiff: true,
        attrs: {
          insert: {
            'data-attr': 'insert',
            'class': 'insertion'
          },
          delete: {
            'data-attr': 'delete'
          },
          equal: {
            'data-attr': 'equal'
          }
        },
      };

    var CONFIG_PATH = "static/js/config.js";
    var config = {};
    var setExamples = function(doc){
        $scope.options.doc = angular.copy(config.SAMPLE_DOCS[0]);
        if(doc){
            angular.extend($scope.options.doc, doc);
        }
        var promiseLeft = $http.get($scope.app_constants.EXAMPLE_PATH + $scope.options.doc.paths.left);
        var promiseRight = $http.get($scope.app_constants.EXAMPLE_PATH + $scope.options.doc.paths.right);

        $q.all([promiseLeft, promiseRight]).then(function(responseArray){
            jQuery('.alertify-log').click();
            alertify.log('Comparing...', 100);
            $scope.leftDoc = {'name': 'Example 1: '+$scope.options.doc.paths.left.replace(/.*\//,''),
                          'text':  processText(responseArray[0].data)
            };
            $scope.rightDoc = {'name': 'Example 2: '+$scope.options.doc.paths.right.replace(/.*\//,''),
                              'text': processText(responseArray[1].data)
            };
        }
        );
        };
   $http({
        method: 'GET',
        dataType: 'json',
        url: CONFIG_PATH,
        contentType: "application/json; charset=utf-8",
        mimeType: 'application/json'
                                })
                                .then(function(response){
                                    config = response.data;
                                    $scope.app_constants = config.app_constants;
                                    setExamples(config.SAMPLE_DOCS[0]);
                                    $scope.SAMPLE_DOCS = config.SAMPLE_DOCS;
                                }, function(error){console.log('Error getting LDiff configuration'); console.log(error);});

      $scope.setExamplesTimeout = function(doc){

            alertify.log('Loading...');

        $timeout(function(){
            setExamples(doc);
        },200);
      }

    }]);

    app.filter("trust", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        };
    }]);

    app.directive('textFileUpload', [function () {
        return {
            scope: true,
            controller: function($scope, $attrs){
                $scope.options = {
                    url: 'upload',
                    dropZone: jQuery($attrs.dropzoneselect),
                    autoUpload: false,
                    setVar: function(){return {textSourceName: $attrs.textsourcename, scope: $scope};},
                    processQueue: [
                        {
                            action: 'extractText',
                            acceptFileTypes: '@',
                            setVar: '@setVar'
                        }]
                };
            }
        };
    }]);

    app.controller('FileDestroyController', [
            '$scope', '$http',
            function ($scope, $http) {
                var file = $scope.file,
                    state;
                if (file.url) {
                    file.$state = function () {
                        return state;
                    };
                    file.$destroy = function () {
                        state = 'pending';
                        return $http({
                            url: file.deleteUrl,
                            method: file.deleteType
                        }).then(
                            function () {
                                state = 'resolved';
                                $scope.clear(file);
                            },
                            function () {
                                state = 'rejected';
                            }
                        );
                    };
                } else if (!file.$cancel && !file._index) {
                    file.$cancel = function () {
                        $scope.clear(file);
                    };
                }
            }
        ]);

})();
