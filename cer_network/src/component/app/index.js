import React from 'react';
import { NetworkProvider } from '../../context';
import Main from '../main';
import Description from '../description';
import { Page } from '../../styles';

function App() {
    return (
        <NetworkProvider>
            <Page>
                <Main />
                <Description />
            </Page>
        </NetworkProvider>
    );
}

export default App;
