import React from 'react';
import { Component } from 'react';

import { serverConnection } from '../../../serverConnection';

import './createTruckPage.scss';

class CreateTruckPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formInput: '',
            token: localStorage.getItem('token'),
            error: '',
            message: ''
        }
    }

    inputChange = (e) => {
        this.setState({
            formInput: e.target.value.toLowerCase()
        })
    }

    createTruck = async (e) => {
        e.preventDefault();
        const truckType = this.state.formInput.split(' ').join('_');

        const response = await serverConnection('/api/trucks', 'POST', {type: truckType}, {Authorization: `Bearer ${this.state.token}`});
        
        if (response.result) {
            this.setState({
                message: response.data.message,
                error: '',
                formInput: ''
            })
        } else {
            this.setState({
                message: '',
                error: response.data.message,
                formInput: ''
            })
        }
    }

    render() {
        return (
            <>
                <form className='create_truck_form'>
                    <input onChange={this.inputChange} type="text" value={this.state.formInput} name="createTruck" id="createTruck" placeholder='Truck type'/>
                    <button onClick={this.createTruck} className='create_truck_btn'>Create truck</button>
                </form>
                {this.state.message ? <span className='form_message'>{this.state.message}</span> : null}
                {this.state.error ? <span className='form_error'>{this.state.error}</span> : null}
                <table className="truck_types">
                    <thead>
                        <tr>
                            <th>Truck type</th>
                            <th>Payload</th>
                            <th>Width</th>
                            <th>Length</th>
                            <th>Height</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Sprinter</td>
                            <td>1700</td>
                            <td>250</td>
                            <td>300</td>
                            <td>170</td>
                        </tr>
                        <tr>
                            <td>Small straight</td>
                            <td>2500</td>
                            <td>250</td>
                            <td>500</td>
                            <td>170</td>
                        </tr>
                        <tr>
                            <td>Large straight</td>
                            <td>4000</td>
                            <td>350</td>
                            <td>700</td>
                            <td>200</td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

export default CreateTruckPage;