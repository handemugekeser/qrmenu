import { Language } from '@prisma/client';

export interface WeeklyInsightsTemplateData {
  ownerName: string;
  count: number;
  topInsightTitle: string;
  topInsightBody: string;
  appUrl: string;
  unsubscribeUrl: string;
  preferencesUrl: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

const COLORS = {
  navy: '#3b5bdb',
  text: '#0d1b3e',
  textMuted: 'rgba(13,27,62,0.55)',
  bg: '#f8f9ff',
  surface: '#ffffff',
  border: 'rgba(59,91,219,0.10)',
};

const STRINGS: Record<Language, {
  subject: string;
  greeting: (name: string) => string;
  intro: (count: number) => string;
  mostImportant: string;
  ctaBtn: string;
  signature: string;
  footerNote: string;
  unsubscribeLink: string;
  preferencesLink: string;
}> = {
  TR: {
    subject: 'Bu haftaki AI öneriniz hazır 🔵',
    greeting: (name) => `Merhaba ${name},`,
    intro: (count) => `Bu hafta menünüz için <strong>${count} yeni öneri</strong> hazırladık.`,
    mostImportant: 'En önemlisi şu:',
    ctaBtn: 'Önerilerimi gör',
    signature: 'İyi haftalar dileriz,<br/>Menusflow',
    footerNote: 'Bu e-postaları almak istemiyor musunuz?',
    unsubscribeLink: 'Tek tıkla aboneliği iptal et',
    preferencesLink: 'Bildirim tercihlerini güncelle',
  },
  EN: {
    subject: 'Your weekly AI insights are ready 🔵',
    greeting: (name) => `Hi ${name},`,
    intro: (count) => `We've prepared <strong>${count} new suggestions</strong> for your menu this week.`,
    mostImportant: 'The most important one:',
    ctaBtn: 'View my insights',
    signature: 'Have a great week,<br/>Menusflow',
    footerNote: "Don't want to receive these emails?",
    unsubscribeLink: 'One-click unsubscribe',
    preferencesLink: 'Update notification preferences',
  },
  AR: {
    subject: 'توصيات الذكاء الاصطناعي لهذا الأسبوع جاهزة 🔵',
    greeting: (name) => `مرحباً ${name}،`,
    intro: (count) => `لقد أعددنا <strong>${count} توصية جديدة</strong> لقائمتك هذا الأسبوع.`,
    mostImportant: 'الأهم هو:',
    ctaBtn: 'عرض توصياتي',
    signature: 'نتمنى لك أسبوعاً سعيداً،<br/>Menusflow',
    footerNote: 'لا ترغب في تلقي هذه الرسائل؟',
    unsubscribeLink: 'إلغاء الاشتراك بنقرة واحدة',
    preferencesLink: 'تحديث تفضيلات الإشعارات',
  },
};

export function renderWeeklyInsightsEmail(
  locale: Language,
  data: WeeklyInsightsTemplateData,
): RenderedEmail {
  const s = STRINGS[locale] ?? STRINGS.TR;
  const dir = locale === 'AR' ? 'rtl' : 'ltr';

  const html = `<!DOCTYPE html>
<html lang="${locale.toLowerCase()}" dir="${dir}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(s.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;color:${COLORS.text}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:${COLORS.surface};border:1px solid ${COLORS.border};border-radius:16px;overflow:hidden">
        <tr><td style="padding:32px 32px 8px 32px">
          <div style="font-size:13px;font-weight:600;letter-spacing:.04em;color:${COLORS.navy};text-transform:uppercase">Menusflow</div>
        </td></tr>
        <tr><td style="padding:8px 32px 0 32px">
          <h1 style="margin:0;font-size:22px;font-weight:700;line-height:1.3;color:${COLORS.text}">${escapeHtml(s.greeting(data.ownerName))}</h1>
        </td></tr>
        <tr><td style="padding:16px 32px 0 32px">
          <p style="margin:0;font-size:15px;line-height:1.6;color:${COLORS.text}">${s.intro(data.count)}</p>
          <p style="margin:16px 0 0 0;font-size:15px;line-height:1.6;color:${COLORS.textMuted}">${escapeHtml(s.mostImportant)}</p>
        </td></tr>
        <tr><td style="padding:16px 32px 0 32px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-${dir === 'rtl' ? 'right' : 'left'}:3px solid ${COLORS.navy};border-radius:8px">
            <tr><td style="padding:16px 20px">
              <div style="font-size:15px;font-weight:700;color:${COLORS.text};margin-bottom:6px">${escapeHtml(data.topInsightTitle)}</div>
              <div style="font-size:14px;line-height:1.55;color:${COLORS.textMuted}">${escapeHtml(data.topInsightBody)}</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td align="center" style="padding:28px 32px 8px 32px">
          <a href="${data.appUrl}/dashboard/insights" style="display:inline-block;background:${COLORS.navy};color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:10px">${escapeHtml(s.ctaBtn)}</a>
        </td></tr>
        <tr><td style="padding:24px 32px 32px 32px">
          <p style="margin:0;font-size:14px;line-height:1.6;color:${COLORS.textMuted}">${s.signature}</p>
        </td></tr>
        <tr><td style="padding:20px 32px;border-top:1px solid ${COLORS.border};background:${COLORS.bg}">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${COLORS.textMuted}">
            ${escapeHtml(s.footerNote)}
            <br/>
            <a href="${data.unsubscribeUrl}" style="color:${COLORS.navy};text-decoration:underline">${escapeHtml(s.unsubscribeLink)}</a>
            &nbsp;·&nbsp;
            <a href="${data.preferencesUrl}" style="color:${COLORS.navy};text-decoration:underline">${escapeHtml(s.preferencesLink)}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    stripTags(s.greeting(data.ownerName)),
    '',
    stripTags(s.intro(data.count).replace(/<[^>]+>/g, '')),
    stripTags(s.mostImportant),
    '',
    `> ${data.topInsightTitle}`,
    `> ${data.topInsightBody}`,
    '',
    `${data.appUrl}/dashboard/insights`,
    '',
    stripTags(s.signature),
    '',
    '---',
    `${stripTags(s.footerNote)} ${stripTags(s.unsubscribeLink)}: ${data.unsubscribeUrl}`,
  ].join('\n');

  return { subject: s.subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
}
