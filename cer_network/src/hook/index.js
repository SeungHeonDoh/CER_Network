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

    function changeActivate(id){
        for(var i=0; i<networkState.data.nodes.length; i++){
            var node = networkState.data.nodes[i];
            if(node.id === id){
                networkState.activateFunction(node)
                return
            }
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