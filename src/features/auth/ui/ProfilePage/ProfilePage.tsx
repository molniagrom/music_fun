import { PlaylistList } from "@/features/playlists/ui/PlaylistsList/PlaylistsList"
import { useGetMeQuery } from "../../api/authApi"
import { useFetchPlaylistsQuery } from "@/features/playlists/api/playlistApi"

export const ProfilePage = () => {
  const { data: meResponce } = useGetMeQuery()

  const { data: playlistsResponce, isLoading } = useFetchPlaylistsQuery({userId: meResponce?.userId})

  return (
    <div>
      <h1>{meResponce?.login} page</h1>
      <PlaylistList isPlaylistsLoading={isLoading} playlists={playlistsResponce?.data || []} />
    </div>
  )
}