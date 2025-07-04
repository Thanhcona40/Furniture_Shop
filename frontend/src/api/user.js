import {api} from '../config/api';

export const fetchUsers = async () => {
  const res = await api.get('/user');
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/user/${id}`);
  return res.data;
};

export const fetchUserOrderStatusCount = async (userId) => {
  const res = await api.get(`/orders/user/${userId}/status-count`);
  return res.data;
}; 