import React from 'react';
import { NetworkProvider } from '../../context';
import Main from '../main';

function App() {
    return (
        <div className="App">
            <NetworkProvider>
                <Main />
            </NetworkProvider>
        </div>
    );
}

export default App;
