const templatePattern = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;

function lookup(input: Record<string, unknown>, key: string) {
  return key.split(".").reduce<unknown>((value, part) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[part];
  }, input);
}

export function renderTemplate(template: string, variables: Record<string, unknown>) {
  return template.replace(templatePattern, (_match, key) => {
    const value = lookup(variables, key);
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    return JSON.stringify(value, null, 2);
  });
}
