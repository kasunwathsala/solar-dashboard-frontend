import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Auto-redirect to invoices after 5 seconds
    const timer = setTimeout(() => {
      navigate("/dashboard/invoices");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 max-w-lg text-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
        
        <p className="text-lg text-muted-foreground mb-6">
          Thank you for your payment. Your invoice has been marked as paid.
        </p>
        
        {sessionId && (
          <p className="text-sm text-muted-foreground mb-6">
            Payment ID: {sessionId}
          </p>
        )}
        
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            View All Invoices
          </button>
          
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-foreground rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-6">
          Redirecting to invoices page in 5 seconds...
        </p>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
