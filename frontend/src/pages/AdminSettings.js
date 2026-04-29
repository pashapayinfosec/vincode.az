import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API}/admin/settings?token=${token}`);
      setSettings(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/admin/login");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/admin/settings?token=${token}`, settings);
      toast.success("Tənzimlər yadda saxlanıldı");
    } catch (err) {
      toast.error("Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return null;

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
              <Link to="/admin/settings" className="text-foreground font-medium">Tənzim</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6 text-muted-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" /> Geri
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-6" style={{fontFamily: 'Space Grotesk'}}>Tənzimlər</h1>
          
          <div className="space-y-6">
            {/* Price */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Qiymət</h2>
              <div>
                <Label className="text-sm text-muted-foreground">Qiymət (AZN)</Label>
                <Input
                  data-testid="admin-settings-price-input"
                  type="number"
                  className="mt-1 h-12 bg-background border-border max-w-xs"
                  value={settings.price_azn}
                  onChange={(e) => setSettings({...settings, price_azn: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            {/* Site Texts */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Sayt Mətnləri</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Hero Başlıq</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    value={settings.hero_title || ""}
                    onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Hero Alt Başlıq</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    value={settings.hero_subtitle || ""}
                    onChange={(e) => setSettings({...settings, hero_subtitle: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Design */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Dizayn</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Ǝsas Rəng</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="color"
                      className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                      value={settings.primary_color || "#F5C84B"}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    />
                    <Input
                      className="h-12 bg-background border-border max-w-xs"
                      value={settings.primary_color || ""}
                      onChange={(e) => setSettings({...settings, primary_color: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Logo URL</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    value={settings.logo_url || ""}
                    onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Banner URL</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    value={settings.banner_url || ""}
                    onChange={(e) => setSettings({...settings, banner_url: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Telegram Config */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Telegram Bildiriş</h2>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Bot Token</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    placeholder="123456:ABC-DEF..."
                    value={settings.telegram_bot_token || ""}
                    onChange={(e) => setSettings({...settings, telegram_bot_token: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Chat ID</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    placeholder="-100123456789"
                    value={settings.telegram_chat_id || ""}
                    onChange={(e) => setSettings({...settings, telegram_chat_id: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* SMTP Config */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4" style={{fontFamily: 'Space Grotesk'}}>Email (SMTP)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">SMTP Host</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    placeholder="smtp.gmail.com"
                    value={settings.smtp_host || ""}
                    onChange={(e) => setSettings({...settings, smtp_host: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">SMTP Port</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    type="number"
                    placeholder="587"
                    value={settings.smtp_port || ""}
                    onChange={(e) => setSettings({...settings, smtp_port: parseInt(e.target.value) || 587})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">SMTP User</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    placeholder="your@email.com"
                    value={settings.smtp_user || ""}
                    onChange={(e) => setSettings({...settings, smtp_user: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">SMTP Password</Label>
                  <Input
                    className="mt-1 h-12 bg-background border-border"
                    type="password"
                    placeholder="••••••••"
                    value={settings.smtp_password || ""}
                    onChange={(e) => setSettings({...settings, smtp_password: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-5"
              data-testid="admin-settings-save-button"
            >
              <Save className="w-4 h-4 mr-2" /> {saving ? "Saxlanılır..." : "Tənzimləri Yadda Saxla"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
