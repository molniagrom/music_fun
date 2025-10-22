import { useForm, type SubmitHandler } from "react-hook-form"
import { useDeletePlaylistMutation, useFetchPlaylistsQuery, useUpdatePlaylistMutation } from "../../api/playlistApi"
import { CreatePlaylistForm } from "../CreatePlaylistForm/CreatePlaylistForm"
import s from "./PlaylistsPage.module.css"
import type { UpdatePlaylistArgs } from "../../api/playlistsApi.types"

export const PlaylistsPage = () => {
  const { register, handleSubmit } = useForm<UpdatePlaylistArgs>()

  const { data } = useFetchPlaylistsQuery()
  const [deletePlaylist] = useDeletePlaylistMutation()
  const [updatePlaylist] = useUpdatePlaylistMutation()

  const onClickHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  const onDoubleClickHandler = (id: string) => {
    updatePlaylist({
      playlistId: id,
      body: {
        title: "пффпфпфп",
        description: "ннннннннннн",
        tagIds: []
      }
    })
  }

  const editPlaylistHandler = (arg: null) => {
    //
  }

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = data => {
    // createPlaylist(data).unwrap().then(() => reset())
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map(playlist => {
          return (
            <div className={s.item} key={playlist.id}>

              <form onSubmit={handleSubmit(onSubmit)}>
                <h2>Edit playlist</h2>
                <div>
                  <input {...register('title')} placeholder={'title'} />
                </div>
                <div>
                  <input {...register('description')} placeholder={'description'} />
                </div>
                <button type={'submit'}>save</button>
                <button type={'button'} onClick={() => editPlaylistHandler(null)}>
                  cancel
                </button>
              </form>


              <div>
                <div>title: {playlist.attributes.title}</div>
                <div>description: {playlist.attributes.description}</div>
                <div>userName: {playlist.attributes.user.name}</div>
                <button onClick={() => onClickHandler(playlist.id)}>delete</button>
                <button onClick={() => onDoubleClickHandler(playlist.id)}>delete</button>
              </div>



            </div>
          )
        })}
      </div>
    </div>
  )
}