import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Car, Shield, Clock, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function HomePage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({ price_azn: 15, hero_title: "AVTOVIN YOXLAMA", hero_subtitle: "" });

  useEffect(() => {
    axios.get(`${API}/settings/public`).then(res => setSettings(res.data)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border" data-testid="public-header">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-lg text-foreground" style={{fontFamily: 'Space Grotesk'}}>
              VIN<span className="text-primary">CHECK</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Necə işləyir</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Qiymət</a>
            <Link to="/order" className="hover:text-foreground transition-colors">Sifariş</Link>
            <Link to="/tracking" className="hover:text-foreground transition-colors">İzləmə</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/order')} className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="home-hero-primary-cta">
              VIN Yoxla
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 grid-bg hero-gradient" data-testid="home-hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Azərbaycanda VIN yoxlama xidməti
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6" style={{fontFamily: 'Space Grotesk'}}>
              <span className="text-foreground">AVTO</span>
              <span className="text-primary">VIN</span>
              <br />
              <span className="text-foreground">YOXLAMA</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Avtomobilin VIN kodunu daxil edin, sifariş yaradın və detallı hesabatı əldə edin.
            </p>
            
            {/* Sample VIN Display */}
            <div className="inline-block mb-8">
              <div className="gold-border rounded-xl px-6 py-4 bg-card/50">
                <p className="text-xs text-muted-foreground mb-2">NÜMUNƏ VIN KODU</p>
                <p className="font-mono-vin text-xl sm:text-2xl text-primary tracking-widest">
                  1114EKVLGR56BC5HT
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/order')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 gold-glow"
                data-testid="hero-primary-cta-button"
              >
                İndi Sifariş Et →
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/tracking')}
                className="border-border text-foreground hover:bg-accent text-base px-8 py-6"
                data-testid="home-hero-secondary-cta"
              >
                Sifarişi İzlə
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{fontFamily: 'Space Grotesk'}}>Necə işləyir?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "VIN kodunu daxil edin", desc: "17 simvollu VIN kodunu formağa yazın" },
              { icon: Shield, title: `${settings.price_azn} AZN ödəniş edin`, desc: "Təhlükəsiz ödəniş sistemi ilə" },
              { icon: CheckCircle, title: "Hesabatı alın", desc: "Email və ya Telegram ilə göndərilir" }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-primary font-medium mb-1">Addım {i + 1}</div>
                <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Space Grotesk'}}>{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-20 bg-card/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{fontFamily: 'Space Grotesk'}}>Qiymət</h2>
          <p className="text-muted-foreground mb-8">Sadə və şəffaf qiymətləndirmə</p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-sm mx-auto bg-card rounded-2xl border border-primary/30 p-8 gold-glow"
          >
            <h3 className="text-lg font-semibold mb-2" style={{fontFamily: 'Space Grotesk'}}>VIN Yoxlama</h3>
            <div className="text-4xl font-bold text-primary mb-4" style={{fontFamily: 'Space Grotesk'}}>
              {settings.price_azn} <span className="text-lg text-muted-foreground">AZN</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-3 mb-6 text-left">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Tam VIN tarixçəsi</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Qəza məlumatları</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Kilometr yoxlaması</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Sürətli cavab (10-30 dəq)</li>
            </ul>
            <Button
              onClick={() => navigate('/order')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6"
            >
              Sifariş et
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Shield, text: "Təhlükəsiz ödəniş" },
              { icon: Clock, text: "Sürətli cavab" },
              { icon: Car, text: "Şəffaf proses" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4">
                <item.icon className="w-8 h-8 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-sm">VINCHECK</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 VINCheck. Bütün hüquqlar qorunur.</p>
          <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
        </div>
      </footer>
    </div>
  );
}
