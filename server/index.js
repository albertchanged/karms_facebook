const express = require('express');
let app = express();
const bodyParser = require('body-parser');
const db = require('../database-posgtres/index.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../client/dist'));

let port = 3000;

app.get('/search/users', function(req, res) {
  db.getAllUsers((err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  });
});

//gets post of all friends
app.get('/:username/posts/friends', function(req, res) {
  db.findPostsByFriends(req.params.username, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get('/:username/profilePage', (req, res) => {
  var username = req.params.username;
  db.getProfilePageInfo(username, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

//gets post of non friends
app.get('/:username/posts/nonFriends', function(req, res) {
  db.findPostsByNonFriends(req.params.username, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  });
});


app.get('/:username/posts', function(req, res) {
  db.getAllPosts((err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  });
});

// Get posts by a certain user
app.get('/:username/posts/:certainUser', function(req, res) {
  db.getUserPosts(req.params.certainUser, (error, data) => {
    if (error) {
    } else {
      res.status(200).json(data);
    }
  });
});

// Add new post to database
app.post('/:username/posts', function(req, res) {
  db.createPost(req.params.username, req.body.text, (err, data) => {
    if (err) {
      res.sendStatus(404);    
    } else {    
      res.status(200).json(data);   
    }   
  })    
});

app.post('/likes/:author', function(req, res) {
  db.likePost(req.params.author, req.body.text, req.body.username, (err, data) => {
    if (err) {
      res.sendStatus(404);    
    } else {
      res.status(200).json(data); 
    }   
  });
});

app.delete('/likes/:author', function(req, res) {
  db.unlikePost(req.params.author, req.query.text, req.query.username, (err, data) => {
    if (err) {
      res.sendStatus(404);    
    } else {
      res.status(200).json(data); 
    }   
  });
});

app.get('/likes', function(req, res) {
  db.getLikeAmount(req.query.text, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get('/:username/likes', function(req, res) {
  db.getPersonalLikeAmount(req.params.username, req.query.text, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get('/likers', function(req, res) {
  db.getLikers(req.query.text, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.get('/:username/profile/:user', function(req, res) {
  db.searchSomeone(req.params.user, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

// Get info about single user to load their profile
app.get('/:username', (req, res) => {
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    db.getUser(username, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).json(data);
      }
    });
  }
});

app.get('/:firstname/:lastname', (req, res) => {
  db.getUsername(req.params.firstname, req.params.lastname, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).json(data);
    }
  })
})
// Get author of post
app.get('/:username/post/author', (req, res) => {
  db.getPostAuthor(req.query.text, (err, data) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).json(data);
    }
  })
})
// Add new user to db
app.post('/:username', (req, res) => {
  var username = req.params.username;
  if (username !== 'favicon.ico') {
    var newUserData = {
      username: req.body.username,
      pictureUrl: req.body.pictureUrl,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    }
    db.addUser(newUserData, (err, data) => {
      if (err) {
        res.status(500).json(err);
      } else {
        db.addNewUserProfileInfo(newUserData.username, (err, data) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.status(200).json(data);
          }
        });
      }
    });
  }  
});

// route to add friend
app.post('/:username/addFriend/:friendToAdd', (req, res) => {
  var username = req.params.username;
  var friendToAdd = req.params.friendToAdd;
  db.addFriend(username, friendToAdd, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

// route to get a friends list
app.get('/:username/friendsList/:otherUsername', (req, res) => {
  var username = req.params.username;
  var otherUsername = req.params.otherUsername;
  db.getFriendsList(otherUsername, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }    
  });
});

// route to remove a friend
app.post('/:username/removeFriend/:friendToRemove', (req, res) => {
  var username = req.params.username;
  var friendToRemove = req.params.friendToRemove;
  db.removeFriend(username, friendToRemove, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.patch('/:username/updateProfile', (req, res) => {
  var username = req.params.username;
  var changes = req.body;
  db.updateProfilePageInfo(username, changes, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json(data);
    }
  });
});

app.listen(process.env.PORT || port, function() {
  console.log(`listening on port ${port}`);
});




