import dbSupabase from '@/lib/prisma/prisma';
import { Envelope } from '@/types/envelope';
import { Prisma, receipt } from '@prisma/client';

export const createPatentReceipt = async (input: {
  data: Prisma.receiptCreateInput;
}) => {
  const response: Envelope<receipt> = {
    success: true,
    data: null,
    error: null,
    pagination: null,
  };

  try {
    const receipt = await dbSupabase.receipt.create({
      data: input.data,
    });

    response.data = receipt;
  } catch (error) {
    console.error({ error });

    response.success = false;
    response.error = 'Error al crear el comprobante de pago de patente';
  }

  return response;
};
