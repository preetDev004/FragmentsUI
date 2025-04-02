import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/80 border-t border-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              FSS
            </h3>
            <p className="text-gray-400">
              Transforming manufacturing data management with cloud-native solutions.
            </p>
            <div className="flex space-x-4">
              <a
                target="_blank"
                href="https://github.com/preetDev004"
                className="text-gray-400 hover:text-orange-500"
              >
                <Github size={20} />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/in/preet-patel-16908226a/"
                className="text-gray-400 hover:text-orange-500"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  API Reference
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-orange-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for updates and insights.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-black/40 border border-orange-900/50 rounded-md text-gray-300 focus:outline-none focus:border-orange-500"
              />
              <Button className="w-full bg-orange-500 hover:bg-orange-600">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-900/20">
          <p className="text-center text-gray-400">
            &copy; {currentYear} FSS. All rights reserved. Created with 🧡 by Preet.
          </p>
        </div>
      </div>
    </footer>
  );
}
