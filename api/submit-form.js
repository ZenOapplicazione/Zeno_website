import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, fields } = req.body;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided' });
    }

    const isProducer = type === 'produttori';
    const title = isProducer ? 'Questionario Produttori' : 'Questionario Utenti';
    const color = '#1b4332';

    // Build HTML table rows
    const rows = fields
      .map(({ label, value }, i) => {
        const bg = i % 2 === 0 ? '#f9fafb' : '#ffffff';
        return `<tr style="background:${bg}">
          <td style="padding:14px 18px;font-weight:600;color:${color};border-bottom:1px solid #e5e7eb;width:40%;font-size:14px">${label}</td>
          <td style="padding:14px 18px;color:#374151;border-bottom:1px solid #e5e7eb;font-size:14px">${value}</td>
        </tr>`;
      })
      .join('');

    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:Arial,Helvetica,sans-serif">
        <div style="background:${color};padding:28px 24px;border-radius:12px 12px 0 0;text-align:center">
          <h1 style="color:#ff5e14;margin:0;font-size:32px;font-weight:900;letter-spacing:-0.02em">ZenO</h1>
          <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:14px">${title}</p>
        </div>
        <table style="width:100%;border-collapse:collapse;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb">
          ${rows}
        </table>
        <div style="background:#f3f4f6;padding:18px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e5e7eb;border-top:none">
          <p style="margin:0;font-size:12px;color:#9ca3af">Inviato tramite zenocircle.it</p>
        </div>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL || 'onboarding@resend.dev',
      to: process.env.PUBLIC_FORM_EMAIL,
      subject: `ZenO — Nuovo ${title}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
