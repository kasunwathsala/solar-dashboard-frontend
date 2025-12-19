import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use relative path so Vite proxy forwards requests to backend
const baseUrl = "/api";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  tagTypes: ['SolarUnit', 'EnergyRecord', 'User'],
  baseQuery: fetchBaseQuery({ 
    baseUrl: baseUrl, 
    prepareHeaders: async (headers, { getState }) => {
      try {
        // Wait for Clerk to load if not loaded yet
        if (typeof window !== 'undefined') {
          // Check if Clerk is available
          if (window.Clerk && window.Clerk.loaded) {
            const session = window.Clerk.session;
            if (session) {
              const token = await session.getToken();
              console.log("✅ Auth token obtained successfully:", token ? "Token received" : "No token");
              if (token) {
                headers.set("Authorization", `Bearer ${token}`);
              }
            } else {
              console.warn("⚠️ No active Clerk session - user not signed in");
            }
          } else {
            console.warn("⚠️ Clerk not loaded yet - waiting for initialization");
            // Try to wait a bit for Clerk to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (window.Clerk && window.Clerk.session) {
              const token = await window.Clerk.session.getToken();
              if (token) {
                headers.set("Authorization", `Bearer ${token}`);
                console.log("✅ Auth token obtained after waiting");
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ Error getting auth token:", error);
      }
      
      // Always set content type
      headers.set("Content-Type", "application/json");
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
        // Map frontend groupBy values to backend expected values
        const mappedGroupBy = groupBy === 'date' ? 'daily' : groupBy;
        const qs = mappedGroupBy ? `?groupBy=${encodeURIComponent(mappedGroupBy)}&limit=${encodeURIComponent(limit)}` : '';
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
    deleteSolarUnit: build.mutation({
      query: (id) => ({
        url: `/solar-units/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['SolarUnit'],
    }),
    getAllUsers: build.query({
      query: () => `/users`,
      providesTags: ['User'],
    }),
    getWeather: build.query({
      query: ({ lat, lon }) => `/weather?lat=${lat}&lon=${lon}`,
    }),
    getCapacityFactor: build.query({
      query: ({ solarUnitId, days = 7 }) => `/metrics/capacity-factor/solar-unit/${solarUnitId}?days=${days}`,
      providesTags: ['EnergyRecord'],
    }),
    getPeakHours: build.query({
      query: ({ solarUnitId, days = 30 }) => `/metrics/peak-hours/solar-unit/${solarUnitId}?days=${days}`,
      providesTags: ['EnergyRecord'],
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
  useEditSolarUnitMutation,
  useDeleteSolarUnitMutation,
  useGetWeatherQuery,
  useGetCapacityFactorQuery,
  useGetPeakHoursQuery
} = api;