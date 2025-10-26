import { en } from "./en"
import { bg } from "./bg"

export const translations = {
  en,
  bg,
}

export type Language = keyof typeof translations
export type { Translations } from "./en"
