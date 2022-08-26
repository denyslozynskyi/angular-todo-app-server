import React, { Component } from 'react';

import logo from './logo.png';
import './header.scss';

class Header extends Component {   
    logoutUser = (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        this.props.setToken('', false);
    }

    tooglePages = (e) => {
        e.preventDefault();
        this.props.tooglePages();
    }
    
    render() {
        return (
            <header className='header'>
                <div className="logo_title">
                    <div>
                        <a href="/"><img src={logo} alt="logo" className="logo"/></a>
                    </div>
                    <span className="header_title">LoadsAndTrucks App</span>
                </div>
                <div className="header_btns">
                    {this.props.isAuth ? <span className="username">{`Hello, ${this.props.name}`}</span> : null}
                    {this.props.isAuth ? <button onClick={this.props.toggleAboutState} className="about_me">About me</button> : null}
                    {this.props.isAuth ?
                        <button onClick={this.logoutUser} className="log_out">Log out</button> : this.props.login
                            ? <button onClick={this.tooglePages} className='sign_up_btn'>Sign up</button>
                            : <button onClick={this.tooglePages} className='sign_in_btn'>Sign in</button>
                        }
                </div>
            </header>
        )
    }
}

export default Header;