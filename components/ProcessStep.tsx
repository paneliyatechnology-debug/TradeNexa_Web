"use client";

import React from "react";
import { LucideIcon, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ProcessStepProps {
  steps: Step[];
}

export default function ProcessStep({ steps }: ProcessStepProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 relative">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex flex-col items-center text-center relative group">
            {/* Step Icon & Number */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 border-2 border-slate-100 text-slate-700 shadow-sm transition-all group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-md"
            >
              <Icon className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-sm group-hover:bg-white group-hover:text-primary transition-colors">
                {step.number}
              </span>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="mt-6"
            >
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>

            {/* Connecting Arrow for Desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[70%] w-[60%] z-0 text-slate-300">
                <ArrowRight className="h-6 w-6 mx-auto animate-pulse" />
              </div>
            )}

            {/* Connecting Arrow for Mobile */}
            {index < steps.length - 1 && (
              <div className="md:hidden mt-6 text-slate-300">
                <ArrowDown className="h-6 w-6 mx-auto animate-pulse" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
