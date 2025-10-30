import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
import defaultCover from '@/app/assets/images/default-playlist-cover.png'
import s from './PlaylistItem.module.css'
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from '../../api/playlistApi'
import type { ChangeEvent } from 'react'


type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {

  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

  const originalCover = playlist.attributes.images.main.find(img => img.type === "original")
  const src = originalCover ? originalCover.url : defaultCover

  const uploadPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      alert("Only Jpeg Png or giff images are allowed")
      return
    }

    if (file.size > maxSize) {
      alert(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlaylistCover({ file, playlistId: playlist.id })
  }

  const deletePlaylistCoverHandler = () => deletePlaylistCover({ playlistId: playlist.id })


  return (
    <div>
      <img src={src} alt="cover" width={"240px"} className={s.cover} />
      <input accept={"image/jpeg,image/png,image/gif"} type="file" onChange={uploadPlaylistHandler} />
      {originalCover && <button onClick={deletePlaylistCoverHandler}>delete cover</button>}

      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylistHandler(playlist)}>update</button>
    </div>
  )
}