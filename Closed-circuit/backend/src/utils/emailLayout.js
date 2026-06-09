export function wrapEmailHtml({ title, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#030712;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#030712;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:linear-gradient(180deg,#0f172a 0%,#111827 100%);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 16px;border-bottom:1px solid rgba(255,255,255,0.08);">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.3px;">Closed Circuit</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;">Closed Circuit AI Pvt Ltd</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;color:#e2e8f0;font-size:15px;line-height:1.7;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.08);">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;">
                <a href="https://closedcircuit.in" style="color:#818cf8;text-decoration:none;">closedcircuit.in</a>
                &nbsp;|&nbsp;
                <a href="mailto:cc@closedcircuit.in" style="color:#818cf8;text-decoration:none;">cc@closedcircuit.in</a>
              </p>
              <p style="margin:10px 0 0;color:#64748b;font-size:11px;">&copy; Closed Circuit AI Pvt Ltd. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
