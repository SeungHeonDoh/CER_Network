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
        const nodes = await require('../data/node_v0.0.json');
        const links = await require('../data/link_v0.0.json');
        setNetworkState((prev) => ({
            ...prev,
            data: {
                nodes,
                links: links.filter((link)=>{
                    if(link.Type==='main'){
                        return link
                    }
                })
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