import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, X, Trash2, Plus, Minus, AlertCircle, Locate } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuthHook";
import { useProducts } from "@/hooks/useDataFetch";

type ProductItem = {
  _id?: string;
  name: string;
  price: number;
  description: string;
  stock: number;
  image_url?: string;
  image?: string;
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
  const { isAuthenticated } = useAuth();
  const { products, isLoading, error } = useProducts();

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const totalQty = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((s, l) => s + l.qty * l.product.price, 0), [cart]);

  const addToCart = (p: ProductItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((l) => l.product.name === p.name);
      if (idx >= 0) {
        const next = [...prev];
        const currentQty = next[idx].qty;
        const maxStock = next[idx].product.stock ?? 0;
        if (currentQty >= maxStock) {
          toast.error(`Stok hanya ${maxStock} untuk ${p.name}`);
          return prev;
        }
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        toast.success(`${p.name} ditambahkan ke keranjang`);
        return next;
      }
      if ((p.stock ?? 0) <= 0) {
        toast.error(`Stok habis untuk ${p.name}`);
        return prev;
      }
      toast.success(`${p.name} ditambahkan ke keranjang`);
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const decQty = (name: string) =>
    setCart((prev) =>
      prev.map((l) => (l.product.name === name ? { ...l, qty: Math.max(1, l.qty - 1) } : l))
    );

  const incQty = (name: string) =>
    setCart((prev) =>
      prev.map((l) => {
        if (l.product.name !== name) return l;
        const maxStock = l.product.stock ?? 0;
        if (l.qty >= maxStock) {
          toast.error(`Maksimum stok tercapai (${maxStock})`);
          return l;
        }
        return { ...l, qty: l.qty + 1 };
      })
    );

  const removeLine = (name: string) =>
    setCart((prev) => prev.filter((l) => l.product.name !== name));

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Keranjang masih kosong");
      return;
    }

    navigate("/checkout", { state: { cart } });
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading produk...</p>
        </div>
      </div>
    );
  }

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

        {error && (
          <div className="mb-8 flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              Tidak dapat memuat produk dari server. Silakan coba lagi atau hubungi admin.
            </p>
          </div>
        )}

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

        {products.length === 0 ? (
          <div className="text-center py-12 bm-10 mb-10">
            <p className="font-semibold bg-[#CFE0FF] text-lg text-[#3A66EE]">Belum ada produk yang dijual oleh POUT</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {products.map((product, index) => {
              const liked = !!favorites[product.name];
              return (
                <Card
                  key={product._id || product.name}
                  className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.image_url || product.image || "https://via.placeholder.com/300"}
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
                      <p className="mb-3 text-sm font-semibold">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock > 0
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                          }`}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : "Out of Stock"}
                        </span>
                      </p>
                      <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-3xl font-bold text-secondary mb-1">{currency(product.price)}</p>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <Button
                        onClick={() => product.stock > 0 ? addToCart(product) : null}
                        disabled={product.stock === 0}
                        className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stock > 0 ? "Tambah ke Keranjang" : "Out of Stock"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setCartOpen(false)}
      />
      <div
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-50 transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"
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
              <img src={line.product.image_url || line.product.image || ""} className="h-16 w-16 rounded-md object-cover bg-gray-100" />
              <div className="flex-1">
                <p className="font-semibold leading-tight">{line.product.name}</p>
                <p className="text-sm text-muted-foreground">{currency(line.product.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => decQty(line.product.name)}
                    className="h-7 w-7 grid place-items-center rounded-md bg-muted hover:bg-muted/80"
                  >
                    <Minus className="h-4 w-4" />
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
                    <img src={p.image_url || p.image || ""} className="h-10 w-10 rounded object-cover bg-gray-100" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">{p.name}</p>
                      <p className="text-[12px] text-muted-foreground">{currency(p.price)}</p>
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
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Product;
