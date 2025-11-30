import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use relative path so Vite proxy forwards requests to backend
const baseUrl = "/api";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  tagTypes: ['SolarUnit', 'EnergyRecord', 'User'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl, 
    prepareHeaders: async (headers) => {
      const clerk = window.Clerk;
      if (clerk) {
        const token = await clerk.session.getToken();
        console.log(token);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    } 
  }),
  endpoints: (build) => ({
    getEnergyGenerationRecordsBySolarUnitId: build.query({
      query: (id) => `/energy-generation-records/solar-unit/${id}`,
      providesTags: ['EnergyRecord'],
    }),
    // Supports object input with optional grouping
    getEnergyGenerationRecordsBySolarUnit: build.query({
      query: ({ id, groupBy, limit } = {}) => {
        const qs = groupBy ? `?groupBy=${encodeURIComponent(groupBy)}&limit=${encodeURIComponent(limit)}` : '';
        return `/energy-generation-records/solar-unit/${id}${qs}`;
      },
      providesTags: ['EnergyRecord'],
    }),
    getSolarUnitByClerkUserId: build.query({
      query: (clerkUserId) => `/solar-units/users/${clerkUserId}`,
      providesTags: ['SolarUnit'],
    }),
    // Get solar unit for authenticated user
    getSolarUnitForUser: build.query({
      query: () => `/solar-units/user/me`,
      providesTags: ['SolarUnit'],
    }),
    getSolarUnits: build.query({
      query: () => `/solar-units`,
      providesTags: ['SolarUnit'],
    }),
    getSolarUnitById: build.query({
      query: (id) => `/solar-units/${id}`,
      providesTags: ['SolarUnit'],
    }),
    createSolarUnit: build.mutation({
      query: (data) => ({
        url: `/solar-units`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['SolarUnit'],
    }),
    editSolarUnit: build.mutation({
      query: ({id, data}) => ({
        url: `/solar-units/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['SolarUnit'],
    }),
    getAllUsers: build.query({
      query: () => `/users`,
      providesTags: ['User'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useGetAllUsersQuery, 
  useGetEnergyGenerationRecordsBySolarUnitIdQuery,
  useGetEnergyGenerationRecordsBySolarUnitQuery, 
  useGetSolarUnitByClerkUserIdQuery,
  useGetSolarUnitForUserQuery, 
  useGetSolarUnitsQuery, 
  useGetSolarUnitByIdQuery, 
  useCreateSolarUnitMutation, 
  useEditSolarUnitMutation 
} = api;