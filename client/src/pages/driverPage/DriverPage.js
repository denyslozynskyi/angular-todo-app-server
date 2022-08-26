import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Component } from 'react';

import ActiveLoadPage from '../driverPages/ActiveLoadPage';
import CreateTruckPage from '../driverPages/CreateTruckPage';
import TrucksPage from '../driverPages/TrucksPage';

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
                    </Routes>
                </main>
            </>
        );
    }
}

export default DriverPage;