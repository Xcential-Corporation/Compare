(function(){
       //TODO support pdf
       //Add process action to fileupload
    jQuery.blueimp.fileupload.prototype.processActions.extractText = function(data, options){
                    //setReader here uses the readerFactory-provided setter function
                    var scope = options.setVar().scope;
                    var textSourceName = options.setVar().textSourceName;
                    var file = data.files[data.index],
                    dfd = $.Deferred();
                    var fileReader = new FileReader();
                    fileReader.onload = function (event) {
                        var fileText = event.target.result;
                        //Save fileText to an object
                        
                        scope.$parent.$apply(
                            function($scope){
                                $scope[textSourceName].text= fileText;
                                $scope[textSourceName].name= file.name;
                            }
                            );
                        };
                    fileReader.readAsText(file);
                    return dfd.resolveWith(this, [data]);
                };

    var app = angular.module('diffDemo', ['ng',  'ui.bootstrap', 'diff-match-patch', 'angular-rich-text-diff', 'blueimp.fileupload']);

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

    app.controller('diffCtrl', ['$scope', '$http', function($scope, $http) {
      
      var EXAMPLEPATH = 'static/examples';
      var LEFTDOCPATH = EXAMPLEPATH + '/BILLS-114hr776/BILLS-114hr776ih.xml';
      var RIGHTDOCPATH = EXAMPLEPATH + '/BILLS-114hr776/BILLS-114hr776rh.xml';
      $scope.showRichTextDiff = true;
      $scope.showSemanticDiff = true;

      $http.get(LEFTDOCPATH).then(function(result){
        $scope.leftDoc = {'name': LEFTDOCPATH.replace(/.*\//,''),
                          'text': result
        };
      }
      );
      $http.get(RIGHTDOCPATH).then(function(result){
        $scope.rightDoc = {'name': RIGHTDOCPATH.replace(/.*\//,''),
                          'text': result
        };
      }
      );

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
        }
      };


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
                    dropZone: $($attrs.dropzoneselect),
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
