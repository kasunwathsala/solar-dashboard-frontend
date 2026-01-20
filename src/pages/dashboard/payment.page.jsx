import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Loader2, Receipt } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { useGetInvoiceByIdQuery } from "@/lib/redux/query";

export default function PaymentPage() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useGetInvoiceByIdQuery(invoiceId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Receipt className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The invoice you're trying to pay could not be found.
          </p>
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Invoices
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Secure payment powered by Stripe
          </p>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Summary
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {invoice.invoiceNumber}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Billing Period:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {new Date(invoice.billingPeriod.startDate).toLocaleDateString()} -{" "}
                {new Date(invoice.billingPeriod.endDate).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Energy Generated:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {invoice.energyGenerated.toFixed(2)} kWh
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Rate per kWh:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                ${(invoice.ratePerKwh / 100).toFixed(2)}
              </span>
            </div>
            
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${(invoice.totalAmount / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <CheckoutForm invoiceId={invoiceId} />
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Your payment information is securely processed by Stripe</p>
        </div>
      </div>
    </div>
  );
}
