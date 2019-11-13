import React from 'react';
import { NetworkProvider } from '../../context';
import D3Graph from '../../D3Graph/D3Graph';
import Main from '../main';

function App() {
    return (
        <div className="App">
            <NetworkProvider>
                <Main />
                <D3Graph />
            </NetworkProvider>
        </div>
    );
}

export default App;
