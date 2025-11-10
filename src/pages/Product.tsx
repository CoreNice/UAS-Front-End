import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { toast } from "sonner";
import risolImg from "@/assets/product-risol.jpg";
import pastelImg from "@/assets/product-pastel.jpg";
import lumpiaImg from "@/assets/product-lumpia.jpg";

const Product = () => {
  const products = [
    {
      name: "Risol Mayo",
      price: "Rp 5.000",
      description: "Risol lezat dengan mayones spesial, cocok untuk camilan",
      image: risolImg,
    },
    {
      name: "Pastel Ayam",
      price: "Rp 5.000",
      description: "Pastel isi ayam pedas yang gurih dan renyah",
      image: pastelImg,
    },
    {
      name: "Lumpia Sayur",
      price: "Rp 4.000",
      description: "Lumpia sayuran segar dengan kulit yang crispy",
      image: lumpiaImg,
    },
    {
      name: "Martabak Mini",
      price: "Rp 8.000",
      description: "Martabak mini coklat keju yang manis dan lezat",
      image: risolImg,
    },
    {
      name: "Donat Kentang",
      price: "Rp 3.500",
      description: "Donat kentang empuk dengan berbagai topping",
      image: pastelImg,
    },
    {
      name: "Es Teh Manis",
      price: "Rp 3.000",
      description: "Minuman segar untuk menemani aktivitas",
      image: lumpiaImg,
    },
    {
      name: "Kopi Susu",
      price: "Rp 8.000",
      description: "Kopi susu premium dengan rasa yang nikmat",
      image: risolImg,
    },
    {
      name: "Jus Jeruk",
      price: "Rp 7.000",
      description: "Jus jeruk segar tanpa pengawet",
      image: pastelImg,
    },
  ];

  const handleOrder = (productName: string) => {
    toast.success(`${productName} berhasil ditambahkan ke keranjang!`, {
      description: "Silakan hubungi kami untuk menyelesaikan pesanan",
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        {/* Stylish Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-4">
            <ShoppingCart className="h-16 w-16 text-primary animate-float" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 italic">
            <span className="bg-gradient-primary bg-clip-text text-transparent">Product</span>
          </h1>
          <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto mb-6"></div>
          <p className="text-2xl font-semibold text-primary mb-4">
            Produk POUT - Mendukung Kegiatan Rohani
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap pembelian produk POUT akan membantu mendanai kegiatan pelayanan dan persekutuan mahasiswa
          </p>
        </div>

        {/* Products Grid with Images */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {products.map((product, index) => (
            <Card 
              key={index} 
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
                  <div className="absolute top-3 right-3">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all transform hover:scale-110">
                      <Heart className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-primary group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-3xl font-bold text-secondary mb-3">{product.price}</p>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <Button 
                    onClick={() => handleOrder(product.name)}
                    className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Pesan Sekarang
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card with image background */}
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
    </div>
  );
};

export default Product;
