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

    var app = angular.module('diffDemo', ['ngMaterial', 'diff-match-patch', 'angular-rich-text-diff', 'blueimp.fileupload']);
    app.config(['$mdThemingProvider', '$locationProvider', '$httpProvider', 'fileUploadProvider', function($mdThemingProvider, $locationProvider, $httpProvider, fileUploadProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('blue');

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

    app.controller('diffCtrl', ['$scope', function($scope) {
      $scope.showRichTextDiff = true;
      $scope.showSemanticDiff = true;
      $scope.leftDoc = {'name':'',
                        'text': ['I am the very model of a modern Major-General,',
        'I\'ve information vegetable, animal, and mineral,',
        'I know the kings of England, and I quote the fights historical,',
        'From Marathon to Waterloo, in order categorical.'
      ].join('\n')};

      $scope.rightDoc = {'name':'',
                         'text':['I am the very model of a cartoon individual,',
        'My animation\'s comical, unusual, and whimsical,',
        'I know the kings of England, and I quote the fights historical,',
        'From wicked puns and stupid jokes to anvils that drop on your head.'
      ].join('\n')};

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
