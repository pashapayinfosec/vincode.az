import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ConfirmationPage() {
  const { orderId } = useParams();
  const [trackingCode, setTrackingCode] = useState("");

  useEffect(() => {
    // Get tracking code from sessionStorage (saved during payment)
    const code = sessionStorage.getItem(`tracking_${orderId}`);
    if (code) {
      setTrackingCode(code);
    }
  }, [orderId]);

  const copyTrackingCode = () => {
    if (trackingCode) {
      navigator.clipboard.writeText(trackingCode);
      toast.success("Tracking kodu kopyalandı!");
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-2xl border border-border p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2" style={{fontFamily: 'Space Grotesk'}}>Sifariş Qəbul Edildi!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Ödənişiniz uğurla tamamlandı. Sifarişiniz emal olunur.
          </p>

          {trackingCode && (
            <div className="bg-background rounded-xl p-4 mb-6">
              <p className="text-xs text-muted-foreground mb-2">Tracking Kodu</p>
              <div className="flex items-center justify-center gap-2">
                <code className="font-mono-vin text-lg text-primary" data-testid="order-confirmation-tracking-code">
                  {trackingCode}
                </code>
                <button
                  onClick={copyTrackingCode}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors"
                  data-testid="order-confirmation-copy-tracking-button"
                >
                  <Copy className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-background rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold mb-3">Növbəti addımlar:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">1.</span>
                Sifarişiniz mütəxəssis tərəfindən yoxlanılacaq
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">2.</span>
                Nəticə hazır olanda sizə göndəriləcək
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">3.</span>
                Tracking kodu ilə statusu izləyə bilərsiniz
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <Link to="/tracking">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5">
                Sifarişi izlə <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="w-full py-5 mt-2 border-border">
                Ana səhifəyə qayıt
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
