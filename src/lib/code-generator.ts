import dayjs from 'dayjs';

export function generateReceiptCode() {
  // Obtener la fecha actual
  const today = dayjs().format('YYYY/MM/DD');

  // Crear la parte de la fecha en formato YYYYMMDD
  const [year, month, day] = today.split('/');
  const datePart = `${year}${month}${day}`;

  // Generar un número aleatorio entre 0 y 9999
  const randomNumber = Math.floor(Math.random() * 10000); // Número aleatorio de 4 dígitos

  // Asegurarse de que el número aleatorio tenga 4 dígitos, rellenando con ceros si es necesario
  const randomPart = String(randomNumber).padStart(4, '0');

  // Concatenar la fecha, "00", y el número aleatorio
  const code = `${datePart}00${randomPart}`;

  return code;
}

export function validateReceiptCode(code: string) {
  // Verificar que los caracteres del código sean numéricos
  if (!/^\d+$/.test(code)) {
    return false;
  }

  // Verificar que el código tenga 14 caracteres
  if (code.length !== 14) {
    return false;
  }

  // Verificar que los primeros 8 caracteres equivalen a una fecha válida
  const datePart = code.slice(0, 8);
  const year = datePart.slice(0, 4);
  const month = datePart.slice(4, 6);
  const day = datePart.slice(6, 8);
  const date = dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD');
  if (!date.isValid() || date.isAfter(dayjs(), 'day')) {
    return false;
  }

  // Verificar que los siguientes 2 caracteres sean "00"
  if (code.slice(8, 10) !== '00') {
    return false;
  }

  return true;
}
