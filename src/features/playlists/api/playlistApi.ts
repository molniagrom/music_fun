// https://musicfun.it-incubator.app/api/1.0/

import { baseApi } from "@/app/api/baseApi";
import type { Images } from "@/common/types/types";
import type { CreatePlaylistArgs, FetchPlaylistsArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types";

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => ({ url: `/playlists`, params }),
      providesTags: ["Playlist"],
    }),

    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: "post",
        url: `/playlists`,
        body
      }),
      invalidatesTags: ['Playlist'],
    }),

    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        method: "delete",
        url: `/playlists/${playlistId}`,
      }),
      invalidatesTags: ['Playlist'],
    }),

    updatePlaylist: build.mutation<void, { playlistId: string, body: UpdatePlaylistArgs }>({
      onQueryStarted: async ({ body, playlistId }, { dispatch, queryFulfilled, getState }) => {

        const args = playlistApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchCollections: any[] = []

        args.forEach((arg) => {
          patchCollections.push(
            dispatch(
              playlistApi.util.updateQueryData(
                'fetchPlaylists',
                {
                  pageNumber: arg.pageNumber,
                  pageSize: arg.pageSize,
                  search: arg.search
                },
                (state) => {
                  console.log("2");
                  const index = state.data.findIndex(playlist => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                }),
            )

          )
        })

        try {
          await queryFulfilled
        } catch (e) {
          patchCollections.forEach((patchCollection) => {
            patchCollection.undo()
          })
        }

      },

      query: ({ playlistId, body }) => {
        return {
          method: "put",
          url: `/playlists/${playlistId}`,
          body
        }
      },

      invalidatesTags: ['Playlist'],
    }),

    uploadPlaylistCover: build.mutation<Images, { playlistId: string, file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)

        return ({ method: "post", url: `/playlists/${playlistId}/images/main`, body: formData })
      },
      invalidatesTags: ['Playlist'],
    }),

    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ method: "delete", url: `/playlists/${playlistId}/images/main` }),
      invalidatesTags: ['Playlist'],
    }),

  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation
} = playlistApi
