import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSolarUnitById } from '../api/Solar-Unit';

// Use relative `/api` so Vite dev server proxy forwards requests to the backend
const baseUrl = "/api";
// Define a service using a base URL and expected endpoints
export const Api = createApi({
  reducerPath: 'Api',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl, prepareHeaders: async (headers) => {
    const clerk = window.Clerk;
    if (clerk) {
      const token = await clerk.session.getToken();
      console.log(token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  } }),
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
    getSolarUnitByClerkUserId: build.query({
      query: (clerkUserId) => `/solar-units/users/${clerkUserId}`,
    }),
    // Get solar unit for authenticated user
    getSolarUnitForUser: build.query({
      query: () => `/solar-units/user/me`,
    }),
    getSolarUnits: build.query({
      query: () => `/solar-units`,
    }),
    getSolarUnitById: build.query({
      query: (id) => `/solar-units/${id}`,
    }),
    createSolarUnit: build.mutation({
      query: (data) => ({
        url: `/solar-units`,
        method: "POST",
        body: data,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetEnergyGenerationRecordsBySolarUnitIdQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery,
  useGetSolarUnitByClerkUserIdQuery,
  useGetSolarUnitForUserQuery,
  useGetSolarUnitsQuery,
  useGetSolarUnitByIdQuery,useCreateSolarUnitMutation
} = Api