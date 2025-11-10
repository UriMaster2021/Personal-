'use client'
import { useState, useEffect } from 'react'
import keycloak from '../lib/keycloak'
import Link from 'next/link'

// Grupo display name (ajustable)
const GROUP_NAME = 'Grupo 02'

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userInitials, setUserInitials] = useState<string>('U')

  useEffect(() => {
    if (keycloak.tokenParsed) {
      const user = keycloak.tokenParsed.preferred_username || 'Usuario'
      setUsername(user)
      setUserInitials(user.substring(0, 2).toUpperCase())
    }
  }, [])

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_20px_45px_-30px_rgba(15,23,42,0.45)]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 text-white shadow-[0_12px_30px_-16px_rgba(99,102,241,0.8)]">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold text-slate-500">Gestión de inventario</span>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-slate-900">Stock Manager</h1>
              <span className="badge-soft">{GROUP_NAME}</span>
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 21h6" />
            </svg>
            Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">{username || 'Cargando...'}</p>
              <p className="text-xs text-slate-500">Sesión activa</p>
            </div>

            <div className="group relative">
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white shadow-[0_18px_40px_-22px_rgba(15,23,42,0.65)] transition-transform hover:-translate-y-0.5">
                {userInitials}
              </button>

              <div className="invisible absolute right-0 mt-3 w-56 translate-y-2 rounded-2xl border border-slate-200/80 bg-white/90 p-1 opacity-0 shadow-[0_24px_55px_-35px_rgba(30,41,59,0.65)] backdrop-blur-xl transition-all duration-200 ease-out group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-2xl bg-slate-50/80 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">{username || 'Usuario'}</p>
                  <p className="text-xs text-slate-500">Sesión en curso</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100/80 hover:text-rose-500"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden rounded-xl border border-slate-200/70 bg-white/80 p-2 text-slate-600 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.65)]"
          aria-label="Abrir menú"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white/90 px-4 pb-6 pt-4 backdrop-blur-xl md:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9M9 21h6" />
            </svg>
            Dashboard
          </Link>

          <div className="mt-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800">{username || 'Usuario'}</p>
            <p className="text-xs text-slate-500">Sesión en curso</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200/60 bg-rose-50/80 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-100"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  )
}
