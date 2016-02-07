app.directive('memeComposite', function() {
    var directive = {};

    directive.restrict = 'E';

    directive.templateUrl = 'templates/meme-composite.html';

    directive.scope = {
        meme : "=meme"
    }

    return directive;
});
