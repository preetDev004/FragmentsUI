"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AuthContextProps, useAuth } from "react-oidc-context";

const signOutRedirect = () => {
  const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!;
  const logoutUri = process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL!;
  const cognitoDomain = process.env.NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();

  const signIn = async (auth: AuthContextProps) => {
    try {
      await auth.signinRedirect()
    } catch (error) {
      console.error(error);
    }
  };
  const signOut = async (auth: AuthContextProps) => {
    try {
      await auth.removeUser();
      signOutRedirect();
    } catch (error) {
      console.error(error);
    }
  };

  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Benefits", href: "#benefits" },
    { label: "Documentation", href: "#" },
    { label: "Pricing", href: "#" },
  ];

  return (
    <nav className="sticky top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-orange-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={'/'} className="flex-shrink-0">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              FSS
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-orange-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {auth.isAuthenticated ? (
              <Button
                onClick={() => signOut(auth)}
                className="bg-orange-500 hover:bg-orange-600 hover:underline hover:underline-offset-2"
              >
                <span>Log Out</span>
              </Button>
            ) : (
              <Button
                onClick={() => signIn(auth)}
                className="bg-orange-500 hover:bg-orange-600 hover:underline hover:underline-offset-2"
              >
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-orange-500"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 border-b border-orange-900/20"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-3 py-2 text-gray-300 hover:text-orange-500 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-2 pb-1">
                {auth.isAuthenticated ? (
                  <Button
                    onClick={() => signOut(auth)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Log Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => signIn(auth)}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
