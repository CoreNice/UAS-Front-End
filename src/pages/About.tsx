import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Users, BookOpen, Award, Cross } from "lucide-react";
import wavePattern from "@/assets/wave-pattern.jpg";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <Cross className="h-20 w-20 text-primary animate-float" />
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">About Us</span>
          </h1>
          <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
            Mengenal lebih dalam tentang POUT UNTAR dan komitmen kami
          </p>
        </div>

        {/* About POUT with pattern background */}
        <section className="mb-20 animate-scale-in">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div 
                  className="absolute inset-0 opacity-5 bg-cover bg-center"
                  style={{ backgroundImage: `url(${wavePattern})` }}
                ></div>
                <div className="relative z-10 p-8 md:p-12">
                  <div className="flex items-center justify-center mb-8">
                    <div className="h-1 w-20 bg-gradient-primary rounded-full"></div>
                    <BookOpen className="h-12 w-12 text-primary mx-4" />
                    <div className="h-1 w-20 bg-gradient-primary rounded-full"></div>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-primary bg-clip-text text-transparent">
                    Tentang POUT UNTAR
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    POUT UNTAR (Persekutuan Oikumene Universitas Tarumanagara) adalah organisasi 
                    kemahasiswaan yang berfokus pada pertumbuhan rohani dan pembinaan karakter mahasiswa 
                    Kristen di lingkungan Universitas Tarumanagara.
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                    Sejak berdirinya, POUT telah menjadi wadah bagi mahasiswa untuk bertumbuh dalam iman, 
                    membangun persekutuan yang solid, dan melayani sesama dengan kasih Kristus. Kami percaya 
                    bahwa setiap mahasiswa memiliki potensi luar biasa untuk menjadi berkat bagi dunia.
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Melalui berbagai program seperti ibadah mingguan, kelompok kecil, retreat rohani, 
                    dan kegiatan pelayanan sosial, POUT berusaha menciptakan lingkungan yang mendukung 
                    pertumbuhan spiritual dan akademik mahasiswa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Identity & History */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Identitas & Sejarah
            </h2>
            <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 animate-slide-in-left">
              <CardContent className="p-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl p-4 mr-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary group-hover:text-accent transition-colors">Identitas</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  POUT UNTAR adalah persekutuan oikumene yang terbuka bagi seluruh mahasiswa Kristen 
                  dari berbagai denominasi. Kami menghargai keberagaman dalam kesatuan iman kepada 
                  Yesus Kristus sebagai Tuhan dan Juruselamat.
                </p>
              </CardContent>
            </Card>

            <Card className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 animate-slide-in-right">
              <CardContent className="p-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-purple-600 to-purple-400 rounded-2xl p-4 mr-4 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Award className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary group-hover:text-accent transition-colors">Sejarah</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Didirikan dengan visi untuk menjadi terang di tengah kampus, POUT telah melayani 
                  ribuan mahasiswa selama bertahun-tahun. Setiap generasi membawa pembaharuan 
                  sambil tetap mempertahankan nilai-nilai inti persekutuan.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision & Mission with enhanced design */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-2xl border-0 overflow-hidden animate-scale-in">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-hero"></div>
                <CardContent className="relative z-10 p-10">
                  <div className="flex items-center mb-8">
                    <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-2xl p-4 mr-4">
                      <Eye className="h-12 w-12 text-primary-foreground" />
                    </div>
                    <h2 className="text-4xl font-bold text-primary-foreground">Visi</h2>
                  </div>
                  <p className="text-xl text-primary-foreground leading-relaxed">
                  Menjadi komunitas mahasiswa Kristen yang mengasihi Tuhan, saling mengasihi, 
                  dan menjadi berkat bagi kampus dan masyarakat melalui kehidupan yang mencerminkan 
                  karakter Kristus.
                  </p>
                </CardContent>
              </div>
            </Card>

            <Card className="shadow-2xl border-0 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-10">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-primary rounded-2xl p-4 mr-4 shadow-lg">
                    <Target className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h2 className="text-4xl font-bold text-primary">Misi</h2>
                </div>
                <ul className="space-y-4 text-muted-foreground text-lg">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-2xl font-bold">•</span>
                    Membimbing mahasiswa dalam pertumbuhan rohani yang berkelanjutan
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-2xl font-bold">•</span>
                    Membangun persekutuan yang solid dan saling mendukung
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-2xl font-bold">•</span>
                    Mengembangkan kepemimpinan Kristen yang melayani
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 text-2xl font-bold">•</span>
                    Melakukan pelayanan sosial sebagai wujud kasih Kristus
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Core Activities with enhanced cards */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Kegiatan Rutin POUT
            </h2>
            <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Ibadah Mingguan",
                description: "Kebaktian setiap minggu untuk penyembahan bersama dan mendengar firman Tuhan",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: Users,
                title: "Kelompok Kecil",
                description: "Pertemuan dalam kelompok kecil untuk pembelajaran Alkitab dan sharing kehidupan",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: BookOpen,
                title: "Bible Study",
                description: "Sesi pembelajaran intensif untuk menggali kebenaran firman Tuhan lebih dalam",
                color: "from-green-500 to-emerald-500",
              },
            ].map((activity, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${activity.color} rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <activity.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary group-hover:text-accent transition-colors">{activity.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
