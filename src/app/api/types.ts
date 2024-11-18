import { GameData } from "@data/types";

export type UserType = {
    id: number;
    email: string;
    name?: string;
  }

export type ApiResponse = {
    message: string;
    data?: unknown;
    status: number;
  };

export interface LobbyType {
    id: number;
    name: string;
    started: boolean;
    players: UserType[];
    maxPlayers: number;
    host: number;
    game?: GameData
}