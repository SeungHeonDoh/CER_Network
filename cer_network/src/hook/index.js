import { useContext, useEffect } from 'react';
import { NetworkContext } from '../context';

const useNetwork = () => {
    const [ networkState, setNetworkState ] = useContext(NetworkContext);

    useEffect(() => {
        loadGraphData();
    }, [networkState.activated])

    function setActivateNode(node){
        setNetworkState((prev) => ({
            ...prev,
            activated: node,
        }))
    }

    async function loadGraphData(){
        const nodes = await require('../data/node_v0.1.json');
        const links = await require('../data/link_v0.1.json');
        setNetworkState((prev) => ({
            ...prev,
            data: {
                nodes,
                links
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