import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";

const API = "/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, {
        username,
        password
      });

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
      <div className="hidden lg:flex lg:w-1/2 bg-card items-center justify-center p-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-bold text-3xl">V</span>
          </div>
          <h2 className="text-3xl font-bold mb-3">VINCHECK</h2>
          <p className="text-muted-foreground">Admin idarəetmə paneli</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <Label>İstifadəçi adı</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>

          <div>
            <Label>Şifrə</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {loading ? "Yüklənir..." : "Daxil ol"}
          </Button>
        </form>
      </div>
    </div>
  );
}
