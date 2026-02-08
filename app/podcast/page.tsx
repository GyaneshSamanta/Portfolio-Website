import videos from "@/data/videos.json";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/ui/section";

export const metadata = {
  title: "Podcast",
  description: "Episodes and video content.",
};

export default function PodcastPage() {
  return (
    <Section>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Podcast & Videos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Conversations about technology, product management, and the creator economy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group overflow-hidden flex flex-col hover:border-primary/50 transition-colors h-full">
              {/* Thumbnail Placeholder - In real usage, use Next/Image with the thumbnail URL */}
              <div className="aspect-video bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="h-6 w-6 fill-current" />
                  </div>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2">{video.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground line-clamp-3">{video.description}</p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-white/5 mt-auto">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={video.url} target="_blank">
                    Watch on YouTube
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
}
