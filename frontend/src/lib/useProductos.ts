import { useCallback, useEffect, useState } from 'react';
import { obtenerProductos } from '../servicios/api';
import type { Producto } from './types';

interface UseProductosOptions {
  refreshSignal?: number;
}

export function useProductos({ refreshSignal }: UseProductosOptions = {}) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProductos();
  }, [loadProductos, refreshSignal]);

  return {
    productos,
    loading,
    error,
    refresh: loadProductos,
  };
}
