import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../serverConnection';

import './loginForm.scss';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: '',
            message: ''
        }
    }

    onInput = (e) => {
        this.setState(() => {
            const changeTarget = e.target.name
            return {
                [changeTarget]: e.target.value
            }
        })
    }

    loginUser = async (e) => {
        e.preventDefault();

        const { email, password } = this.state;

        if (!email || !password) {
            this.setState({
                error: 'Please, complete all fields'
            });
            return;
        }

        const body = {
            email,
            password
        }

        const response = await serverConnection('/api/auth/login', 'POST', body)

        if (!response.result) {
            this.setState({
                error: response.data.message
            })
        } else {
            this.setState({
                error: '',
                message: 'Login'
            })

            localStorage.setItem('token', response.data.jwt_token);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('name', response.data.name)

            this.props.setToken(response.data.role, true, response.data.name);
        }
    }

    forgotPassword = async (e) => {
        e.preventDefault();

        const { email } = this.state;

        if (!email) {
            this.setState({
                error: 'Please, complete email fields'
            });
            return;
        }

        const body = {
            email
        }

        const response = await serverConnection(
            '/api/auth/forgot_password',
            'POST',
            body
        )

        if (!response.result) {
            this.setState({
                error: response.data.message
            })
        } else {
            this.setState({
                error: '',
                message: response.data.message
            })
        }
    }
    
    render() {
        return (
            <form className='login_form'>
                <input
                    onChange={this.onInput}
                    type="text"
                    name="email"
                    id="email"
                    placeholder='Email'
                    value={this.state.email}/>
                <input
                    onChange={this.onInput}
                    type="password"
                    name="password"
                    id="password"
                    placeholder='Password'
                    value={this.state.password}/>
                {this.state.error
                    ? <span className='auth_error'>{this.state.error}</span>
                    : null}
                {this.state.message
                    ? <span className='auth_message'>{this.state.message}</span>
                    : null} 
                <div className="form_button_group">
                    <button onClick={this.loginUser}>Login</button>
                    <button onClick={this.forgotPassword} className='forgot_password'>Forgot password</button>
                </div>
            </form>
        )
    }
};

export default LoginForm;
