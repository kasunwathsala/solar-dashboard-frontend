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
    // Supports object input with optional grouping
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({ id, groupBy, limit } = {}) => {
        const qs = groupBy ? `?groupBy=${encodeURIComponent(groupBy)}&limit=${encodeURIComponent(limit)}` : '';
        return `/energy-generation-records/solar-unit/${id}${qs}`;
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetEnergyGenerationRecordsBySolarUnitIdQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
} = Api