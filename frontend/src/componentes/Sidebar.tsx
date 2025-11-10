'use client'

import Link from 'next/link'
import { useState } from 'react'
import keycloak from '../lib/keycloak'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '#productos', label: 'Productos', icon: '📦' },
  { href: '#reservas', label: 'Reservas', icon: '📋' },
  { href: '#reportes', label: 'Reportes', icon: '📊' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin })
  }

  return (
    <aside
      className={`hidden self-start rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all lg:flex ${collapsed ? 'w-[84px]' : 'w-64'}`}
    >
      <div className="flex h-full w-full flex-col justify-between">
        <div className="space-y-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-purple-500 text-white shadow-[0_12px_30px_-16px_rgba(99,102,241,0.8)] transition-all ${collapsed ? 'h-11 w-11' : 'h-12 w-12'}`}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Panel</span>
                <span className="text-sm font-semibold text-slate-900">Stock Manager</span>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-indigo-200 hover:text-indigo-600"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            {!collapsed && <span>Contraer menú</span>}
          </button>

          <nav className="space-y-2 text-sm font-semibold text-slate-500">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 transition hover:border-indigo-200/70 hover:bg-white/90 hover:text-indigo-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-base">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/80 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base">⎋</span>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
