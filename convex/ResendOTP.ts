import { Email } from '@convex-dev/auth/providers/Email';
import { Resend as ResendAPI } from 'resend';
import { alphabet, generateRandomString } from 'oslo/crypto';

type Locale = 'en' | 'ko' | 'ja';

interface SendVerificationRequestArgs {
  identifier: string;
  provider: { apiKey?: string };
  token: string;
}

interface EmailTemplate {
  lang: Locale;
  subject: string;
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  codeLabel: string;
  expires: string;
  security: string;
  footer: string;
  fromName: string;
}

const RESEND_API_KEY = process.env.AUTH_RESEND_KEY;
const SITE_URL = 'https://crossplatformkorea.com';

const emailTemplates: Record<Locale, EmailTemplate> = {
  en: {
    lang: 'en',
    subject: 'Your Cross-Platform Korea sign-in code',
    preheader: 'Use this 8-digit code to finish signing in.',
    eyebrow: 'MEMBER ACCESS / EMAIL OTP',
    heading: 'Let’s get you signed in.',
    intro: 'Enter the verification code below on the sign-in screen.',
    codeLabel: 'YOUR VERIFICATION CODE',
    expires: 'This code expires in 15 minutes.',
    security:
      'If you didn’t request this code, you can safely ignore this email. Never share this code with anyone.',
    footer: 'A community for people building across platforms.',
    fromName: 'Cross-Platform Korea',
  },
  ko: {
    lang: 'ko',
    subject: '크로스플랫폼 코리아 로그인 인증 코드',
    preheader: '8자리 인증 코드로 로그인을 완료해 주세요.',
    eyebrow: 'MEMBER ACCESS / 이메일 OTP',
    heading: '로그인을 계속할게요.',
    intro: '아래 인증 코드를 로그인 화면에 입력해 주세요.',
    codeLabel: '인증 코드',
    expires: '이 코드는 15분 후 만료됩니다.',
    security:
      '직접 요청하지 않았다면 이 메일을 무시해도 안전합니다. 인증 코드는 누구에게도 공유하지 마세요.',
    footer: '크로스플랫폼을 만드는 사람들의 커뮤니티',
    fromName: '크로스플랫폼 코리아',
  },
  ja: {
    lang: 'ja',
    subject: 'クロスプラットフォーム・コリア ログイン認証コード',
    preheader: '8桁の認証コードでログインを完了してください。',
    eyebrow: 'MEMBER ACCESS / メールOTP',
    heading: 'ログインを続けましょう。',
    intro: '以下の認証コードをログイン画面に入力してください。',
    codeLabel: '認証コード',
    expires: 'このコードは15分後に期限切れになります。',
    security:
      'このコードをリクエストしていない場合は、このメールを無視しても安全です。コードを他人と共有しないでください。',
    footer: 'クロスプラットフォームをつくる人のためのコミュニティ',
    fromName: 'クロスプラットフォーム・コリア',
  },
};

const fromEmail =
  process.env.ENVIRONMENT !== 'production' ? 'onboarding@resend.dev' : 'crossplatformkorea@hyo.dev';

function buildEmailHtml(template: EmailTemplate, token: string) {
  return `<!doctype html>
<html lang="${template.lang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${template.subject}</title>
  </head>
  <body style="margin:0;background:#f3f3f3;color:#111111;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${template.preheader}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f3f3;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #d9d9d9;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;border-bottom:1px solid #e5e5e5;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <img src="${SITE_URL}/assets/logo.png" width="34" height="34" alt="Cross-Platform Korea" style="display:inline-block;width:34px;height:34px;border:0;vertical-align:middle;" />
                      <span style="display:inline-block;margin-left:11px;vertical-align:middle;font-size:14px;font-weight:700;letter-spacing:-0.2px;">Cross-Platform Korea</span>
                    </td>
                    <td align="right" style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;letter-spacing:1.4px;color:#707070;">SECURE MAIL</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:42px 32px 36px;">
                <p style="margin:0 0 18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:1.6px;color:#111111;">${template.eyebrow}</p>
                <h1 style="margin:0;font-size:34px;line-height:1.12;letter-spacing:-1.4px;color:#111111;">${template.heading}</h1>
                <p style="margin:15px 0 30px;font-size:16px;line-height:1.65;color:#5f5f5f;">${template.intro}</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#111111;border-radius:14px;">
                  <tr>
                    <td align="center" style="padding:26px 16px;">
                      <p style="margin:0 0 12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:700;letter-spacing:1.8px;color:#b5b5b5;">${template.codeLabel}</p>
                      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:34px;font-weight:700;letter-spacing:8px;color:#ffffff;">${token}</div>
                    </td>
                  </tr>
                </table>

                <p style="margin:18px 0 0;font-size:13px;font-weight:600;color:#111111;">${template.expires}</p>
                <p style="margin:28px 0 0;padding-top:22px;border-top:1px solid #e5e5e5;font-size:13px;line-height:1.65;color:#707070;">${template.security}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px;background:#f7f7f7;border-top:1px solid #e5e5e5;">
                <p style="margin:0 0 6px;font-size:12px;color:#707070;">${template.footer}</p>
                <a href="${SITE_URL}" style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#111111;text-decoration:underline;">crossplatformkorea.com ↗</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildEmailText(template: EmailTemplate, token: string) {
  return `${template.heading}\n\n${template.intro}\n\n${template.codeLabel}: ${token}\n${template.expires}\n\n${template.security}\n\n${template.footer}\n${SITE_URL}`;
}

async function sendOtpEmail(
  locale: Locale,
  { identifier: email, provider, token }: SendVerificationRequestArgs,
) {
  const template = emailTemplates[locale];
  if (!provider.apiKey) throw new Error('Missing Resend API key');
  const resend = new ResendAPI(provider.apiKey);
  const { error } = await resend.emails.send({
    from: `${template.fromName} <${fromEmail}>`,
    to: [email],
    subject: template.subject,
    html: buildEmailHtml(template, token),
    text: buildEmailText(template, token),
  });

  if (error) throw new Error(JSON.stringify(error));
}

function createOtpProvider(locale: Locale) {
  return Email({
    id: `resend-otp-${locale}`,
    apiKey: RESEND_API_KEY,
    maxAge: 60 * 15,
    async generateVerificationToken() {
      return generateRandomString(8, alphabet('0-9'));
    },
    async sendVerificationRequest(args: SendVerificationRequestArgs) {
      await sendOtpEmail(locale, args);
    },
  });
}

export const ResendOtpEn = createOtpProvider('en');
export const ResendOtpKo = createOtpProvider('ko');
export const ResendOtpJa = createOtpProvider('ja');
