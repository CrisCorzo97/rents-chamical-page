// Crear y exportar una función para convertir un objeto en queryParams de una URL eliminando los valores vacíos, nulos o undefined.

export function objectToQueryString(obj: Record<string, string>) {
  const queries = Object.entries(obj)
    .filter(([, value]) => !!value && value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `?${queries}`;
}

// Crear función para obtener la url + el pathname de la página actual.

export function getCurrentUrl() {
  return window.location.href;
}

// Crear función que unifica la url de la página actual con los queryParams de un objeto.

export function buildUrlQuery(obj: Record<string, string>) {
  const currentUrl = getCurrentUrl();
  const queryString = objectToQueryString(obj);

  return `${currentUrl}${queryString}`;
}

// Crear función que obtiene los queryParams de la url actual y los convierte en un objeto.

export function getQueryParams() {
  const urlParams = new URLSearchParams(globalThis.location?.search);
  const queryParams: Record<string, string> = {};

  for (const [key, value] of urlParams) {
    queryParams[key] = value;
  }

  return queryParams;
}
