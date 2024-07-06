import { Rule } from 'antd/es/form';

export function cuilValidator(_rule: Rule, value: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const parsedCuil = value.replace(/-/g, '');

    if (parsedCuil.length !== 11) {
      reject('El CUIL debe tener 11 dígitos');
    }

    const [checkDigit, ...rest] = parsedCuil.split('').map(Number).reverse();

    const total = rest.reduce(
      (acc, cur, index) => acc + cur * (2 + (index % 6)),
      0
    );

    const mod11 = 11 - (total % 11);

    if (mod11 === 11) {
      checkDigit === 0 ? resolve(true) : reject('CUIL inválido');
    }

    if (mod11 === 10) {
      reject('CUIL inválido');
    }

    checkDigit === mod11 ? resolve(true) : reject('CUIL inválido');
  });
}
