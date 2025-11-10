import { ChangeEvent, FormEvent, useState } from 'react';
import { agregarProducto } from '../servicios/api';

interface Producto {
  nombre: string;
  descripcion: string;
  precio: string;
  cantidad: string;
}

interface ProductoFormProps {
  onProductoAgregado: () => void;
}

export default function ProductoForm({ onProductoAgregado }: ProductoFormProps) {
  const [form, setForm] = useState<Producto>({
    nombre: '',
    descripcion: '',
    precio: '',
    cantidad: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Partial<Producto>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Producto> = {};
    
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!form.precio || parseFloat(form.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    if (!form.cantidad || parseInt(form.cantidad) < 0) newErrors.cantidad = 'La cantidad no puede ser negativa';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof Producto]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const resultado = await agregarProducto({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        cantidad: String(parseInt(form.cantidad, 10)),
      });

      setMessage({
        type: 'success',
        text: resultado.mensaje || 'Producto agregado correctamente'
      });
      setForm({ nombre: '', descripcion: '', precio: '', cantidad: '' });
      onProductoAgregado();
      
      setTimeout(() => setMessage(null), 4000);
    } catch (error) {
      console.error('Error al agregar producto:', error)
      setMessage({
        type: 'error',
        text: 'Error al agregar el producto. Intenta de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-2">
            📦 Nombre del producto
            <span className="text-rose-500">*</span>
          </span>
        </label>
        <input
          id="nombre"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Ej: Laptop Dell XPS 13"
          required
          className="input-field"
          data-error={Boolean(errors.nombre)}
          aria-invalid={Boolean(errors.nombre)}
          aria-describedby={errors.nombre ? 'nombre-error' : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className="text-xs font-medium text-rose-500">
            {errors.nombre}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="text-sm font-semibold text-slate-600">
          <span className="flex items-center gap-2">📝 Descripción</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Detalles técnicos del producto..."
          rows={3}
          className="input-field min-h-[120px] resize-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="precio" className="text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              💰 Precio
              <span className="text-rose-500">*</span>
            </span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">$</span>
            <input
              id="precio"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              required
              className="input-field pl-9"
              data-error={Boolean(errors.precio)}
              aria-invalid={Boolean(errors.precio)}
              aria-describedby={errors.precio ? 'precio-error' : undefined}
            />
          </div>
          {errors.precio && (
            <p id="precio-error" className="text-xs font-medium text-rose-500">
              {errors.precio}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="cantidad" className="text-sm font-semibold text-slate-600">
            <span className="flex items-center gap-2">
              📊 Cantidad
              <span className="text-rose-500">*</span>
            </span>
          </label>
          <input
            id="cantidad"
            name="cantidad"
            value={form.cantidad}
            onChange={handleChange}
            placeholder="0"
            type="number"
            min="0"
            required
            className="input-field"
            data-error={Boolean(errors.cantidad)}
            aria-invalid={Boolean(errors.cantidad)}
            aria-describedby={errors.cantidad ? 'cantidad-error' : undefined}
          />
          {errors.cantidad && (
            <p id="cantidad-error" className="text-xs font-medium text-rose-500">
              {errors.cantidad}
            </p>
          )}
        </div>
      </div>

      {message && (
        <div
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-600'
              : 'border-rose-200 bg-rose-50/80 text-rose-600'
          }`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.type === 'success' ? (
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{message.text}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-70" fill="currentColor" d="M4 12a8 8 0 018-8V2C6.477 2 2 6.477 2 12h2zm2 5.291A7.962 7.962 0 014 12H2c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Agregar producto</span>
          </>
        )}
      </button>

      <p className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-xs text-slate-500">
        Los campos marcados con <span className="font-semibold text-rose-500">*</span> son obligatorios. Revisa los datos antes de guardar.
      </p>
    </form>
  );
}
