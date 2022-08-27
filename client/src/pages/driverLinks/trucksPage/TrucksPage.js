import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../../serverConnection';

import './trucksPage.scss';

class TrucksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trucks: [],
            token: localStorage.getItem('token'),
            cardMessage: '',
            cardError: ''
        }
    }

    componentDidMount = async () => {
        const trucks = await serverConnection('/api/trucks', 'GET', null, {Authorization: `Bearer ${this.state.token}`})

        if (trucks) {
            this.setState({
                trucks:  trucks.data.trucks
            });
        }
    }

    assignTruck = async (e) => {
        const truckId = e.target.parentNode.parentNode.getAttribute('data-key');
        const response = await serverConnection(`/api/trucks/${truckId}/assign`, 'POST', null, {Authorization: `Bearer ${this.state.token}`});
        const span = document.createElement('span');
    
        document.querySelectorAll('.truck_card').forEach( truckCard => {
            if (truckCard.querySelector('span')) {
                truckCard.removeChild(truckCard.querySelector('span'));
            }
        })

        if (response.result) {  
            const newTrucks = await serverConnection('/api/trucks', 'GET', null, {Authorization: `Bearer ${this.state.token}`});
            
            this.setState(() => ({
                cardMessage: response.data.message,
                cardError: '',
                trucks: newTrucks.data.trucks
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

        e.target.parentNode.parentNode.append(span);
    }

    deleteTruck = async (e) => {
        const truckId = e.target.parentNode.parentNode.getAttribute('data-key');
        const response = await serverConnection(`/api/trucks/${truckId}`, 'DELETE', null, {Authorization: `Bearer ${this.state.token}`});

        if (response.result) {  
            const newTrucks = await serverConnection('/api/trucks', 'GET', null, {Authorization: `Bearer ${this.state.token}`});
            this.setState({
                trucks: newTrucks.data.trucks
            });
        } else {
            this.setState({
                trucks: []
            })
        }
    }
    
    render() {
        const trucks = this.state.trucks.map((truck) => {            
            return (
                <div className="truck_card" key={truck._id} data-key={truck._id}>
                    <p className="truck_type">Truck type: {truck.type.split('_').join(' ')}</p>
                    <p className="truck_status">Truck status: {truck.status}</p>
                    <p className="truck_assigned">Truck assigned: {truck.assigned_to ? 'yes' : 'no'}</p>
                    <p className="truck_create_date">Creation date: {new Date(truck.created_date).toLocaleString()}</p>
                    <div className="truck_card_buttons">
                        <button onClick={this.assignTruck} className="assign_truck">Assign</button>
                        <button onClick={this.deleteTruck} className="delete_truck">Delete</button>
                    </div>
                </div>
            )
        });

        return (
            <div className='truck_cards'>
                {this.state.trucks.length === 0 ? <span className="cards_message">No trucks yet</span> : trucks}
            </div>
        );
    }
}

export default TrucksPage;