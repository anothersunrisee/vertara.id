
import React from 'react';
import { AppSettings, InvoiceStatus } from './types';

export const DEFAULT_SETTINGS: AppSettings = {
  id: '1',
  bankName: 'BCA / MANDIRI',
  accountNo: '0812-3456-7890',
  accountName: 'VERTARA ADVENTURE',
  whatsappContact: '0895-3638-98438',
  emailContact: 'vertara.id@gmail.com',
  instagramContact: '@vertara.id',
  footerNote: 'This invoice serves as a binding confirmation of your booking with **VERTARA.ID**. By receiving this document, the participant confirms that all provided personal and medical data is accurate. The participant agrees to adhere to all safety protocols, group regulations, and instructions provided by the lead mountain guides at all times. Please note that payments are non-refundable unless specified otherwise in our standard cancellation policy.'
};

export const PACKETS = [
  'Open Trip Reguler',
  'Private Trip VIP',
  'Private Trip Standard'
];

export const STATUS_COLORS = {
  [InvoiceStatus.UNPAID]: 'bg-red-100 text-red-700 border-red-200',
  [InvoiceStatus.DP]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [InvoiceStatus.PAID]: 'bg-green-100 text-green-700 border-green-200',
};
