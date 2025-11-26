import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Loader2 } from "lucide-react";

interface ActivityItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  status: 'upcoming' | 'past';
  created_at?: string;
  updated_at?: string;
}

const Activity = () => {
  const [upcomingActivities, setUpcomingActivities] = useState<ActivityItem[]>([]);
  const [pastActivities, setPastActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/activities`);

      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }

      const data = await response.json();
      const activities = Array.isArray(data) ? data : data.data || [];

      const upcoming = activities.filter((a: ActivityItem) => a.status === 'upcoming');
      const past = activities.filter((a: ActivityItem) => a.status === 'past');

      setUpcomingActivities(upcoming);
      setPastActivities(past);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to load activities. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading kegiatan...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchActivities}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* Upcoming Activities with Images */}
            <section className="mb-24">
              <div className="flex items-center mb-10">
                <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
                <h2 className="text-4xl font-bold text-primary mx-6">Kegiatan Mendatang</h2>
                <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
              </div>

              {upcomingActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Tidak ada kegiatan mendatang</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-8">
                  {upcomingActivities.map((activity, index) => (
                    <Card
                      key={activity._id || activity.id || index}
                      className="group shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden animate-scale-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80';
                            }}
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
              )}
            </section>

            {/* Past Activities with enhanced layout */}
            <section>
              <div className="flex items-center mb-10">
                <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
                <h2 className="text-4xl font-bold text-primary mx-6">Kegiatan Yang Telah Dilaksanakan</h2>
                <div className="h-1 flex-1 bg-gradient-primary rounded-full"></div>
              </div>

              {pastActivities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">Tidak ada kegiatan yang telah dilaksanakan</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {pastActivities.map((activity, index) => (
                    <Card
                      key={activity._id || activity.id || index}
                      className="group shadow-card hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden animate-slide-in-left"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <CardContent className="p-0 md:flex">
                        <div className="md:w-2/5 relative overflow-hidden h-80">
                          <img
                            src={activity.image}
                            alt={activity.title}
                            className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-700" onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80';
                            }}
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
              )}
            </section>
          </>
        )}

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

