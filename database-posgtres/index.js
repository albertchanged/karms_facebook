const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/fb_database'
});
client.connect();

module.exports = {
  getAllUsers: (callback) => {
    client.query('SELECT * FROM users;', (err, res) => {
      if (err) callback(err, null);
      callback(null, res.rows);
    });
  },
  updateProfilePageInfo: (username, change, callback) => {
    var edit = {};
    edit[change[0]] = change[1];
    edit = JSON.stringify(edit);
    var query = `UPDATE user_profiles set user_data = user_data::jsonb || '${edit}' where user_id = (SELECT id FROM users WHERE username = '${username}')`;
    client.query(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        if (change[0] === 'profile_picture') {
          client.query(`UPDATE users set picture_url = '${change[1]}' WHERE username = '${username}'`, (err, res) => {
            if (err) {
              callback(err, null);
            } else {  
              console.error('updated profile pic in users table');
            }
          })
        }
        callback(null, res.rows);
      }  
    });
  },
  createPost: (username, text, callback) => {
    let queryStr =
    `INSERT INTO posts (post_text, user_id)
    VALUES ('${text}', (SELECT id FROM users WHERE username = '${username}'))`;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        console.log('Posting!');
        callback(null, res.rows);
      }
    });
  },
  likePost: (author, text, username, callback) => {
    let queryStr = 
    `INSERT INTO user_posts_liked (user_id, post_id) 
    VALUES ((SELECT id FROM users WHERE username = '${username}'),
    (SELECT posts.id FROM posts INNER JOIN users ON users.id = 
    posts.user_id AND posts.post_text = 
    '${text}' AND posts.user_id = 
    (SELECT id FROM users WHERE username = '${author}')))
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  unlikePost: (author, text, username, callback) => {
    let queryStr = 
    `DELETE FROM user_posts_liked WHERE user_id = 
    (SELECT id FROM users WHERE username = '${username}')
    AND post_id = (SELECT posts.id FROM posts INNER JOIN users ON users.id = 
    posts.user_id AND posts.post_text = 
    '${text}' AND posts.user_id = 
    (SELECT id FROM users WHERE username = '${author}'))
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  getLikeAmount: (text, callback) => {
    let queryStr =
    `SELECT user_id FROM user_posts_liked WHERE post_id = 
    (SELECT id FROM posts WHERE post_text = '${text}')
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  getPersonalLikeAmount: (username, text, callback) => {
    let queryStr =
    `SELECT count(user_id) FROM user_posts_liked INNER JOIN 
    users ON users.id = user_posts_liked.user_id AND 
    user_posts_liked.user_id = (SELECT id FROM users WHERE username = '${username}') 
    WHERE post_id = (SELECT id FROM posts WHERE posts.post_text = '${text}');
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  getLikers: (text, callback) => {
    let queryStr =
    `SELECT users.first_name, users.last_name FROM users INNER JOIN 
    user_posts_liked ON users.id = user_posts_liked.user_id INNER JOIN 
    posts ON posts.id = user_posts_liked.post_id AND posts.post_text = '${text}'
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  searchSomeone: (name, callback) => {
    const queryStr = `SELECT * FROM users WHERE username LIKE '%${name}%';`; // selects all names that begin with searched query
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  getAllPosts: (callback) => {
    let queryStr = 'SELECT posts.*, users.first_name, users.last_name FROM posts INNER JOIN users ON users.id = posts.user_id ORDER BY id DESC';
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  //find select username
  getUser: (username, callback) => {
    client.query(`SELECT * FROM users WHERE username='${username}';`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },
  //retrieves all users
  getAllUsers: (callback) => {
    client.query(`SELECT * FROM users;`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },

  getUsername: (firstname, lastname, callback) => {
    client.query(`SELECT username FROM users WHERE first_name='${firstname}' AND last_name='${lastname}'`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      } 
    });
  },
  getPostAuthor: (text, callback) => {
    let queryStr = 
    `SELECT username FROM users INNER JOIN posts ON users.id = posts.user_id
    AND posts.post_text = '${text}'`;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  //add user to db
  addUser: (userData, callback) => {
    client.query(`INSERT INTO users (username, first_name, last_name, picture_url) VALUES ('${userData.username}', '${userData.firstName}', '${userData.lastName}', '${userData.pictureUrl}');`, (err, res) => {
      if (err) {
        callback(err.detail, null);
      } else {  
        callback(null, res.rows);
      }
    });
  },   
  addNewUserProfileInfo: (username, callback) => {
    var defaultProfile = {};
    defaultProfile.profile_picture = '/images/profile_default.jpg'
    defaultProfile = JSON.stringify(defaultProfile);
    client.query(`INSERT INTO user_profiles (user_id, user_data) VALUES ((SELECT id FROM users WHERE username='${username}'), '${defaultProfile}')`, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }
    });
  },     
  getUserPosts: (username, callback) => {
    var query = {
      text: 'SELECT posts.*, users.* FROM posts INNER JOIN users ON posts.user_id = users.id WHERE users.id = (SELECT users.id FROM users WHERE users.username = $1) ORDER BY posts.id DESC',
      values: [username]
    };
    client.query(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, res.rows);
      }
    });
  },
  //add 2 rows to user_friends table
  addFriend: (username1, username2, callback) => {
    let queryStr = 
    `INSERT INTO user_friends (username, friend_id)
    VALUES ('${username1}', (SELECT id FROM users WHERE username='${username2}')),
    ('${username2}', (SELECT id FROM users WHERE username='${username1}'));
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },
  getFriendsList: (username, callback) => {
    let queryStr = `SELECT users.* FROM users INNER JOIN user_friends ON (user_friends.friend_id = users.id) WHERE user_friends.username = '${username}';`
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },
  findPostsByFriends: (username, callback) => {
    let queryStr =
    `SELECT posts.*, users.first_name, users.last_name FROM posts INNER JOIN 
    users ON users.id = posts.user_id INNER JOIN user_friends ON 
    (user_friends.friend_id = posts.user_id) AND user_friends.username = 
    '${username}' ORDER BY posts.id DESC
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },
  findPostsByNonFriends: (username, callback) => {
    let queryStr = 
    `SELECT posts.*, users.first_name, users.last_name FROM posts 
    INNER JOIN users ON posts.user_id = users.id AND users.id IN (SELECT users.id FROM users WHERE users.id NOT IN (SELECT user_friends.friend_id 
    FROM user_friends WHERE user_friends.username = 
    '${username}')) ORDER BY posts.id DESC
    `;
    client.query(queryStr, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  },
  removeFriend: (username, friendToRemove, callback) => {
    var queryOne = `DELETE FROM user_friends where username = '${username}' AND friend_id = (SELECT id FROM users WHERE username = '${friendToRemove}')`;
    var queryTwo = `DELETE FROM user_friends where username = '${friendToRemove}' AND friend_id = (SELECT id FROM users WHERE username = '${username}')`;
    client.query(queryOne, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        client.query(queryTwo, (err, res) => {
          if (err) {
            callback(err, null);
          } else {  
            callback(null, res.rows);
          }  
        });
      }  
    });
  },
  getProfilePageInfo: (username, callback) => {
    var query = `SELECT * from user_profiles WHERE user_id = (SELECT id FROM users WHERE username = '${username}')`;
    client.query(query, (err, res) => {
      if (err) {
        callback(err, null);
      } else {  
        callback(null, res.rows);
      }  
    });
  }
}