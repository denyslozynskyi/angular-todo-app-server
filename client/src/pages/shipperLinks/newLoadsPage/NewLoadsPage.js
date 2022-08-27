import React, { Component } from "react";

import { serverConnection } from '../../../serverConnection';

import './newLoadsPage.scss';

class NewLoadsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loads: [],
            token: localStorage.getItem('token'),
            cardMessage: '',
            cardError: ''
        }
    }

    componentDidMount = async () => {
        const loads = await serverConnection('/api/loads?status=new', 'GET', null, {Authorization: `Bearer ${this.state.token}`})
        
        if (loads.result) {
            this.setState({
                loads:  loads.data.loads
            });
        }
    }

    postLoad = async (e) => {
        const loadId = e.target.parentNode.parentNode.getAttribute('data-key');
        const response = await serverConnection(`/api/loads/${loadId}/post`, 'POST', null, {Authorization: `Bearer ${this.state.token}`});
        const span = document.createElement('span');
    
        document.querySelectorAll('.load_card').forEach( truckCard => {
            if (truckCard.querySelector('span')) {
                truckCard.removeChild(truckCard.querySelector('span'));
            }
        });

        if (response.result) {  
            const newLoads = await serverConnection('/api/loads?status=new', 'GET', null, {Authorization: `Bearer ${this.state.token}`});
            
            this.setState(() => ({
                cardMessage: response.data.message,
                cardError: '',
                loads: newLoads.data.loads ? newLoads.data.loads : []
            }));
            span.classList.add('card_message');
            span.innerText = response.data.message;
        } else {
            this.setState(() => ({
                cardError: response.data.message,
                cardMessage: ''
            }));
            span.classList.add('card_error');
            span.innerText = response.data.message;
        }

        e.target.parentNode.append(span);
    }

    deleteLoad = async (e) => {
        const loadId = e.target.parentNode.parentNode.getAttribute('data-key');
        const response = await serverConnection(`/api/loads/${loadId}`, 'DELETE', null, {Authorization: `Bearer ${this.state.token}`});

        if (response.result) {  
            const newLoads = await serverConnection('/api/loads?status=new', 'GET', null, {Authorization: `Bearer ${this.state.token}`});
            if (newLoads.result) {
                this.setState(() => ({
                    loads: newLoads.data.loads
                }));
            } else {
                this.setState(() => ({
                    loads: []
                }));
            }
        }
    }
    
    render() {
        const loads = this.state.loads.map((load) => {            
            return (
                <div className="new_load_card" key={load._id} data-key={load._id}>
                    <p className="load_name">Load name: {load.name}</p>
                    <p className="load_status">Load status: {load.status}</p>
                    <p className="load_pickup">Pickup address: {load.pickup_address}</p>
                    <p className="load_delivery">Delivery address: {load.delivery_address}</p>
                    <p className="load_created">Creation date: {new Date(load.createdDate).toLocaleString()}</p>
                    <p className="load_payload">Load payload: {load.payload}</p>
                    <div className="load_dimensions">
                        <p>Load dimensions:</p>
                        <p className="dimension">width: {load.dimensions.width}</p>
                        <p className="dimension">length: {load.dimensions.length}</p>
                        <p className="dimension">heigth: {load.dimensions.height}</p>
                    </div>
                    <div className="load_card_buttons">
                        <button onClick={this.postLoad} className="post_load">Post</button>
                        <button onClick={this.deleteLoad} className="delete_load">Delete</button>
                    </div>
                </div>
            )
        });

        return (
            <div className='new_load_cards'>
                {this.state.loads.length === 0 ? <span className="cards_message">No loads yet</span> : loads}
            </div>
        );
    }
}

export default NewLoadsPage;