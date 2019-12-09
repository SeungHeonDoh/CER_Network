import { useContext } from 'react';
import { NetworkContext } from '../context';

const useNetwork = () => {
    const [ networkState, setNetworkState ] = useContext(NetworkContext);

    function setActivateNode(node){
        console.log(node);
        setNetworkState((prev) => ({
            ...prev,
            activated: node,
        }))
    }

    return {
        data: networkState.data,
        activated: networkState.activated,
        setActivateNode,
    }
}

export default useNetwork