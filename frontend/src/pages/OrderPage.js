import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function OrderPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ price_azn: 15 });
  const [loading, setLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("email");
  const [form, setForm] = useState({
    vin: "",
    car_model: "",
    name: "",
    phone: "",
    email: "",
    telegram: ""
  });

  useEffect(() => {
    axios.get(`${API}/settings/public`).then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.vin.length !== 17) {
      toast.error("VIN kodu 17 simvol olmalıdır");
      return;
    }
    if (!form.name || !form.phone || !form.car_model) {
      toast.error("Bütün məcburi sahələri doldurun");
      return;
    }
    if (deliveryMethod === "email" && !form.email) {
      toast.error("Email daxil edin");
      return;
    }
    if (deliveryMethod === "telegram" && !form.telegram) {
      toast.error("Telegram username daxil edin");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/orders`, {
        ...form,
        vin: form.vin.toUpperCase(),
        delivery_method: deliveryMethod
      });
      navigate(`/payment/${response.data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Xəta baş verdi");
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
            <span className="font-bold text-lg" style={{fontFamily: 'Space Grotesk'}}>VIN<span className="text-primary">CODE</span></span>
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{fontFamily: 'Space Grotesk'}}>VIN Sifarişi</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="order-form-page">
              {/* VIN Input */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">VIN Kodu *</Label>
                <Input
                  data-testid="order-form-vin-input"
                  className="mt-2 font-mono-vin text-lg h-14 bg-card border-border"
                  placeholder="1HGCM82633A004329"
                  maxLength={17}
                  value={form.vin}
                  onChange={(e) => setForm({...form, vin: e.target.value.toUpperCase()})}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{form.vin.length}/17</p>
              </div>

              {/* Car Model */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Avtomobil Markası/Modeli *</Label>
                <Input
                  data-testid="order-form-car-model-input"
                  className="mt-2 h-12 bg-card border-border"
                  placeholder="Toyota Camry 2019"
                  value={form.car_model}
                  onChange={(e) => setForm({...form, car_model: e.target.value})}
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Ad Soyad *</Label>
                  <Input
                    data-testid="order-form-name-input"
                    className="mt-2 h-12 bg-card border-border"
                    placeholder="Əli Həsənov"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Telefon *</Label>
                  <Input
                    data-testid="order-form-phone-input"
                    className="mt-2 h-12 bg-card border-border"
                    placeholder="+994 50 123 45 67"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Email</Label>
                <Input
                  data-testid="order-form-email-input"
                  className="mt-2 h-12 bg-card border-border"
                  placeholder="ali@example.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>

              {/* Delivery Method */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3 block">
                  Hesabatı necə almaq istəyirsiniz? *
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    data-testid="delivery-method-email"
                    onClick={() => setDeliveryMethod("email")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      deliveryMethod === "email"
                        ? "border-primary/50 bg-primary/5 gold-glow"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Email</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Email ünvanınıza göndərilir</p>
                  </button>
                  <button
                    type="button"
                    data-testid="delivery-method-telegram"
                    onClick={() => setDeliveryMethod("telegram")}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      deliveryMethod === "telegram"
                        ? "border-primary/50 bg-primary/5 gold-glow"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Send className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">Telegram</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Telegram hesabınıza göndərilir</p>
                  </button>
                </div>
              </div>

              {/* Telegram username if selected */}
              {deliveryMethod === "telegram" && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Telegram Username *</Label>
                  <Input
                    data-testid="order-form-telegram-input"
                    className="mt-2 h-12 bg-card border-border"
                    placeholder="@username"
                    value={form.telegram}
                    onChange={(e) => setForm({...form, telegram: e.target.value})}
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base gold-glow"
                data-testid="order-form-submit-button"
              >
                {loading ? "Göndərilir..." : "Davam et →"}
              </Button>
            </form>
          </motion.div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
            data-testid="order-form-summary-card"
          >
            <div className="sticky top-24 bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Sifariş Xülasəsi</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Xidmət</span>
                  <span>VIN Yoxlama</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Qiymət</span>
                  <span className="text-primary font-bold text-lg">{settings.price_azn} AZN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Çatdırılma</span>
                  <span>{deliveryMethod === "email" ? "Email" : "Telegram"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Müddət</span>
                  <span>10-30 dəqiqə</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Ödəniş etdikdən sonra sifarişiniz dərhal emal olunmağa başlayır.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
