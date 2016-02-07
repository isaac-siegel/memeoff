app.directive('memeComposite', function() {
    var directive = {};

    directive.restrict = 'E';

    directive.templateUrl = 'templates/meme-composite.html';

    directive.scope = {
        meme : "=meme"
    }

    return directive;
});

app.directive('noScroll', function() {
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $element.on('touchmove', function(e) {
                e.preventDefault();
            });
        }
    }
})
