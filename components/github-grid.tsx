"use client";

import { motion } from "framer-motion";
import { Repo } from "@/lib/github";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Star, GitFork, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface GithubGridProps {
  repos: Repo[];
}

export function GithubGrid({ repos }: GithubGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="h-full flex flex-col hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl truncate pr-2" title={repo.name}>
                  {repo.name}
                </CardTitle>
                <div className="text-xs font-mono text-muted-foreground border border-white/10 px-2 py-1 rounded">
                  {repo.language || "Code"}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="line-clamp-3">
                {repo.description || "No description provided."}
              </CardDescription>
            </CardContent>
            <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t border-white/5 pt-4 mt-auto">
              <div className="flex gap-4">
                <div className="flex items-center gap-1 hover:text-primary transition-colors">
                  <Star className="h-4 w-4" />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1 hover:text-primary transition-colors">
                  <GitFork className="h-4 w-4" />
                  <span>{repo.forks_count}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="-mr-2">
                <Link href={repo.html_url} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
