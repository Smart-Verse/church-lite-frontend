export const status = [
  { key: "ACTIVE", value: "Ativo" },
  { key: "INACTIVE", value: "Inativo" }
]

export const typePlanAccount = [
  { key: "ANALYTICAL", value: "Analítico" },
  { key: "SYNTHETIC", value: "Sintético" }
]
export const typeCash = [
  { key: "CASH", value: "Caixa" },
  { key: "BANK", value: "Conta bancária" }
]
export const typeFinancial = [
  { key: "REVENUE", value: "Receita" },
  { key: "EXPENSE", value: "Despesa" }
]
export const transactionOperation = [
  { key: "OPEN_CASH", value: "Caixa aberto" },
  { key: "CLOSE_CASH", value: "Caixa fechado" },
  { key: "REVENUE", value: "Receita" },
  { key: "EXPENSE", value: "Despesa" }
]

export function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function base64ToArrayBuffer(base64: any): ArrayBuffer {
  const binaryString = atob(base64.split(',')[1]);
  const length = binaryString.length;
  const bytes = new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
