import React, { Component } from "react";

import { serverConnection } from '../../../serverConnection';

import './activeLoadsPage.scss';

class ActiveLoadsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loads: [],
            token: localStorage.getItem('token'),
            cardMessage: ''
        }
    }

    componentDidMount = async () => {
        const loads = await serverConnection('/api/loads?status=assigned', 'GET', null, {Authorization: `Bearer ${this.state.token}`})
        
        if (loads.result) {
            this.setState({
                loads:  loads.data.loads
            });
        }
    }
    
    render() {
        const loads = this.state.loads.map((load) => {            
            return (
                <div className="active_load_card" key={load._id} data-key={load._id}>
                    <p className="load_name">Load name: {load.name}</p>
                    <p className="load_status">Load status: {load.status}</p>
                    <p className="load_state">Load state: {load.state}</p>
                    <p className="load_delivery">Delivery address: {load.delivery_address}</p>
                    <p className="load_created">Creation date: {new Date(load.createdDate).toLocaleString()}</p>
                </div>
            )
        });

        return (
            <div className='active_load_cards'>
                {this.state.loads.length === 0 ? <span className="cards_message">No loads yet</span> : loads}
            </div>
        );
    }
}

export default ActiveLoadsPage;