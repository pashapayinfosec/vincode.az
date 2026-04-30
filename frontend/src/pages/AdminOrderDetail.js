import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Save, Clock, CheckCircle, Loader2, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const [order, setOrder] = useState(null);
  const [resultText, setResultText] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    fetchOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/admin/orders/${orderId}?token=${token}`);
      setOrder(res.data);
      setResultText(res.data.result_text || "");
      setStatus(res.data.status || "gözləyir");
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
      toast.error("Sifariş tapılmadı");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/orders/${orderId}?token=${token}`, {
        status,
        result_text: resultText
      });
      toast.success("Yadda saxlanıldı");
      fetchOrder();
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      const res = await axios.post(`${API}/admin/orders/${orderId}/send?token=${token}`);
      toast.success(res.data.message);
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Göndərmə uğursuz");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Bu sifarişi silmək istədiyinizdən əminsiniz?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/admin/orders/${orderId}?token=${token}`);
      toast.success("Sifariş silindi");
      navigate("/admin");
    } catch (err) {
      toast.error("Silinmə uğursuz");
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Kopyalandı!");
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">V</span>
              </div>
              <span className="font-bold text-sm" style={{fontFamily: 'Space Grotesk'}}>ADMIN</span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link to="/admin" className="text-muted-foreground hover:text-foreground">Sifarişlər</Link>
              <Link to="/admin/customers" className="text-muted-foreground hover:text-foreground">Müştərilər</Link>
              <Link to="/admin/payments" className="text-muted-foreground hover:text-foreground">Ödənişlər</Link>
              <Link to="/admin/settings" className="text-muted-foreground hover:text-foreground">Tənzim</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Geri
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} disabled={deleting} className="text-destructive hover:text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-1" /> {deleting ? "Silinir..." : "Sil"}
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Order Info */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold" style={{fontFamily: 'Space Grotesk'}}>Sifariş Detalı</h1>
              <div className="flex items-center gap-2">
                <code className="font-mono-vin text-xs text-primary bg-primary/10 px-2 py-1 rounded">{order.tracking_code}</code>
                <button onClick={() => copyToClipboard(order.tracking_code)} className="p-1 rounded hover:bg-accent">
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">VIN</span>
                <div className="font-mono-vin flex items-center gap-2">
                  {order.vin}
                  <button onClick={() => copyToClipboard(order.vin)} className="p-1 rounded hover:bg-accent">
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Avtomobil</span>
                <div>{order.car_model}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Müştəri</span>
                <div>{order.name}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Telefon</span>
                <div>{order.phone}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Email</span>
                <div>{order.email || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Telegram</span>
                <div>{order.telegram || '-'}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Çatdırılma üsulu</span>
                <div className="capitalize">{order.delivery_method}</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Qiymət</span>
                <div className="text-primary font-bold">{order.price_azn} AZN</div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Ödəniş</span>
                <div className={order.payment_status === 'paid' ? 'text-green-400' : 'text-red-400'}>
                  {order.payment_status === 'paid' ? 'Ödənilib' : 'Gözləyir'}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs">Tarix</span>
                <div>{new Date(order.created_at).toLocaleString('az-AZ')}</div>
              </div>
            </div>
          </div>

          {/* Status & Result */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Status və Nəticə</h2>
            
            {/* Status Select */}
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Status</Label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { value: "gözləyir", label: "Gözləyir", icon: Clock, color: "text-yellow-400" },
                  { value: "yoxlanılır", label: "Yoxlanılır", icon: Loader2, color: "text-blue-400" },
                  { value: "göndərildi", label: "Göndərildi", icon: CheckCircle, color: "text-green-400" }
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-all ${
                      status === s.value
                        ? "bg-primary/10 border-primary/50 text-foreground"
                        : "bg-card border-border text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Text */}
            <div className="mb-6">
              <Label className="text-sm text-muted-foreground mb-2 block">Nəticə Mətni</Label>
              <textarea
                data-testid="admin-order-result-textarea"
                className="w-full h-40 bg-background border border-border rounded-xl p-4 text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="VIN yoxlama nəticəsini bura yazın..."
                value={resultText}
                onChange={(e) => setResultText(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              >
                <Save className="w-4 h-4 mr-2" /> {saving ? "Saxlanılır..." : "Yadda saxla"}
              </Button>
              <Button
                onClick={handleSend}
                disabled={sending || !resultText}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="admin-order-send-result-button"
              >
                <Send className="w-4 h-4 mr-2" /> {sending ? "Göndərilir..." : "Nəticəni göndər"}
              </Button>
            </div>

            {order.sent_at && (
              <p className="text-xs text-green-400 mt-3">
                Göndərilmə tarixi: {new Date(order.sent_at).toLocaleString('az-AZ')}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
