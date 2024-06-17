import { PrismaClient } from '@prisma/client';

const enrollment_regex = /^[0-9-]+$/;

export const dbSupabase = new PrismaClient();

const migrateTables = async () => {
  console.log('Procesando migración de tablas...');
  try {
    const barrios = await dbSupabase.tb_barrio.findMany();

    await dbSupabase.neighborhood.createMany({
      data: barrios.map((barrio) => ({
        id: barrio.COD_BARRIO_N_3_0,
        name: barrio.DESCRIP_BA_C_100,
      })),
    });

    console.log('Barrios migrados correctamente.');

    const lugaresCementerios = await dbSupabase.tb_lugares.findMany();

    await dbSupabase.cementery_place.createMany({
      data: lugaresCementerios.map((lugar) => ({
        id: lugar.COD_CEMENT_C_2,
        name: lugar.DESCRIP_CE_C_100,
      })),
    });

    console.log('Tipos de lugares de cementerios migrados correctamente.');

    const seccionesCiudad = await dbSupabase.tb_secciones.findMany();

    await dbSupabase.city_section.createMany({
      data: seccionesCiudad.map((section) => ({
        id: section.COD_SECCIO_N_3_0,
        name: section.DESCRIP_SE_C_4,
      })),
    });

    console.log('Secciones de la ciudad migradas correctamente.');

    const tiposEntierro = await dbSupabase.tb_tipo_entierro.findMany();

    await dbSupabase.burial_type.createMany({
      data: tiposEntierro.map((tipo) => ({
        id: tipo.COD_TIPO_N_2_0,
        type: tipo.DESCRIP_TI_C_100,
        price: tipo.IMPORTE_TI_N_8_0,
      })),
    });

    console.log('Tipos de entierro migrados correctamente.');
  } catch (error) {
    console.error('Error al migrar tablas: ', error);
  } finally {
    console.log('Migración de tablas finalizada.');
  }
};

const migrateCementeryRecords = async () => {
  console.log('Procesando migración de registros de cementerios...');
  try {
    console.log('Obteniendo los registros de la tabla vieja de cementerio...');
    const cementeryRecords = [];
    let currentCementeryRecord = [];

    do {
      currentCementeryRecord = await dbSupabase.tb_cementerio.findMany({
        take: 100,
        skip: cementeryRecords.length,
      });

      cementeryRecords.push(...currentCementeryRecord);
    } while (currentCementeryRecord.length > 0);

    console.log('Parseando los datos e insertándolos en la nueva tabla...');

    let i = 1;

    for (const record of cementeryRecords) {
      console.log(`Procesando registros: ${i} de ${cementeryRecords.length}`);
      const missingFields = [];
      if (!record.DIRECCION__C_150) {
        missingFields.push('address_taxpayer');
      }

      const parsedRecord = {
        taxpayer: record.NOMBRE_PER_C_100,
        address_taxpayer: record.DIRECCION__C_150,
        section: record.SECCION_CO_C_3,
        row: typeof record.FILA_C_4 !== 'number' ? null : record.FILA_C_4,
        location_number:
          typeof record.NRO_UBICAC_C_6 !== 'number'
            ? null
            : record.NRO_UBICAC_C_6,
        deceased_name: record.NOM_DIFUNT_C_100,
        last_year_paid: record.A_O_DEBE_N_4_0,
        missing_fields: missingFields.length
          ? JSON.stringify(missingFields)
          : null,
        neighborhood: {
          connect: {
            id: record.COD_BARRIO_N_3_0,
          },
        },
        burial_type: {
          connect: {
            id: record.COD_TIPO_N_2_0,
          },
        },
        cementery_place: {
          connect: {
            id: record.COD_CEMENT_C_2,
          },
        },
      };

      await dbSupabase.cementery.create({
        data: parsedRecord,
      });

      i++;
    }

    console.log('Registros de cementerios migrados correctamente.');
  } catch (error) {
    console.error('Error al migrar registros de cementerios: ', error);
  } finally {
    console.log('Migración de registros de cementerios finalizada.');
  }
};

const migratePropertyRecords = async () => {
  console.log('Procesando migración de registros de inmuebles...');
  try {
    console.log('Obteniendo los registros de la tabla vieja de inmuebles...');
    const propertyRecords = [];
    let currentPropertyRecord = [];

    do {
      currentPropertyRecord = await dbSupabase.tb_inmueble.findMany({
        take: 100,
        skip: propertyRecords.length,
      });

      propertyRecords.push(...currentPropertyRecord);
    } while (currentPropertyRecord.length > 0);

    console.log('Parseando los datos e insertándolos en la nueva tabla...');

    let i = 1;

    for (const record of propertyRecords) {
      console.log(`Procesando registros: ${i} de ${propertyRecords.length}`);
      const missingFields = [];

      if (!record.MATRICULA_C_50) {
        missingFields.push('enrollment');
      }
      if (!record.COD_BARRIO_N_3_0) {
        missingFields.push('neighborhood');
      }
      if (!record.COD_SECCIO_N_3_0) {
        missingFields.push('city_section');
      }
      if (!record.DIRECCION_C_150) {
        missingFields.push('address');
      }
      if (!record.MTS_FRENTE_N_4_0) {
        missingFields.push('front_length');
      }

      let enrollment = record.MATRICULA_C_50;

      if (
        !!record.MATRICULA_C_50 &&
        !enrollment_regex.test(record.MATRICULA_C_50)
      ) {
        enrollment = null;
      }

      let city_section = null;

      if (!!record.COD_SECCIO_N_3_0) {
        const section = Number(record.COD_SECCIO_N_3_0);

        switch (section) {
          case 1:
          case 2: {
            city_section = 1;
            break;
          }
          case 3:
          case 4: {
            city_section = 2;
            break;
          }
          case 5:
          case 6: {
            city_section = 3;
            break;
          }
          case 7: {
            city_section = 4;
            break;
          }
          default:
            break;
        }
      }

      const parsedRecord = {
        taxpayer: record.RAZON_SOCI_C_150,
        taxpayer_type: null,
        enrollment,
        is_part: null,
        address: record.DIRECCION_C_150,
        front_length: record.MTS_FRENTE_N_4_0,
        last_year_paid: Number(record.A_O_PAGADO_N_4_0),
        missing_fields: missingFields.length
          ? JSON.stringify(missingFields)
          : null,
        neighborhood: !record.COD_BARRIO_N_3_0
          ? undefined
          : {
              connect: {
                id: record.COD_BARRIO_N_3_0,
              },
            },
        city_section: !city_section
          ? undefined
          : {
              connect: {
                id: city_section,
              },
            },
      };

      await dbSupabase.property.create({
        data: parsedRecord,
      });

      i++;
    }

    console.log('Registros de inmuebles migrados correctamente.');
  } catch (error) {
    console.error('Error al migrar registros de inmuebles: ', error);
  } finally {
    console.log('Migración de registros de inmuebles finalizada.');
  }
};

const fixPropertyMissingFields = async () => {
  console.log('Procesando corrección de campos faltantes...');
  try {
    const propertyRecords = await dbSupabase.property.findMany({
      where: {
        enrollment: null,
      },
    });

    let i = 1;

    for (const record of propertyRecords) {
      console.log(`Actualizando registros: ${i} de ${propertyRecords.length}`);

      const missingFields = !!record.missing_fields
        ? JSON.parse(record.missing_fields)
        : [];

      if (!missingFields.includes('enrollment')) {
        missingFields.push('enrollment');
        await dbSupabase.property.update({
          where: {
            id: record.id,
          },
          data: {
            missing_fields: JSON.stringify(missingFields),
          },
        });
      }

      i++;
    }

    console.log('Corrección de campos faltantes finalizada.');
  } catch (error) {
    console.error('Error al corregir campos faltantes: ', error);
  }
};

// migrateTables();
// migrateCementeryRecords();
// migratePropertyRecords();
// fixPropertyMissingFields();
