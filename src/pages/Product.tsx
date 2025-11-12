import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, X, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import risolImg from "@/assets/product-risol.jpg";
import pastelImg from "@/assets/product-pastel.jpg";
import lumpiaImg from "@/assets/product-lumpia.jpg";

type ProductItem = {
  name: string;
  priceLabel: string;
  price: number;
  description: string;
  image: string;
};

type CartLine = {
  product: ProductItem;
  qty: number;
};

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const Product = () => {
  const navigate = useNavigate();

  const products: ProductItem[] = [
    { name: "Risol Mayo", priceLabel: "Rp 5.000", price: 5000, description: "Risol lezat dengan mayones spesial, cocok untuk camilan", image: risolImg },
    { name: "Pastel Ayam", priceLabel: "Rp 5.000", price: 5000, description: "Pastel isi ayam pedas yang gurih dan renyah", image: pastelImg },
    { name: "Lumpia Sayur", priceLabel: "Rp 4.000", price: 4000, description: "Lumpia sayuran segar dengan kulit yang crispy", image: lumpiaImg },
    { name: "Martabak Mini", priceLabel: "Rp 8.000", price: 8000, description: "Martabak mini coklat keju yang manis dan lezat", image: risolImg },
    { name: "Donat Kentang", priceLabel: "Rp 3.500", price: 3500, description: "Donat kentang empuk dengan berbagai topping", image: pastelImg },
    { name: "Es Teh Manis", priceLabel: "Rp 3.000", price: 3000, description: "Minuman segar untuk menemani aktivitas", image: lumpiaImg },
    { name: "Kopi Susu", priceLabel: "Rp 8.000", price: 8000, description: "Kopi susu premium dengan rasa yang nikmat", image: risolImg },
    { name: "Jus Jeruk", priceLabel: "Rp 7.000", price: 7000, description: "Jus jeruk segar tanpa pengawet", image: pastelImg },
  ];

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const totalQty = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.qty * l.product.price, 0), [cart]);

  const addToCart = (p: ProductItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.product.name === p.name);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product: p, qty: 1 }];
    });
    toast.success(`${p.name} ditambahkan ke keranjang`);
  };

  const decQty = (name: string) =>
    setCart((prev) =>
      prev.map((l) => (l.product.name === name ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
    );

  const incQty = (name: string) =>
    setCart((prev) =>
      prev.map((l) => (l.product.name === name ? { ...l, qty: l.qty + 1 } : l))
    );

  const removeLine = (name: string) =>
    setCart((prev) => prev.filter((l) => l.product.name !== name));

  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const raw = localStorage.getItem("pout_favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("pout_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (p: ProductItem) =>
    setFavorites((prev) => {
      const next = { ...prev, [p.name]: !prev[p.name] };
      toast.message(next[p.name] ? `Menyukai ${p.name} ❤️` : `Batalkan suka ${p.name}`);
      return next;
    });

  const likedProducts = products.filter((p) => favorites[p.name]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <ShoppingCart className="h-16 w-16 text-primary animate-float" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 italic">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Product</span>
          </h1>
          <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-primary mb-4">Produk POUT - Mendukung Kegiatan Rohani</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap pembelian produk POUT akan membantu mendanai kegiatan pelayanan dan persekutuan mahasiswa
          </p>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="fixed right-6 top-28 md:top-24 z-40 bg-white shadow-2xl rounded-full p-3 hover:scale-105 transition"
        >
          <div className="relative">
            <ShoppingCart className="h-7 w-7 text-primary" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 rounded-full bg-amber-400 text-xs font-bold text-white flex items-center justify-center">
                {totalQty}
              </span>
            )}
          </div>
        </button>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => {
            const liked = !!favorites[product.name];
            return (
              <Card
                key={product.name}
                className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() => toggleFavorite(product)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all hover:scale-110"
                        aria-label={liked ? "Batal suka" : "Suka"}
                      >
                        <Heart className={`h-5 w-5 ${liked ? "text-red-500 fill-red-500" : "text-red-500"}`} />
                      </button>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-3xl font-bold text-secondary mb-3">{product.priceLabel}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <Button
                      onClick={() => addToCart(product)}
                      className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg transition hover:scale-105"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Tambah ke Keranjang
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero opacity-95"></div>
              <div className="relative z-10 p-12 text-center">
                <ShoppingCart className="h-16 w-16 text-primary-foreground mx-auto mb-6 animate-float" />
                <h2 className="text-4xl font-bold text-primary-foreground mb-6">
                  Cara Pemesanan
                </h2>
                <div className="max-w-3xl mx-auto space-y-4">
                  <p className="text-xl text-primary-foreground leading-relaxed">
                    Untuk pemesanan, silakan hubungi kontak POUT melalui Instagram atau email kami.
                  </p>
                  <p className="text-lg text-primary-foreground/90">
                    📍 Produk dapat diambil di sekretariat POUT
                  </p>
                  <p className="text-lg text-primary-foreground/90">
                    🚗 Layanan antar tersedia untuk minimal pembelian Rp 50.000
                  </p>
                  <div className="pt-6">
                    <Button
                      size="lg"
                      onClick={() => (window.location.href = "mailto:contact@pout.untar.ac.id")}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-8 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
                    >
                      Hubungi Kami
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Keranjang</h3>
            <span className="text-xs text-muted-foreground">({totalQty} item)</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2 rounded-md hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-260px)]">
          {cart.length === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-6">
              Keranjang masih kosong.
            </p>
          )}

          {cart.map((line) => (
            <div key={line.product.name} className="flex gap-3 items-center border rounded-lg p-3">
              <img src={line.product.image} className="h-16 w-16 rounded-md object-cover" />
              <div className="flex-1">
                <p className="font-semibold leading-tight">{line.product.name}</p>
                <p className="text-sm text-muted-foreground">{currency(line.product.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => decQty(line.product.name)}
                    className="h-7 w-7 grid place-items-center rounded-md bg-muted hover:bg-muted/80"
                  >
                    <Plus className="h-4 w-4 rotate-180" />
                  </button>
                  <span className="w-8 text-center font-semibold">{line.qty}</span>
                  <button
                    onClick={() => incQty(line.product.name)}
                    className="h-7 w-7 grid place-items-center rounded-md bg-muted hover:bg-muted/80"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <button onClick={() => removeLine(line.product.name)} className="p-2 rounded-md hover:bg-muted">
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}

          {likedProducts.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <p className="text-sm font-semibold">Disukai</p>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {likedProducts.map((p) => (
                  <div key={p.name} className="flex items-center gap-3 border rounded-lg p-2">
                    <img src={p.image} className="h-10 w-10 rounded object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">{p.name}</p>
                      <p className="text-[12px] text-muted-foreground">{p.priceLabel}</p>
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90"
                    >
                      Tambah
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{currency(subtotal)}</span>
          </div>
          <Button
            className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:opacity-90"
            onClick={() => navigate("/checkout", { state: { cart } })}
          >
            Checkout
          </Button>
          <p className="text-[11px] text-muted-foreground mt-2">
            Belum ada backend. Checkout hanya tampilan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Product;
