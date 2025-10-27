// https://musicfun.it-incubator.app/api/1.0/

import { baseApi } from "@/app/api/baseApi";
import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from "./playlistsApi.types";

export const playlistApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => ({ url: `/playlists` }),
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

    updatePlaylist: build.mutation<void, {playlistId: string, body: UpdatePlaylistArgs}>({
      query: ({playlistId, body}) => ({
        method: "put",
        url: `/playlists/${playlistId}`,
        body
      }),
      invalidatesTags: ['Playlist'],
    }),

  }),
})

export const { useFetchPlaylistsQuery, useCreatePlaylistMutation, useDeletePlaylistMutation, useUpdatePlaylistMutation } = playlistApi