import { useCallback } from "react";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "@clerk/clerk-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutForm({ invoiceId }) {
  const { getToken } = useAuth();

  const fetchClientSecret = useCallback(async () => {
    try {
      const token = await getToken();
      
      if (!token) {
        throw new Error("Authentication token not available");
      }

      console.log("🔐 Creating checkout session for invoice:", invoiceId);
      
      const apiUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL;
      
      const response = await fetch(
        `${apiUrl}/api/invoices/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoiceId }),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        // Get detailed error message
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to create checkout session";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error("Backend error:", errorData);
        } else {
          const textResponse = await response.text();
          console.error("Non-JSON response:", textResponse.substring(0, 200));
          errorMessage = `Server error (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      const { clientSecret } = await response.json();
      console.log("✅ Client secret received");
      return clientSecret;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }, [invoiceId, getToken]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
