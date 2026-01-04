
export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  DP = 'DP',
  PAID = 'PAID'
}

export interface InvoiceData {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  status: InvoiceStatus;

  // Participant Info
  namaLengkap: string;
  namaPanggilan: string;
  jenisKelamin: string;
  usia: number;
  domisili: string;
  wa: string;
  email: string;

  // Trip Info
  gunung: string;
  tanggalTrip: string;
  jenisPaket: string;
  pengalaman: string;

  // Health
  riwayatPenyakit: string;
  alergi: string;

  // Items
  sewaAlat: string;

  // Financials
  subtotal: number;
  diskon: number;
  total: number;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  notes?: string;
}

export interface AppSettings {
  id?: string;
  logo?: string; // Base64 string
  bankName: string;
  accountNo: string;
  accountName: string;
  whatsappContact: string;
  emailContact: string;
  instagramContact: string;
  footerNote?: string;
}
