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


  $scope.cardDestroyed = function(index) {
    console.log("hkjhk");
    $scope.memesToVoteFor.splice(index, 1);
  };

  $scope.addCard = function() {

  }

  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
  };
})

.controller('LeaderboardCtrl', function($scope, Data) {
  $scope.leaderboardOfMemes = Data.getLeaderboard();
})

.controller('imageController', function($scope, $cordovaCamera, $cordovaFile) {
    // $scope.images = [];
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
    alert(imageString);
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
