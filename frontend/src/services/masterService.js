import api from "./api";

const getAll = (url) => api.get(url);

const getById = (url, id) => api.get(`${url}/${id}`);

const create = (url, data) => api.post(url, data);

const update = (url, id, data) => api.put(`${url}/${id}`, data);

const remove = (url, id) => api.delete(`${url}/${id}`);

export default {

    getAll,

    getById,

    create,

    update,

    remove

};