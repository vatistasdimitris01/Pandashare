import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/Pages/Home';
import View from '@/Pages/View';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/view" element={<View />} />
            </Routes>
        </Router>
    );
}

export default App;
