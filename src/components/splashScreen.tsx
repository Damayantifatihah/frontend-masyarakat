"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glow Background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
        className="absolute w-80 h-80 rounded-full bg-[#E8734A]/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{
            scale: 0.5,
            opacity: 0,
            y: 30,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <Image
            src="/images/logo.png"
            alt="LaporinAja"
            width={300}
            height={100}
            priority
          />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: 0.5,
          }}
          className="mt-3 text-gray-600"
        >
          Suara Masyarakat, Aksi Nyata
        </motion.p>

        {/* Loading Bar */}
        <div className="w-52 h-2 mt-8 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E8734A]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2.3,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}