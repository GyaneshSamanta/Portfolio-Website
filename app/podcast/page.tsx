"use client";

import { motion } from "framer-motion";
import data from "@/data/new_content.json";
import Image from "next/image";
import { ArrowUpRight, Play, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PodcastPage() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">Podcast & Video</h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
          Conversations, case studies, and insights on product strategy from the <strong className="text-foreground">@GyaneshOnProduct</strong> YouTube channel.
        </p>
      </motion.div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.youtube.map((video, index) => (
          <motion.a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group block rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-secondary">
              <Image 
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="w-8 h-8 rounded-full border border-border flex shrink-0 items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-transparent transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-auto flex items-center gap-2 text-sm text-muted-foreground font-mono font-medium">
                <span>{video.views}</span>
                <span>&bull;</span>
                <span>{video.date}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
