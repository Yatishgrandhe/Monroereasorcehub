'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white border-t border-primary-900 pt-20 pb-12">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          <div className="flex flex-col">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm ring-1 ring-white/20 shrink-0">
                <img
                  src="/logo.png"
                  alt="Monroe Resource Hub Logo"
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              <span className="text-xl font-bold tracking-tight font-serif">Monroe Resource Hub</span>
            </Link>
            <p className="text-gray-300 text-sm mb-6 max-w-sm leading-relaxed">
              Monroe Resource Hub is a free, community-maintained directory of local services in Union County, NC. We connect residents with vital help and opportunity.
            </p>
            <div className="flex gap-4">
              {/* Social Icons Placeholder */}
              {['Twitter', 'Facebook', 'Instagram'].map(social => (
                <div key={social} className="w-8 h-8 rounded-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer text-xs font-semibold">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-accent-500 font-bold mb-6 text-sm uppercase tracking-widest font-serif">Link Directory</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {['Resources', 'Events', 'Career Center', 'Volunteer', 'About Us', 'Information'].map((item) => (
                <li key={item}>
                  <Link
                    href={item === 'Information' ? '/info' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col">
            <h3 className="text-accent-500 font-bold mb-6 text-sm uppercase tracking-widest font-serif">Contact & Location</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-4 w-4 mt-1 text-accent-500" />
                <span className="text-sm">PO Box 1234<br />Monroe, NC 28112</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4 text-accent-500" />
                <span className="text-sm">hello@monroeresourcehub.us</span>
              </div>
              <div className="pt-2">
                <p className="text-[10px] text-gray-500 font-medium italic">
                  Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-gray-400">
            © {currentYear} Monroe Resource Hub. Built in Union County, for Union County.
          </div>

          <div className="flex gap-6 text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>

  );
}
