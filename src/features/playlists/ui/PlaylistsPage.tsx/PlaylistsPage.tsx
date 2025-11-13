import { Pagination } from '@/common/components'
import { useDebounceValue } from '@/common/hooks'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { type ChangeEvent, useState } from 'react'
import { useFetchPlaylistsQuery } from '../../api/playlistApi'
import { PlaylistList } from '../PlaylistsList/PlaylistsList'
import s from './PlaylistsPage.module.css'

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(2)

  const debounceSearch = useDebounceValue(search)
  const { data, isLoading } = useFetchPlaylistsQuery({ search: debounceSearch, pageNumber: currentPage, pageSize })

  // useEffect(() => {
  //   if (error) {
  //     if ("status" in error) {
  //       debugger
  //       const errMsg = 'error' in error
  //         ? error.error
  //         : ((error.data as { error: string }).error) || ((error.data as { message: string }).message) || "Some error ocured"
  //       toast(errMsg, { type: "error", theme: "colored" })

  //     } else {
  //       const errMsg = error.message || "Some error ocured"
  //       toast(errMsg, { type: "error", theme: "colored" })
  //     }
  //   }
  // }, [error])


  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  if (isLoading) {
    return <h1>Skeleton loader ...</h1>
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search" placeholder="Search playlist by title" onChange={(e) => searchPlaylistHandler(e)} />
      <PlaylistList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        changePageSize={changePageSizeHandler}
      />
    </div>
  )
}