'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import keycloak from '../lib/keycloak'

const FEATURES = [
  {
    title: 'Catálogo centralizado',
    description: 'Unifica productos, variantes y stock en una única vista operativa.',
    icon: '📦',
  },
  {
    title: 'Alertas inteligentes',
    description: 'Detecta bajas de stock y compromisos de reserva en tiempo real.',
    icon: '⚡',
  },
  {
    title: 'Reportes ejecutivos',
    description: 'Convierte los datos en decisiones con indicadores claros y exportables.',
    icon: '📊',
  },
]

const TRUST_BADGES = [
  { title: 'SSO Keycloak', description: 'Autenticación segura', icon: '🔐' },
  { title: 'Soporte 24/7', description: 'Equipo especializado', icon: '💬' },
  { title: 'Actualizaciones', description: 'Iteración continua', icon: '♻️' },
]

export default function Page() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      void keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        })
        .then((authenticated) => {
          if (authenticated) {
            router.push('/dashboard')
          }
        })
        .catch((err) => {
          console.warn('Keycloak init warning:', err)
        })
    } catch (err) {
      console.warn('Error inicializando Keycloak:', err)
    }
  }, [router])

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await keycloak.login({ redirectUri: window.location.origin + '/dashboard' })
    } catch (err) {
      console.error('Error en login:', err)
      setError('No pudimos iniciar la sesión. Intenta nuevamente.')
      setIsLoading(false)
    }
  }

  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/70 via-purple-200/50 to-transparent blur-3xl" />
        <div className="absolute -bottom-28 right-0 h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-sky-200/60 via-white to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
          <section className="space-y-10">
            <span className="badge-soft w-fit">Solución empresarial</span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl lg:text-6xl">
                Gestioná tu inventario con una <span className="text-gradient">experiencia elegante</span>
              </h1>
              <p className="max-w-xl text-base text-slate-600 sm:text-lg">
                Stock Manager combina autenticación corporativa con tableros intuitivos para que puedas monitorear productos,
                reservas y desempeño sin fricción.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.65)] transition hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-lg">{feature.icon}</div>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-2 text-xs text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Monitoreo en tiempo real
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Integración con APIs internas
              </div>
            </div>
          </section>

          <section className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.75)]">
                  <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Bienvenido</h2>
                  <p className="text-sm text-slate-500">Inicia sesión con tu cuenta corporativa</p>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-200/70 bg-rose-50/80 px-4 py-3 text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Conectando…' : 'Ingresar con Keycloak'}
              </button>

              <div className="grid gap-3 sm:grid-cols-3">
                {TRUST_BADGES.map((badge) => (
                  <div key={badge.title} className="rounded-2xl border border-slate-200/60 bg-white/80 px-4 py-3 text-center">
                    <div className="text-lg">{badge.icon}</div>
                    <p className="mt-2 text-xs font-semibold text-slate-700">{badge.title}</p>
                    <p className="text-[11px] text-slate-400">{badge.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/80 px-5 py-4 text-sm text-indigo-600">
                ¿Primera vez en la plataforma? Solicita acceso al administrador para habilitar tu cuenta.
              </div>

              <footer className="text-center text-xs text-slate-400">
                © 2025 FRRe · Plataforma diseñada para equipos que valoran la precisión.
              </footer>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
