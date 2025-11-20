// https://musicfun.it-incubator.app/api/1.0/

import { baseApi } from "@/app/api/baseApi";
import type { Cover, Images } from "@/common/types/types";
import { errorToast } from "@/common/utils";
import { playlistCreateResponseSchema, playlistsResponseSchema } from "../model/playlists.schemas";
import type { CreatePlaylistArgs, FetchPlaylistsArgs, PlaylistData, UpdatePlaylistArgs } from "./playlistsApi.types";
import { imagesSchema } from "@/common/schemas";

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: `/playlists`, params }),
      responseSchema: playlistsResponseSchema,
      catchSchemaFailure: (error) => {
        errorToast("Zod error, details in the console", error.issues)
        return {
          status: 'CUSTOM_ERROR',
          error: 'Schema validation failed ',
        }
      },
      providesTags: ["Playlist"],
    }),

    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        method: "post",
        url: `/playlists`,
        body
      }),
      responseSchema: playlistCreateResponseSchema,
      catchSchemaFailure: (error) => {
        errorToast("Zod error, details in the console", error.issues)
        return {
          status: 'CUSTOM_ERROR',
          error: 'Schema validation failed ',
        }
      },
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
      responseSchema: imagesSchema,
      catchSchemaFailure: (error) => {
        errorToast("Zod error, details in the console", error.issues)
        return {
          status: 'CUSTOM_ERROR',
          error: 'Schema validation failed ',
        }
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
