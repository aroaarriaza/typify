import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-indigo-600">Typify</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Términos de Servicio</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: 27 de mayo de 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Aceptación de los términos</h2>
            <p>Al crear una cuenta o usar Typify, aceptas estos Términos de Servicio. Si no estás de acuerdo, no utilices el servicio.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Descripción del servicio</h2>
            <p>Typify es una herramienta de generación de textos para e-commerce mediante inteligencia artificial. El servicio genera títulos, descripciones, meta-tags, palabras clave y puntos clave para listings de productos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Cuentas de usuario</h2>
            <p>Debes proporcionar información veraz al registrarte. Eres responsable de mantener la seguridad de tu contraseña y de toda actividad que ocurra en tu cuenta.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Créditos y pagos</h2>
            <p>El plan gratuito incluye 10 créditos mensuales. El plan Pro incluye 100 créditos mensuales por 9€/mes. Los créditos no utilizados no se acumulan ni se reembolsan. Los pagos se procesan a través de Stripe de forma segura.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Cancelaciones y reembolsos</h2>
            <p>Puedes cancelar tu suscripción Pro en cualquier momento. Seguirás teniendo acceso al plan Pro hasta el final del período facturado. No se ofrecen reembolsos por el período ya utilizado.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Uso aceptable</h2>
            <p>Te comprometes a no utilizar Typify para generar contenido ilegal, engañoso, difamatorio, o que infrinja derechos de terceros. Nos reservamos el derecho de suspender cuentas que infrinjan estas normas.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Propiedad intelectual</h2>
            <p>Los textos generados por Typify son de tu propiedad. Typify retiene los derechos sobre la plataforma, el código y los modelos utilizados.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Limitación de responsabilidad</h2>
            <p>Typify se proporciona "tal cual". No garantizamos que los textos generados sean precisos, completos o adecuados para cualquier propósito específico. No somos responsables de pérdidas derivadas del uso del servicio.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Modificaciones</h2>
            <p>Podemos actualizar estos términos en cualquier momento. Te notificaremos por email ante cambios significativos. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">10. Contacto</h2>
            <p>Para cualquier consulta sobre estos términos, contacta con nosotros en: <a href="mailto:hola@typify.app" className="text-indigo-600 hover:underline">hola@typify.app</a></p>
          </section>
        </div>
      </main>

      <footer className="text-center py-8 px-6 text-xs text-gray-400 space-x-4 border-t border-gray-100">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <Link href="/pricing" className="hover:text-gray-600">Precios</Link>
        <Link href="/privacy" className="hover:text-gray-600">Privacidad</Link>
      </footer>
    </div>
  )
}
