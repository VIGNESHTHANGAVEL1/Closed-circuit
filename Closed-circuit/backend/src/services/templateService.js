import { findSmsTemplateByKey } from '../models/smsTemplate.model.js';
import { findEmailTemplateByKey } from '../models/emailTemplate.model.js';
import { renderSmsTemplate, renderEmailTemplate } from '../utils/templateRender.js';

export async function getSmsTemplate(templateKey) {
  const template = await findSmsTemplateByKey(templateKey);
  if (!template) {
    const error = new Error(`SMS template not found: ${templateKey}`);
    error.statusCode = 500;
    throw error;
  }
  return template;
}

export async function getEmailTemplate(templateKey) {
  const template = await findEmailTemplateByKey(templateKey);
  if (!template) {
    const error = new Error(`Email template not found: ${templateKey}`);
    error.statusCode = 500;
    throw error;
  }
  return template;
}

export async function buildSmsMessage(templateKey, variables = []) {
  const template = await getSmsTemplate(templateKey);
  return {
    template,
    message: renderSmsTemplate(template.template_content, variables),
  };
}

export async function buildEmailMessage(templateKey, variables = {}) {
  const template = await getEmailTemplate(templateKey);
  return {
    template,
    subject: renderEmailTemplate(template.subject, variables),
    html: renderEmailTemplate(template.html_content, variables),
  };
}
