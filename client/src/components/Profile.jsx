import React from 'react';
import CreatePost from './CreatePost.jsx';
import Post from './Post.jsx';
import PostList from './PostList.jsx';
import FBHeader from './Header.jsx';
import Profile_friends from './Profile_friends.jsx';
import Profile_photos from './Profile_photos.jsx';
import Profile_intro from './Profile_intro.jsx';
import Profile_about from './Profile_about.jsx';
import Profile_allFriends from './Profile_allFriends.jsx';
import Profile_navigation from './Profile_navigation.jsx';
import Profile_backgroundAndProfilePic from './Profile_backgroundAndProfilePic.jsx';
import Profile_postSection from './Profile_postSection.jsx';
import axios from 'axios';
import { Image, Button, Header, List, Item, Divider, Icon, Menu } from 'semantic-ui-react';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      friends: [],
      friend: false,
      username: props.match.params.friendname, // not an error, do not change
      profilePageOwner: props.match.params.username, // not an error, do not change
      profilePageInfo: '',
      isOwner: true,
      userInfo: {},
      view: 'Timeline',
      clickedFriend: ''
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getUserInfo(this.state.profilePageOwner);
    this.getUserPosts(this.state.profilePageOwner);
    this.getFriends(this.state.profilePageOwner);
    this.getUserProfileInfo(this.state.profilePageOwner);
  }  

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        profilePageOwner: nextProps.match.params.friendname
      });
      this.getUserInfo(nextProps.match.params.friendname);
      this.getUserPosts(nextProps.match.params.friendname);
      this.getFriends(nextProps.match.params.friendname);
      this.getUserProfileInfo(nextProps.match.params.friendname);
    }
  }

  getUserInfo(user) {
    axios.get(`/${user}`)
      .then((responseUserInfo) => {
        this.setState({
          userInfo: responseUserInfo.data[0],
          isOwner: this.state.username === user
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getUserProfileInfo(user) {
    console.log('user...', user)
    axios.get(`/${user}/profilePage`)
      .then((responseUserProfileInfo) => {
        console.log('profile page info....', responseUserProfileInfo);
        this.setState({
          profilePageInfo: responseUserProfileInfo.data['0'].user_data
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getUserPosts(user) {
    var username = this.state.username;
    axios.get(`/${username}/posts/${user}`)
      .then((response) => {
        this.setState({
          posts: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getFriends(user) {
    var username = this.state.username;
    axios.get(`/${username}/friendsList/${user}`)
      .then((response) => {
        console.log('friends list...', response.data);
        var isFriend = this.checkIfFriend(username, response.data, user);
        this.setState({
          friends: response.data,
          friend: isFriend
        });
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  checkIfFriend(username, friendsList, otherUsername) {
    for (var i = 0; i < friendsList.length; i++) {
      var user = friendsList[i];
      if (user.username === username) {
        return true;
      }
    }
    return false;
  }

  addFriend() {
    var username = this.state.username;
    var friendToAdd = this.state.profilePageOwner;
    axios.post(`/${username}/addFriend/${friendToAdd}`)
      .then((response) => {
        this.getFriends(this.state.profilePageOwner);
      })
      .catch((error) => {
        console.log(error);
      }); 
  } 

  removeFriend() {
    var username = this.state.username;
    var friendToRemove = this.state.profilePageOwner;
    axios.post(`/${username}/removeFriend/${friendToRemove}`)
      .then((response) => {
        this.getFriends(this.state.profilePageOwner);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleNavigation(event) {
    this.setState({
      view: event.target.id
    });
  }

  updateProfile(changes) {
    var username = this.state.username;
    axios.patch(`/${username}/updateProfile`, changes)
      .then((response) => {
        this.getUserProfileInfo(this.state.profilePageOwner);
      })
      .catch((error) => {
        console.log(error);
      }); 
  }

  getFriendName(friend) {
    this.setState({
      clickedFriend: friend
    });
  }

  render() {
    return (
      <div className="profile">
        <Profile_backgroundAndProfilePic userInfo={this.state.userInfo} friend={this.state.friend} addFriend={this.addFriend.bind(this)} removeFriend={this.removeFriend.bind(this)} isOwner={this.state.isOwner} profilePageInfo={this.state.profilePageInfo} />
        <Profile_navigation handleNavigation={this.handleNavigation.bind(this)} view={this.state.view} />
        <Profile_about view={this.state.view} profilePageInfo={this.state.profilePageInfo} updateProfile={this.updateProfile.bind(this)} isOwner={this.state.isOwner} />
        <Profile_allFriends view={this.state.view} friends={this.state.friends} />
        <Profile_intro view={this.state.view} profilePageInfo={this.state.profilePageInfo} />
        <Profile_friends friend={this.state.clickedFriend} getFriendName={this.getFriendName.bind(this)} friends={this.state.friends} view={this.state.view} owner={this.state.profilePageOwner} user={this.state.username} />
        <Profile_photos view={this.state.view} />
        <Profile_postSection getUserPosts={this.getUserPosts.bind(this)} username={this.state.profilePageOwner} posts={this.state.posts} view={this.state.view} isOwner={this.state.isOwner} />
      </div>
    );
  }
}

export default Profile;