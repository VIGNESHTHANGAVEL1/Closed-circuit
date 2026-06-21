/**
 * SMS Just / Kapsystem gateway response parsing (College CSM pattern).
 * Success: schedule ID like `5068570-2008_12_29`, or plain `Y` on some gateways.
 */

const KAPSYSTEM_ERROR_MAP = {
  ES1004: 'Invalid Sender ID',
  ES1007: 'Account Deactivated',
  ES1009: 'Unable to process request',
  ES1013: 'Invalid Template ID',
  ES1002: 'Unauthorized - insufficient privilege',
  ES1032: 'Authentication failed',
  ES1033: 'Not a valid service',
};

const SCHEDULE_ID_PATTERN = /^\d+-\d{4}_\d{2}_\d{2}$/;

export function parseKapsystemResponse(response) {
  const trimmed = String(response || '').trim();
  if (!trimmed) {
    return { success: false, message: 'Empty response from SMS gateway' };
  }

  if (SCHEDULE_ID_PATTERN.test(trimmed)) {
    return {
      success: true,
      message: 'SMS sent successfully',
      scheduleId: trimmed,
    };
  }

  const upper = trimmed.toUpperCase();
  if (upper === 'Y' || upper === 'YES' || upper === 'SUCCESS') {
    return { success: true, message: 'SMS sent successfully' };
  }

  if (upper === 'N' || upper === 'NO' || upper === 'FAIL' || upper === 'FAILED') {
    return { success: false, message: 'SMS gateway rejected the request' };
  }

  const errorCode = trimmed.match(/^(ES\d+)/i)?.[1]?.toUpperCase();
  if (errorCode && KAPSYSTEM_ERROR_MAP[errorCode]) {
    return { success: false, message: KAPSYSTEM_ERROR_MAP[errorCode], errorCode };
  }

  if (errorCode) {
    return { success: false, message: trimmed, errorCode };
  }

  if (/fail|error|invalid|reject/i.test(trimmed)) {
    return { success: false, message: trimmed };
  }

  return { success: true, message: trimmed };
}

export function buildKapsystemSendUrl(baseUrl, params) {
  const normalizedBase = String(baseUrl || '').trim().replace(/\?.*$/, '');
  return `${normalizedBase}?${params.toString()}`;
}
