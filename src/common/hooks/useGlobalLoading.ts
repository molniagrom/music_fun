import type { RootState } from '@/app/model/store.ts'
import { playlistApi } from '@/features/playlists/api/playlistApi'
import { tracksApi } from '@/features/tracks/api/tracksApi'
import { useSelector } from 'react-redux'

const excludedEndpoints = [
    playlistApi.endpoints.fetchPlaylists.name,
    tracksApi.endpoints.fetchTracks.name,
]

export const useGlobalLoading = () => {
    return useSelector((state: RootState) => {

        // Get all active queries from the RTK Query API
        const queries = Object.values(state.baseApi.queries || {})
        const mutations = Object.values(state.baseApi.mutations || {})

        // Check if there are any active requests (status 'pending')
        const hasActiveQueries = queries.some(query => {
            if (query?.status !== 'pending') return

            if (excludedEndpoints.includes(query.endpointName)) {
                const completedQueries = queries.filter((q) => q?.status === 'fulfilled')
                return completedQueries.length > 0
            }
        })
        const hasActiveMutations = mutations.some(mutation => mutation?.status === 'pending')

        return hasActiveQueries || hasActiveMutations
    })
}