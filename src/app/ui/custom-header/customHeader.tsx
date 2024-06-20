import { CustomClientHeader } from './customClientHeader';

export const CustomHeader = ({ isLogged }: { isLogged: boolean }) => {
  return <CustomClientHeader isLogged={isLogged} />;
};
