import React from 'react';
import CreatePost from './CreatePost.jsx';
import PostList from './PostList.jsx';
import Profile from './Profile.jsx';
import FBHeader from './Header.jsx';
import axios from 'axios';
import { Button, Icon, Image, Header, List, Item, Divider, Menu, Advertisement } from 'semantic-ui-react';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postList: [],
      username: '',
    }
  }
  componentDidMount() {
    this.getAllPosts();
  }
  getAllPosts() {
    let username = this.props.match.params.username;
    this.setState({
      username: username
    });
    //create new route
    axios.get(`/${username}/posts/friends`)
      .then((res1) => {
        console.log('ALL FRIENDS POSTS', res1.data);
        axios.get(`/${username}/posts/nonFriends`)
          .then((res2) => {
            console.log('ALL NON-FRIENDS POSTS', res2.data);
            //concats all friends posts, then all non-friends posts
            this.setState({
              postList: res1.data.concat(res2.data)
            });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return (
      <div className="feedContainer">
        <div className="feedSidebar">
          <div className = "feedSidebarUser">
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='user' />
              {this.props.match.params.username}
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='browser' />
              Feed
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='mail outline' />
              Messages
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='video play outline' />
              Watch
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='shop' />
              Marketplace
            </Button>
          </div>

          <div className="exploreTag">Explore</div>
            
          <div className = "feedSidebarExplore" >
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='calendar' />
              Events
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='fa' />
              Groups
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='group' />
              Friends
            </Button>
            <Button icon labelPosition='left' fluid className="feedSideBarUserButton">
              <Icon name='bookmark' />
              Saved
            </Button>
          </div>
        </div>

        <div className="feedContent">
          <PostList postList={this.state.postList} getAllPosts={this.getAllPosts.bind(this)} name={this.state.username} />
        </div>

        <div className="feedSidebar">
        
          <div className="feedSidebarTrending">
            <p className="feedTrendingLabel">Trending</p>
            <Item.Group className="feedSidebarTrendingItem">
              <Item>
                <Icon name='lightning' />
                <Item.Content>  
                  <div className="feedSidebarTrendingTopicHeader">Trending Topic</div>
                  <Item.Description className="trendingDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                  </Item.Description>
                  <Item.Extra>loremipsum.com</Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
            <Item.Group className="feedSidebarTrendingItem">
              <Item>
                <Icon name='lightning' />
                <Item.Content>  
                  <div className="feedSidebarTrendingTopicHeader">Trending Topic</div>
                  <Item.Description className="trendingDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                  </Item.Description>
                  <Item.Extra>loremipsum.com</Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
            <Item.Group className="feedSidebarTrendingItem">
              <Item>
                <Icon name='lightning' />
                <Item.Content>  
                  <div className="feedSidebarTrendingTopicHeader">Trending Topic</div>
                  <Item.Description className="trendingDescription">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                  </Item.Description>
                  <Item.Extra>loremipsum.com</Item.Extra>
                </Item.Content>
              </Item>
            </Item.Group>
          </div>

          <div className="feedSidebarAds">
            <Item.Group className="feedSidebarAdItem">
            <Item>
              <Icon name='external' />
              <Item.Content>  
                <div className="feedSidebarTrendingTopicHeader">Advertisement</div>
                <Item.Description>
                  <img className="adPic" src="/images/hackreactor.png" />
                </Item.Description>
              </Item.Content>
              </Item>
            </Item.Group>
          </div>
        </div>
      </div>
    );
  }
}

export default Feed;