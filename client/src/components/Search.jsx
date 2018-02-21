import axios from 'axios';
import { Icon } from 'semantic-ui-react';
import _ from 'lodash'
import faker from 'faker'
import React, { Component } from 'react'
import { Search, Grid, Header } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';

class SearchBar extends Component {
  //retrieve data using ajax call
  //parse names into title format
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  componentWillMount() {
    this.resetComponent()
  }
  componentDidMount() {
    this.getAllUsers();
  }
  getAllUsers() {
    var user = this.state.username;
    axios.get(`/search/users`)
    .then((response) => {
      let searchNames = response.data.map(function(user){
        return { 
          "title": user.first_name + ' ' + user.last_name,
          "description": user.username
        }
      });
      this.setState({
        source: searchNames
      });
    })
    .catch((error) => {
      console.log(error);
    }); 
  }
  resetComponent() {
    this.setState({ isLoading: false, results: [], value: '' })
  }
  handleResultSelect(e, { result }) { 
    //go to profile
    this.setState({
      redirect: true,
      clickedName: result.description
    });
  }
  handleSearchChange(e, { value }) {
    this.setState({ isLoading: true, value })
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent()
      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)
      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      });
    }, 500)
  }
  render() {
    const { isLoading, value, results, source } = this.state
    const profileUrl = '/' + this.state.clickedName + '/profile/' + this.props.loggedInUser;
    if (this.state.redirect) {
      return <Redirect to={profileUrl} />
    }
    return (
      <Grid>
        <form className="search-bar" onSubmit={this.handleSearchChange.bind(this)}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect.bind(this)}
            onSearchChange={this.handleSearchChange.bind(this)}
            results={results}
            value={value}
            className="search-input"
          />
        </form>
      </Grid>
    )
  }
}

export default SearchBar;