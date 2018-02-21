import React from 'react';
import { Divider, Header, Icon, Image } from 'semantic-ui-react';

class Profile_allFriends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: props.view
    }
  }

  render() {
    return (
      <div className={this.props.view === 'friends' ? "friendsContainer" : "hide"}>
        <div className="friends">  
          <div className="title">
            <Header>             
              <Icon name="users"></Icon>
              &nbsp;Friends 
            </Header>
          </div>
          <div className="allFriends">
          {
            this.props.friends.slice(0, 9).map((friend) => (
              <div className="friendInAllFriends">
                <img src={friend.picture_url} />
                <a className="nameLink"><span className="friendName"> <strong> {friend.first_name} {friend.last_name} </strong> </span></a>
              </div>  
            ))
          }
          </div>  
        </div>  
      </div>
    );
  }
}

export default Profile_allFriends;