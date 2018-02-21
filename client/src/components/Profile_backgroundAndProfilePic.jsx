import React from 'react';
import { Header, Icon, Image, Button } from 'semantic-ui-react';

class Profile_backgroundAndProfilePic extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={this.props.profilePageInfo.cover_picture ? "backgroundAndProfilePic" : "backgroundAndProfilePic defaultBackground"}>
        <Image className="backgroundPicture" src={this.props.profilePageInfo.cover_picture}></Image>
        <Image className="profilePicture" src={this.props.profilePageInfo.profile_picture}></Image>
        <Header size="large" inverted color="grey" textAlign="center" className="name"> 
          {this.props.userInfo.first_name} {this.props.userInfo.last_name} 
        </Header>
        {this.props.isOwner ? 
          <span></span> :
          this.props.friend ?
          <Button compact animated inverted size="small" className="friendStatus removeFriend" onClick={this.props.removeFriend.bind(this)} >
            <Button.Content visible> 
              <Icon name="check" />
              &nbsp; Friends 
            </Button.Content>  
            <Button.Content hidden> 
              <Icon name="delete" />
              &nbsp; Remove Friend 
            </Button.Content> 
          </Button>
          :
          <Button compact inverted size="small" className="friendStatus addFriend" onClick={this.props.addFriend.bind(this)}>
            <Icon name="add user"/>
            Add Friend
          </Button>
        }
        {this.props.isOwner ?
          <span></span> :
          <Button compact inverted size="small" className="messageFriend">
            <Icon name='pointing right'/>
            &nbsp; &nbsp; Poke {this.props.userInfo.first_name}
          </Button>
        }  
      </div>
    );
  }
}

export default Profile_backgroundAndProfilePic;