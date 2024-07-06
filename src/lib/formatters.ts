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
