"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
      }}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{
          scale: 0.7,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        className="flex flex-col items-center"
      >
        <Image
          src="/images/logo.png"
          alt="LaporinAja"
          width={280}
          height={80}
          priority
        />

        <motion.p
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
          }}
          className="mt-4 text-[#E8734A] font-medium"
        >
          Memuat halaman...
        </motion.p>
      </motion.div>
    </motion.div>
  );
}