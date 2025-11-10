'use client'

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../componentes/Navbar';
import ProductoForm from '../../componentes/ProductoForm';
import ListaProductos from '../../componentes/ListaProductos';
import Sidebar from '../../componentes/Sidebar';
import keycloak from '../../lib/keycloak';
import { useProductos } from '../../lib/useProductos';

function Dashboard() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { productos, loading, error, refresh } = useProductos({ refreshSignal });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (!keycloak.authenticated) {
        router.push('/');
      } else {
        setAuthLoading(false);
      }
    } catch (err) {
      console.warn('Error verificando autenticación:', err);
      setAuthLoading(false);
    }
  }, [router]);

  const resumen = useMemo(() => {
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((acc, producto) => acc + (producto.cantidad ?? 0), 0);
    const valorTotal = productos.reduce((acc, producto) => acc + producto.precio * (producto.cantidad ?? 0), 0);
    const alerta = productos.filter((p) => (p.cantidad ?? 0) < 5).length;
    return { totalProductos, stockTotal, valorTotal, alerta };
  }, [productos]);

  const handleProductoCreado = () => {
    setRefreshSignal((prev) => prev + 1);
  };

  const handleRetry = () => {
    void refresh();
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="surface-glass flex flex-col items-center gap-4 px-10 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.75)]">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">Cargando tu panel</p>
            <p className="text-sm text-slate-500">Verificando tu sesión segura...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />

      <main className="relative flex-1 pb-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 lg:flex-row lg:items-start">
          <Sidebar />

          <section className="flex-1 space-y-10">
            <header className="rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.55)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <span className="badge-soft">Panel principal</span>
                  <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">Gestión de inventario</h1>
                  <p className="text-sm text-slate-500">Monitoriza productos, stock y valor económico en un vistazo.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { label: 'Productos', value: resumen.totalProductos.toString() },
                    { label: 'Stock total', value: resumen.stockTotal.toString() },
                    { label: 'Valor ($)', value: resumen.valorTotal.toFixed(2) },
                    { label: 'En alerta', value: resumen.alerta.toString() },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 text-center shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px,1fr]">
              <aside className="xl:sticky xl:top-24">
                <div className="space-y-6">
                  <div className="surface-glass p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-[0_18px_40px_-22px_rgba(99,102,241,0.75)]">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Nuevo producto</p>
                        <p className="text-lg font-semibold text-slate-900">Registrar artículo</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <ProductoForm onProductoAgregado={handleProductoCreado} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Sugerencias</h3>
                    <ul className="mt-3 space-y-2 text-sm text-slate-500">
                      <li>• Utiliza nombres descriptivos para cada producto.</li>
                      <li>• Mantén actualizada la cantidad para evitar faltantes.</li>
                      <li>• Completa la descripción para mejorar las búsquedas.</li>
                    </ul>
                  </div>
                </div>
              </aside>

              <section id="productos" className="space-y-6">
                <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.45)]">
                  <div className="flex flex-col gap-2 border-b border-slate-200/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-900">Inventario actualizado</h2>
                      <p className="text-sm text-slate-500">Consulta y ordena los artículos registrados en el sistema.</p>
                    </div>
                    <button
                      onClick={handleRetry}
                      className="btn-secondary"
                      type="button"
                    >
                      Refrescar datos
                    </button>
                  </div>

                  <div className="pt-6">
                    <ListaProductos productos={productos} loading={loading} error={error} onRetry={handleRetry} />
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
