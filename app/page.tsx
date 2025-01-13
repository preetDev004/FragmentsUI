"use client";

import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  Cpu,
  Database,
  FileText,
  Gauge,
  Image,
  Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";

export const signOutRedirect = () => {
  const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID!;
  const logoutUri = process.env.NEXT_PUBLIC_OAUTH_SIGN_OUT_REDIRECT_URL!;
  const cognitoDomain = process.env.NEXT_PUBLIC_AWS_COGNITO_HOSTED_UI_DOMAIN;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
    logoutUri
  )}`;
};
export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-orange-950">
      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,98,0,0.1),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300 mb-6">
                Fragment Storage Service
              </h1>
              <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                A scalable cloud-based microservice for managing and processing
                text and image fragments across your manufacturing systems.
              </p>
              <div className="relative z-20 flex gap-4 justify-center">
                {auth.isAuthenticated ? (
                  <Button
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-1 border-orange-500 text-orange-500 bg-orange-950 hover:bg-orange-950 hover:text-orange-500 hover:underline hover:underline-offset-2 transition-colors"
                  >
                    <span>Dashboard</span> <ArrowRight className="w-5 h-5" />
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => auth.signinRedirect()}
                      size="lg"
                      className="bg-orange-500 hover:bg-orange-600 transition-colors hover:underline hover:underline-offset-2"
                      variant="ghost"
                    >
                      Get Started
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-orange-500 text-orange-500 bg-orange-950 hover:bg-orange-950 hover:text-orange-500 hover:underline hover:underline-offset-2 transition-colors"
                    >
                      Documentation
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<FileText className="w-10 h-10 text-orange-500" />}
                title="Multi-Format Support"
                description="Handle various text formats including JSON, CSV, Markdown, and plain text with ease."
              />
              <FeatureCard
                icon={<Image className="w-10 h-10 text-orange-500" />}
                title="Image Processing"
                description="Store and process images from automated assembly line cameras and quality control systems."
              />
              <FeatureCard
                icon={<Cpu className="w-10 h-10 text-orange-500" />}
                title="AI Ready"
                description="Built-in support for AI and Machine Learning model integration and training."
              />
              <FeatureCard
                icon={<Cloud className="w-10 h-10 text-orange-500" />}
                title="Cloud Native"
                description="Seamlessly deployed on AWS infrastructure for maximum scalability and reliability."
              />
            </div>
          </motion.div>
        </section>

        {/* Key Benefits */}
        <section
          id="benefits"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-300">
              Key Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <BenefitCard
                icon={<Gauge className="w-8 h-8" />}
                title="High Performance"
                description="Optimized for speed and efficiency in handling large volumes of data fragments."
              />
              <BenefitCard
                icon={<Lock className="w-8 h-8" />}
                title="Secure Integration"
                description="Seamless integration with existing authorization systems and security protocols."
              />
              <BenefitCard
                icon={<Database className="w-8 h-8" />}
                title="Scalable Storage"
                description="Flexible storage solutions that grow with your manufacturing needs."
              />
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,98,0,0.1),transparent_60%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Manufacturing Data?
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Join the digital transformation journey and streamline your
                manufacturing processes with our Fragment Storage Service.
              </p>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 bg-black/40 border-orange-900/50 hover:border-orange-500/50 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </Card>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="inline-block p-3 bg-orange-500/10 rounded-full mb-4">
        <div className="text-orange-500">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
