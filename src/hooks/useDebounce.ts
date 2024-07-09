import { useEffect } from 'react';

export const useCallbackDebouncing = (input: {
  value: string | number | Record<string, string>;
  delay: number;
  callback: () => void;
}) => {
  const { callback, delay, value } = input;

  useEffect(() => {
    const timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay, callback]);
};
