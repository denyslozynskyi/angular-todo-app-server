import React, { Component } from "react";

import { serverConnection } from '../../../serverConnection';

import './createLoadPage.scss';

class CreateLoadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            payload: '',
            pickup: '',
            delivery: '',
            width: '',
            length: '',
            height: '',
            token: localStorage.getItem('token'),
            error: '',
            message: ''
        }
    }

    inputChange = (e) => {
        const field = e.target.getAttribute('data-field');
        this.setState({
            [field]: e.target.value
        })
    }

    createLoad = async (e) => {
        e.preventDefault();
        const {name, payload, pickup, delivery, width, length, height} = this.state;
        const dimensions = {
            width: +width,
            length: +length,
            height: +height
        }

        const response = await serverConnection('/api/loads', 'POST', {name, payload: +payload, pickup_address: pickup, delivery_address: delivery, dimensions}, {Authorization: `Bearer ${this.state.token}`});
        
        if (response.result) {
            this.setState({
                message: response.data.message,
                error: ''
            })
        } else {
            this.setState({
                message: '',
                error: response.data.message
            })
        }
    }

    render() {
        const {name, payload, pickup, delivery, width, length, height} = this.state;

        return (
            <>
                <form className='create_load_form'>
                    <input onChange={this.inputChange} type="text" value={name} name="createLoad" id="createLoad" placeholder='Load name' data-field="name"/>
                    <input onChange={this.inputChange} type="number" value={payload} name="createLoad" id="createLoad" placeholder='Load payload' data-field="payload"/>
                    <input onChange={this.inputChange} type="text" value={pickup} name="createLoad" id="createLoad" placeholder='Load pickup address' data-field="pickup"/>
                    <input onChange={this.inputChange} type="text" value={delivery} name="createLoad" id="createLoad" placeholder='Load delivery address' data-field="delivery"/>
                    <input onChange={this.inputChange} type="number" value={width} name="createLoad" id="createLoad" placeholder='Load width' data-field="width"/>
                    <input onChange={this.inputChange} type="number" value={length} name="createLoad" id="createLoad" placeholder='Load length' data-field="length"/>
                    <input onChange={this.inputChange} type="number" value={height} name="createLoad" id="createLoad" placeholder='Load height' data-field="height"/>
                </form>
                <button onClick={this.createLoad} className='create_load_btn'>Create load</button>
                {this.state.message ? <span className='form_message'>{this.state.message}</span> : null}
                {this.state.error ? <span className='form_error'>{this.state.error}</span> : null}
            </>
        );
    }
}

export default CreateLoadPage;