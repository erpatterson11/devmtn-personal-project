angular.module('portfolioApp').controller('aboutCtrl', function($scope) {

    function Images() {
        this.js = new Image()
        this.react = new Image()
        this.angular = new Image()
        this.node = new Image()
        this.postgresql = new Image()
        this.html = new Image()
        this.css = new Image()
        this.sass = new Image()
        this.jquery = new Image()
        this.gulp = new Image()
        this.git = new Image()
        this.github = new Image()

        this.js.src = './app/routes/about/images/js.svg'
        this.react.src = './app/routes/about/images/react.svg'
        this.angular.src = './app/routes/about/images/angular.svg'
        this.node.src = './app/routes/about/images/node.svg'
        this.postgresql.src = './app/routes/about/images/postgresql.svg'
        this.html.src = './app/routes/about/images/html.svg'
        this.css.src = './app/routes/about/images/css.svg'
        this.sass.src = './app/routes/about/images/sass.svg'
        this.jquery.src = './app/routes/about/images/jquery.svg'
        this.gulp.src = './app/routes/about/images/gulp.svg'
        this.git.src = './app/routes/about/images/git.svg'
        this.github.src = './app/routes/about/images/github_logo.svg'
    }

    $scope.images = new Images()
    
})