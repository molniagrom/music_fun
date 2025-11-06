import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
import { PlaylistCover } from './PlaylistCover/PlaylistCover'
import { PlaylistDescription } from './PlaylistDescription/PlaylistDescription'


type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {

  return (
    <div>
      <PlaylistCover images={playlist.attributes.images} playlistId={playlist.id} />
      <PlaylistDescription attributes={playlist.attributes}/>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  )
}