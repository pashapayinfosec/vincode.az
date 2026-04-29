import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, { username, password });
      localStorage.setItem("admin_token", response.data.token);
      localStorage.setItem("admin_username", response.data.username);
      toast.success("Giriş uğurlu!");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Giriş uğursuz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-bold text-3xl" style={{fontFamily: 'Space Grotesk'}}>V</span>
          </div>
          <h2 className="text-3xl font-bold mb-3" style={{fontFamily: 'Space Grotesk'}}>VINCHECK</h2>
          <p className="text-muted-foreground">Admin idarəetmə paneli</p>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-lg" style={{fontFamily: 'Space Grotesk'}}>VINCHECK</span>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{fontFamily: 'Space Grotesk'}}>Admin Girişi</h1>
          <p className="text-muted-foreground text-sm mb-8">İdarə panelinə daxil olun</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground">İstifadəçi adı</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="admin-login-email-input"
                  className="pl-10 h-12 bg-card border-border"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Şifrə</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  data-testid="admin-login-password-input"
                  type="password"
                  className="pl-10 h-12 bg-card border-border"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              data-testid="admin-login-submit-button"
            >
              {loading ? "Giriş edilir..." : "Daxil ol"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
