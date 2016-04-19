(function(angular){
  angular
    .module('personal', [
      'ngRoute', 'personal.templates', 'personal.home', 'personal.about',
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
