import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Component } from 'react';

import ActiveLoadPage from '../driverLinks/activeLoadPage/ActiveLoadPage';
import CreateTruckPage from '../driverLinks/createTruckPage/CreateTruckPage';
import TrucksPage from '../driverLinks/trucksPage/TrucksPage';

import './driverPage.scss';

class DriverPage extends Component {       
    render() {
        return (
            <>
                <aside className='sidebar'>
                    <nav className='aside_navbar'>
                        <Link to="/driver/activeLoad">Active load</Link>
                        <Link to="/driver/createTruck">Create truck</Link>
                        <Link to="/driver/trucks">My trucks</Link>
                    </nav>
                </aside>
                <main className='main'>
                    <Routes>
                        <Route path="/driver/activeload" element={<ActiveLoadPage/>} exact/>
                        <Route path="/driver/createTruck" element={<CreateTruckPage/>}/>
                        <Route path="/driver/trucks" element={<TrucksPage/>}/>
                        <Route path="*" element={<ActiveLoadPage/>}/>
                    </Routes>
                </main>
            </>
        );
    }
}

export default DriverPage;