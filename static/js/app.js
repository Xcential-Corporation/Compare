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
      var DOCPATH_LEFT = EXAMPLEPATH + '/BILLS-114hr766/BILLS-114hr766ih.xml';
      var DOCPATH_RIGHT = EXAMPLEPATH + '/BILLS-114hr766/BILLS-114hr766rh.xml';
      var HR50_LEFT = EXAMPLEPATH + '/BILLS-114hr50/BILLS-114hr50rfs.xml';
      var HR50_RIGHT = EXAMPLEPATH + '/BILLS-114hr50/BILLS-114hr50rh.xml';
      var RULESEX_LEFT = EXAMPLEPATH + '/HouseRules/Rules113content.html';
      var RULESEX_RIGHT= EXAMPLEPATH + '/HouseRules/Rules114content.html';
      var USCEX_LEFT = EXAMPLEPATH + '/t44-ch3/usc44-ch3-before113-235.xml';
      var USCEX_RIGHT = EXAMPLEPATH + '/t44-ch3/usc44-ch3-after113-235.xml';
      var BILLCSS = 'static/css/docexample.css';
      var RULESCSS = 'static/css/rules.css';
      var USCODECSS = 'static/css/uslm.css';
      var USCODEHTMLCSS = 'static/css/usctitle-html.css';
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
        docPaths : { leftdocpath: USCEX_LEFT,
        rightdocpath: USCEX_RIGHT
        },
        docType : 'uscode',
        docCSS: USCODECSS
      };

      var setExamples = function(){
        alertify.log('Loading...');
        $http.get($scope.options.docPaths.leftdocpath).then(function(result){
            $scope.leftDoc = {'name': 'Example 1: '+$scope.options.docPaths.leftdocpath.replace(/.*\//,''),
                          'text': result.data
            };
        }
        );
        $http.get($scope.options.docPaths.rightdocpath).then(function(result){
            $scope.rightDoc = {'name': 'Example 2: '+$scope.options.docPaths.rightdocpath.replace(/.*\//,''),
                              'text': result.data
            };
            jQuery('.alertify-log').click();
        }
        );
        };

      setExamples();

      $scope.$watch('options.docType', function(newValue, oldValue) {
            if(newValue==='uscode'){
                $scope.options.docCSS = USCODECSS;
                $scope.options.docPaths = {
                    leftdocpath: USCEX_LEFT,
                    rightdocpath: USCEX_RIGHT
                };
                setExamples();
               }
            else if(newValue==='bill'){
                $scope.options.docCSS = BILLCSS;
                $scope.options.docPaths = {
                    leftdocpath: DOCPATH_LEFT,
                    rightdocpath: DOCPATH_RIGHT
                };
                setExamples();

            }else if(newValue==='bill2'){
                $scope.options.docCSS = BILLCSS;
                $scope.options.docPaths = {
                    leftdocpath: HR50_LEFT,
                    rightdocpath: HR50_RIGHT
                };
                setExamples();

            }else if(newValue==='rules'){
                $scope.options.docCSS = RULESCSS;
                $scope.options.docPaths = {
                    leftdocpath: RULESEX_LEFT,
                    rightdocpath: RULESEX_RIGHT
                };
                setExamples();
            }else if(newValue==='uscode2'){
                $scope.options.docCSS = USCODEHTMLCSS;
            }
        });
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
