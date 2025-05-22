import { useState, useEffect } from 'react';

export function useDebounceV2<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timeout si el valor cambia (o si el delay cambia, o si el componente se desmonta)
    // Esto es para que si el usuario sigue escribiendo, no se actualice el valor debounced prematuramente
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}
