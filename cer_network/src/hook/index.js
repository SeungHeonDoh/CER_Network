import { useContext } from 'react';
import { NetworkContext } from '../context';

const useNetwork = () => {
    const [ networkState, setNetworkState ] = useContext(NetworkContext);
    console.log(networkState);

    return {
        nodes: networkState.nodes
    }
}

export default useNetwork