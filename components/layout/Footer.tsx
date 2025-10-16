import Link from 'next/link';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold">Monroe Resource Hub</span>
              </div>
              <p className="text-secondary-300 mb-6 max-w-md">
                Connecting Monroe, North Carolina residents with vital community resources, 
                services, and opportunities to build a stronger, more supported community.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-secondary-300">
                  <MapPin className="h-4 w-4" />
                  <span>Monroe, North Carolina 28112</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-300">
                  <Phone className="h-4 w-4" />
                  <span>(704) 283-0000</span>
                </div>
                <div className="flex items-center space-x-2 text-secondary-300">
                  <Mail className="h-4 w-4" />
                  <span>info@monroeresourcehub.org</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/resources" className="text-secondary-300 hover:text-white transition-colors">
                    Resource Directory
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="text-secondary-300 hover:text-white transition-colors">
                    Community Events
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-secondary-300 hover:text-white transition-colors">
                    Career Center
                  </Link>
                </li>
                <li>
                  <Link href="/volunteer" className="text-secondary-300 hover:text-white transition-colors">
                    Volunteer Opportunities
                  </Link>
                </li>
                <li>
                  <Link href="/submit-resource" className="text-secondary-300 hover:text-white transition-colors">
                    Submit a Resource
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/career/resume-builder" className="text-secondary-300 hover:text-white transition-colors">
                    AI Resume Builder
                  </Link>
                </li>
                <li>
                  <Link href="/career/job-assistant" className="text-secondary-300 hover:text-white transition-colors">
                    Job Application Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/career/jobs" className="text-secondary-300 hover:text-white transition-colors">
                    Local Job Board
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-secondary-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-secondary-300 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-secondary-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for Monroe, NC</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-secondary-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <span>© 2024 Monroe Resource Hub</span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-secondary-500">
            <p>
              A project by the Monroe High School TSA Chapter
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
