import Link from 'next/link'

export default function UpgradePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Actualiza a Pro</h1>
          <p className="text-gray-500 text-sm mb-8">
            Has agotado tus créditos gratuitos. Con Pro tienes 100 créditos cada mes.
          </p>

          <div className="bg-indigo-50 rounded-xl p-5 mb-6 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-900">Plan Pro</span>
              <span className="text-2xl font-bold text-indigo-600">9€<span className="text-sm font-normal text-gray-500">/mes</span></span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              {['100 créditos al mes', 'Acceso a todos los tipos de texto', 'Historial ilimitado'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-indigo-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            disabled
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-medium opacity-60 cursor-not-allowed mb-3"
          >
            Próximamente — Pago con Stripe
          </button>

          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
