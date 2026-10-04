export function buildPrefixSearchClause(search) {
  const term = String(search || '').trim();
  if (!term) {
    return { clause: '', params: [] };
  }

  const prefix = `${term}%`;
  return {
    clause: `(fullName LIKE ? OR college LIKE ? OR university LIKE ? OR city LIKE ? OR state LIKE ?)`,
    params: [prefix, prefix, prefix, prefix, prefix],
  };
}
