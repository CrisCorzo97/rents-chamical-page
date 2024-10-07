import dayjs from 'dayjs';

// función que reciba el último código de comprobante y devuelva el siguiente, siegiendo la secuencia de comprobantes
// La estructura del código de comprobante es la siguiente:
// YYYY-XXXXXXXX
// Ejemplo: 2024-000001
// Ejemplo de funcionaiento:
// Si el último código de comprobante es 2024-000001, la función debe devolver 2024-000002
export function generateReceiptCode(lastCode: string) {
  if (!lastCode || !validateReceiptCode(lastCode)) {
    return null;
  }

  // Extraer el año y el número del comprobante
  const [_year, number] = lastCode.split('-');
  // Incrementar el número del comprobante
  const nextNumber = String(Number(number) + 1).padStart(8, '0');
  // Devolver el nuevo código de comprobante
  return `${dayjs().year()}-${nextNumber}`;
}

export function validateReceiptCode(code: string) {
  if (!code || code.length !== 13 || !code.includes('-')) {
    return false;
  }

  const [year, number] = code.split('-');
  if (
    year.length !== 4 ||
    !/^\d+$/.test(year) ||
    Number(year) > dayjs().year()
  ) {
    return false;
  }

  if (number.length !== 8 || !/^\d+$/.test(number)) {
    return false;
  }

  return true;
}
