import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use environment variable when provided (useful when running built app or
// when backend is hosted remotely). Fall back to relative `/api` so Vite dev
// server proxy works during local development.
const envBackend = import.meta.env.VITE_BACKEND_URL;
const baseUrl = envBackend ? `${envBackend.replace(/\/$/, '')}/api` : "/api";

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  tagTypes: ['SolarUnit', 'EnergyRecord', 'User', 'Invoice'],
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
      if (typeof window !== 'undefined') {
        // Helpful debug log to confirm which baseUrl is being used
        // (Safe to leave in - can help during local troubleshooting)
        // eslint-disable-next-line no-console
        console.debug("API baseUrl:", baseUrl);
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
    getUserInvoices: build.query({
      query: ({ status } = {}) => {
        const qs = status && status !== 'ALL' ? `?status=${status}` : '';
        return `/invoices/user/me${qs}`;
      },
      providesTags: ['Invoice'],
    }),
    getAllInvoices: build.query({
      query: ({ status, userId } = {}) => {
        const params = new URLSearchParams();
        if (status && status !== 'ALL') params.append('status', status);
        if (userId) params.append('userId', userId);
        const qs = params.toString() ? `?${params.toString()}` : '';
        return `/invoices${qs}`;
      },
      providesTags: ['Invoice'],
    }),
    getInvoiceById: build.query({
      query: (id) => `/invoices/${id}`,
      providesTags: ['Invoice'],
    }),
    createCheckoutSession: build.mutation({
      query: (invoiceId) => ({
        url: `/invoices/create-checkout-session`,
        method: 'POST',
        body: { invoiceId },
      }),
    }),
    getSessionStatus: build.query({
      query: (sessionId) => `/invoices/session-status?session_id=${sessionId}`,
    }),
    generateInvoice: build.mutation({
      query: (data) => ({
        url: `/invoices/generate`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Invoice'],
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
  useGetPeakHoursQuery,
  useGetUserInvoicesQuery,
  useGetAllInvoicesQuery,
  useGetInvoiceByIdQuery,
  useCreateCheckoutSessionMutation,
  useGetSessionStatusQuery,
  useGenerateInvoiceMutation
} = api;