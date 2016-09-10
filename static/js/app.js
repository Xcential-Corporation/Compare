(function(){
    var app = angular.module('diffDemo', ['ngMaterial', 'diff-match-patch', 'angular-rich-text-diff']);
    app.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('blue');
    });

    app.controller('diffCtrl', ['$scope', function($scope) {
      $scope.left = ['I am the very model of a modern Major-General,',
        'I\'ve information vegetable, animal, and mineral,',
        'I know the kings of England, and I quote the fights historical,',
        'From Marathon to Waterloo, in order categorical.'
      ].join('\n');

      $scope.right = ['I am the very model of a cartoon individual,',
        'My animation\'s comical, unusual, and whimsical,',
        'I know the kings of England, and I quote the fights historical,',
        'From wicked puns and stupid jokes to anvils that drop on your head.'
      ].join('\n');

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
})();
