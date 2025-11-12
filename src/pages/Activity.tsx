import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import workshopImg from "@/assets/activity-workshop.jpg";
import bibleStudyImg from "@/assets/activity-bible-study.jpg";
import worshipImg from "@/assets/activity-worship.jpg";
import serviceImg from "@/assets/activity-service.jpg";

const Activity = () => {
  const activities = [
    {
      title: "Leadership Workshop",
      date: "Sabtu, 15 Januari 2025",
      location: "Gedung L - Kampus 1",
      description: "Workshop kepemimpinan Kristen untuk mengembangkan karakter pemimpin yang melayani.",
      image: workshopImg,
    },
    {
      title: "Bible Study Session",
      date: "Rabu, 20 Januari 2025",
      location: "Ruang Doa Kampus 2",
      description: "Sesi pembelajaran Alkitab interaktif dengan pembahasan mendalam tentang firman Tuhan.",
      image: bibleStudyImg,
    },
    {
      title: "Worship Night",
      date: "Jumat, 25 Januari 2025",
      location: "Aula Universitas",
      description: "Malam penyembahan spesial dengan pujian dan penyerahan kepada Tuhan.",
      image: worshipImg,
    },
    {
      title: "Community Service",
      date: "Minggu, 30 Januari 2025",
      location: "Panti Asuhan Kasih",
      description: "Kegiatan pelayanan sosial untuk memberikan kasih kepada sesama yang membutuhkan.",
      image: serviceImg,
    },
  ];

  const pastActivities = [
    {
      title: "Christmas Celebration 2024",
      date: "Desember 2024",
      description: "Perayaan Natal bersama dengan tema 'Terang di Tengah Dunia'. Acara sukses dihadiri oleh lebih dari 200 mahasiswa dengan ibadah yang penuh sukacita dan kebersamaan.",
      image: worshipImg,
    },
    {
      title: "Retreat Rohani",
      date: "November 2024",
      description: "Retreat tiga hari dua malam di Puncak untuk penyegaran rohani dan penguatan persekutuan. Pengalaman spiritual yang mendalam dengan sesi doa dan penyembahan.",
      image: bibleStudyImg,
    },
    {
      title: "Seminar Karier & Panggilan",
      date: "Oktober 2024",
      description: "Seminar tentang menemukan panggilan Tuhan dalam dunia kerja dan karir profesional. Dibimbing oleh para profesional Kristen yang berpengalaman.",
      image: workshopImg,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto">
        {/* Header with animated title */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-gradient-primary bg-clip-text text-transparent italic">
            POUT's Activity
          </h1>
          <div className="h-1.5 w-40 bg-gradient-primary rounded-full mx-auto mb-6"></div>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
            Berbagai kegiatan untuk pertumbuhan rohani dan persekutuan
          </p>
        </div>

        {/* Upcoming Activities with Images */}
        <section className="mb-24">
          <div className="flex items-center mb-10">
            <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
            <h2 className="text-4xl font-bold text-primary mx-6">Kegiatan Mendatang</h2>
            <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {activity.title}
                      </h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-semibold">{activity.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-2 text-accent" />
                      <span>{activity.location}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{activity.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Activities with enhanced layout */}
        <section>
          <div className="flex items-center mb-10">
            <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
            <h2 className="text-4xl font-bold text-primary mx-6">Kegiatan Yang Telah Dilaksanakan</h2>
            <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
          </div>
          <div className="space-y-8">
            {pastActivities.map((activity, index) => (
              <Card 
                key={index} 
                className="group shadow-card hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden animate-slide-in-left"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-0 md:flex">
                  <div className="md:w-2/5 relative overflow-hidden">
                    <img 
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/50 md:to-background"></div>
                  </div>
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold mb-3 text-primary group-hover:text-accent transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-lg text-secondary font-bold mb-4 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      {activity.date}
                    </p>
                    <p className="text-muted-foreground leading-relaxed text-lg">{activity.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-20">
          <Card className="bg-gradient-hero shadow-2xl border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                Jangan Lewatkan Kegiatan Kami!
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Ikuti media sosial kami untuk mendapat update terbaru tentang kegiatan-kegiatan menarik POUT
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Activity;
