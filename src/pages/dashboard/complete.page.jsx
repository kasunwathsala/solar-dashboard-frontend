import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CheckCircle, XCircle, Loader2, ArrowRight, Home } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

export default function CompletePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [countdown, setCountdown] = useState(5);
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchSessionStatus = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        
        if (!token) {
          throw new Error("Authentication token not available");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/invoices/session-status?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        
        if (!response.ok) {
          // Try to get error message from response
          let errorMessage = "Failed to fetch session status";
          
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } else {
            // Got HTML instead of JSON (possibly error page or redirect)
            const textResponse = await response.text();
            console.error("Unexpected response:", textResponse.substring(0, 200));
            errorMessage = `Server error (${response.status}): Expected JSON but got HTML`;
          }
          
          throw new Error(errorMessage);
        }

        // Ensure we got JSON response
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format from server");
        }

        const data = await response.json();
        setSessionData(data);
      } catch (err) {
        console.error("Session status error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionStatus();
  }, [sessionId, getToken]);

  useEffect(() => {
    if (!loading && sessionData?.status === "complete") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/dashboard/invoices");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, sessionData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Verifying payment status...
          </p>
        </div>
      </div>
    );
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="w-20 h-20 text-red-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Verification Failed
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "Unable to verify payment status. Please contact support."}
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

  const isSuccess = sessionData.status === "complete" && sessionData.paymentStatus === "paid";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <CheckCircle className="w-20 h-20 text-green-500" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {isSuccess ? "Payment Successful!" : "Payment Failed"}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {isSuccess
            ? "Your payment has been processed successfully. Thank you for your payment!"
            : "There was an issue processing your payment. Please try again or contact support."}
        </p>

        {isSuccess && (
          <>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 space-y-2">
              {sessionData.customerEmail && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email:</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {sessionData.customerEmail}
                  </p>
                </div>
              )}
              
              {sessionData.amountTotal && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Amount Paid:</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    ${(sessionData.amountTotal / 100).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            {sessionId && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Session ID:</p>
                <p className="text-xs font-mono text-gray-900 dark:text-white break-all">
                  {sessionId}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Redirecting to invoices in {countdown} seconds...
            </p>
          </>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/dashboard/invoices")}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Invoices
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
