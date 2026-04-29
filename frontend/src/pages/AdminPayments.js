import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPayments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("admin_token");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    fetchPayments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/admin/payments?token=${token}`);
      setPayments(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/admin/login");
      toast.error("Məlumat yüklənə bilmədi");
    }
  };

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
              <Link to="/admin/payments" className="text-foreground font-medium">Ödənişlər</Link>
              <Link to="/admin/settings" className="text-muted-foreground hover:text-foreground">Tənzim</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold" style={{fontFamily: 'Space Grotesk'}}>Ödənişlər</h1>
          <span className="text-sm text-muted-foreground">({payments.length})</span>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Tracking</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">VIN</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Müştəri</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Məbləğ</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Tarix</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Ödəniş yoxdur</td></tr>
                ) : (
                  payments.map((p, i) => (
                    <tr key={i} className="border-b border-border hover:bg-[rgba(245,200,75,0.03)]">
                      <td className="p-4 font-mono-vin text-xs text-primary">{p.tracking_code}</td>
                      <td className="p-4 font-mono-vin text-xs">{p.vin}</td>
                      <td className="p-4">{p.name}</td>
                      <td className="p-4 text-primary font-semibold">{p.price_azn} AZN</td>
                      <td className="p-4">
                        <span className="inline-flex px-2 py-1 rounded-md text-xs border bg-green-400/10 text-green-400 border-green-400/20">
                          Ödənilib
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString('az-AZ')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
