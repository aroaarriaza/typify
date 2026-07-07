import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description: "Política de privacidad de Typify. Cómo recopilamos, usamos y protegemos tus datos personales.",
  alternates: { canonical: "/privacy" },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto border-b border-gray-100">
        <Link href="/" className="text-xl font-bold text-indigo-600">Typify</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-gray-400 mb-10">Última actualización: 27 de mayo de 2026</p>

        <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
          <section>
            <h2 className="font-semibold text-gray-900 mb-2">1. Responsable del tratamiento</h2>
            <p>Typify es responsable del tratamiento de tus datos personales. Puedes contactarnos en <a href="mailto:aroa@visualvol.com" className="text-indigo-600 hover:underline">aroa@visualvol.com</a>.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">2. Datos que recopilamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cuenta:</strong> dirección de email y contraseña cifrada al registrarte.</li>
              <li><strong>Uso:</strong> los productos que introduces para generar listings y los textos generados.</li>
              <li><strong>Pago:</strong> procesado por Stripe. No almacenamos datos de tarjeta.</li>
              <li><strong>Técnicos:</strong> dirección IP, tipo de navegador y cookies de sesión necesarias para el funcionamiento.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">3. Finalidad y base legal</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Prestar el servicio de generación de listings (ejecución del contrato).</li>
              <li>Gestionar pagos y suscripciones (ejecución del contrato).</li>
              <li>Enviarte comunicaciones relacionadas con tu cuenta (interés legítimo).</li>
              <li>Mejorar el servicio mediante análisis de uso agregado (interés legítimo).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">4. Conservación de datos</h2>
            <p>Conservamos tus datos mientras tu cuenta esté activa. Si eliminas tu cuenta, borraremos tus datos personales en un plazo de 30 días, salvo obligación legal de conservarlos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">5. Compartición con terceros</h2>
            <p>No vendemos tus datos. Compartimos información únicamente con proveedores necesarios para el servicio:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase:</strong> base de datos y autenticación (servidores en la UE).</li>
              <li><strong>Stripe:</strong> procesamiento de pagos.</li>
              <li><strong>Groq:</strong> procesamiento de IA para generar los textos.</li>
              <li><strong>Vercel:</strong> alojamiento de la aplicación.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">6. Tus derechos</h2>
            <p>Tienes derecho a acceder, rectificar, suprimir, oponerte al tratamiento y solicitar la portabilidad de tus datos. Para ejercerlos, escríbenos a <a href="mailto:aroa@visualvol.com" className="text-indigo-600 hover:underline">aroa@visualvol.com</a>. Responderemos en un plazo máximo de 30 días.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">7. Cookies</h2>
            <p>Utilizamos únicamente cookies estrictamente necesarias para mantener tu sesión iniciada. No usamos cookies de rastreo ni publicidad.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">8. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas para proteger tus datos: conexiones HTTPS, contraseñas cifradas con bcrypt y acceso restringido a la base de datos.</p>
          </section>

          <section>
            <h2 className="font-semibold text-gray-900 mb-2">9. Cambios en esta política</h2>
            <p>Si realizamos cambios significativos, te informaremos por email. La fecha de "última actualización" al inicio de esta página indica cuándo se modificó por última vez.</p>
          </section>
        </div>
      </main>

      <footer className="text-center py-8 px-6 text-xs text-gray-400 space-x-4 border-t border-gray-100 mt-8">
        <Link href="/" className="hover:text-gray-600">Inicio</Link>
        <Link href="/pricing" className="hover:text-gray-600">Precios</Link>
        <Link href="/terms" className="hover:text-gray-600">Términos</Link>
      </footer>
    </div>
  )
}
