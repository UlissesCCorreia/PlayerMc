// src/api/playlistRoutes.ts
import axios, { AxiosResponse } from 'axios';

// Tipagem para uma playlist
export interface PlaylistItem {
  id?: number;
  name: string;
}

const BASE_URL = 'https://localhost:7008/api/Playlist';

// Buscar todas as playlists
export const getAllPlaylists = (): Promise<AxiosResponse<PlaylistItem[]>> =>
  axios.get(BASE_URL);