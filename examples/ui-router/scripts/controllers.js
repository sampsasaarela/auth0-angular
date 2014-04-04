var myApp = angular.module('myApp');

myApp.controller('RootCtrl', function (auth, $scope) {
  $scope.auth = auth;
});

myApp.controller('CallbackCtrl', function (auth, $scope, $cookies, $state) {
  $scope.auth = auth;
});

myApp.controller('LoginCtrl', function (auth, $scope, $cookies, $state) {
  $scope.user = '';
  $scope.pass = '';

  $scope.submit = function () {
    auth.signin({
      connection: 'Username-Password-Authentication',
      username: $scope.user,
      password: $scope.pass
    });
  };

  $scope.doGoogleAuthWithPopup = function () {
    auth.signin({popup: true, connection: 'google-oauth2'});
  };

  $scope.doGoogleAuthWithRedirect = function () {
    return auth.signin({connection: 'google-oauth2'});
  };
});

myApp.controller('LogoutCtrl', function (auth, $scope, $state) {
  auth.signout();
  $state.go('login');
});
