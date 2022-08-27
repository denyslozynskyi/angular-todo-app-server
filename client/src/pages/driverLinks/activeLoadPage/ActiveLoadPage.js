import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../../serverConnection';

import './activeLoadPage.scss';

class ActiveLoadPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLoad: {},
            token: localStorage.getItem('token'),
            message: '',
            error: ''
        }
    }

    componentDidMount = async () => {
        const activeLoad = await serverConnection('/api/loads/active', 'GET', null, {Authorization: `Bearer ${this.state.token}`})
        if (activeLoad.result) {
            this.setState({
                activeLoad: activeLoad.data.load
            });
        } else {
            this.setState({
                message: activeLoad.data.message
            });
        }
    }

    iterateState = async () => {
        const response = await serverConnection('/api/loads/active/state', 'PATCH', null, {Authorization: `Bearer ${this.state.token}`});
        
        if (response.result) {
            const updatedLoad = await serverConnection('/api/loads/active', 'GET', null, {Authorization: `Bearer ${this.state.token}`});

            this.setState({
                activeLoad: updatedLoad.data.load
            })
        } else {
            this.setState({
                error: response.data.message
            })
        }
    }
    
    render() {
        const { name, createdDate, delivery_address, pickup_address, dimensions, payload, state } = this.state.activeLoad;
        const { width, length, height } = dimensions || {};
        
        const activeLoadTemplate = (
            <>
                <div className="active_load_card">
                    <p className="load_name">Name:<br/>{name}</p>
                    <p className="load_state">State:<br/>{state}</p>
                    <p className="load_payload">Payload:<br/>{payload}</p>
                    <div className="load_dimensions">
                        <p className="load_width">Width:<br/>{width}</p>
                        <p className="load_length">Length:<br/>{length}</p>
                        <p className="load_height">Height:<br/>{height}</p>
                    </div>
                    <p className="load_pickup">Pickup address:<br/>{pickup_address}</p>
                    <p className="load_delivery">Delivery address:<br/>{delivery_address}</p>
                    <p className="load_create_date">Create date:<br/>{new Date(createdDate).toLocaleString()}</p>
                    <button onClick={this.iterateState} className='active_load_btn'>Iterate state</button>
                    {this.state.error ? <span className='active_load_error'>{this.state.error}</span> : null}
                </div>
            </>
        )

        return (
            <div className='active_load'>
                {!this.state.message ? activeLoadTemplate : <span className='active_load_message'>{this.state.message}</span>}
            </div>
        );
    }
}

export default ActiveLoadPage;