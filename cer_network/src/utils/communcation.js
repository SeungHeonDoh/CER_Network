import data from '../utils/data';

const getGraphData = async (query) => {
    //fake async
    await new Promise(resolve => setTimeout(resolve, 2000));
    return data;
};

export default {
    getGraphData
};