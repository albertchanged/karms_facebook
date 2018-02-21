import React from 'react';
import { Route, Switch } from 'react-router-dom';
import App from './index.jsx';
import Feed from './components/Feed.jsx';
import PostList from './components/PostList.jsx';
import Profile from './components/Profile.jsx';
import Header from './components/Header.jsx';
import SignIn from './components/SignIn.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      newUsername: '',
      signedIn: ''
    }
  }
  getProfile(user) {
    // axiox call to db to get profile
    this.props.getProfile(user);
  }
  getUsername(username) {
    this.setState({
      username: username
    });
  }
  getNewUsername(newUsername) {
    this.setState({
      username: newUsername
    });
  }
  getSignedIn(signedIn) {
    this.setState({
      signedIn: signedIn
    });
  }
  render() {
    return (
      <main>
        <div>
        <Header getProfile={this.getProfile.bind(this)} name={this.state.username} signedIn={this.state.signedIn} getSignedIn={this.getSignedIn.bind(this)}/>
        <Switch>
          <Route exact path='/' component={() => <SignIn getUsername={this.getUsername.bind(this)} getNewUsername={this.getNewUsername.bind(this)} getProfile={this.getProfile.bind(this)} getSignedIn={this.getSignedIn.bind(this)}/> } />
          <Route path='/:username/feed' component={Feed} />
          <Route path='/login' component={() =><SignIn getUsername={this.getUsername.bind(this)} getNewUsername={this.getNewUsername.bind(this)} getProfile={this.getProfile.bind(this)} getSignedIn={this.getSignedIn.bind(this)}/>} />
          <Route path='/:username/profile/:friendname' component={Profile} />
        </Switch>
        </div>
      </main>
    )
  }
}

export default Main;

