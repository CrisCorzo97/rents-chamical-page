import { FC, createContext } from 'react';
import { useContextInit } from './contextInit';

export const Context = createContext<ReturnType<typeof useContextInit>>({
  session: null,
});

export const ContextProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const session = useContextInit();

  return <Context.Provider value={session}>{children}</Context.Provider>;
};
