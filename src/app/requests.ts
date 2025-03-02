import { BattleData, CardQueryCondition, GameData, PlayerData, PopulatedCardData, UserData } from "@data/types";
import { getAuthToken } from "@lib/auth/getAuthToken";
import axios from "axios";

// Users //

export const fetchUserById = async (id: string | number) => {
    const response: {data:{userData:UserData}}|null = id?await axios.get(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    }):null;
    return response;
}

export const fetchAllUsers = async () => {
    const response = await axios.get(`/api/users`, { 
        headers: { Authorization: `Bearer ${getAuthToken()}` }, 
    });
    return response;
}

// Lobbies //

export const fetchLobbyById = async (id: string | number) => {
    const response = await axios.get(`/api/lobby/${id}`, { 
        headers: { Authorization: `Bearer ${getAuthToken()}` } 
    });
    return response;
}

export const updateLobbyById = async (id: string | number, action, data={}) => {
    const response = await axios.post(
        `/api/lobby/${id}`, {
            action,
            data,
        }, { 
            headers: { Authorization: `Bearer ${getAuthToken()}` } 
        },
    );
    return response;
}

export const fetchAllLobbies = async () => {
    const response = await axios.get(`/api/lobby`, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const createNewLobby = async (name: string) => {
    const response = await axios.post(`/api/lobby`, {
        action: 'create',
        name,
      }, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const joinLobbyById = async (id: string | number) => {
    const response = await axios.post(`/api/lobby/${id}`, {
        action: 'join',
      }, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const userLeaveLobby = async () => {
    const response = await axios.post(`/api/lobby`, {
        action: 'leave',
    }, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const deleteLobbyById = async (id: string | number) => {
    const response = await axios.delete(`/api/lobby/${id}`, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const deleteAllLobbies = async () => {
    const response = await axios.post("/api/lobby", { action: "deleteAll" }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response;
}

// Games //

export const fetchGameById = async (id: string | number) => {
    const response: {data:{game:GameData}} = await axios.get(`/api/game/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
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

export const fetchAllGames = async () => {
    const response = await axios.get(`/api/game`, { 
        headers: {Authorization: `Bearer ${getAuthToken()}`}, 
    });
    return response;
}

export const deleteAllGames = async () => {
    const response = await axios.delete("/api/game", {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
    });
    return response;
}

// Players //

export const fetchPlayerById = async (id: string | number) => {
    const response: {data:{player:PlayerData}} = await axios.get(`/api/player/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response;
}

// Battles //

export const fetchBattleById = async (id: string | number) => {
    const response: {data:{battle:BattleData}} = await axios.get(`/api/battle/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response;
}

export const updateBattleById = async (id: string | number, action, data) => {
    const response = await axios.put(`/api/battle/${id}`, {
        action,
        data,
    }, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },  
    });
    return response;
}

// Cards //

export const fetchCardsByCondition = async (condition: CardQueryCondition) => {
    const response: {data:{cards:PopulatedCardData[]}} = await axios.get(`/api/card`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
        params: {
            ...condition,
        }
    });
    return response;
}
