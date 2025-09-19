import React, { useEffect, useState } from 'react';
import { Button, List, Typography, Spin, Alert } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import usePlaylistStore, { Playlist } from '../controlState/playlistStore.tsx'; // Certifique-se de que o caminho está correto

const { Title } = Typography;

// Tipagem para a mídia da playlist
interface Media {
  id: string;
  name: string;
  url: string; // URL local da imagem
}

const PlaylistsPage = () => {
  // Estado local para a visualização
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [isViewingMedia, setIsViewingMedia] = useState<boolean>(false);

  // Acessa o estado e a ação da store Zustand
  const { playlistList, loading, error, fetchPlaylists } = usePlaylistStore();

  // Usa useEffect para buscar as playlists quando o componente for montado
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]); // Adicione fetchPlaylists como dependência

  // Função para lidar com o clique na playlist
  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentMediaIndex(0);
    setIsViewingMedia(true);
  };

  // Função para ir para a próxima imagem
  const handleNextMedia = () => {
    if (selectedPlaylist && selectedPlaylist.media) { // Verifique se selectedPlaylist.media existe
      const nextIndex = currentMediaIndex + 1;
      if (nextIndex < selectedPlaylist.media.length) {
        setCurrentMediaIndex(nextIndex);
      } else {
        setIsViewingMedia(false);
      }
    }
  };

  // Renderização condicional para a visualização de mídia em tela cheia
  if (isViewingMedia && selectedPlaylist) {
    const currentMedia = selectedPlaylist.media?.[currentMediaIndex];
    if (!currentMedia) {
      return <Alert message="Mídia não encontrada" type="error" />;
    }
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          flexDirection: 'column',
        }}
      >
        <img
          src={currentMedia.url}
          alt={currentMedia.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
        <Button
          type="primary"
          onClick={handleNextMedia}
          style={{ position: 'absolute', bottom: '20px' }}
        >
          Próxima Imagem
        </Button>
      </div>
    );
  }

  // Renderização da lista de playlists
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Carregando playlists...</p>
      </div>
    );
  }

  if (error) {
    return <Alert message="Erro ao carregar playlists" description={error.message} type="error" showIcon />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Minhas Playlists</Title>
      <div style={{ maxWidth: 600, margin: 'auto' }}>
        <List
          bordered
          dataSource={playlistList}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => handleSelectPlaylist(item as Playlist)}>
                  Rodar
                </Button>,
              ]}
            >
              {item.playlistName}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default PlaylistsPage;