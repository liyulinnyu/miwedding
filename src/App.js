import React, { Component } from 'react';
import classes from './App.module.css';
import {connect} from 'react-redux';
import {BrowserRouter, Route, Switch, Redirect, withRouter} from 'react-router-dom';
import MainView from './views/MainView/MainView';
import Navigation from './components/Navigation/Navigation';
import CreateWeddingView from './views/CreateWeddingView/CreateWeddingView';
import WeddingView from './views/WeddingView/WeddingView';
import LoginView from './views/LoginView/LoginView';
import SignupView from './views/SignupView/SignupView';
import UpdateWeddingView from './views/UpdateWeddingView/UpdateWeddingView';
import UserView from './views/UserView/UserView';
import SearchWeddingView from './views/SearchWeddingView/SearchWeddingView';
import {checkLoginActionHandler} from './actions/loginAction';

class App extends Component {

  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.tokenExp > (+new Date())) {
      // already login, and token is not exp
      this.props.checkLoginActionHandler(user);
    } else if (user && user.tokenExp < (+new Date())) {
      localStorage.removeItem('user');
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Navigation />
        <Switch>

          <Route exact path='/create-wedding' component={CreateWeddingView} />
          <Route exact path='/viewWedding' component={WeddingView} />
          <Route exact path='/loginView' component={LoginView} />
          <Route exact path='/signupView' component={SignupView} />
          <Route exact path='/updateWedding' component={UpdateWeddingView} />
          <Route exact path='/userView' component={UserView} />
          <Route exact path='/searchWedding' component={SearchWeddingView} />
          <Route path='*' component={MainView} />
          
        </Switch>
      </BrowserRouter>
    );
  }
}

export default connect(null, {checkLoginActionHandler})(App);
