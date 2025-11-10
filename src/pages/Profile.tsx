import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Heart, BookOpen, Target, Award, Shield } from "lucide-react";
import heroImage from "@/assets/hero-fellowship.jpg";

const Profile = () => {
  const divisions = [
    {
      name: "BPHI",
      description: "Badan Pengurus Harian Inti - Tim inti yang mengelola operasional POUT dengan dedikasi penuh",
      icon: Shield,
      color: "from-blue-600 to-blue-400",
    },
    {
      name: "Badan Pembina",
      description: "Membimbing dan memberikan arahan spiritual kepada anggota dengan penuh kasih dan hikmat",
      icon: Award,
      color: "from-purple-600 to-purple-400",
    },
    {
      name: "Acara",
      description: "Merencanakan dan mengkoordinasi seluruh kegiatan POUT dengan kreatif dan terorganisir",
      icon: Target,
      color: "from-cyan-600 to-cyan-400",
    },
    {
      name: "Kelompok Kecil",
      description: "Fasilitator pertumbuhan rohani dalam kelompok kecil yang intim dan mendalam",
      icon: Users,
      color: "from-green-600 to-green-400",
    },
    {
      name: "Pujian & Penyembahan",
      description: "Memimpin ibadah melalui musik dan penyembahan yang penuh semangat dan ketulusan",
      icon: Heart,
      color: "from-pink-600 to-pink-400",
    },
    {
      name: "Doa & Pemerhati",
      description: "Tim khusus yang melayani dalam doa syafaat dan perhatian pastoral kepada setiap anggota",
      icon: Heart,
      color: "from-orange-600 to-orange-400",
    },
    {
      name: "Padok",
      description: "Pendampingan Doktrinal - Memastikan ajaran sesuai dengan kebenaran firman Tuhan",
      icon: BookOpen,
      color: "from-indigo-600 to-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        {/* Hero Header with Image */}
        <div className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl animate-fade-in">
          <div 
            className="h-96 bg-cover bg-center relative"
            style={{ 
              backgroundImage: `linear-gradient(135deg, rgba(66, 135, 245, 0.9), rgba(88, 166, 255, 0.85)), url(${heroImage})`,
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <h1 className="text-6xl md:text-7xl font-extrabold text-primary-foreground mb-6 drop-shadow-lg">
                Profil POUT
              </h1>
              <div className="h-1.5 w-32 bg-secondary rounded-full mb-6"></div>
              <p className="text-2xl text-primary-foreground max-w-3xl leading-relaxed drop-shadow-md">
                Tim yang berdedikasi untuk melayani dan membangun komunitas rohani di kampus
              </p>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <Card className="mb-20 shadow-2xl border-0 overflow-hidden animate-scale-in">
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary"></div>
              <div className="relative z-10 p-12 text-center">
                <div className="inline-block mb-6">
                  <Heart className="h-16 w-16 text-primary-foreground animate-pulse-slow" />
                </div>
                <p className="text-2xl md:text-3xl text-primary-foreground italic leading-relaxed font-medium">
                  "Yak berat kah sisan dalek-dalek salan BMI Hana laen keluarga, persekutuan, 
                  melakukan, berjaga akan kasih – santoseng yeman kenap jenaka perfay dalam 
                  perlindungan dan menghinakan Tuhan."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meet Our Team Button */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Button 
            size="lg"
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold px-12 py-8 rounded-full shadow-2xl text-xl transform hover:scale-105 transition-all"
          >
            <Users className="mr-3 h-6 w-6" />
            MEET OUR TEAM
          </Button>
        </div>

        {/* Divisions Section with Enhanced Design */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Divisi & Departemen BPHI
            </h2>
            <div className="h-1.5 w-40 bg-gradient-primary rounded-full mx-auto"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {divisions.map((division, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${division.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <division.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                        {division.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {division.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-20">
          <Card className="bg-gradient-hero shadow-2xl border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                Tertarik Bergabung dengan Salah Satu Divisi?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                Setiap divisi memiliki peran penting dalam membangun komunitas POUT. Temukan tempat pelayanan Anda bersama kami!
              </p>
              <Button 
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold px-10 py-6 rounded-full shadow-2xl transform hover:scale-105 transition-all"
              >
                Hubungi Kami
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Profile;
