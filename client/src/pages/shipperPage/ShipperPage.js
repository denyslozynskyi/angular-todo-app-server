import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Component } from 'react';

import CreateLoadPage from '../shipperLinks/CreateLoadPage';
import NewLoadsPage from '../shipperLinks/NewLoadsPage';
import ActiveLoadsPage from '../shipperLinks/ActiveLoadsPage';
import CompletedLoadsPage from '../shipperLinks/CompletedLoadsPage';

import './shipperPage.scss';

class ShipperPage extends Component {
    render() {
        return (
            <>
                <aside className='sidebar'>
                    <nav className='aside_navbar'>
                        <Link to="/shipper/createLoad">Create load</Link>
                        <Link to="/shipper/newLoads">New loads</Link>
                        <Link to="/shipper/ativeLoads">Active loads</Link>
                        <Link to="/shipper/completedLoads">Completed loads</Link>
                    </nav>
                </aside>
                <main className='main'>
                    <Routes>
                        <Route path="/shipper/createLoad" element={<CreateLoadPage/>} exact/>
                        <Route path="/shipper/newLoads" element={<NewLoadsPage/>}/>
                        <Route path="/shipper/ativeLoads" element={<ActiveLoadsPage/>}/>
                        <Route path="/shipper/completedLoads" element={<CompletedLoadsPage/>}/>
                    </Routes>
                </main>
            </>
        );
    }
}

export default ShipperPage;