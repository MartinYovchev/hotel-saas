import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Hotel SaaS",
  description: "Sign in to your hotel management account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Hotel SaaS</h1>
          <p className="mt-2 text-slate-600">Sign in to manage your properties</p>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-sm font-medium text-blue-900">Demo Mode</p>
          <p className="mt-1 text-sm text-blue-700">
            Email: <span className="font-mono font-semibold">admin@demo.com</span>
          </p>
          <p className="text-sm text-blue-700">
            Password: <span className="font-mono font-semibold">password</span>
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">Open source hotel management platform</p>
      </div>
    </div>
  )
}
