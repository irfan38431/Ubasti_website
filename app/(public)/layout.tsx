"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Floating nav icon — visible on all pages */}
      <Navbar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          className="flex-1 flex flex-col"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <main id="main-content">
            {children}
          </main>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  );
}
