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

export const theme = [
  { key: "DARK", value: "Escuro" },
  { key: "LIGHT", value: "Claro" }
]

export const language = [
  { key: "PORTUGUESE", value: "Português" },
  { key: "ENGLISH", value: "Inglês" },
  { key: "SPANISH", value: "Espanhol" }
]

export const languages: any = {
  PORTUGUESE: "pt-BR",
  ENGLISH: "en-US",
  SPANISH: "es-ES",
}

export const gender = [
  { key: "MALE", value: "Masculino" },
  { key: "FEMALE", value: "Feminino" }
]

export const maritalStatus = [
  { key: "SINGLE", value: "Solteiro(a)" },
  { key: "MARRIED", value: "Casado(a)" },
  { key: "DIVORCED", value: "Divorciado(a)" },
  { key: "WIDOWED", value: "Viúvo(a)" },
  { key: "SEPARATED", value: "Separado" },
  { key: "CIVIL_UNION", value: "União estavel" },
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
