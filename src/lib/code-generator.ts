import dayjs from 'dayjs';
import JsBarcode from "jsbarcode";

// función que reciba el último código de comprobante y devuelva el siguiente, siegiendo la secuencia de comprobantes
// La estructura del código de comprobante es la siguiente:
// YYYY-XXXXXXXX
// Ejemplo: 2024-000001
// Ejemplo de funcionaiento:
// Si el último código de comprobante es 2024-000001, la función debe devolver 2024-000002
export function generateReceiptCode(lastCode?: string) {
  if (!lastCode) {
    const initialNumber = '00000001';
    return `${dayjs().year()}-${initialNumber}`;
  }

  if (!validateReceiptCode(lastCode)) {
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

// función que reciba el último código de factura y devuelva el siguiente, siegiendo la secuencia de facturas emitidas
// La estructura del código de factura es la siguiente:
// YYYY-XXXXXX
// Ejemplo: 2024-000001
// Ejemplo de funcionaiento:
// Si el último código de comprobante es 2024-000001, la función debe devolver 2024-000002
// Cada año debe comenzar la secuencia desde 000001

export function generateInvoiceCode(lastCode?: string) {
  if (!lastCode) {
    const initialNumber = '000001';
    return `${dayjs().year()}-${initialNumber}`;
  }

  if (!validateInvoiceCode(lastCode)) {
    return null;
  }

  // Extraer el año y el número del comprobante
  const [_year, number] = lastCode.split('-');
  // Incrementar el número del comprobante
  const nextNumber = String(Number(number) + 1).padStart(6, '0');
  // Devolver el nuevo código de comprobante

  if (dayjs().year() !== Number(_year)) {
    return `${dayjs().year()}-000001`;
  }

  return `${dayjs().year()}-${nextNumber}`;
}

export function validateInvoiceCode(code: string) {
  if (!code || code.length !== 11 || !code.includes('-')) {
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

  if (number.length !== 6 || !/^\d+$/.test(number)) {
    return false;
  }

  return true;
}


// función para generar el código de barra de la factura
export function generateBarcodeBase64(data: string): string {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, data, {
    format: "CODE128",
    width: 2,
    height: 60,
    displayValue: false,
    margin: 0,
  });
  return canvas.toDataURL("image/png");
}
