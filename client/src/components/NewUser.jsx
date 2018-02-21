import React from 'react';
import $ from 'jquery';
import {Input, Button, Card, Image, Form, Field, Icon} from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';

class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      firstName: undefined,
      lastName: undefined,
      pictureUrl: '/images/profile_default.jpg',
      newUsername: '',
      redirect: false,
      invalidInput: false,
      duplicateUsername: false
    }
  }
  handleInputChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value, 
      duplicateUsername: false,
      invalidInput: false
    });
  }
  handleSubmit() {
    if (!this.state.username || !this.state.firstName || !this.state.lastName) {
      this.setState({
        invalidInput: true
      });
    } else {
      this.setState({
        newUsername: this.state.username
      });
      $.post(`/${this.state.username}`, this.state, () => {
        this.setState({
          redirect: true,
          newUsername: this.state.username
        });
        this.props.getNewUsername(this.state.username);
        this.props.getSignedIn(true);
      })
      .fail((err) => {
        if (err.responseJSON.includes('Key (username)=') && err.responseJSON.includes('already exists.')) {
          this.setState({
            duplicateUsername: true
          });
        }
      });
    }
  }
  render() {
    let newUserFeedPath = '/' + this.state.newUsername + '/feed';
    if (this.state.redirect) {
      return <Redirect push to={newUserFeedPath} />;
    }
    return(
      <div className="newUser">
        {this.props.usernameError ?
        <h3><font color="red"><Icon name="warning circle"/>Username '{this.props.username}' doesn't match any account.</font></h3> : null}
        <h4 id="new-account-title">Create a New Account</h4>
        <Card className="new-user-card">
          <Image className="ui tiny images" src="/images/profile_default.jpg"/>
          <Form className="input-form" onSubmit={this.handleSubmit.bind(this)}>
          {this.state.invalidInput ? <h5 className="undefined-user-error"><Icon name="warning circle"/>All fields are required. Please enter your info and try again.</h5> : null}
          {this.state.duplicateUsername ? <h5 className="undefined-user-error"><Icon name="warning circle"/>Username is already in the system. Please log in above or choose a different username.</h5> : null}
            <Input className="newUserInput" name="username" type="text" onChange={this.handleInputChange.bind(this)} placeholder="Username"/>
            <Input className="newUserInput" name="firstName" type="text" onChange={this.handleInputChange.bind(this)} placeholder="First name"/>
            <Input className="newUserInput" name="lastName" type="text" onChange={this.handleInputChange.bind(this)} placeholder="Last name"/>
            <div id="terms">By clicking Create Account, you agree to our Terms and that you have read our Data Policy, including our Cookie Use.</div>
            <Input className="login-button" id="create-account" type="submit" value="Create Account"/>
          </Form>
        </Card>
      </div>
    )
  }
}

export default NewUser;

