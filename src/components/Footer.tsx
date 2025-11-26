import { Mail, Phone, MapPin, Github, Linkedin, Instagram, Twitter, Facebook } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-100">
            {/* Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="rounded bg-amber-300 px-2 py-[2px] text-slate-900 font-black">
                                POUT
                            </span>
                        </div>
                        <p className="text-sm text-slate-400">
                            POUT (Persekutuan Oikumene Universitas Tarumanagara) adalah organisasi kemahasiswaan yang berfokus pada pertumbuhan rohani dan pembinaan karakter mahasiswa Kristen di lingkungan Universitas Tarumanagara.
                            POUT telah menjadi wadah bagi mahasiswa untuk bertumbuh dalam iman, membangun persekutuan yang solid, dan melayani sesama dengan kasih Kristus. Kami percaya bahwa setiap mahasiswa memiliki potensi luar biasa untuk menjadi berkat bagi dunia.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="text-slate-400 hover:text-white transition">Home</a></li>
                            <li><a href="/product" className="text-slate-400 hover:text-white transition">Products</a></li>
                            <li><a href="/activity" className="text-slate-400 hover:text-white transition">Activities</a></li>
                            <li><a href="/about" className="text-slate-400 hover:text-white transition">About Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Information</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2">
                                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-400" />
                                <a href="mailto:contact@pout.untar.ac.id" className="text-slate-400 hover:text-white transition">
                                    oikoumene.ut@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-400" />
                                <span className="text-slate-400">Jakarta, Indonesia</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="font-semibold mb-4">Follow Us</h4>
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-white transition"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-white transition"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500 text-slate-400 hover:text-white transition"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800 my-8"></div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                    <p>&copy; {currentYear} POUT. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
