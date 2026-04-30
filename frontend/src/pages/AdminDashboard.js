import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, CreditCard, Clock, CheckCircle, LogOut, Eye, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchData();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({ token, status: filter });
      if (search) params.append("search", search);
      
      const [statsRes, ordersRes] = await Promise.all([
        axios.get(`${API}/admin/stats?token=${token}`),
        axios.get(`${API}/admin/orders?${params.toString()}`)
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("admin_token");
        navigate("/admin/login");
      }
    }
  }, [token, filter, search, navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success("Yeniləndi");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  };

  const statusBadge = (status) => {
    const configs = {
      "gözləyir": "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
      "yoxlanılır": "bg-blue-400/10 text-blue-400 border-blue-400/20",
      "göndərildi": "bg-green-400/10 text-green-400 border-green-400/20"
    };
    return configs[status] || configs["gözləyir"];
  };

  const paymentBadge = (status) => {
    return status === "paid"
      ? "bg-green-400/10 text-green-400 border-green-400/20"
      : "bg-red-400/10 text-red-400 border-red-400/20";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
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
              <Link to="/admin" className="text-foreground font-medium">Sifarişlər</Link>
              <Link to="/admin/customers" className="text-muted-foreground hover:text-foreground">Müştərilər</Link>
              <Link to="/admin/payments" className="text-muted-foreground hover:text-foreground">Ödənişlər</Link>
              <Link to="/admin/settings" className="text-muted-foreground hover:text-foreground">Tənzim</Link>
            </nav>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="w-4 h-4 mr-1" /> Çıxış
          </Button>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
        {/* KPIs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-testid="admin-dashboard-kpi-row">
            {[
              { label: "Yeni sifarişlər", value: stats.waiting_orders, icon: Clock, color: "text-yellow-400" },
              { label: "Ödənilmiş", value: stats.paid_orders, icon: CreditCard, color: "text-blue-400" },
              { label: "Göndərilmiş", value: stats.sent_orders, icon: CheckCircle, color: "text-green-400" },
              { label: "Gəlir (AZN)", value: stats.total_revenue, icon: Package, color: "text-primary" }
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <p className="text-2xl font-bold" style={{fontFamily: 'Space Grotesk'}}>{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              data-testid="admin-search-input"
              placeholder="VIN, ad, email, telefon ilə axtar..."
              className="h-10 bg-card border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" size="sm" className="bg-primary text-primary-foreground h-10 px-4">
              <Search className="w-4 h-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRefresh} className="h-10 px-4 border-border">
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: "Hamısı", value: "" },
            { label: "Gözləyir", value: "gözləyir" },
            { label: "Yoxlanılır", value: "yoxlanılır" },
            { label: "Göndərildi", value: "göndərildi" }
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden" data-testid="admin-dashboard-orders-table">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">VIN</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Müştəri</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Əlaqə</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Ödəniş</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Tarix</th>
                  <th className="text-left p-4 text-muted-foreground font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      {search ? "Axtarış nəticəsi tapılmadı" : "Sifariş yoxdur"}
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.order_id} className="border-b border-border hover:bg-[rgba(245,200,75,0.03)] transition-colors cursor-pointer" onClick={() => navigate(`/admin/orders/${order.order_id}`)}>
                      <td className="p-4 font-mono-vin text-xs">{order.vin}</td>
                      <td className="p-4">
                        <div>{order.name}</div>
                        <div className="text-xs text-muted-foreground">{order.phone}</div>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">{order.email || order.telegram || '-'}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs border ${paymentBadge(order.payment_status)}`}>
                          {order.payment_status === "paid" ? "Ödənilib" : "Gözləyir"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded-md text-xs border ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('az-AZ')}
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); navigate(`/admin/orders/${order.order_id}`); }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {orders.length > 0 && (
            <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
              Cəmi: {orders.length} sifariş
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
