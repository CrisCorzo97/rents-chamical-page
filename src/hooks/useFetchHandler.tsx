// Crear un Custom hook que reciba una función asíncrona y devuelva un objeto con los datos de la respuesta y un estado de carga.

import { useState } from 'react';

interface FetchHandler<T> {
  data: T | null;
  loading: boolean;
}

export const useFetchHandler = async <T,>(
  fetchFunction: () => Promise<T>
): Promise<FetchHandler<T>> => {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);

  try {
    setData(await fetchFunction());
  } catch (error) {
    console.error({ error });
  } finally {
    setLoading(false);
  }

  return {
    data,
    loading,
  };
};
