/** Shared HTML blocks — content from approved Closed Circuit customer email docx templates. */

const p = 'margin:0 0 14px;color:#e2e8f0;';
const h2 = 'margin:24px 0 12px;color:#ffffff;font-size:18px;font-weight:700;';
const h3 = 'margin:18px 0 10px;color:#c7d2fe;font-size:15px;font-weight:600;';
const li = 'margin:0 0 6px;color:#cbd5e1;';
const muted = 'margin:0;color:#94a3b8;font-size:14px;';
const quote = 'margin:16px 0 0;color:#818cf8;font-size:14px;font-style:italic;';

function list(items) {
  return `<ul style="margin:0 0 14px;padding-left:20px;">${items
    .map((item) => `<li style="${li}">${item}</li>`)
    .join('')}</ul>`;
}

function brandClosing(quoteText) {
  return `
    <p style="${p}">Warm Regards,<br/><strong>Closed Circuit AI Pvt Ltd</strong><br/>Private. Secure. Connected.</p>
    <p style="${muted}">🌐 Website: <a href="https://closedcircuit.in" style="color:#818cf8;">https://closedcircuit.in</a><br/>
    📧 Email: <a href="mailto:support@closedcircuit.in" style="color:#818cf8;">support@closedcircuit.in</a></p>
    <p style="${quote}">${quoteText}</p>
  `;
}

function aboutClosedCircuitCore() {
  return `
    <h2 style="${h2}">About Closed Circuit</h2>
    <p style="${p}"><strong>Private. Secure. Connected.</strong></p>
    <p style="${p}">Closed Circuit is a next-generation digital platform designed to create trusted communities where people and organizations can share, communicate, and engage in a secure environment. Unlike public social media platforms, Closed Circuit focuses on privacy, meaningful interactions, and relationship building.</p>

    <h3 style="${h3}">Solutions for Individuals and Families (B2C)</h3>
    <p style="${p}">Closed Circuit enables users to:</p>
    ${list([
      '📸 Share Photos and Videos Privately — preserve memories and share them with trusted family members and friends.',
      '🎂 Celebrate Birthdays and Special Moments — digital gifting, greetings, and celebrations.',
      '💬 Secure Messaging — communicate safely with approved contacts.',
      '👨‍👩‍👧 Family and Relationship Building — stay connected across generations and geographical boundaries.',
      '🏆 Share Life\'s Important Moments — birthdays, anniversaries, family gatherings, school events, vacations, festivals, achievements.',
      '🔒 Privacy by Design — your memories stay within your circle, not on public platforms.',
    ])}

    <h3 style="${h3}">Solutions for Businesses and Organizations (B2B)</h3>
    <p style="${p}">Closed Circuit provides secure engagement platforms for:</p>
    ${list([
      '🏫 Schools and Educational Institutions — parent communities, student engagement, alumni networks, event sharing.',
      '🏢 Corporates and Enterprises — employee engagement, internal communication, corporate celebrations.',
      '🏘 Residential Welfare Associations (RWAs) — resident communication, community announcements, event coordination.',
      '🤝 Clubs and Membership Organizations — member interaction, event participation, community building.',
      '🏥 Hospitals and Healthcare Communities — awareness campaigns, patient communities, trusted support groups.',
      '🛍 Brands and Businesses — customer relationship programs, loyalty communities, personalized engagement.',
      '🎁 Digital Gifting and Celebration Programs — meaningful experiences for customers, employees, students, and members.',
      '📢 Permission-Based Promotions — reach customers through secure and trusted communication channels.',
    ])}

    <h3 style="${h3}">Industries Served</h3>
    ${list([
      'Schools and Colleges',
      'Corporates and Enterprises',
      'Residential Welfare Associations',
      'Hospitals and Clinics',
      'Clubs and Associations',
      'NGOs and Non-Profit Organizations',
      'Religious and Cultural Institutions',
      'Retail Businesses and Brands',
      'Event Management Companies',
      'Alumni Networks',
      'Membership Communities',
      'Family Networks',
    ])}

    <h3 style="${h3}">Why Choose Closed Circuit?</h3>
    ${list([
      'Privacy First',
      'Trusted Connections',
      'Secure Media Sharing',
      'Community Building',
      'Digital Gifting Ecosystem',
      'Family and Relationship Engagement',
      'Customer Relationship Platform',
      'Exclusive Networks Instead of Public Exposure',
      'Meaningful Interactions Over Endless Feeds',
    ])}
  `;
}

export const EMAIL_VERIFICATION_OTP_BODY = `
  <p style="${p}">Dear Customer,</p>
  <p style="${p}">Greetings from <strong>Closed Circuit AI Pvt Ltd</strong>.</p>
  <p style="${p}">Thank you for choosing Closed Circuit, a secure and private platform designed for safe digital interactions and media sharing.</p>

  <h2 style="${h2}">Email Verification</h2>
  <p style="${p}">To complete your registration and activate your account, please use the following One-Time Password (OTP):</p>
  <div style="margin:20px 0;padding:20px;background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.35);border-radius:12px;text-align:center;">
    <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">OTP</p>
    <p style="margin:0;color:#ffffff;font-size:32px;font-weight:700;letter-spacing:6px;">{{OTP_CODE}}</p>
  </div>
  <p style="${p}">This OTP is valid for the next <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>

  <h3 style="${h3}">About Closed Circuit — For Individuals and Families (B2C)</h3>
  <p style="${p}">Closed Circuit provides a private environment where children, parents, relatives, and friends can:</p>
  ${list([
    'Securely store and share photos and videos.',
    'Celebrate birthdays and special occasions with personalized digital gifting.',
    'Exchange messages and media only with trusted contacts.',
    'Preserve precious memories without exposing them on public social media platforms.',
    'Enjoy a safer and more meaningful online experience.',
  ])}

  <h3 style="${h3}">For Businesses and Organizations (B2B)</h3>
  <p style="${p}">Closed Circuit enables organizations to create secure digital communities for customers and members, schools and educational institutions, RWAs, clubs, communities, employee engagement, and brand promotions—building trusted networks with privacy and controlled access.</p>

  <p style="${p}">Thank you for being part of the Closed Circuit community.</p>
  <p style="${p}"><strong>Closed Circuit AI Pvt Ltd</strong><br/>Private. Secure. Connected.</p>
  <p style="${muted}">Website: <a href="https://closedcircuit.in" style="color:#818cf8;">https://closedcircuit.in</a><br/>
  Email: <a href="mailto:support@closedcircuit.in" style="color:#818cf8;">support@closedcircuit.in</a></p>
  <p style="${muted}">If you did not request this verification, please ignore this email.</p>
`;

export const EMAIL_VERIFICATION_SUCCESS_BODY = `
  <p style="${p}">Dear Customer,</p>
  <p style="${p}">Greetings from <strong>Closed Circuit AI Pvt Ltd</strong>.</p>
  <p style="${p}">🎉 Your email address has been successfully verified, and your Closed Circuit account is now active.</p>
  <p style="${p}">Thank you for joining a new generation of private and secure digital communication. Unlike public social media platforms, Closed Circuit is built around trusted relationships, privacy, and meaningful interactions.</p>

  <h3 style="${h3}">For Individuals and Families (B2C)</h3>
  ${list([
    '📸 Private Photo &amp; Video Sharing',
    '🎂 Birthday Gifting Platform',
    '💬 Secure Messaging',
    '👨‍👩‍👧 Family Connections',
    '🔒 Privacy First',
    '🌎 Global Reach',
    '🎉 Events and Celebrations',
  ])}

  <h3 style="${h3}">For Businesses and Organizations (B2B)</h3>
  ${list([
    '🏫 Schools and Educational Institutions',
    '🏢 Corporates and Enterprises',
    '🏘 Residential Welfare Associations (RWAs)',
    '🤝 Clubs and Membership Organizations',
    '🛍 Brands and Businesses',
    '🏥 Hospitals and Healthcare Communities',
    '🎁 Loyalty and Gifting Programs',
    '📢 Targeted Promotions',
  ])}

  <h3 style="${h3}">Why Closed Circuit?</h3>
  ${list([
    'Privacy by Design',
    'Trusted Connections',
    'Secure Media Sharing',
    'Digital Gifting Experience',
    'Family and Community Engagement',
    'Business and Customer Relationship Platform',
    'Exclusive Networks Instead of Public Exposure',
    'Meaningful Interactions Over Endless Feeds',
  ])}

  <h3 style="${h3}">Industries That Can Benefit</h3>
  ${list([
    'Schools and Colleges',
    'Residential Welfare Associations',
    'Corporates and Enterprises',
    'Hospitals and Clinics',
    'Clubs and Associations',
    'Religious and Cultural Organizations',
    'NGOs and Non-Profit Institutions',
    'Retail Businesses and Brands',
    'Event Management Companies',
    'Communities and Membership Groups',
  ])}

  <p style="${p}">Thank you for becoming part of the Closed Circuit Community. Together, we are building a safer, more private, and more meaningful digital world.</p>
  ${brandClosing('Because your memories and relationships deserve privacy.')}
`;

export const ENQUIRY_RECEIVED_CLIENT_BODY = `
  <p style="${p}">Dear Customer,</p>
  <p style="${p}">Greetings from <strong>Closed Circuit AI Pvt Ltd</strong>.</p>
  <p style="${p}">Thank you for your interest in Closed Circuit. We have successfully received your enquiry and appreciate the opportunity to introduce our platform to you.</p>

  <h2 style="${h2}">📅 Callback Schedule</h2>
  <p style="${p}">As per the date and time selected by you in the enquiry form, one of our representatives will contact you to understand your requirements and provide a detailed explanation of the Closed Circuit platform, its features, and the various ways it can benefit individuals, families, businesses, and organizations.</p>
  <div style="margin:16px 0;padding:16px;background:rgba(255,255,255,0.04);border-radius:12px;border:1px solid rgba(255,255,255,0.08);">
    <p style="margin:0 0 8px;"><strong>Looking For:</strong> {{lookingFor}}</p>
    <p style="margin:0 0 8px;"><strong>Preferred Date:</strong> {{preferredCallDate}}</p>
    <p style="margin:0;"><strong>Preferred Time:</strong> {{preferredCallTime}}</p>
  </div>
  <p style="${p}">We look forward to speaking with you and helping you discover a safer and more meaningful digital experience.</p>

  ${aboutClosedCircuitCore()}

  <h3 style="${h3}">Our Vision</h3>
  <p style="${p}">To create a world where memories, relationships, communities, and businesses can flourish within secure and trusted networks.</p>
  <p style="${p}">Thank you once again for your enquiry. We look forward to speaking with you on your preferred schedule and welcoming you to the Closed Circuit ecosystem.</p>
  ${brandClosing('Because relationships are built on trust, and trust deserves privacy.')}
`;

export const CALL_REMINDER_CLIENT_BODY = `
  <p style="${p}">Dear Customer,</p>
  <p style="${p}">Greetings from <strong>Closed Circuit AI Pvt Ltd</strong>.</p>
  <p style="${p}">This is a gentle reminder that your scheduled discussion regarding Closed Circuit is coming up in approximately <strong>one hour</strong>.</p>

  <div style="margin:20px 0;padding:18px;background:rgba(99,102,241,0.12);border-radius:12px;border:1px solid rgba(99,102,241,0.25);">
    <p style="margin:0 0 8px;">📅 <strong>Scheduled Date:</strong> {{SCHEDULED_DATE}}</p>
    <p style="margin:0;">🕒 <strong>Scheduled Time:</strong> {{SCHEDULED_TIME}}</p>
  </div>

  <p style="${p}">As per your request, one of our representatives will contact you to provide a detailed explanation of the Closed Circuit platform, answer your questions, and discuss how it can benefit individuals, families, communities, businesses, and organizations.</p>
  <p style="${p}">We look forward to speaking with you.</p>

  ${aboutClosedCircuitCore()}

  <p style="${p}">We appreciate your interest in Closed Circuit and look forward to connecting with you shortly. Thank you for giving us the opportunity to demonstrate how Closed Circuit can help create safer, stronger, and more meaningful relationships for individuals and organizations alike.</p>
  ${brandClosing('Because memories deserve privacy and relationships deserve trust.')}
`;
