# 0.1.x

## 0.1.0
 * Added `AUTH_EVENTS.redirectEnded` event that is emitted when the callback URL is parsed but it does not contain neither `access_token` nor `error`. On that way, it can be determined whether the redirect ended to execute an action. For example, this is useful with the `AUTH_EVENTS.loginSuccess` and `AUTH_EVENTS.loginFailed` to show a loading page while being redirected.

# 0.0.x

## 0.0.2

 * Removed promises from `signin` method. Now the way to handle login is by listening to `AUTH_EVENTS.loginSuccess`:
 
   ```js
       $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
        // TODO Handle when login succeeds
        $location.path('/');
       }); 
   ```
 * Removed `ngRoute` and `route` from auth0-angular.
 * Created a dictionary with the authentication events:
 
    ```js
      myApp.run(function ($rootScope, AUTH_EVENTS) {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
          // TODO Handle login success here!
        });
      });
    ```
 * `authInterceptor` must to be added explicitely on the user code. The idea behind this is to prevent leaking the token in CORS requests.

