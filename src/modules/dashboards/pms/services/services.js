import api from "../../../../config/axiosConfig";


export const getProjectStatistics = async () => {
    try {
        const response = await api.get('/pms/projects/statistics/');
      
        console.log(response)
        return response?.data?.data;
    } catch (error) {
        
        console.log('Failed to fetch project statistics.');
    }
};
