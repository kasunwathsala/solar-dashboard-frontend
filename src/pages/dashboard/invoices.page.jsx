import { useState } from "react";
import { useNavigate } from "react-router";
import { useGetUserInvoicesQuery } from "@/lib/redux/query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, DollarSign, Calendar, CreditCard, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { data: invoices, isLoading, isError } = useGetUserInvoicesQuery({ status: statusFilter });

  const handlePayInvoice = (invoiceId) => {
    navigate(`/dashboard/invoices/payment/${invoiceId}`);
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
    totalPaid: invoices
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
            <h1 className="text-3xl font-bold text-foreground">My Invoices</h1>
            <p className="text-sm text-muted-foreground">View and pay your solar energy bills</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground mb-2">Total Invoices</p>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </Card>
        <Card className="p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400 mb-2">Paid</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">{stats.paid}</p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">{formatAmount(stats.totalPaid)}</p>
        </Card>
        <Card className="p-5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">{formatAmount(stats.totalPending)}</p>
        </Card>
        <Card className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">Total Paid</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{formatAmount(stats.totalPaid)}</p>
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
              ? "You don't have any invoices yet."
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
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Billing Period</p>
                      <p className="font-medium text-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(invoice.billingPeriod.startDate)} - {formatDate(invoice.billingPeriod.endDate)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Energy Generated</p>
                      <p className="font-bold text-foreground">{invoice.energyGenerated.toFixed(2)} kWh</p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Rate</p>
                      <p className="font-medium text-foreground">${(invoice.ratePerKwh / 100).toFixed(2)} / kWh</p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Amount</p>
                      <p className="text-2xl font-bold text-primary flex items-center gap-1">
                        <DollarSign className="w-5 h-5" />
                        {formatAmount(invoice.totalAmount)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-muted-foreground">
                    <span>Due Date: {formatDate(invoice.dueDate)}</span>
                    {invoice.paidAt && (
                      <span className="ml-4">Paid: {formatDate(invoice.paidAt)}</span>
                    )}
                  </div>
                </div>
                
                {(invoice.status === "PENDING" || invoice.status === "OVERDUE") && (
                  <div className="ml-6">
                    <button
                      onClick={() => handlePayInvoice(invoice._id)}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                    >
                      <CreditCard className="w-5 h-5" />
                      Pay Now
                    </button>
                  </div>
                )}
                
                {invoice.status === "PAID" && (
                  <div className="ml-6">
                    <div className="px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Paid
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;
