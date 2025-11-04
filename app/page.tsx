"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Hotel,
  Calendar,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Globe,
  Shield
} from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

export default function LandingPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Hotel className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.landing.brandName}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-white/50 transition-all duration-300">
                {t.landing.login}
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                {t.landing.getStarted}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default">
            <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.landing.futureOfHotelManagement}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              {t.landing.heroTitle1}
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">
              {t.landing.heroTitle2}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {t.landing.startFreeTrial}
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-purple-600 transition-all duration-300 hover:scale-105">
                {t.landing.watchDemo}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "1000+", label: t.landing.stats.hotels },
              { number: "50K+", label: t.landing.stats.bookingsPerMonth },
              { number: "99.9%", label: t.landing.stats.uptime },
              { number: "24/7", label: t.landing.stats.support }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.landing.features.title}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t.landing.features.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: Hotel,
              title: t.landing.features.roomManagement.title,
              description: t.landing.features.roomManagement.description,
              color: "from-purple-500 to-pink-500"
            },
            {
              icon: Calendar,
              title: t.landing.features.smartBooking.title,
              description: t.landing.features.smartBooking.description,
              color: "from-blue-500 to-cyan-500"
            },
            {
              icon: BarChart3,
              title: t.landing.features.analytics.title,
              description: t.landing.features.analytics.description,
              color: "from-green-500 to-emerald-500"
            },
            {
              icon: Users,
              title: t.landing.features.guestManagement.title,
              description: t.landing.features.guestManagement.description,
              color: "from-orange-500 to-red-500"
            },
            {
              icon: Globe,
              title: t.landing.features.multiLanguage.title,
              description: t.landing.features.multiLanguage.description,
              color: "from-indigo-500 to-purple-500"
            },
            {
              icon: Shield,
              title: t.landing.features.secure.title,
              description: t.landing.features.secure.description,
              color: "from-pink-500 to-rose-500"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-default"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-12 md:p-16 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
              {t.landing.benefits.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                t.landing.benefits.increaseRevenue,
                t.landing.benefits.reduceWork,
                t.landing.benefits.support247,
                t.landing.benefits.freeUpdates,
                t.landing.benefits.noCreditCard,
                t.landing.benefits.cancelAnytime
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                >
                  <CheckCircle2 className="w-6 h-6 text-green-300 flex-shrink-0" />
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t.landing.cta.title}
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {t.landing.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg px-8 py-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
                {t.landing.cta.getStartedFree}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Hotel className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t.landing.brandName}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t.landing.footer.copyright}
              <Link href="https://www.linkedin.com/in/ivan-ivanov-8b1b4b200/" className="text-blue-500 hover:text-blue-600">
                {t.landing.footer.developer}
              </Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-6000 {
          animation-delay: 6s;
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  )
}
