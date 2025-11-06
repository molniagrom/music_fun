import { useState } from "react"
import { EditPlaylistForm } from "../EditPlaylistForm/EditPlaylistForm"
import { PlaylistItem } from "../PlaylistItem/PlaylistItem"
import s from "./PlaylistsList.module.css"
import type { PlaylistData, UpdatePlaylistArgs } from "../../api/playlistsApi.types"
import { useForm } from "react-hook-form"
import { useDeletePlaylistMutation } from "../../api/playlistApi"

type Props = {
    playlists: PlaylistData[]
    isPlaylistsLoading: boolean
}

export const PlaylistList = ({isPlaylistsLoading, playlists}: Props) => {
    const [playlistId, setPlaylistId] = useState<string | null>(null)
    const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()
  
    const [deletePlaylist] = useDeletePlaylistMutation()
  
    const deletePlaylistHandler = (playlistId: string) => {
      if (confirm('Are you sure you want to delete the playlist?')) {
        deletePlaylist(playlistId)
      }
    }
  
    const editPlaylistHandler = (playlist: PlaylistData | null) => {
      if (playlist) {
        setPlaylistId(playlist.id)
        reset({
          title: playlist.attributes.title,
          description: playlist.attributes.description,
          tagIds: playlist.attributes.tags.map((tag) => tag.id),
        })
      } else {
        setPlaylistId(null)
      }
    }
    
    return (
        <div className={s.items}>
            {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
            {playlists.map((playlist) => {
                const isEditing = playlist.id === playlistId

                return (
                    <div className={s.item} key={playlist.id}>
                        {isEditing ? (
                            <EditPlaylistForm
                                playlistId={playlistId}
                                setPlaylistId={setPlaylistId}
                                editPlaylist={editPlaylistHandler}
                                register={register}
                                handleSubmit={handleSubmit}
                            />
                        ) : (
                            <PlaylistItem
                                playlist={playlist}
                                deletePlaylistHandler={deletePlaylistHandler}
                                editPlaylistHandler={editPlaylistHandler}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}