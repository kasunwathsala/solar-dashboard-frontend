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
      
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/invoices/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ invoiceId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { clientSecret } = await response.json();
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
