angular.module('starter.controllers', [])

.controller('UploadCtrl', function($scope, Data) {

  $scope.aMeme = Data.getOneMeme();
  console.log($scope.aMeme)
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('VoteCtrl', function($scope, $stateParams, Data) {
  $scope.memesToVoteFor = Data.getMemesToVoteFor();
  $scope.onSwipeLeft = function(){
    alert("Swiped left");
  };
})

.controller('LeaderboardCtrl', function($scope, Data) {
  $scope.leaderboardOfMemes = Data.getLeaderboard();


    $scope.cardSwipedLeft = function(index) {
        console.log('Left swipe');
    }

    $scope.cardSwipedRight = function(index) {
        console.log('Right swipe');
    }

    $scope.cardDestroyed = function(index) {
        // $scope.cards.splice(index, 1);
        console.log('Card removed');
    }

});
