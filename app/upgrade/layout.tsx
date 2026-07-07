import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Actualizar a Pro",
  robots: { index: false, follow: false },
}

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
