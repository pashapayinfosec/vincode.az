import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusConfig = {
  "gözləyir": { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", label: "Gözləyir", icon: Clock },
  "yoxlanılır": { color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", label: "Yoxlanılır", icon: Loader2 },
  "göndərildi": { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", label: "Göndərildi", icon: CheckCircle }
};

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      toast.error("Tracking kodu daxil edin");
      return;
    }

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const response = await axios.post(`${API}/orders/track`, {
        tracking_code: trackingCode.trim().toUpperCase()
      });
      setResult(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      } else {
        toast.error("Xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const status = result ? statusConfig[result.status] || statusConfig["gözləyir"] : null;

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

      <div className="pt-24 pb-16 max-w-lg mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center" style={{fontFamily: 'Space Grotesk'}}>Sifarişi İzlə</h1>
          <p className="text-muted-foreground text-center mb-8 text-sm">Tracking kodunu daxil edib sifarişinizin statusunu yoxlayın</p>

          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <Input
              data-testid="order-tracking-code-input"
              placeholder="VIN-XXXXXXXX"
              className="font-mono-vin h-12 bg-card border-border"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6"
              data-testid="order-tracking-submit-button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </form>

          {/* Not Found */}
          {notFound && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-2xl border border-destructive/20 p-6 text-center"
            >
              <p className="text-destructive text-sm">Sifariş tapılmadı. Tracking kodunu yoxlayın.</p>
            </motion.div>
          )}

          {/* Result */}
          {result && status && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6"
              data-testid="order-tracking-result-panel"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${status.bg} ${status.border} border`}>
                  <status.icon className={`w-4 h-4 ${status.color}`} />
                  <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
                </div>
                <code className="font-mono-vin text-xs text-muted-foreground">{result.tracking_code}</code>
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VIN</span>
                  <span className="font-mono-vin text-xs">{result.vin}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avtomobil</span>
                  <span>{result.car_model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ödəniş</span>
                  <span className={result.payment_status === "paid" ? "text-green-400" : "text-yellow-400"}>
                    {result.payment_status === "paid" ? "Ödənilib" : "Gözləyir"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tarix</span>
                  <span>{new Date(result.created_at).toLocaleDateString('az-AZ')}</span>
                </div>
              </div>

              {/* Result text if sent */}
              {result.result_text && (
                <div className="mt-6 pt-4 border-t border-border">
                  <h3 className="text-sm font-semibold mb-2">Nəticə:</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.result_text}</p>
                </div>
              )}

              {/* Progress Steps */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  {["Gözləyir", "Yoxlanılır", "Göndərildi"].map((step, i) => {
                    const steps = ["gözləyir", "yoxlanılır", "göndərildi"];
                    const currentIdx = steps.indexOf(result.status);
                    const isActive = i <= currentIdx;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {i + 1}
                        </div>
                        <span className={`text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
