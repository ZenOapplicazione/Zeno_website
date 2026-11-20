// Crea un contatto in HubSpot (solo dopo la verifica anti-bot).
// Token: app privata HubSpot con crm.objects.contacts.read/write.

const HUBSPOT_CONTACTS_URL = 'https://api.hubapi.com/crm/v3/objects/contacts';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email) {
  return typeof email === 'string' && email.length <= 254 && EMAIL_RE.test(email);
}

// Restituisce true se il contatto è stato creato o esisteva già.
export async function upsertHubSpotContact(email) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    console.error('HUBSPOT_ACCESS_TOKEN non configurato');
    return false;
  }

  try {
    const res = await fetch(HUBSPOT_CONTACTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties: { email: email.trim().toLowerCase() } }),
    });
    // 409 = contatto già esistente: va bene così
    if (res.ok || res.status === 409) return true;
    console.error('HubSpot error:', res.status, (await res.text()).slice(0, 500));
    return false;
  } catch (err) {
    console.error('HubSpot request failed:', err);
    return false;
  }
}
