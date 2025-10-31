import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Use relative `/api` so Vite dev server proxy forwards requests to the backend
const baseUrl = "/api";
// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnitId: build.query({
      query: (id) => `/energy-generation-records/solar-unit/${id}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEnergyGenerationRecordsBySolarUnitIdQuery } = Api