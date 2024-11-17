import { GameData, UserDataType } from "@data/types";
import { getAuthToken } from "@lib/auth/getAuthToken";
import axios from "axios";

export const fetchGameById = async (id: string | number) => {
    const response: {data:{game:GameData}} = await axios.get(`/api/game/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response;
}

export const fetchUserById = async (id: string | number) => {
    const response: {data:{userData:UserDataType}}|null = id?await axios.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    }):null;
    return response;
}

export const updateGameById = async (id: string | number, action, data) => {
    const response = await axios.put(`/api/game/${id}`, {
        action,
        data,
    }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },  
    });
    return response;
}

export const deleteAllLobbies = async () => {
    const response = await axios.post("/api/lobby", { action: "deleteAll" }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response;
}

export const deleteAllGames = async () => {
    const response = await axios.delete("/api/game", {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response;
}