import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../serverConnection';

import './registerForm.scss';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            role: '',
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

    registerUser = async (e) => {
        e.preventDefault();

        const { email, password, role, name } = this.state;

        if (!email || !password || !role || !name) {
            this.setState({
                error: 'Please, complete all fields'
            });
            return;
        }

        const body = {
            name,
            email,
            password,
            role
        }

        const response = await serverConnection(
            '/api/auth/register',
            'POST',
            body
        )

        if (response.result) {
            this.setState({
                message: response.data.message,
                error: ''
            })
        } else {
            this.setState({
                error: response.data.message
            })
        }
    }

    render() {
        return (
            <form className='register_form'>
                <input
                    onChange={this.onInput}
                    type="text"
                    name="name"
                    id="name"
                    placeholder='Name'
                    value={this.state.name}/>
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
                <input
                    onChange={this.onInput}
                    type="text"
                    name="role"
                    id="role"
                    placeholder='Role (driver or shipper)'
                    value={this.state.role}/>
                {this.state.error
                    ? <span className='auth_error'>{this.state.error}</span>
                    : null}
                {this.state.message
                    ? <span className='auth_message'>{this.state.message}</span>
                    : null}               
                <div className="form_button_group">
                    <button onClick={this.registerUser}>Register</button>
                </div>
            </form>
        )
    }
};

export default RegisterForm;
