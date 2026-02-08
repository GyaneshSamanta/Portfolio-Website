"use client";

import { useState } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SITE_CONFIG } from "@/lib/constants";

export function EmailCopy() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_CONFIG.links.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-muted-foreground">
          <div className="p-3 bg-secondary/10 rounded-lg text-primary">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Email</p>
            <p className="text-sm">{SITE_CONFIG.links.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="shrink-0"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          <span className="sr-only">Copy Email</span>
        </Button>
      </CardContent>
    </Card>
  );
}
