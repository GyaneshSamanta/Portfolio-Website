"use client";

import { ContactCTA } from "@/components/contact-cta";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-4 md:px-12 max-w-7xl mx-auto pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
      <ContactCTA />
    </div>
  );
}
