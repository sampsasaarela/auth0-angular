var myApp = angular.module('myApp', [
  'ui.router', 'auth0-auth', 'authInterceptor'
]);

myApp.run(function ($rootScope, $state, auth, AUTH_EVENTS, $timeout, parseHash) {
  var onRedirect = true;
  $state.go('callback');

  $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
    // TODO Handle when login succeeds
    onRedirect = false;
    $state.go('root');
  });

  $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
    // TODO Handle when login fails
    onRedirect = false;
    $state.go('login');
  });
  
  $rootScope.$on(AUTH_EVENTS.redirectEnded, function () {
    // TODO Handle when redirect ends
    onRedirect = false;
    $state.go('root');
  });

  // This needs to happen after we register the events in order to
  // receive the events.
  parseHash();
  
  $rootScope.$on('$stateChangeStart', function(e, to) {
    if (onRedirect && to.name === 'login') {
      // When on redirect, prevent login as it should display 
      // the callback page
      e.preventDefault();
      return;
    }
    if ( !to || !to.data || !angular.isFunction(to.data.rule)) {
      return;
    }
    var result = to.data.rule(auth);

    if (!result) {
      e.preventDefault();

      // Optionally set option.notify to false if you don't want
      // to retrigger another $stateChangeStart event
      $state.go('login', {});
      return;
    }

    $state.go(to, {}, {notify: false});
  });

});

function isAuthenticated(auth) { return auth.isAuthenticated; }

myApp.config(function($stateProvider, $urlRouterProvider, $httpProvider, authProvider) {

  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise('/login');

  // Now set up the states
  $stateProvider
  .state('logout', {
    url: '/logout',
    templateUrl: 'views/logout.html',
    controller: 'LogoutCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  })
  .state('callback', {
    url: '/callback',
    templateUrl: 'views/callback.html',
    controller: 'CallbackCtrl'
  })
  .state('root', {
    url: '/',
    templateUrl: 'views/root.html',
    controller: 'RootCtrl',
    data: { rule: isAuthenticated }
  });

  authProvider.init({
    domain: 'contoso.auth0.com',
    clientID: 'DyG9nCwIEofSy66QM3oo5xU6NFs3TmvT',
    // TODO Set this to your callbackURL, for instance http://localhost:1337/examples/widget/
    callbackURL: document.location.href.toString().replace(/\/login$/,'/callback')
  });
  $httpProvider.interceptors.push('authInterceptor');
});

