// https://musicfun.it-incubator.app/api/1.0/

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types";

export const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      "API-KEY": import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: (headers) => {
      // debugger
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    }
  }),
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => ({ url: `/playlists` }),
    }),

    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: "post",
        url: `/playlists`,
        body
      }),
    }),

    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({
        method: "delete",
        url: `/playlists/${playlistId}`,
      }),
    }),

    updatePlaylist: build.mutation<void, {playlistId: string, body: UpdatePlaylistArgs}>({
      query: ({playlistId, body}) => ({
        method: "put",
        url: `/playlists/${playlistId}`,
        body
      }),
    }),

  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation } = playlistApi