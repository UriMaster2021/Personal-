import { useMemo, useState } from 'react';
import type { Producto } from '../lib/types';

type SortKey = 'nombre' | 'precio' | 'cantidad';

interface Props {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function ListaProductos({ productos, loading, error, onRetry }: Props) {
  const [filtro, setFiltro] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('nombre');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleChangeOrden = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const productosFiltrados = useMemo(() => {
    const lower = filtro.toLowerCase();
    const filtrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(lower) ||
      (producto.descripcion?.toLowerCase().includes(lower) ?? false)
    );

    return filtrados.sort((a, b) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      if (sortKey === 'nombre') {
        return a.nombre.localeCompare(b.nombre) * direction;
      }
      if (sortKey === 'precio') {
        return ((a.precio ?? 0) - (b.precio ?? 0)) * direction;
      }
      const cantidadA = a.cantidad ?? 0;
      const cantidadB = b.cantidad ?? 0;
      return (cantidadA - cantidadB) * direction;
    });
  }, [filtro, productos, sortDirection, sortKey]);

  const totalProductos = productos.length;
  const totalStock = productos.reduce((sum, p) => sum + (p.cantidad ?? 0), 0);
  const valorTotal = productos.reduce((sum, p) => sum + p.precio * (p.cantidad ?? 0), 0);
  const stockCritico = productos.filter((p) => (p.cantidad ?? 0) < 5).length;

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200/70 bg-rose-50/80 px-6 py-10 text-center text-rose-600 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold">No pudimos cargar los productos</p>
        <p className="mt-2 text-sm text-rose-500/80">{error}</p>
        <button onClick={onRetry} className="btn-secondary mt-6">Reintentar</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl border border-slate-200/70 bg-white/60 p-6 shadow-sm"
          >
            <div className="h-4 w-2/3 rounded-full bg-slate-200/80" />
            <div className="mt-4 h-3 w-1/3 rounded-full bg-slate-200/60" />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="h-12 rounded-2xl bg-slate-100/80" />
              <div className="h-12 rounded-2xl bg-slate-100/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!loading && productos.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-12 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-slate-800">Todavía no hay productos</p>
        <p className="mt-2 text-sm text-slate-500">Agrega tu primer ítem con el formulario de la izquierda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-3 shadow-sm">
          <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por nombre o descripción"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Ordenar por</span>
          {(['nombre', 'precio', 'cantidad'] as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleChangeOrden(key)}
              type="button"
              className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                sortKey === key
                  ? 'border-indigo-300 bg-indigo-50 text-indigo-600 shadow-sm'
                  : 'border-slate-200/70 bg-white/80 text-slate-500 hover:border-indigo-200/70 hover:text-indigo-600'
              }`}
            >
              {key === 'nombre' && 'Nombre'}
              {key === 'precio' && 'Precio'}
              {key === 'cantidad' && 'Stock'}
              {sortKey === key && (
                <span className="ml-2 text-xs text-slate-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {productosFiltrados.map((producto) => {
          const cantidad = producto.cantidad ?? 0;
          const status = cantidad === 0 ? 'agotado' : cantidad < 5 ? 'bajo' : 'normal';

          return (
            <article
              key={producto.id_producto}
              className="floating-card group relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-x-6 top-6 h-24 rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-indigo-50 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{producto.nombre}</h3>
                  {producto.descripcion && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{producto.descripcion}</p>
                  )}
                </div>
                <span className="rounded-full border border-indigo-200/70 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 shadow-sm">
                  #{producto.id_producto}
                </span>
              </div>

              <div className="relative mt-6 flex items-center gap-4">
                <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Precio</p>
                  <p className="text-xl font-semibold text-slate-900">${producto.precio.toFixed(2)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Stock</p>
                  <p className="text-xl font-semibold text-slate-900">{cantidad}</p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    status === 'agotado'
                      ? 'border border-rose-200/80 bg-rose-50/80 text-rose-500'
                      : status === 'bajo'
                        ? 'border border-amber-200/80 bg-amber-50/80 text-amber-600'
                        : 'border border-emerald-200/80 bg-emerald-50/80 text-emerald-600'
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-current" />
                  {status === 'agotado' ? 'Agotado' : status === 'bajo' ? 'Stock bajo' : 'En stock'}
                </span>
                <p className="text-xs font-medium text-slate-400">
                  Valor: <span className="font-semibold text-slate-700">${(producto.precio * cantidad).toFixed(2)}</span>
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {productosFiltrados.length === 0 && productos.length > 0 && (
        <div className="rounded-3xl border border-slate-200/70 bg-white/80 px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            No se encontraron productos que coincidan con <span className="text-indigo-500">“{filtro}”</span>
          </p>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="surface-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Total de productos</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalProductos}</p>
        </div>
        <div className="surface-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Stock disponible</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{totalStock}</p>
        </div>
        <div className="surface-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Valor estimado</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">${valorTotal.toFixed(2)}</p>
        </div>
        <div className="surface-glass p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Productos en alerta</p>
          <p className="mt-2 text-3xl font-semibold text-rose-500">{stockCritico}</p>
        </div>
      </section>
    </div>
  );
}
