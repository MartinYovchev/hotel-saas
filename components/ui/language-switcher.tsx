"use client"

import { useLanguage } from "@/lib/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bg" : "en")
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage} className="gap-2">
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </Button>
  )
}
