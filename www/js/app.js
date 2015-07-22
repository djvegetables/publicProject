// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if(window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//     }
//     if(window.StatusBar) {
//       StatusBar.styleDefault();
//     }
//   });

  .factory('Items', ['$firebaseArray', function($firebaseArray){
    var itemsRef = new Firebase('https://burning-inferno-5246.firebaseio.com/items');
    return $firebaseArray(itemsRef);

  }])

  .controller('AddSalonCtrl', function($scope, $ionicListDelegate, $ionicPopup, Items){
    $scope.items = Items;

    $scope.showPopup = function(){
      $scope.data = {}

      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.workout">',
        title: 'Enter new workout',
        subTitle: 'You can edit this later...',
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.workout) {
                //don't allow the user to close with Save button unless they enter a value
                e.preventDefault();
              } else {
                // Write to table
                if( $scope.data.workout ) {
                  $scope.items.$add({
                    'name': $scope.data.workout
                  });
                }
                return $scope.data.workout;
              }
            }
          }
        ]
      });
    }

    $scope.addItem = function(){
      console.log('before the popup');
      $scope.showPopup();
      console.log('after the popup');

    }

    $scope.completeItem = function(item) {
      var itemRef = new Firebase('https://burning-inferno-5246.firebaseio.com/items/' + item.$id);
      if (item.status == 'complete'){
        itemRef.child('status').set('');
      }
      else {
        itemRef.child('status').set('complete');
      }
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.editItem = function(item) {
      var editRef = new Firebase('https://burning-inferno-5246.firebaseio.com/items/' + item.$id);
      var newName = prompt(item.name);
      if(newName){
        editRef.child('name').set(newName);
      }
      $ionicListDelegate.closeOptionButtons();
    };

    $scope.onItemDelete = function(item){
      $scope.items.splice($scope.items.indexOf(item), 1);

      // Update database
      var delRef = new Firebase('https://burning-inferno-5246.firebaseio.com/items/' + item.$id);
      delRef.set(null);
    };
  })

// .controller('FirebaseCtrl', function($scope) {
//
//   var dataRef = new Firebase('https://burning-inferno-5246.firebaseio.com/');
//   var allMsgs;
//
//   $scope.sendChat = function(messageInput){
//     dataRef.push({text: messageInput});
//     $scope.messageInput = "";
//   }
//
//   $scope.getChat = function(){
//     dataRef.on('child_added', function(snapshot){
//       var message = snapshot.val();
//       allMsgs = message;
//
//       $scope.chatMessages = allMsgs;
//     })
//   };
//
// })
