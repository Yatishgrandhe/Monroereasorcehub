'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617] text-white border-t border-white/[0.06] pt-32 pb-16">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24 mb-24">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-3 mb-8 group">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <span className="text-black font-black text-2xl">M</span>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase font-display">Monroe Hub</span>
            </Link>
            <p className="text-slate-400 text-base mb-10 max-w-sm leading-relaxed">
              Empowering the residents of Monroe, North Carolina with access to essential services and community opportunities.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer" />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-black mb-8 text-xs uppercase tracking-widest font-display">Platform</h3>
            <ul className="space-y-4">
              {['Resources', 'Events', 'Career Help', 'Volunteer', 'About Us', 'Info'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Info' ? '/info' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-slate-500 hover:text-white transition-colors text-sm font-bold flex items-center group"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-white font-black mb-8 text-xs uppercase tracking-widest font-display">Contact</h3>
            <div className="space-y-5">
              <div className="flex items-center space-x-4 text-slate-500">
                <MapPin className="h-5 w-5 text-slate-700" />
                <span className="text-sm font-bold">Monroe, NC 28112</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-500">
                <Mail className="h-5 w-5 text-slate-700" />
                <span className="text-sm font-bold">info@monroeresourcehub.org</span>
              </div>
              <Link href="/contact" className="inline-flex mt-4 px-6 py-2 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                Get in touch
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 text-slate-400 font-medium">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-primary-400 fill-primary-400" />
            <span>for Monroe, NC</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>© {currentYear} Monroe Resource Hub</span>
          </div>

          <div className="text-slate-500 text-xs">
            CATA TSA Chapter Project
          </div>
        </div>
      </div>
    </footer>
  );
}
