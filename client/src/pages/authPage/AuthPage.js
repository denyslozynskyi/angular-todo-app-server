import React from 'react';
import { Component } from 'react';

import RegisterForm from '../../components/registerForm/RegisterForm';
import LoginForm from '../../components/loginForm/LoginForm';
import { serverConnection } from '../../serverConnection';

import './authPage.scss';

class AuthPage extends Component {
    render() {
        return (
            <>
                {this.props.login ?
                    <LoginForm setToken={this.props.setToken}/> :
                    <RegisterForm/>}
            </>
        )
    }
}

export default AuthPage;