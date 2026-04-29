import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ price_azn: 15 });

  useEffect(() => {
    axios.get(`${API}/settings/public`).then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/orders/${orderId}/pay`);
      toast.success("Ödəniş uğurlu!");
      // Store tracking code for confirmation page
      if (response.data.tracking_code) {
        sessionStorage.setItem(`tracking_${orderId}`, response.data.tracking_code);
      }
      navigate(`/confirmation/${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Ödəniş zamanı xəta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-lg" style={{fontFamily: 'Space Grotesk'}}>VIN<span className="text-primary">CHECK</span></span>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-md mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-8"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{fontFamily: 'Space Grotesk'}}>Ödəniş</h1>
            <p className="text-muted-foreground text-sm">VIN yoxlama xidməti üçün ödəniş</p>
          </div>

          {/* Price */}
          <div className="bg-background rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Ödəniləcək məbləğ</p>
            <p className="text-3xl font-bold text-primary" style={{fontFamily: 'Space Grotesk'}}>{settings.price_azn} AZN</p>
          </div>

          {/* Mock Payment Notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-6">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-300">Bu simulyasiya ödənişidir. Real PayPal inteqrasiyası tezliklə aktiv olacaq.</p>
          </div>

          {/* PayPal Mock Button */}
          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white py-6 text-base rounded-xl"
            data-testid="payment-paypal-mock-button"
          >
            {loading ? "Ödəniş emal olunur..." : "PayPal ilə ödə (Mock)"}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Ödəniş etməklə xidmət şərtlərini qəbul edirsiniz
          </p>
        </motion.div>
      </div>
    </div>
  );
}
