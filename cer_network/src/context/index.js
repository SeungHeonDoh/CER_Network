import React, { createContext, useState } from 'react';


const NetworkContext = createContext([{}, () => {}]);

const NetworkProvider = (props) => {
    const [ state, setState ] = useState({
        data: {
        },
        activated: null,
        activateFunction: null
    });
    return (
        <NetworkContext.Provider value={[state, setState]}>
            {props.children}
        </NetworkContext.Provider>
    );
}

export { NetworkContext, NetworkProvider };