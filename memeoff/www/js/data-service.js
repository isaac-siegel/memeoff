app.factory('Data', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var memes = [{
    url: "http://i.imgur.com/gDST0yj.jpg",
    caption: 'Awesome Caption',
    score: 5
  }, {
    url: "http://i.imgur.com/gDST0yj.jpg",
    caption: 'Awesome Caption2',
    score: 7
  }];

  return {
    getLeaderboard: function() {
      console.log("getLeaderboard() called")
      return memes;
    },
    getOneMeme: function() {
      console.log("getOneMeme() called")
      return memes[0];
    }

  };
});
