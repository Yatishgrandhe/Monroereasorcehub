'use client';

import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white border-t border-white/5 pt-24 pb-16 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent-500/5 blur-[120px] pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 lg:gap-24 mb-20">
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-4 mb-8 group shrink-0">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-white/20 shrink-0 bg-white backdrop-blur-md flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform duration-500">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-3xl font-black tracking-tighter font-serif block leading-none text-white whitespace-nowrap">
                  Monroe Resource <span className="text-accent-500 italic block">Hub.</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-base mb-8 max-w-sm leading-relaxed">
              Monroe Resource Hub is a free, community-maintained directory of local services in Union County, NC. We connect residents with vital help and opportunity.
            </p>
            <div className="flex gap-4">
              {['X', 'FB', 'IG'].map(social => (
                <div key={social} className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer text-[10px] font-bold tracking-widest text-white/50 hover:text-white">
                  {social}
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-accent-500 font-bold mb-8 text-[10px] uppercase tracking-[0.3em]">Link Directory</h3>
            <ul className="space-y-4">
              {['Resources', 'Events', 'Career Center', 'Volunteer', 'About Us'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-accent-500 transition-colors text-sm font-bold uppercase tracking-widest"
                  >
                    {item}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/info"
                  className="text-gray-400 hover:text-accent-500 transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  Technical Transparency
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-accent-500 font-bold mb-8 text-[10px] uppercase tracking-[0.3em]">Contact & Operations</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-accent-500" />
                </div>
                <div>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-1">Central Office</p>
                  <p className="text-sm text-gray-400 leading-relaxed font-medium">
                    PO Box 1234<br />Monroe, NC 28112
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-accent-500" />
                </div>
                <div>
                  <p className="text-sm text-white font-bold uppercase tracking-widest mb-1">Support Channel</p>
                  <p className="text-sm text-gray-400 font-medium">hello@monroeresourcehub.us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500 text-center md:text-left space-y-1">
            <p>© {currentYear} Monroe Resource Hub. Built for Union County, by Union County residents.</p>
            <p className="text-xs text-gray-600">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link>
            <Link href="/info" className="text-gray-500 hover:text-white transition-colors">Information</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
