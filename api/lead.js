export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const { name, phone, website } = req.body || {};
  if (website) return res.status(200).json({ ok: true }); // ловушка для ботов

  const n = String(name || '').trim();
  const p = String(phone || '').trim();
  const digits = p.replace(/\D/g, '');
  if (n.length < 2 || n.length > 100 || digits.length < 10 || digits.length > 15) {
    return res.status(400).json({ ok: false });
  }

  const time = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tomsk' });
  const text = `Новая заявка с сайта\nФИО: ${n}\nТелефон: ${p}\nВремя: ${time}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TG_CHAT_ID, text })
    });
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    return res.status(502).json({ ok: false });
  }
}
