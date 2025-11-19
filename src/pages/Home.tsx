import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Users, Heart, BookOpen, Target } from "lucide-react";
import heroImage from "@/assets/hero-fellowship.jpg";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(135deg, rgba(66, 135, 245, 0.85), rgba(88, 166, 255, 0.75)), url(${heroImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold text-primary-foreground mb-6 animate-fade-in tracking-tight drop-shadow-lg">
            HI!! WE ARE <span className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg inline-block transform hover:scale-105 transition-transform">POUT</span>
          </h1>
          <div className="max-w-3xl mx-auto space-y-4 mb-10 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground drop-shadow-md">
              Selamat Datang di POUT
            </h2>
            <p className="text-2xl text-primary-foreground/95 font-semibold">
              Bersama dalam Kasih, Bertumbuh dalam Iman
            </p>
            <p className="text-2xl text-primary-foreground/95 font-semibold">
              dan Bersama dengan Keluarga Rohani
            </p>
            <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 mt-6 border-2 border-primary-foreground/20">
              <p className="text-xl text-primary-foreground italic font-medium">
                Markus 10:45 <br/>
                "Karena Anak Manusia juga datang bukan untuk dilayani, melainkan untuk melayani..."
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/about")}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-xl px-12 py-8 rounded-full shadow-2xl transition-all hover:scale-110 hover:shadow-card-hover animate-float"
          >
            JELAJAHI POUT
          </Button>
        </div>
      </section>

      <section className="py-24 px-4 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-2xl hover:shadow-card-hover transition-all duration-500 border-2 border-primary/10 transform hover:-translate-y-2">
              <CardContent className="p-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="h-1 w-20 bg-gradient-primary rounded-full"></div>
                  <Heart className="h-10 w-10 text-primary mx-4 animate-pulse-slow" />
                  <div className="h-1 w-20 bg-gradient-primary rounded-full"></div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-primary bg-gradient-primary bg-clip-text">
                  Selamat Datang di POUT UNTAR
                </h2>
                <p className="text-xl text-muted-foreground text-center leading-relaxed">
                  POUT UNTAR adalah komunitas keagamaan di Universitas Tarumanagara 
                  yang berdedikasi untuk pertumbuhan rohani mahasiswa. Kami percaya bahwa 
                  setiap individu memiliki potensi luar biasa untuk bertumbuh dalam iman 
                  dan kasih, serta berkontribusi positif bagi sesama.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-b from-muted/30 to-background relative">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Nilai-Nilai Kami
            </h2>
            <div className="h-1.5 w-32 bg-gradient-primary rounded-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: "Kasih", description: "Mengasihi Tuhan dan sesama dengan tulus", color: "from-red-500 to-pink-500", delay: "0s" },
              { icon: Users, title: "Persekutuan", description: "Membangun komunitas yang solid dan saling mendukung", color: "from-blue-500 to-cyan-500", delay: "0.1s" },
              { icon: BookOpen, title: "Pembelajaran", description: "Terus bertumbuh dalam pengetahuan firman", color: "from-green-500 to-emerald-500", delay: "0.2s" },
              { icon: Target, title: "Pelayanan", description: "Melayani dengan hati yang tulus dan rendah hati", color: "from-yellow-500 to-orange-500", delay: "0.3s" },
            ].map((value, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 overflow-hidden animate-scale-in"
                style={{ animationDelay: value.delay }}
              >
                <CardContent className="p-8 text-center relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <value.icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }}></div>
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Siap Bergabung dengan Kami?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari keluarga POUT dan rasakan pengalaman pertumbuhan rohani yang luar biasa!
          </p>
          <Button
            onClick={() => navigate("/about")}
            size="lg"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold text-lg px-10 py-6 rounded-full shadow-2xl transition-all hover:scale-105"
          >
            Pelajari Lebih Lanjut
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
