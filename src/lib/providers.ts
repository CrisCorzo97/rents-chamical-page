import axios from 'axios';
import dayjs from 'dayjs';

type HolidayApiData = {
  fecha: string;
  tipo: string;
  nombre: string;
};

export async function getFirstBusinessDay(date: string) {
  let currentDate = dayjs(date);

  // Obtener el año de la fecha proporcionada
  const year = currentDate.year();

  // Llamar a la API para obtener los feriados del año correspondiente
  try {
    const { data } = await axios.get<HolidayApiData[]>(
      `https://api.argentinadatos.com/v1/feriados/${year}`
    );

    const holidays = data.map((holiday) => holiday.fecha);

    // Función para verificar si un día es hábil
    function isBusinessDay(date: dayjs.Dayjs) {
      const isWeekend = date.day() === 0 || date.day() === 6; // Domingo = 0, Sábado = 6
      const isHoliday = holidays.includes(date.format('YYYY-MM-DD'));
      return !isWeekend && !isHoliday;
    }

    // Iterar hasta encontrar el próximo día hábil
    while (!isBusinessDay(currentDate)) {
      currentDate = currentDate.add(1, 'day');
    }

    return currentDate.format('YYYY-MM-DD');
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error('Hubo un error al obtener los feriados');
  }
}
