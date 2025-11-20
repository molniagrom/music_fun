import { PlaylistList } from "@/features/playlists/ui/PlaylistsList/PlaylistsList"
import { useGetMeQuery } from "../../api/authApi"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi"
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm"
import s from "./ProfilePage.module.css"
import { Navigate } from "react-router"
import { Path } from "@/common/routing"

export const ProfilePage = () => {
  const { data: meResponce, isLoading: isMeLoading } = useGetMeQuery()

  const { data: playlistsResponce, isLoading } = useFetchPlaylistsQuery({ userId: meResponce?.userId }, { skip: !meResponce?.userId })

  if (isLoading || isMeLoading) {
    return <h1>Skeleton loader ...</h1>
  }

  if (!isMeLoading && !meResponce) return <Navigate to={Path.Playlists} />

  return (
    <div>
      <h1>{meResponce?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList isPlaylistsLoading={isLoading || isMeLoading} playlists={playlistsResponce?.data || []} />
      </div>
    </div>
  )
}


