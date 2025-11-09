import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
});

export const loginUser = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};
export const loginWithGoogleToken = async (token: string) => {
  const { data } = await api.post('/auth/google', { token });
  return data;
};
export const registerUser = async (email: string, fullName: string, password: string) => {
  const {data} = await api.post('/auth/register', {email, fullName, password});
  return data;
};