"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/contexts/language-context"

export default function LoginPage() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{t.app.title}</h1>
          <p className="mt-2 text-slate-600">{t.auth.signInPrompt}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              {t.auth.dontHaveAccount}{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                {t.auth.signup}
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">{t.auth.openSourcePlatform}</p>
      </div>
    </div>
  )
}
