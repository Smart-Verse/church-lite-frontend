function collectCodes(items: any[]): string[] {
  const codes: string[] = [];

  for (const item of items ?? []) {
    if (item?.codeTree !== null && item?.codeTree !== undefined) {
      codes.push(String(item.codeTree).trim());
    }
    if (Array.isArray(item?.children)) {
      codes.push(...collectCodes(item.children));
    }
  }

  return codes;
}

export function getNextTreeCode(items: any[], parentCode?: string | null): string {
  const parentParts = parentCode
    ? String(parentCode).split(".").filter(Boolean)
    : [];

  const siblingNumbers = collectCodes(items)
    .map(code => code.split(".").filter(Boolean))
    .filter(parts => {
      if (parentParts.length === 0) {
        return parts.length === 1;
      }

      return parts.length === parentParts.length + 1
        && parentParts.every((part, index) => parts[index] === part);
    })
    .map(parts => Number(parts[parts.length - 1]))
    .filter(value => Number.isInteger(value) && value >= 0);

  const nextNumber = (siblingNumbers.length ? Math.max(...siblingNumbers) : 0) + 1;
  return parentParts.length ? `${parentParts.join(".")}.${nextNumber}` : String(nextNumber);
}
