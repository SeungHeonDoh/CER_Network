import { useContext } from 'react';
import { NetworkContext } from '../context';

const useNetwork = () => {
    const [ networkState, setNetworkState ] = useContext(NetworkContext);

    function setActivateNode(node){
        setNetworkState((prev) => ({
            ...prev,
            activated: node,
        }))
    }

    async function loadGraphData(path){
        var nodes = await require('../data/node_v0.1.json');
        setNetworkState((prev) => ({
            ...prev,
            data: {
                nodes,
                links: []
            },
        }))
    }

    function setActivateFunction(activateFunction){
        setNetworkState((prev) => ({
            ...prev,
            activateFunction
        }))
    }

    function changeActivate(node){
        if(node !== undefined){
            networkState.activateFunction(node);
        }
    }

    return {
        data: networkState.data,
        activated: networkState.activated,
        setActivateNode,
        loadGraphData,
        setActivateFunction,
        changeActivate,
    }
}

export default useNetwork