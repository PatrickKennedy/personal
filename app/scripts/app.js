(function(angular){
  angular
    .module('personal', [
      'ngRoute',
      'personal.templates',
      'personal.about',
      'personal.contact',
      'personal.home',
      'personal.portfolio',
      'personal.resume',
    ])
    .controller('PersonalController', PersonalController)
    .config(RouteConfig)
  ;

  RouteConfig.$inject = ['$routeProvider'];
  function RouteConfig($route) {
    $route
      .when('/about', {
        templateUrl: 'about.jade',
        controller: 'AboutCtrl',
        controllerAs: 'ctrl',
      })
      .when('/contact', {
        templateUrl: 'contact.jade',
        controller: 'ContactCtrl',
        controllerAs: 'ctrl',
      })
      .when('/portfolio', {
        templateUrl: 'portfolio.jade',
        controller: 'PortfolioCtrl',
        controllerAs: 'ctrl',
      })
      .when('/portfolio/:project', {
        templateUrl: function(url_attrs){
          return url_attrs.project + '.jade';
        },
        controller: 'ProjectsCtrl',
        controllerAs: 'ctrl',
      })
      .when('/resume', {
        templateUrl: 'resume.jade',
        controller: 'ResumeCtrl',
        controllerAs: 'ctrl',
      })
      .when('/', {
        templateUrl: 'home.jade',
        controller: 'HomeCtrl',
        controllerAs: 'ctrl',
      })
      .otherwise({
        redirectTo: '/',
      })
    ;
  }

  PersonalController.$inject = [];
  function PersonalController() {
  }

}(angular));
