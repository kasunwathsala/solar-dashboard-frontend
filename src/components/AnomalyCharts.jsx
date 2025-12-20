import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

const COLORS = {
  CRITICAL: "#EF4444",
  WARNING: "#F59E0B",
  INFO: "#3B82F6",
  ZERO_GENERATION: "#DC2626",
  SUDDEN_DROP: "#EA580C",
  CAPACITY_FACTOR: "#CA8A04",
  IRREGULAR_PATTERN: "#7C3AED",
  MISSING_DATA: "#6366F1",
};

export const AnomalyCharts = ({ anomalies }) => {
  // Process data for charts
  const { severityData, typeData, timelineData } = useMemo(() => {
    if (!anomalies || anomalies.length === 0) {
      return { severityData: [], typeData: [], timelineData: [] };
    }

    // Severity distribution
    const severityCounts = anomalies.reduce((acc, a) => {
      acc[a.severity] = (acc[a.severity] || 0) + 1;
      return acc;
    }, {});

    const severityData = Object.entries(severityCounts).map(([name, value]) => ({
      name,
      value,
      fill: COLORS[name],
    }));

    // Type distribution
    const typeCounts = anomalies.reduce((acc, a) => {
      const typeName = a.type.replace(/_/g, " ");
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    const typeData = Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
    }));

    // Timeline data (last 7 days)
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split("T")[0];
    });

    const timelineCounts = last7Days.map((date) => {
      const dayAnomalies = anomalies.filter((a) => {
        const detectedDate = new Date(a.detectedAt).toISOString().split("T")[0];
        return detectedDate === date;
      });

      const critical = dayAnomalies.filter((a) => a.severity === "CRITICAL").length;
      const warning = dayAnomalies.filter((a) => a.severity === "WARNING").length;
      const info = dayAnomalies.filter((a) => a.severity === "INFO").length;

      return {
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        Critical: critical,
        Warning: warning,
        Info: info,
      };
    });

    return { severityData, typeData, timelineData: timelineCounts };
  }, [anomalies]);

  if (!anomalies || anomalies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No data available for visualization</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Timeline Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Anomaly Timeline (Last 7 Days)</CardTitle>
          <CardDescription>Daily anomaly detections by severity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Critical" fill={COLORS.CRITICAL} stackId="a" />
              <Bar dataKey="Warning" fill={COLORS.WARNING} stackId="a" />
              <Bar dataKey="Info" fill={COLORS.INFO} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Severity Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Severity Distribution</CardTitle>
          <CardDescription>Breakdown by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Types</CardTitle>
          <CardDescription>Distribution by anomaly type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
