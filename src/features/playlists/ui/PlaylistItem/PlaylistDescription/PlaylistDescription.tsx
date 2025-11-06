import type { PlaylistAttributes } from "@/features/playlists/api/playlistsApi.types"

type PlaylistDescriptionType = {
    attributes: PlaylistAttributes
}

export const PlaylistDescription = ({attributes}: PlaylistDescriptionType) => {
    return (
        <>
            <div>title: {attributes.title}</div>
            <div>description: {attributes.description}</div>
            <div>userName: {attributes.user.name}</div>
        </>
    )
}