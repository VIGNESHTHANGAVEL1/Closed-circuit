import { config } from '../config/env.js';
import { buildSmsMessage } from './templateService.js';
import { logNotificationAttempt } from './notificationLogService.js';
import { truncateSafe } from '../utils/templateRender.js';
import { renderOtpSmsMessage } from '../utils/otpSmsRender.js';
import {
  buildKapsystemSendUrl,
  parseKapsystemResponse,
} from '../utils/kapsystemSms.js';

const OTP_TEMPLATE_KEYS = new Set(['MOBILE_VERIFICATION_OTP']);

function normalizeMobile(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length === 10) {
    return digits;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  return digits;
}

function formatGatewayMobile(mobile) {
  const normalized = normalizeMobile(mobile);
  if (config.sms.sendMode === 'full_message') {
    return normalized.length === 10 ? `91${normalized}` : normalized;
  }
  return normalized;
}

function parseProviderResponse(responseText, sendMode) {
  const trimmed = String(responseText || '').trim();

  if (sendMode === 'dlt_entity') {
    const result = parseKapsystemResponse(trimmed);
    return {
      ok: result.success,
      error: result.success ? undefined : result.message,
      providerResponse: trimmed,
      scheduleId: result.scheduleId,
    };
  }

  if (!trimmed) {
    return { ok: true, providerResponse: trimmed };
  }

  try {
    const json = JSON.parse(trimmed);

    if (sendMode === 'dlt_variables') {
      const rejected =
        json.return === false ||
        json.return === 'false' ||
        json.status === 'false' ||
        json.status === false;
      if (rejected) {
        return {
          ok: false,
          error: json.message || json.msg || 'SMS gateway rejected the request',
          providerResponse: trimmed,
        };
      }
      return { ok: true, providerResponse: trimmed };
    }

    const status = String(json.status || json.Status || json.success || '').toLowerCase();
    if (
      status === 'error' ||
      status === 'failed' ||
      status === 'false' ||
      json.error ||
      json.Error
    ) {
      return {
        ok: false,
        error:
          json.message ||
          json.Message ||
          json.error ||
          json.Error ||
          'SMS gateway rejected the request',
        providerResponse: trimmed,
      };
    }

    return { ok: true, providerResponse: trimmed };
  } catch {
    const lower = trimmed.toLowerCase();
    if (/fail|error|invalid|reject/.test(lower)) {
      return { ok: false, error: trimmed, providerResponse: trimmed };
    }
    return { ok: true, providerResponse: trimmed };
  }
}

async function requestSmsGateway({ url, method = 'POST', body, headers = {}, contentType }) {
  const response = await fetch(url, {
    method,
    headers: contentType
      ? {
          'Content-Type': contentType,
          ...headers,
        }
      : { ...headers },
    body,
  });

  const responseText = await response.text();
  console.log(`[sms] response status: ${response.status} | body: ${truncateSafe(responseText, 200)}`);

  const parsed = parseProviderResponse(responseText, config.sms.sendMode);

  if (!response.ok) {
    throw new Error(parsed.error || parsed.providerResponse || `SMS gateway returned ${response.status}`);
  }

  if (!parsed.ok) {
    throw new Error(parsed.error || parsed.providerResponse || 'SMS gateway rejected the request');
  }

  return parsed.providerResponse;
}

async function postSmsGateway(body, headers = {}) {
  return requestSmsGateway({
    url: config.sms.gatewayUrl,
    body: JSON.stringify(body),
    headers,
    contentType: 'application/json',
  });
}

async function sendViaDltVariables({ mobile, template, variables, senderId }) {
  const variablesValues = variables.map((value) => String(value ?? '')).join('|');

  const body = {
    authorization: config.sms.apiKey,
    route: 'dlt',
    sender_id: senderId,
    message: template.template_id,
    variables_values: variablesValues,
    numbers: formatGatewayMobile(mobile),
    flash: '0',
  };

  return postSmsGateway(body);
}

/**
 * SMS Just / Kapsystem / Xtend DLT API — POST with query params (College CSM pattern).
 */
async function sendViaDltEntity({ mobile, template, message, senderId }) {
  const params = new URLSearchParams({
    username: config.sms.username,
    pass: config.sms.password,
    senderid: senderId,
    dest_mobileno: normalizeMobile(mobile),
    message: message,
    response: 'Y',
  });

  if (config.sms.dltEntityId) {
    params.append('dltentityid', config.sms.dltEntityId);
  }

  const dltTemplateId = String(template.template_id || '').trim();
  if (dltTemplateId) {
    params.append('dlttempid', dltTemplateId);
  } else {
    console.warn(`[sms] dlttempid empty for template ${template.template_key}`);
  }

  if (config.sms.dltHeaderId) {
    params.append('dltheaderid', config.sms.dltHeaderId);
  }

  const gatewayUrl = config.sms.gatewayUrl.toLowerCase();
  if (gatewayUrl.includes('xtendonline.com')) {
    params.append('msgtype', 'TXT');
  }

  const url = buildKapsystemSendUrl(config.sms.gatewayUrl, params);

  return requestSmsGateway({ url, method: 'POST' });
}

async function sendViaFullMessage({ mobile, template, message, senderId }) {
  const gatewayMobile = formatGatewayMobile(mobile);
  const bearerHeaders = {
    Authorization: `Bearer ${config.sms.apiKey}`,
  };

  const modernBody = {
    to: [gatewayMobile],
    sender: senderId,
    text: message,
    type: 'transactional',
    dlttemplateid: template.template_id,
  };

  try {
    return await postSmsGateway(modernBody, bearerHeaders);
  } catch (err) {
    console.warn('[sms] Full-message send (Bearer) failed, retrying legacy body format:', err.message);
  }

  const legacyBody = {
    api_key: config.sms.apiKey,
    authorization: config.sms.apiKey,
    senderid: senderId,
    sender_id: senderId,
    mobile: gatewayMobile,
    numbers: gatewayMobile,
    message: message,
    text: message,
    dlttempid: template.template_id,
    dlttemplateid: template.template_id,
    template_id: template.template_id,
  };

  return postSmsGateway(legacyBody);
}

function finalizeOtpMessage(templateKey, templateContent, variables, smsContext) {
  if (!OTP_TEMPLATE_KEYS.has(templateKey) || !smsContext) {
    return renderSmsPreview(templateContent, variables);
  }

  const otp = smsContext.otp ?? variables[variables.length - 1] ?? '';
  return renderOtpSmsMessage(templateContent, {
    bindingEnabled: smsContext.bindingEnabled,
    webOtpHost: smsContext.webOtpHost,
    otp,
  });
}

function renderSmsPreview(templateContent, variables) {
  let index = 0;
  return String(templateContent || '').replace(/\{#(alphanumeric|numeric)#\}/g, (_match, type) => {
    const value = variables[index] ?? '';
    index += 1;
    if (type === 'numeric') {
      return String(value).replace(/\D/g, '');
    }
    return String(value).slice(0, 30);
  });
}

export async function checkSmsBalance() {
  if (!config.sms.balanceUrl || !config.sms.username || !config.sms.password) {
    return { success: false, error: 'SMS balance URL or credentials not configured' };
  }

  const params = new URLSearchParams({
    username: config.sms.username,
    pass: config.sms.password,
    response: 'Y',
  });

  const url = buildKapsystemSendUrl(config.sms.balanceUrl, params);
  const response = await fetch(url, { method: 'POST' });
  const text = await response.text();

  return {
    success: response.ok,
    balance: text.trim(),
  };
}

export async function sendTemplateSms({
  mobile,
  templateKey,
  variables = [],
  recipientType = 'CLIENT',
  notificationType,
  recipientName,
  inquiryId = null,
  smsContext = null,
}) {
  const sentAt = new Date();
  const normalizedMobile = normalizeMobile(mobile);

  if (!config.sms.enabled) {
    console.warn(
      `[sms] SKIPPED ${templateKey} → ${normalizedMobile.slice(0, 2)}**** | SMS gateway not configured`
    );
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      status: 'SKIPPED',
      errorMessage: 'SMS gateway not configured',
    });
    return { success: false, skipped: true, reason: 'SMS gateway not configured' };
  }

  try {
    const { template, message: previewMessage } = await buildSmsMessage(templateKey, variables);
    const senderId = template.sender_id || config.sms.senderId;
    const renderedMessage = finalizeOtpMessage(
      templateKey,
      template.template_content,
      variables,
      smsContext
    );

    const outboundMessage = renderedMessage || previewMessage;

    console.log(
      `[sms] Sending ${templateKey} | mode=${config.sms.sendMode} | dlttempid=${template.template_id}`
    );
    console.log(`[sms] template content (from DB): ${truncateSafe(template.template_content, 300)}`);
    console.log(`[sms] rendered message: ${truncateSafe(outboundMessage, 300)}`);

    let providerResponse;
    if (config.sms.sendMode === 'dlt_entity') {
      providerResponse = await sendViaDltEntity({
        mobile,
        template,
        message: outboundMessage,
        senderId,
      });
    } else if (config.sms.sendMode === 'full_message') {
      providerResponse = await sendViaFullMessage({
        mobile,
        template,
        message: outboundMessage,
        senderId,
      });
    } else {
      providerResponse = await sendViaDltVariables({
        mobile,
        template,
        variables,
        senderId,
      });
    }

    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      templateId: template.template_id,
      status: 'SENT',
      providerResponse,
      sentAt,
    });

    console.log(`[sms] SENT ${templateKey} → ${normalizedMobile.slice(0, 2)}****`);

    return { success: true, message: outboundMessage };
  } catch (err) {
    await logNotificationAttempt({
      inquiryId,
      recipientType,
      channel: 'SMS',
      notificationType,
      recipientName,
      recipientMobile: normalizedMobile,
      templateKey,
      status: 'FAILED',
      errorMessage: truncateSafe(err.message, 500),
    });
    console.error(`[sms] Failed to send ${templateKey}:`, err.message);
    return { success: false, error: err.message };
  }
}
