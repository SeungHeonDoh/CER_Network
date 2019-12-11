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

    async function loadGraphData(path){
        var nodes = await require('../data/node.json');
        setNetworkState((prev) => ({
            ...prev,
            data: {
                nodes,
                links: []
            },
        }))
    }

    return {
        data: networkState.data,
        activated: networkState.activated,
        setActivateNode,
        loadGraphData,
    }
}

export default useNetwork