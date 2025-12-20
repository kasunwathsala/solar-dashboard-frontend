import { useState } from "react";
import {
  useGetUserAnomaliesQuery,
  useGetAnomalyStatsQuery,
  useAcknowledgeAnomalyMutation,
  useResolveAnomalyMutation,
  useMarkAsFalsePositiveMutation,
  useTriggerDetectionMutation,
} from "../../lib/api/anomaly.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Skeleton } from "../../components/ui/skeleton";
import { AnomalyCharts } from "../../components/AnomalyCharts";
import { 
  AlertTriangle, 
  TrendingDown, 
  BarChart, 
  RefreshCw, 
  XCircle,
  CheckCircle,
  Eye,
  AlertCircle,
  Play
} from "lucide-react";

const anomalyTypeIcons = {
  ZERO_GENERATION: AlertTriangle,
  SUDDEN_DROP: TrendingDown,
  CAPACITY_FACTOR: BarChart,
  IRREGULAR_PATTERN: RefreshCw,
  MISSING_DATA: XCircle,
};

const severityColors = {
  CRITICAL: "destructive",
  WARNING: "warning",
  INFO: "secondary",
};

const severityBgColors = {
  CRITICAL: "bg-red-50 border-red-200",
  WARNING: "bg-yellow-50 border-yellow-200",
  INFO: "bg-blue-50 border-blue-200",
};

const AnomaliesPage = () => {
  const [filters, setFilters] = useState({
    type: "",
    severity: "",
    status: "",
  });

  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

  // API queries and mutations
  const { data: anomalies = [], isLoading, error, refetch } = useGetUserAnomaliesQuery(filters);
  const { data: stats } = useGetAnomalyStatsQuery();
  const [acknowledgeAnomaly] = useAcknowledgeAnomalyMutation();
  const [resolveAnomaly] = useResolveAnomalyMutation();
  const [markAsFalsePositive] = useMarkAsFalsePositiveMutation();
  const [triggerDetection, { isLoading: isDetecting }] = useTriggerDetectionMutation();

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeAnomaly(id).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to acknowledge anomaly:", error);
    }
  };

  const handleResolve = async () => {
    if (!selectedAnomaly) return;
    try {
      await resolveAnomaly({ id: selectedAnomaly._id, resolutionNotes }).unwrap();
      setIsResolveDialogOpen(false);
      setResolutionNotes("");
      setSelectedAnomaly(null);
      refetch();
    } catch (error) {
      console.error("Failed to resolve anomaly:", error);
    }
  };

  const handleFalsePositive = async (id) => {
    try {
      await markAsFalsePositive({ id, notes: "Marked as false positive by user" }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to mark as false positive:", error);
    }
  };

  const handleTriggerDetection = async () => {
    try {
      await triggerDetection().unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to trigger detection:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load anomalies. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Anomaly Detection</h1>
          <p className="text-muted-foreground">Monitor irregular patterns in your solar energy generation</p>
        </div>
        <Button onClick={handleTriggerDetection} disabled={isDetecting}>
          <Play className="mr-2 h-4 w-4" />
          {isDetecting ? "Detecting..." : "Run Detection"}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.critical}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.warning}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ZERO_GENERATION">Zero Generation</SelectItem>
              <SelectItem value="SUDDEN_DROP">Sudden Drop</SelectItem>
              <SelectItem value="CAPACITY_FACTOR">Capacity Factor</SelectItem>
              <SelectItem value="IRREGULAR_PATTERN">Irregular Pattern</SelectItem>
              <SelectItem value="MISSING_DATA">Missing Data</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.severity || "all"} onValueChange={(value) => handleFilterChange("severity", value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="FALSE_POSITIVE">False Positive</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Visualization Section */}
      {anomalies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <AnomalyCharts anomalies={anomalies} />
        </div>
      )}

      {/* Anomaly List */}
      <div className="space-y-4">
        {anomalies.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-lg">No anomalies detected</p>
                <p className="text-sm">Your solar system is performing normally</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          anomalies.map((anomaly) => {
            const Icon = anomalyTypeIcons[anomaly.type];
            return (
              <Card key={anomaly._id} className={`${severityBgColors[anomaly.severity]} border-l-4`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">
                            {anomaly.type.replace(/_/g, " ")}
                          </CardTitle>
                          <Badge variant={severityColors[anomaly.severity]}>
                            {anomaly.severity}
                          </Badge>
                          <Badge variant="outline">{anomaly.status}</Badge>
                        </div>
                        <CardDescription>{anomaly.description}</CardDescription>
                        <div className="text-xs text-muted-foreground mt-2">
                          <div>Detected: {formatDate(anomaly.detectedAt)}</div>
                          <div>
                            Affected Period: {formatDate(anomaly.affectedPeriod.start)} →{" "}
                            {formatDate(anomaly.affectedPeriod.end)}
                          </div>
                          {anomaly.solarUnit && (
                            <div>Solar Unit: {anomaly.solarUnit.name || anomaly.solarUnit.serialNumber}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{anomaly.type.replace(/_/g, " ")}</DialogTitle>
                            <DialogDescription>{anomaly.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Details</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {anomaly.details.expectedValue !== undefined && (
                                  <>
                                    <div className="text-muted-foreground">Expected Value:</div>
                                    <div>{anomaly.details.expectedValue} kWh</div>
                                  </>
                                )}
                                {anomaly.details.actualValue !== undefined && (
                                  <>
                                    <div className="text-muted-foreground">Actual Value:</div>
                                    <div>{anomaly.details.actualValue} kWh</div>
                                  </>
                                )}
                                {anomaly.details.dropPercent !== undefined && (
                                  <>
                                    <div className="text-muted-foreground">Drop Percentage:</div>
                                    <div>{anomaly.details.dropPercent}%</div>
                                  </>
                                )}
                                {anomaly.details.capacityFactor !== undefined && (
                                  <>
                                    <div className="text-muted-foreground">Capacity Factor:</div>
                                    <div>{anomaly.details.capacityFactor}%</div>
                                  </>
                                )}
                                {anomaly.details.gapDuration !== undefined && (
                                  <>
                                    <div className="text-muted-foreground">Gap Duration:</div>
                                    <div>{anomaly.details.gapDuration} hours</div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Confidence Level</h4>
                              <Badge>{anomaly.confidence}</Badge>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {anomaly.status === "OPEN" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcknowledge(anomaly._id)}
                          >
                            Acknowledge
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedAnomaly(anomaly);
                              setIsResolveDialogOpen(true);
                            }}
                          >
                            Resolve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFalsePositive(anomaly._id)}
                          >
                            False Positive
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>

      {/* Resolve Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Anomaly</DialogTitle>
            <DialogDescription>
              Add notes about how this issue was resolved (optional)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="E.g., Cleaned solar panels, replaced faulty sensor, etc."
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve}>Resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnomaliesPage;
