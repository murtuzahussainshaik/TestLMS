// src/components/payment/RazorpayCheckout.jsx
import { useEffect } from "react";
import { paymentService } from "../../services/paymentService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const RazorpayCheckout = ({ order, course, onSuccess, onFailure }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    // Initialize Razorpay
    const initializeRazorpay = async () => {
      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Create Razorpay instance
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "EduTech",
        description: `Payment for ${course.name}`,
        image: course.image,
        order_id: order.id,
        handler: async (response) => {
          try {
            const result = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              onSuccess();
            } else {
              onFailure({
                error: { description: "Payment verification failed" },
              });
            }
          } catch (error) {
            onFailure({ error: { description: error.message } });
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5", // primary-600
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    };

    initializeRazorpay();
  }, [order, course, user, onSuccess, onFailure]);

  return (
    <div className="text-center py-4">
      <CreditCardIcon className="mx-auto h-12 w-12 text-primary-600" />
      <h3 className="mt-2 text-lg font-medium text-secondary-900">
        Payment Processing
      </h3>
      <p className="mt-1 text-sm text-secondary-500">
        Please complete your payment in the Razorpay window
      </p>

      <button
        onClick={() => window.location.reload()}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
      >
        Reload Payment Window
      </button>
    </div>
  );
};

export default RazorpayCheckout;
