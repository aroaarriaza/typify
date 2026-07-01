'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/dashboard/settings/cuenta',       label: 'Cuenta',         icon: '👤' },
  { href: '/dashboard/settings/preferencias', label: 'Preferencias',   icon: '🎛️' },
  { href: '/dashboard/settings/plan',         label: 'Plan y uso',     icon: '💳' },
  { href: '/dashboard/settings/datos',        label: 'Datos',          icon: '📦' },
]

export default function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-row lg:flex-col gap-0.5 overflow-x-auto lg:overflow-visible">
      {NAV.map(item => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors w-full ${
              active
                ? 'bg-white shadow-sm border border-gray-100 text-gray-900 font-medium'
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
            }`}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
