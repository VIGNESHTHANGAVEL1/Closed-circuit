import { config } from '../config/env.js';
import { buildSmsMessage } from './templateService.js';
import { logNotificationAttempt } from './notificationLogService.js';
import { truncateSafe } from '../utils/templateRender.js';
import { renderOtpSmsMessage } from '../utils/otpSmsRender.js';

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
  if (!trimmed) {
    return { ok: true, providerResponse: trimmed };
  }

  if (sendMode === 'dlt_entity') {
    const upper = trimmed.toUpperCase();
    if (upper === 'Y' || upper === 'YES' || upper === 'SUCCESS') {
      return { ok: true, providerResponse: trimmed };
    }
    if (upper === 'N' || upper === 'NO' || upper === 'FAIL' || upper === 'FAILED') {
      return { ok: false, error: 'SMS gateway rejected the request', providerResponse: trimmed };
    }
  }

  try {
    const json = JSON.parse(trimmed);

    if (sendMode === 'dlt_entity') {
      const status = String(json.status || json.response || json.Response || '').toUpperCase();
      if (status === 'Y' || status === 'YES' || status === 'SUCCESS' || json.success === true) {
        return { ok: true, providerResponse: trimmed };
      }
      if (status === 'N' || status === 'NO' || status === 'FAIL' || json.success === false) {
        return {
          ok: false,
          error: json.message || json.error || 'SMS gateway rejected the request',
          providerResponse: trimmed,
        };
      }
    }

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

async function requestSmsGateway({ body, headers = {}, contentType = 'application/json' }) {
  const response = await fetch(config.sms.gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      ...headers,
    },
    body,
  });

  const responseText = await response.text();
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

async function sendViaDltEntity({ mobile, template, message, senderId }) {
  const params = new URLSearchParams();
  params.set('username', config.sms.username);
  params.set('pass', config.sms.password);
  params.set('senderid', senderId);
  params.set('dest_mobileno', normalizeMobile(mobile));
  params.set('message', message);
  params.set('msgtype', 'TXT');
  params.set('dltentityid', config.sms.dltEntityId);
  params.set('dlttempid', template.template_id);
  params.set('response', 'Y');

  if (config.sms.dltHeaderId) {
    params.set('dltheaderid', config.sms.dltHeaderId);
  }

  return requestSmsGateway({
    body: params.toString(),
    contentType: 'application/x-www-form-urlencoded',
  });
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
      `[sms] SKIPPED ${templateKey} → ${normalizedMobile.slice(0, 2)}**** | SMS gateway not configured in .env`
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
    return { success: false, skipped: true, reason: 'SMS gateway not configured in .env' };
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

    console.log(`[sms] Sending ${templateKey} | mode=${config.sms.sendMode} | template_id=${template.template_id}`);
    console.log(`[sms] template content (from DB): ${truncateSafe(template.template_content, 300)}`);
    console.log(`[sms] rendered message: ${truncateSafe(renderedMessage || previewMessage, 300)}`);

    const outboundMessage = renderedMessage || previewMessage;

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

    return { success: true, message: renderedMessage || previewMessage };
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
