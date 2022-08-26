import React, { Component } from 'react';

import Header from '../header/Header';
import AuthPage from '../../pages/authPage/AuthPage';
import DriverPage from '../../pages/driverPage/DriverPage';
import ShipperPage from '../../pages/shipperPage/ShipperPage';
import AboutPage from '../../pages/aboutPage/AboutPage';

import './app.scss';

class App extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      isAuth: localStorage.getItem('token') ? true : false,
      role: localStorage.getItem('role') || null,
      about: false,
      login: true,
      name: localStorage.getItem('name') || null
    }
  }

  setAuthState = (role, isAuth, name) => {
    this.setState({
      isAuth,
      role,
      name
    });
  }

  toggleAboutState = () => {
    this.setState({
      about: !this.state.about
    });
  }

  changePage = () => {
    this.setState({
        login: !this.state.login
    });
}
  
  render() {
    return (
      <div className='container'>
        <Header 
          toggleAboutState={this.toggleAboutState} 
          setToken={this.setAuthState} 
          tooglePages={this.changePage}
          isAuth={this.state.isAuth}
          login={this.state.login}
          name={this.state.name}/>
        <div className='content'>
          {!this.state.isAuth
              ? <AuthPage setToken={this.setAuthState} login={this.state.login}/> : this.state.about
                ? <AboutPage/> : this.state.role === 'driver'
                  ? <DriverPage/> : this.state.role === 'shipper' 
                    ? <ShipperPage/> : <AuthPage/>}
        </div>
      </div>
    );
  }
}

export default App;
