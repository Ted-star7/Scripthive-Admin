import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";

interface Payment {
  phoneNumber: string;
  amount: number;
  mpesaReceiptNumber: string | null;
  status: string;
  resultDesc: string;
  transactionDate: string | null;
  merchantRequestId: string | null;
  checkoutRequestId: string | null;
}

const Payment = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch("https://onlinewriting.onrender.com/api/open/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const result = await response.json();
        setPayments(result.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-scripthive-gray-light p-6 overflow-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-scripthive-black">Payments</h1>
          <p className="text-scripthive-gray-dark mt-1">
            Below is a list of all payment transactions.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-scripthive-gold" size={32} />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">Error: {error}</div>
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
                  <p><strong>Checkout ID:</strong> {payment.checkoutRequestId || "N/A"}</p>
                  <p><strong>Merchant ID:</strong> {payment.merchantRequestId || "N/A"}</p>
                  <p className="italic text-scripthive-gray-dark">{payment.resultDesc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
