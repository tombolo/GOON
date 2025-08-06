import React from 'react';

const GlobalLoading = () => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            background: '#111',
            color: '#fff',
            fontSize: '2rem',
            flexDirection: 'column',
        }}
    >
        <img src='/logo.svg' alt='Deriv Logo' style={{ width: 80, marginBottom: 24 }} />
        Loading Deriv App...
    </div>
);

export default GlobalLoading;
