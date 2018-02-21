import React from 'react';
import SearchBar from './Search.jsx';
import { Icon, Image } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePath: '',
      feedPath: '',
      redirectProfile: false,
    }
  }
  getUserProfile(user) {
    this.props.getProfile(user);
  }
  setSignedOut() {
    this.props.getSignedIn(false);
  }
  render() {
    const profilePath = '/' + this.props.name + '/profile/' + this.props.name;
    const feedPath = '/' + this.props.name + '/feed';
    return (
      <div className="global-header">
        {
          (this.props.signedIn) ? 
          <div>
            <Image className="logo" src="/images/rbooktransparent.png"></Image>
            <SearchBar className="searchBarClass"getUserProfile={this.getUserProfile.bind(this)} loggedInUser={this.props.name}/>
            <div className="header-btn">
              <Link onClick={this.setSignedOut.bind(this)} to='/login'><button className="btn"><span className="headerFont">Log Out</span></button></Link>
              <Link to={profilePath}><button className="btn"><span className="headerFont">Profile</span></button></Link>
              <Link to={feedPath}><button className="btn"><span className="headerFont">Feed</span></button></Link>
            </div>
          </div>
          :
          null
        }
      </div>
    );
  }
}

export default Header;
