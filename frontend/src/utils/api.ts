import axios from 'axios'

axios.defaults.withCredentials = true;

export const fetchData = async (endpoint : string) => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error : any) {
    console.error('Error fetching data:', error);
    return error.response.data
  }
};

export const postData = async (endpoint : string, data : any) => {
  try {
    const response = await axios.post(endpoint, data);
    return response.data;

  } catch (error : any) {
    console.error('Error posting data:', error);
    return error.response.data
  }
};

export const updateData = async (endpoint : string, data : any) => {
  try {
    const response = await axios.put(endpoint, data);
    return response.data;
  } catch (error : any) {
    console.error('Error updating data:', error);
    return error.response.data
  }
};

export const deleteData = async (endpoint : string) => {
  try {
    const response = await axios.delete(endpoint);
    return response.data;
  } catch (error : any) {
    console.error('Error deleting data:', error);
    return error.response.data
  }
};