export function renderSmsTemplate(content, variables = []) {
  let index = 0;
  return String(content || '').replace(/\{#(alphanumeric|numeric)#\}/g, (_match, type) => {
    const value = variables[index] ?? '';
    index += 1;
    if (type === 'numeric') {
      return String(value).replace(/\D/g, '');
    }
    return String(value).slice(0, 30);
  });
}

export function renderEmailTemplate(content, variables = {}) {
  let rendered = String(content || '');
  for (const [key, value] of Object.entries(variables)) {
    const safeValue = value == null ? '' : String(value);
    rendered = rendered.replaceAll(`{{${key}}}`, safeValue);
    rendered = rendered.replaceAll(`{${key}}`, safeValue);
  }
  return rendered;
}

export function truncateSafe(text, max = 500) {
  if (!text) return null;
  const value = String(text);
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}
