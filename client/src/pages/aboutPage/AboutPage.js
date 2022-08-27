import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../serverConnection';

import './aboutPage.scss';

class AboutPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            token: localStorage.getItem('token'),
            cardMessage: '',
            cardError: ''
        }
    }

    componentDidMount = async () => {
        const user = await serverConnection('/api/users/me', 'GET', null, {Authorization: `Bearer ${this.state.token}`});
        
        if (user.result) {
            this.setState({
                user:  user.data.user
            });
        }
    }
    
    render() {
        return (
            <div className="user_card" data-key={this.state.user._id}>
                <p className="user_name">Name: {this.state.user.name}</p>
                <p className="user_role">Role: {this.state.user.role}</p>
                <p className="user_email">Email: {this.state.user.email}</p>
                <p className="user_created">Creation date: {new Date(this.state.user.created_date).toLocaleDateString()}</p>
            </div>
        );
    }
}

export default AboutPage;