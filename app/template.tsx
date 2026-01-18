"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} // Exit animations might not work perfectly with just template in some Next.js versions without AnimatePresence in layout, but entry animations will work great.
            transition={{ ease: "easeInOut", duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
}
