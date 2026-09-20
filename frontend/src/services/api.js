import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export async function createPaste(data) {
    const response = await api.post("/pastes", data);
    return response.data;
}

export async function getPaste(id) {
    const response = await api.get(`/pastes/${id}`);
    return response.data;
}

export async function deletePaste(id) {
    const response = await api.delete(`/pastes/${id}`);
    return response.data;
}

export async function getRawPaste(id) {
    const response = await api.get(`/pastes/${id}/raw`);
    return response.data;
}

export default api;