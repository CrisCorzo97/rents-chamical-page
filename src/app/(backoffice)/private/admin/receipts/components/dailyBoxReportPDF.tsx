/* eslint-disable jsx-a11y/alt-text */
import { formatName } from '@/lib/formatters';
import { receipt } from '@prisma/client';
import { JsonObject } from '@prisma/client/runtime/library';
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// const mockData: ReceiptPDFProps['data'] = {
//   total_amount_collected: 64000,
//   total_receipts: 64,
//   page_data: [
//     {
//       page: 1,
//       subtotal: 35000,
//       receipts: [
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//       ],
//       total_items: 35,
//     },
//     {
//       page: 2,
//       subtotal: 29000,
//       receipts: [
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000005',
//           taxpayer: 'JUAN PEREZ',
//           amount: 2000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'd4090851-cacc-4f2b-a31a-6acf2dee66b5',
//           created_at: dayjs('2024-11-19T12:40:23.253Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:48:12.000Z').toDate(),
//           other_data: {
//             observations: 'Holaaaaa',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//         {
//           id: '2024-00000004',
//           taxpayer: 'MENGANO FULANO',
//           amount: 10000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '61dbbd1f-f09c-48ec-91db-71bf8806c867',
//           created_at: dayjs('2024-11-19T12:40:12.802Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:46:50.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'APROBACIÓN Y VISACIÓN DE PLANOS',
//           },
//         },
//         {
//           id: '2024-00000003',
//           taxpayer: 'JUAN PEREZ',
//           amount: 5000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'b0e62f91-8e1d-4c32-95a6-93677ee6ea39',
//           created_at: dayjs('2024-11-19T12:40:03.027Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:11.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'RETENCIONES/VENTAS REM. FERIA',
//           },
//         },
//         {
//           id: '2024-00000006',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 7900,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: '4923a2a0-a41d-4e82-8fee-dac819ac37e8',
//           created_at: dayjs('2024-11-19T12:40:32.191Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:35.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'OCUPACIÓN DE LA VÍA PÚBLICA',
//           },
//         },
//         {
//           id: '2024-00000007',
//           taxpayer: 'CRISTIAN CORZO',
//           amount: 20000,
//           tax_type: 'TASAS DIVERSAS',
//           id_tax_reference: 'aebd2a4b-6e90-40a7-9bf9-222c3afd94e4',
//           created_at: dayjs('2024-11-19T12:40:41.433Z').toDate(),
//           confirmed_at: dayjs('2024-12-01T12:47:42.000Z').toDate(),
//           other_data: {
//             observations: '',
//             tax_or_contribution: 'LIBRETA DE SANIDAD',
//           },
//         },
//       ],
//       total_items: 29,
//     },
//   ],
// };

// Create styles
const styles = StyleSheet.create({
  page: {
    position: 'relative',
    padding: '30px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    alignItems: 'center',
    width: '100%',
  },
  headerLogo: {
    width: '60px',
    height: '60px',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
  },
  contentTitle: {
    fontSize: 14,
    lineHeight: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
  },
  contentTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%',
  },
  contentTableHeader: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    padding: '2px 6px',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
  },
  contentTableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentTableBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  contentTableBodyRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
    padding: '2px 6px',
    justifyContent: 'space-around',
  },
  contentTableBodyCell: {
    fontSize: 9,
    lineHeight: '12px',
    maxLines: 1,
  },
  footer: {
    position: 'absolute',
    top: '85%',
    left: 30,
    right: 30,
    bottom: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '6px',
  },
  footerBorder: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginBottom: '6px',
  },
  footerTotalRow: {
    width: '100%',
    gap: '6px',
    padding: '0px 6px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#f0f0f0',
  },
  footerTotalCell: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export interface ReceiptPDFProps {
  data: {
    total_amount_collected: number;
    total_receipts: number;
    page_data: {
      page: number;
      subtotal: number;
      receipts: receipt[];
      total_items: number;
    }[];
  };
}

// Create Document Component
export const DailyBoxReportPDF = ({ data }: ReceiptPDFProps) => {
  return (
    <Document
      title='Caja diaria'
      author='Municipalidad de Chamical'
      subject='Rentas Municipal'
      language='es'
    >
      {data.page_data.map((page) => (
        <PageComponent
          key={page.page}
          page={page.page}
          subtotal={page.subtotal}
          receipts={page.receipts}
          total_items={page.total_items}
          totalPages={data.page_data.length}
          totalAmountCollected={data.total_amount_collected}
        />
      ))}
    </Document>
  );
};

const PageComponent = (details: {
  page: number;
  subtotal: number;
  receipts: receipt[];
  total_items: number;
  totalPages: number;
  totalAmountCollected: number;
}) => {
  return (
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <Image
          src='https://apkomtlxqddpzutagjvn.supabase.co/storage/v1/object/public/visual-resourses/Escudo%20de%20Chamical.jpg'
          style={styles.headerLogo}
        />
        <View style={styles.headerTitle}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            Municipalidad Departamento Chamical
          </Text>
          <Text
            style={{
              fontSize: 16,
            }}
          >
            Chamical - La Rioja
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.contentTitle}>
          RESUMEN DE CAJA DIARIA {dayjs().format('DD/MM/YYYY')}
        </Text>
        <View style={styles.contentTable}>
          <View style={styles.contentTableHeader}>
            <Text style={{ ...styles.contentTableHeaderCell, width: '10%' }}>
              Hora
            </Text>
            <Text style={{ ...styles.contentTableHeaderCell, width: '15%' }}>
              Comprobante
            </Text>
            <Text
              style={{
                ...styles.contentTableHeaderCell,
                width: '30%',
              }}
            >
              Contribuyente
            </Text>
            <Text style={{ ...styles.contentTableHeaderCell, width: '30%' }}>
              Tasa
            </Text>
            <Text style={{ ...styles.contentTableHeaderCell, width: '15%' }}>
              Importe
            </Text>
          </View>
          <View>
            {details.receipts.map((item, index) => (
              <View
                key={index}
                style={{
                  ...styles.contentTableBodyRow,
                  backgroundColor: index % 2 === 0 ? 'white' : '#f6f6f6',
                }}
              >
                <Text style={{ ...styles.contentTableBodyCell, width: '10%' }}>
                  {dayjs(item.confirmed_at).format('HH:mm')}hs
                </Text>
                <Text style={{ ...styles.contentTableBodyCell, width: '15%' }}>
                  {item.id}
                </Text>
                <Text
                  style={{
                    ...styles.contentTableBodyCell,
                    width: '30%',
                  }}
                >
                  {formatName(item.taxpayer)}
                </Text>
                <Text style={{ ...styles.contentTableBodyCell, width: '30%' }}>
                  {formatName(
                    (item.other_data as JsonObject)!
                      .tax_or_contribution as string
                  )}
                </Text>
                <Text style={{ ...styles.contentTableBodyCell, width: '15%' }}>
                  $
                  {item.amount.toLocaleString('es-AR', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View>
          <View style={styles.footerBorder}></View>
          {details.page === details.totalPages && (
            <View style={styles.footerTotalRow}>
              <Text
                style={{
                  ...styles.footerTotalCell,
                  width: '25%',
                  textAlign: 'right',
                }}
              >
                TOTAL:
              </Text>
              <Text
                style={{
                  ...styles.footerTotalCell,
                  width: '15%',
                }}
              >
                $
                {details.totalAmountCollected.toLocaleString('es-AR', {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={{
            width: '100%',
            fontSize: 10,
            textAlign: 'right',
          }}
        >
          {`Página ${details.page} de ${details.totalPages}`}
        </Text>
      </View>
    </Page>
  );
};
