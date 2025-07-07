import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface Payment {
  phoneNumber: string;
  amount: number;
  userId: number;
  merchantRequestId: string;
  checkoutRequestId: string;
  mpesaReceiptNumber: string;
  resultCode: number;
  resultDesc: string;
  status: string;
}

const mockPayments: Payment[] = [
  {
    phoneNumber: "254718794130",
    amount: 1,
    userId: 1,
    merchantRequestId: "25fe-4f8a-9a66-d5cbb202bfb477235",
    checkoutRequestId: "ws_CO_06072025142621119718794130",
    mpesaReceiptNumber: "TG64UGNJUG",
    resultCode: 0,
    resultDesc: "The service request is processed successfully.",
    status: "Success",
  },
  {
    phoneNumber: "254712345678",
    amount: 100,
    userId: 2,
    merchantRequestId: "merchant-123",
    checkoutRequestId: "checkout-456",
    mpesaReceiptNumber: "MPESA123ABC",
    resultCode: 0,
    resultDesc: "Waiting for customer input.",
    status: "Pending",
  },
  {
    phoneNumber: "254798765432",
    amount: 250,
    userId: 3,
    merchantRequestId: "merchant-789",
    checkoutRequestId: "checkout-987",
    mpesaReceiptNumber: "MPESA789XYZ",
    resultCode: 1,
    resultDesc: "Transaction failed due to timeout.",
    status: "Failed",
  },
];

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate delay like API call
    const timeout = setTimeout(() => {
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-scripthive-gray-light p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-scripthive-black">Payments</h1>
          <p className="text-scripthive-gray-dark mt-1">
            Below is a list of all payment transactions.
          </p>
        </div>

        <Button
          className="bg-scripthive-gold hover:bg-scripthive-gold-dark text-scripthive-black"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-scripthive-gold" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition"
            >
              <CardHeader className="flex justify-between items-start">
                <CardTitle className="text-scripthive-black text-base">
                  Receipt: {payment.mpesaReceiptNumber || "N/A"}
                </CardTitle>
                <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
              </CardHeader>
              <CardContent className="text-sm text-scripthive-black space-y-2">
                <p><strong>Phone:</strong> {payment.phoneNumber}</p>
                <p><strong>Amount:</strong> KES {payment.amount}</p>
                <p><strong>User ID:</strong> {payment.userId}</p>
                <p><strong>Checkout ID:</strong> {payment.checkoutRequestId}</p>
                <p><strong>Merchant ID:</strong> {payment.merchantRequestId}</p>
                <p className="italic text-scripthive-gray-dark">{payment.resultDesc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payment;
