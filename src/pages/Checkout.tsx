import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProductItem = {
  name: string;
  price: number;
  image: string;
};

type CartLine = {
  product: ProductItem;
  qty: number;
};

type LocationState = {
  cart?: CartLine[];
};

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cart: CartLine[] = (state as LocationState)?.cart || [];

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [catatan, setCatatan] = useState("");
  const [metode, setMetode] = useState<"pickup" | "delivery">("pickup");
  const [alamat, setAlamat] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((s, l) => s + l.qty * l.product.price, 0),
    [cart]
  );

  const ongkir = metode === "delivery" ? 10000 : 0;
  const total = subtotal + ongkir;

  const isEmpty = cart.length === 0;

  const handleConfirmEmail = () => {
    const to = "oikoumene.ut@gmail.com";
    const subject = "Order Produk POUT";

    const itemsText = cart
      .map((l) => `- ${l.product.name} x${l.qty} = ${currency(l.qty * l.product.price)}`)
      .join("\n");

    const text = `
Halo POUT,

Saya ingin melakukan pemesanan:
${itemsText}

Subtotal: ${currency(subtotal)}
Ongkir: ${currency(ongkir)}
Total: ${currency(total)}

Data Pemesan:
Nama: ${nama}
Email: ${email}
Telepon: ${telepon}
Metode: ${metode === "pickup" ? "Ambil di Sekretariat" : "Antar ke Alamat"}
${metode === "delivery" ? `Alamat: ${alamat}` : "" }
Catatan: ${catatan}

Terima kasih.
`;

    const encSubject = encodeURIComponent(subject);
    const encBody = encodeURIComponent(text.trim());

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${encSubject}&body=${encBody}`;
    const mailtoUrl = `mailto:${to}?subject=${encSubject}&body=${encBody}`;

    const w = window.open(gmailUrl, "_blank");
    if (!w) {
      window.location.href = mailtoUrl;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-extrabold">Checkout</h1>
                <Button variant="outline" onClick={() => navigate("/product")}>
                  Kembali ke Produk
                </Button>
              </div>

              {isEmpty ? (
                <div className="text-center py-10 text-muted-foreground">
                  Keranjang kosong. Silakan tambahkan produk terlebih dahulu.
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((line) => (
                    <div
                      key={line.product.name}
                      className="flex items-center gap-4 p-3 rounded-xl border bg-white"
                    >
                      <img
                        src={line.product.image}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{line.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {currency(line.product.price)} • Qty {line.qty}
                        </p>
                      </div>
                      <div className="font-semibold">
                        {currency(line.qty * line.product.price)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Data Pemesan</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Nama Lengkap</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded-lg px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">No. Telepon</label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Metode</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2"
                    value={metode}
                    onChange={(e) =>
                      setMetode(e.target.value as "pickup" | "delivery")
                    }
                  >
                    <option value="pickup">Ambil di Sekretariat</option>
                    <option value="delivery">Antar ke Alamat (+ Rp 10.000)</option>
                  </select>
                </div>
              </div>

              {metode === "delivery" && (
                <div>
                  <label className="block text-sm mb-1">Alamat Lengkap</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm mb-1">Catatan</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Contoh: tanpa pedas, ambil jam 13.00, dsb."
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl border-0 sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Ringkasan</h2>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{currency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Ongkir</span>
                <span className="font-semibold">{currency(ongkir)}</span>
              </div>
              <div className="h-px bg-muted" />
              <div className="flex items-center justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-extrabold">{currency(total)}</span>
              </div>

              <Button
                disabled={isEmpty}
                onClick={handleConfirmEmail}
                className="w-full bg-gradient-primary text-primary-foreground font-bold py-6 rounded-xl hover:opacity-90"
              >
                Konfirmasi via Email
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/product")}
                className="w-full"
              >
                Kembali Belanja
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
