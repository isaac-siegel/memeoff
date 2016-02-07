app.service('firebaseService', function($q, $firebase, $firebaseAuth,$firebaseArray, $firebaseObject, $state, $rootScope, $timeout, $http) {

    //PRIVATE
    var rootRef = new Firebase("https://memeoff.firebaseio.com/");
    var memesRef = rootRef.child("memes")
    var userRef;
    var auth = $firebaseAuth(rootRef);
    var username = "";
    var user = {};

    var memesToVoteFor;

    checkAuthState();

    function checkAuthState(){
      console.log("sup")
        var authData = auth.$getAuth();

        if (authData) {
            console.log("Logged in as:", authData.uid);
            console.log(authData)
            user = authData;
            userRef = rootRef.child("users").child(user.uid);
        } else {
            $state.go('login');

            console.log("Logged out");
        }
    }

    function getMemesToVoteFor(){
      var lastMemeVotedOnRef = rootRef.child("users").child(user.uid).child("lastMemeVotedOn");

      lastMemeVotedOnRef.once('value', function(dataSnapshot) {
        var lastMemeVotedOnKey = dataSnapshot.val()
        var ref = memesRef.orderByKey().startAt(lastMemeVotedOnKey).once("value", function(snapshot) {
          $rootScope.$apply(function(){memesToVoteFor = snapshot.val();})



          console.log(memesToVoteFor)
        });

      });

      // return it as a synchronized object
      // return $firebaseObject(profileRef);
    }



    function uploadMeme(imageBase64, caption){
      var userID = user.uid;
      uploadToImgur(imageBase64)
        .then(function successCallback(response) {
            console.log(response)
            var imgLink = response.data.data.link;
            var newMemeRef = memesRef.push()
            newMemeRef.set({
              userID: userID,
              caption: caption,
              url: imgLink,
              score: 0,
              uploadTime: Math.random()*100
            });
            var memeKey = newMemeRef.key();
            saveMemeToUserUploadHistory(memeKey)

            console.log(imgLink)
          }, function errorCallback(response) {
            console.log("Error")
            console.log(response)
          });

    }

    function saveMemeToUserUploadHistory(memeKey){
      var historyRef = rootRef.child("users").child(user.uid).child("uploadHistory");
      historyRef.push().set({
        memeKey: memeKey
      })

    }

    function uploadToImgur(imageBase64) {
      return $http({
        method: 'POST',
        url: 'https://api.imgur.com/3/image',
        headers: {
          Authorization: "Client-ID 62b24ee7af49475", // THIS might work
          Accept: "application/json"
        },
        data: {
          image: imageBase64.replace(/.*,/, ''),
          type: 'base64'
        }
      })
    }

    // find a suitable name based on the meta info given by each provider
    function getName(authData) {
        switch(authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
            case 'google':
                return authData.google.displayName;
        }
    }


    this.auth = function(){return auth};

    this.username = function() {
        return user.google.displayName;
    }


    this.login = function() {
        // create an instance of the authentication service

        // login with Google
        auth.$authWithOAuthRedirect("google").then(function(authData) {
            console.log("Logged in as:", authData.uid);

            rootRef.child("users").child(authData.uid).once("value", function (dataSnapshot) {
                var data = dataSnapshot.val();
                var platformUserName =   getName(authData)
                //If this is a first time user, create firebase user
                if (data === null) {
                    console.log("First time user")
                    rootRef.child("users").child(authData.uid).set({
                        provider: authData.provider,
                        name: platformUserName,
                        profile: "",
                        memes: "",
                        lastMemeVotedOn: ""
                    });
                }
                else {
                    console.log("Returning User")
                }

                user = authData;

                //Need .apply because firebase async happens outside of angular digest
                $rootScope.$apply(function(){
                    getMemesToVoteFor();
                    $state.go('tab.upload');
                });
            });

        }).catch(function(error) {
            console.log("Authentication failed:", error);
            if (error.code === "TRANSPORT_UNAVAILABLE") {
              Auth.$authWithOAuthPopup("google").then(function(authData) {
                // User successfully logged in. We can log to the console
                // since we’re using a popup here
                console.log(authData);
                alert(authData.uid)
      });
    } else {
      // Another error occurred
      console.log(error);
    }
        });
    }

    this.getProfile= function () {
        // create a reference to the database where we will store our data
        var profileRef = rootRef.child("users").child(user.uid).child("profile");

        // return it as a synchronized object
        return $firebaseObject(profileRef);
    }


    this.uploadPhoto= function (base64Photo, caption) {
        uploadMeme(base64Photo, caption);
    }

    this.getMemesToVoteFor= function () {
      getMemesToVoteFor();
      return memesToVoteFor;
    }

    this.upvoteMeme = function (memeKey) {
        var memeRef = memesRef.child(memeKey).child("score");
        memeRef.transaction(function (current_value) {
          return (current_value || 0) + 1;
        });
    }




})
