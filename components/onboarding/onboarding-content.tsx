"use client"

import { OnboardingForm } from "@/components/onboarding/onboarding-form"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { useLanguage } from "@/lib/contexts/language-context"

export function OnboardingContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">{t.onboarding.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{t.onboarding.description}</p>
        </div>

        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <OnboardingForm />
        </div>
      </div>
    </div>
  )
}
