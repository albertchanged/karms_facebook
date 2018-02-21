import React from 'react';
import { Card, Icon, Button, Label, Comment } from 'semantic-ui-react';
import moment from 'moment';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      likeCount: 0,
      clickedUsername: '',
      redirect: false,
      likers: '',
      personalLikeCount: 0,
      profilePicUrl: ''
    };
  }
  componentDidMount() {
    this.getLikeAmount();
    this.getLikers();
    this.getProfileInfo();
  }
  getLikeAmount() {
    axios.get(`/likes`, { params: { 'text': this.props.post.post_text }})
      .then((res) => {
        console.log('This is the number of likes', res.data.length);
        this.setState({
          likeCount: res.data.length
        });
      })
      .catch((err) => {
        console.error('This is the error', err);
      });
  }
  toggleLike() {
    this.executeToggleLike();
  }
  executeToggleLike() {
    let username = this.props.name;
    // Get the author's username
    axios.get(`/${username}/post/author`, { params: { 'text': this.props.post.post_text }})
      .then((author) => {
        // Get the number of times you have liked the post
        axios.get(`/${username}/likes`, { params: { 'text': this.props.post.post_text }})
          .then((count) => {
            let personalLikeCount = count.data[0].count;
            // If you haven't liked it yet
            if (personalLikeCount < 1) {
              axios.post(`/likes/${author.data[0].username}`, { 'text': this.props.post.post_text, 'username': username })
                .then((res) => {
                  console.log(`${username} has liked the post!`);
                  this.getLikers();
                  this.getLikeAmount();
                })
                .catch((err) => {
                  console.error('This is the err', err);
                });
            } else { // Time to unlike!
              axios.delete(`/likes/${author.data[0].username}`, { params: { 'text': this.props.post.post_text, 'username': username }})
                .then((res) => {
                  console.log(`${username} has unliked the post!`);
                  this.getLikers();
                  this.getLikeAmount();
                })
                .catch((err) => {
                  console.error('This is the err', err);
                });
            }
          })
          .catch((err) => {
            console.log('Error getting personal like count', err);
          });
      })
      .catch((err) => {
        console.error('Error', err);
      });
  }
  handleClickedProfile() {
    axios.get(`/${this.props.post.first_name}/${this.props.post.last_name}`)
      .then((res) => {
        if (this.state.clickedUsername !== this.props.name) {
          this.setState({
            clickedUsername: res.data[0].username
          });
        } else {
          this.setState({
            clickedUsername: this.props.name
          });
        }
      })
      .catch((err) => {
        console.error('This is the error', err);
      })
    this.setState({
      redirect: true
    })
  }
  getProfileInfo() {
    axios.get(`/${this.props.post.first_name}/${this.props.post.last_name}`)
      .then((username) => {
        axios.get(`/${username.data[0].username}/profilePage`)
          .then((info) => {
            this.setState({
              profilePicUrl: info.data[0].user_data.profile_picture
            })
            console.log('This is the profile info', info);
          })
          .catch((err) => {
            console.error(err);
          })
      })
      .catch((err) => {
        console.error(err);
      })
  }
  getLikers() {
    axios.get('/likers', { params: { 'text': this.props.post.post_text }})
      .then((likers) => {
        console.log('Got all likers', likers);
        let likerStr = ''
        likers.data.map((liker) => {
          likerStr += `${liker.first_name} ${liker.last_name}<br>`
        });
        this.setState({
          likers: likerStr
        });
      })
      .catch((err) => {
        console.error('Error getting likers', err);
      });
  }
  render() {
    let clickedProfilePath = '/' + this.state.clickedUsername + '/profile/' + this.props.name;
    if (this.state.redirect) {
      return <Redirect push to={clickedProfilePath} />;
    }
    return(
      <div className="postCard">
        <Card fluid>
          <div className="postOverall">
            <div className="postHeader">
              <img className="postPic" src={this.state.profilePicUrl}/>
              <div className="postBody">
                <p className="postName">
                  <strong><span className="nameLink" onClick={this.handleClickedProfile.bind(this)}><a>{this.props.post.first_name}&nbsp;{this.props.post.last_name}</a></span></strong>
                  <br /><span className="postTimestamp">{moment(this.props.post.post_timestamp).fromNow()}</span>
                </p>
              </div>
            </div>
            <hr className="postHorizontal" />
            <p className="postText">{this.props.post.post_text}</p>
            <div className="postButtonRow">
              <Button onMouseOver={this.getLikers.bind(this)} data-multiline='true' data-tip={this.state.likers}className="likeButton" onClick={this.toggleLike.bind(this)} as='div' labelPosition='right'>
                <Button className="likeHeartButton">
                  <Icon name="heart" />
                  {(this.state.likeCount)}&nbsp;{(this.state.likeCount !== 1) ? 'likes' : 'like'}
                </Button>
              </Button>
              <ReactTooltip />
              <Button className="commentButton">
                1 Comment
              </Button>
            </div>
            <hr className="postBottomHorizontal" />
          </div>
          <div className="postCommentOverall">
            <div className="commentOverall">
              <div className="commentHeader">
                <img className="commentPic" src="https://pbs.twimg.com/profile_images/926008201127931904/MQI9hqOg.jpg"/>
                <div className="commentBody">
                  <p className="commentName">
                    <strong><a href="">Fred Zirdung</a></strong>&nbsp;&nbsp;<span className="postTimestamp">a few minutes ago</span>
                    <br /><span className="commentText">Awesome!</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default Post;