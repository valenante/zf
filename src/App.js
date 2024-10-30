// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Cambia Switch por Routes
import AdminPage from './pages/AdminPage';
import PlatosAdmin from './pages/PlatosPage';

const App = () => {
    return (
        <Router>
            <Routes> {/* Cambia Switch por Routes */}
                <Route path="/admin" element={<AdminPage />} /> {/* Usa element en lugar de component */}
                <Route path="/admin/platos" element={<PlatosAdmin />} />
            </Routes>
        </Router>
    );
};

export default App;
