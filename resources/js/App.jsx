import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import MainApp from './MainApp';

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <MainApp />
        </React.StrictMode>
    );
}
