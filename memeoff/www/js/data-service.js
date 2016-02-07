app.factory('Data', ['$http', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var memes = [{
    url: "http://i.imgur.com/gDST0yjm.jpg",
    caption: "Noah's Ark V2: God Also Dislikes Fossil Fuels",
    score: 5
  }, {
    url: "http://i.imgur.com/gDST0yjm.jpg",
    caption: 'Awesome Caption2',
    score: 4
  }];

  var uploadToImgur = function(imageBase64) {
    $http({
      method: 'POST',
      url: '/someUrl'
    }).then(function successCallback(response) {
        // NEED TO GET IMGUR URL OUT OF THE RESPONSE
      }, function errorCallback(response) {

      });
  }

  uploadToImgur("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")

  return {
    getLeaderboard: function() {
      console.log("getLeaderboard() called")
      return memes;
    },
    getOneMeme: function() {
      console.log("getOneMeme() called")
      return memes[0];
    },

    //Assume this list is ordered by score
    getMemesToVoteFor: function() {
      console.log("getMemesToVoteFor() called")
      return memes;
    }


  };
}]);
