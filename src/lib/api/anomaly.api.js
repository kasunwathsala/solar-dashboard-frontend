import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const anomalyApi = createApi({
  reducerPath: "anomalyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/anomalies`,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Anomalies", "AnomalyStats"],
  endpoints: (builder) => ({
    // Get user's anomalies
    getUserAnomalies: builder.query({
      query: ({ type, severity, status, startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (severity) params.append("severity", severity);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return `?${params.toString()}`;
      },
      providesTags: ["Anomalies"],
    }),

    // Get anomaly stats
    getAnomalyStats: builder.query({
      query: () => "/stats",
      providesTags: ["AnomalyStats"],
    }),

    // Get specific anomaly
    getAnomalyById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Anomalies", id }],
    }),

    // Acknowledge anomaly
    acknowledgeAnomaly: builder.mutation({
      query: (id) => ({
        url: `/${id}/acknowledge`,
        method: "PATCH",
      }),
      invalidatesTags: ["Anomalies", "AnomalyStats"],
    }),

    // Resolve anomaly
    resolveAnomaly: builder.mutation({
      query: ({ id, resolutionNotes }) => ({
        url: `/${id}/resolve`,
        method: "PATCH",
        body: { resolutionNotes },
      }),
      invalidatesTags: ["Anomalies", "AnomalyStats"],
    }),

    // Mark as false positive
    markAsFalsePositive: builder.mutation({
      query: ({ id, notes }) => ({
        url: `/${id}/false-positive`,
        method: "PATCH",
        body: { notes },
      }),
      invalidatesTags: ["Anomalies", "AnomalyStats"],
    }),

    // Trigger manual detection
    triggerDetection: builder.mutation({
      query: () => ({
        url: "/detect",
        method: "POST",
      }),
      invalidatesTags: ["Anomalies", "AnomalyStats"],
    }),

    // Admin: Get all anomalies
    getAllAnomalies: builder.query({
      query: ({ type, severity, status, startDate, endDate, limit } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append("type", type);
        if (severity) params.append("severity", severity);
        if (status) params.append("status", status);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (limit) params.append("limit", limit.toString());
        return `/admin/all?${params.toString()}`;
      },
      providesTags: ["Anomalies"],
    }),

    // Admin: Get system summary
    getAnomalySummary: builder.query({
      query: () => "/admin/summary",
      providesTags: ["AnomalyStats"],
    }),

    // Admin: Trigger system-wide detection
    triggerSystemWideDetection: builder.mutation({
      query: () => ({
        url: "/admin/detect",
        method: "POST",
      }),
      invalidatesTags: ["Anomalies", "AnomalyStats"],
    }),
  }),
});

export const {
  useGetUserAnomaliesQuery,
  useGetAnomalyStatsQuery,
  useGetAnomalyByIdQuery,
  useAcknowledgeAnomalyMutation,
  useResolveAnomalyMutation,
  useMarkAsFalsePositiveMutation,
  useTriggerDetectionMutation,
  useGetAllAnomaliesQuery,
  useGetAnomalySummaryQuery,
  useTriggerSystemWideDetectionMutation,
} = anomalyApi;
