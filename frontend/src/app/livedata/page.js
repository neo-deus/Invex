"use client"
import React, { useEffect, useState } from 'react';

// Single Crypto Card Component
const CryptoCard = ({ data }) => {
    return (
        <div style={{ border: '1px solid black', margin: '10px', padding: '10px', width: '200px' }}>
            <h2>{data.symbol}</h2>
            <p>Current Price: ${data.p.toFixed(2)}</p>
            <p>24h Change: {data.p24h.toFixed(2)}%</p>
            <p>Market Cap: ${data.mc.toLocaleString()}</p>
        </div>
    );
};

// Main Component to handle WebSocket and display cards
const CryptoDashboard = () => {
    const [cryptoData, setCryptoData] = useState({});
    const wsUrl = 'wss://push.coinmarketcap.com/ws?device=web&client_source=home_page';
    const payload = {"method":"RSUBSCRIPTION","params":["main-site@crypto_price_5s@{}@normal","1,1027,2010,1839"]};

    useEffect(() => {
        const cryptoWebSocket = new WebSocket(wsUrl);

        cryptoWebSocket.onopen = () => {
            console.log('WebSocket connection established.');
            cryptoWebSocket.send(JSON.stringify(payload));
        };

        cryptoWebSocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
        
            // Check if the 'd' key is present in the message
            if (message && message.d) {
                const cryptoUpdate = message.d;
                setCryptoData(prevData => ({
                    ...prevData,
                    [cryptoUpdate.id]: {...cryptoUpdate, symbol: getSymbol(cryptoUpdate.id)}
                }));
            } else {
                console.error('Unexpected message format:', message);
            }
        };

        return () => {
            cryptoWebSocket.close();
        };
    }, []);

    const getSymbol = (id) => {
        const symbols = {
            '1': 'BTC',
            '1027': 'ETH',
            '2010': 'ADA',
            '1839': 'BNB'
        };
        return symbols[id.toString()];
    };

    return (
        <div>
            <h1>Crypto WebSocket Dashboard</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {Object.values(cryptoData).map(data => (
                    <CryptoCard key={data.id} data={data} />
                ))}
            </div>
        </div>
    );
};

export default CryptoDashboard;
