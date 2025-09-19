import { create } from 'zustand';
import * as playlistRoutes from '../routes/playlistRoutes.ts';

// Tipagem da playlist
export interface Playlist {
  playlistNumber: number;
  playlistName: string;
  active: boolean;
  message: string;
}

// Tipagem do estado e ações
interface PlaylistStoreState {
  playlistList: Playlist[];
  loading: boolean;
  error: Error | null;

  fetchPlaylists: () => Promise<void>;
}

const usePlaylistStore = create<PlaylistStoreState>((set) => ({
  playlistList: [],
  loading: false,
  error: null,

  fetchPlaylists: async () => {
    set({ loading: true });
    try {
      console.log('Buscando playlists...');
      const response = await playlistRoutes.getAllPlaylists();
      console.log('Playlists recebidas:', response.data);
      const playlists = response.data
        .map((item: any) => ({
          playlistNumber: item.playlistNumber,
          playlistName: item.playlistName,
          active: item.active,
          message: item.message,
        }));
      set({
        playlistList: playlists,
        error: null,
      });
      console.log('Playlists carregadas:', playlists);
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ loading: false });
    }
  },
}));

export default usePlaylistStore;