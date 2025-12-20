import { useState } from "react";
import { useGetAllInvoicesQuery, useGenerateInvoiceMutation } from "@/lib/redux/query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, DollarSign, Calendar, AlertCircle, CheckCircle, Clock, XCircle, Plus } from "lucide-react";

const AdminInvoicesPage = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data: invoices, isLoading, isError } = useGetAllInvoicesQuery({ status: statusFilter });
  const [generateInvoice, { isLoading: isGenerating }] = useGenerateInvoiceMutation();
  
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [formData, setFormData] = useState({
    solarUnitId: "",
    startDate: "",
    endDate: "",
  });

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      await generateInvoice(formData).unwrap();
      alert("Invoice generated successfully!");
      setShowGenerateForm(false);
      setFormData({ solarUnitId: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { icon: Clock, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Pending" },
      PAID: { icon: CheckCircle, color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Paid" },
      OVERDUE: { icon: AlertCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Overdue" },
      FAILED: { icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Failed" },
    };
    const badge = badges[status] || badges.PENDING;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (cents) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-700 dark:text-red-300 font-semibold">Failed to load invoices</p>
        </div>
      </Card>
    );
  }

  const stats = {
    total: invoices.length,
    pending: invoices.filter(inv => inv.status === "PENDING" || inv.status === "OVERDUE").length,
    paid: invoices.filter(inv => inv.status === "PAID").length,
    totalRevenue: invoices
      .filter(inv => inv.status === "PAID")
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
    totalPending: invoices
      .filter(inv => inv.status === "PENDING" || inv.status === "OVERDUE")
      .reduce((sum, inv) => sum + inv.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Receipt className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Invoices (Admin)</h1>
            <p className="text-sm text-muted-foreground">Manage and view all user invoices</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* Generate Invoice Form */}
      {showGenerateForm && (
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4">Generate Manual Invoice</h3>
          <form onSubmit={handleGenerateInvoice} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Solar Unit ID</label>
              <input
                type="text"
                value={formData.solarUnitId}
                onChange={(e) => setFormData({ ...formData, solarUnitId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                placeholder="Enter solar unit ID"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isGenerating}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
              <button
                type="button"
                onClick={() => setShowGenerateForm(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-foreground rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground mb-2">Total Invoices</p>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </Card>
        <Card className="p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400 mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.paid}</p>
        </Card>
        <Card className="p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
        </Card>
        <Card className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatAmount(stats.totalRevenue)}</p>
        </Card>
        <Card className="p-5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <p className="text-sm text-orange-700 dark:text-orange-400 mb-2">Pending Revenue</p>
          <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{formatAmount(stats.totalPending)}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["ALL", "PENDING", "PAID", "OVERDUE", "FAILED"].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              statusFilter === filter
                ? "bg-white dark:bg-gray-700 text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Invoices List */}
      {invoices.length === 0 ? (
        <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No invoices found</h3>
          <p className="text-muted-foreground">
            {statusFilter === "ALL" 
              ? "No invoices have been generated yet."
              : `No ${statusFilter.toLowerCase()} invoices.`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-xl font-bold text-foreground">{invoice.invoiceNumber}</h3>
                    {getStatusBadge(invoice.status)}
                    <span className="text-sm text-muted-foreground">
                      User ID: {invoice.userId}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Solar Unit</p>
                      <p className="font-medium text-foreground">
                        {invoice.solarUnitId?.serialNumber || invoice.solarUnitId}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Billing Period</p>
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(invoice.billingPeriod.startDate)} - {formatDate(invoice.billingPeriod.endDate)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Energy</p>
                      <p className="font-bold text-foreground">{invoice.energyGenerated.toFixed(2)} kWh</p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Rate</p>
                      <p className="font-medium text-foreground">${(invoice.ratePerKwh / 100).toFixed(2)} / kWh</p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Amount</p>
                      <p className="text-xl font-bold text-primary flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {formatAmount(invoice.totalAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
                    <span>Due: {formatDate(invoice.dueDate)}</span>
                    {invoice.paidAt && (
                      <span className="ml-4">Paid: {formatDate(invoice.paidAt)}</span>
                    )}
                    <span className="ml-4">Created: {formatDate(invoice.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInvoicesPage;
