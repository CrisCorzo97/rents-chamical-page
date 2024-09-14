export function formatCuilInput(value: string): string {
  // Remueve cualquier carácter no numérico
  let onlyNums = value.replace(/\D/g, '');

  // Inserta guiones en las posiciones correctas
  if (onlyNums.length > 2) {
    onlyNums = onlyNums.slice(0, 2) + '-' + onlyNums.slice(2);
  }
  if (onlyNums.length > 11) {
    onlyNums = onlyNums.slice(0, 11) + '-' + onlyNums.slice(11);
  }

  return onlyNums;
}

export function formatCurrency(input: string) {
  // Remover cualquier carácter que no sea dígito o coma
  let value = input.replace(/[^\d,]/g, '');

  if (value.at(-1) === ',') {
    value = value.slice(0, -1);

    if (!isNaN(Number(value))) {
      value = Number(value).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      return `${value},`;
    }
  }

  // Reeemplazo la coma por un punto
  value = value.replace(',', '.');

  // Si el valor es un número, lo formateo
  if (!isNaN(Number(value))) {
    value = Number(value).toLocaleString('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }

  return value;
}
