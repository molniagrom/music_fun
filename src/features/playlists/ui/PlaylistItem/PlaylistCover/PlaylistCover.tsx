import type { Images } from "@/common/types/types"
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from "@/features/playlists/api/playlistApi"
import type { ChangeEvent } from "react"
import s from './PlaylistCover.module.css'
import defaultCover from '@/app/assets/images/default-playlist-cover.png'
import { Bounce, toast } from "react-toastify"

type Props = {
    playlistId: string
    images: Images
}

export const PlaylistCover = ({ images, playlistId }: Props) => {
    const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
    const [deletePlaylistCover] = useDeletePlaylistCoverMutation()

    const originalCover = images.main.find(img => img.type === "original")
    const src = originalCover ? originalCover.url : defaultCover

    const uploadPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const maxSize = 1024 * 1024
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']

        const file = e.target.files?.length && e.target.files[0]
        if (!file) return

        if (!allowedTypes.includes(file.type)) {
            toast.error(`Only Jpeg Png or giff images are allowed`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            
            // toast("Only Jpeg Png or giff images are allowed")
            return
        }

        if (file.size > maxSize) {
            // toast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)

            toast.error(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            return
        }

        uploadPlaylistCover({ file, playlistId })
    }

    const deletePlaylistCoverHandler = () => deletePlaylistCover({ playlistId })


    return (
        <>
            <img src={src} alt="cover" width={"240px"} className={s.cover} />
            <input accept={"image/jpeg,image/png,image/gif"} type="file" onChange={uploadPlaylistHandler} />
            {originalCover && <button onClick={deletePlaylistCoverHandler}>delete cover</button>}
        </>
    )
}
