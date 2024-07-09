// Crear y exportar una función para convertir un objeto en queryParams de una URL eliminando los valores vacíos, nulos o undefined.

export function objectToQueryString(obj: Record<string, string>) {
  const queriesEntries = Object.entries(getQueryParams());

  Object.entries(obj).forEach(([key, value]) => {
    const alreadyExists = queriesEntries.find(([queryKey]) => queryKey === key);

    if (alreadyExists && (!value || value === '')) {
      alreadyExists[1] = '';
      return delete obj[key];
    }

    queriesEntries.push([key, value]);
  });

  console.log({ queriesEntries });

  // const revisedQueries = Object.entries(obj).map(([key, value]) => {
  //   const alreadyExists = Object.keys(currentQueries).includes(key);

  //   if (alreadyExists && (!value || value === '')) {
  //     return null;
  //   }
  //   return [key, value];
  // });

  // console.log({ revisedQueries });

  // const queries = revisedQueries
  //   .filter((query) => !!query)
  //   .map(([key, value]) => `${key}=${value}`)
  //   .join('&');

  return '?';
}

// Crear función para obtener la url + el pathname de la página actual sin las queryParams.

export function getCurrentUrl() {
  return globalThis.location?.origin + globalThis.location?.pathname;
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
