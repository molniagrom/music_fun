// https://musicfun.it-incubator.app/api/1.0/

import { baseApi } from "@/app/api/baseApi";
import { imagesSchema } from "@/common/schemas";
import type { Images } from "@/common/types/types";
import { playlistCreateResponseSchema, playlistsResponseSchema } from "../model/playlists.schemas";
import type { CreatePlaylistArgs, FetchPlaylistsArgs, PlaylistCreatedEvent, UpdatePlaylistArgs } from "./playlistsApi.types";
import { withZodCatch } from "@/common/utils";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "@/common/constants";
import { subscribeToEvent } from "@/common/socket";

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => {
        return {
          url: `/playlists`,
          params
        }
      },
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {

        await cacheDataLoaded // waiting for the playlist data to finish loading into the cache
        
       const unsubcribe = subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
          const newPlaylist = msg.payload.data
          updateCachedData((state) => {
            state.data.pop()
            state.data.unshift(newPlaylist)
            state.meta.totalCount = state.meta.totalCount + 1
            state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
          })
          // dispatch(playlistApi.util.invalidateTags(["Playlist"]))
        })

        await cacheEntryRemoved
        unsubcribe()
        // !

      },
      providesTags: ["Playlist"],
    }),

    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        method: "post",
        url: `/playlists`,
        body
      }),
      ...withZodCatch(playlistCreateResponseSchema),
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
      ...withZodCatch(imagesSchema),
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
