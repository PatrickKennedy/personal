(function(angular){
  angular
    .module('personal.portfolio', [])
    .controller('PortfolioCtrl', PortfolioCtrl)
    .controller('ProjectsCtrl', ProjectsCtrl)
  ;

  PortfolioCtrl.$inject = [];
  function PortfolioCtrl() {
  }

  ProjectsCtrl.$inject = ['$routeParams', 'angularLoad'];
  function ProjectsCtrl($routeParams, ngLoad) {
    var project = $routeParams.project;
    var path = `demo/${project}/`
    ngLoad.loadScript(`${path}/${project}.js`);
    ngLoad.loadCSS(`${path}/${project}.css`);
  }

}(angular));
