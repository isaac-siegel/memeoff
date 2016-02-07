angular.module('starter.controllers', [])

.controller('UploadCtrl', function($scope, Data, firebaseService) {

  $scope.aMeme = Data.getOneMeme();
  console.log($scope.aMeme)
  $scope.uploadPhoto = function() {
    firebaseService.uploadPhoto(samplePhoto, "Sample Caption");
  };

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

.controller('VoteCtrl', function($scope, $stateParams, Data, firebaseService) {
  // $scope.getMemesToVoteFor = function(){
  $scope.MEME_DATA = {};
  $scope.MEME_DATA.memesToVoteFor = [];
    $scope.MEME_DATA = firebaseService.getMemesToVoteFor();

  // }
  // $scope.memesToVoteFor = Data.getMemesToVoteFor();


  $scope.cardDestroyed = function(index) {
    console.log("hkjhk");
    $scope.MEME_DATA.memesToVoteFor.splice(index, 1);
  };

  $scope.addCard = function() {

  }

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
  };
  $scope.cardSwipedRight = function(key) {
    console.log('RIGHT SWIPE');
    firebaseService.upvoteMeme(key);
  };
})

.controller('LeaderboardCtrl', function($scope, firebaseService) {
  // $scope.leaderboardOfMemes = Data.getLeaderboard();
  $scope.leaderboardOfMemes = firebaseService.getLeaderboard();

  $scope.refreshLeaderboard = function() {
    console.log("REFRESH CALLED");
    firebaseService.getLeaderboard();
    $scope.$broadcast('scroll.refreshComplete');
  };

})



.controller('LoginCtrl', function($scope, firebaseService) {
  $scope.loginWithGoogle = function() {
    firebaseService.login();

  }
})

.controller('imageController', function($scope, $cordovaCamera, $cordovaFile, firebaseService) {
    // $scope.images = [];
    $scope.submitNewMeme = function(memeInProcess){
      firebaseService.uploadMeme(memeInProcess.url, memeInProcess.caption );
    }


    $scope.image;
    $scope.addImage = function(useCamera) {
  //     var options = {
	// 	destinationType : Camera.DestinationType.FILE_URL,
	// 	sourceType : Camera.PictureSourceType.CAMERA,
  //   //sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
	// 	allowEdit : false,
	// 	encodingType: Camera.EncodingType.JPEG,
	// 	popoverOptions: CameraPopoverOptions,
	// };
  var options = {

      quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };
    if (!useCamera){
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    }
	// 3
	$cordovaCamera.getPicture(options).then(function(imageData) {
    var imageString = "data:image/jpeg;base64," + imageData;
    //var imageString = imageData.toDataURL();
    // alert(imageString);
		$scope.memeInProcess = {
      userName: "Billyhilly",
      url: imageString,
      caption: "Noah's Ark V2: God Also Dislikes Fossil Fuels",
      score: 0
    }

		onImageSuccess(imageData);

		function onImageSuccess(fileURI) {
			createFileEntry(fileURI);
		}

		function createFileEntry(fileURI) {
			window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
		}

		// 5
		function copyFile(fileEntry) {
			var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
			var newName = makeid() + name;

			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
				fileEntry.copyTo(
					fileSystem2,
					newName,
					onCopySuccess,
					fail
				);
			},
			fail);
		}

		// 6
		function onCopySuccess(entry) {
			$scope.$apply(function () {
				// $scope.images.push(entry.nativeURL);
        $scope.image = entry.nativeURL;
			});
		}

		function fail(error) {
			console.log("fail: " + error.code);
		}

		function makeid() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			for (var i=0; i < 5; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		}

	}, function(err) {
		console.log(err);
	});
        console.log("add image");
    }

    $scope.urlForImage = function(imageName) {
      var name = imageName.substr(imageName.lastIndexOf('/') + 1);
  var trueOrigin = cordova.file.dataDirectory + name;
  console.log(trueOrigin);
  return trueOrigin;

        console.log("get correct path for image");
    }
});
var samplePhoto = "data:image/jpeg;base64,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"
