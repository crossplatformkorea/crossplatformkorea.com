import { Email } from "@convex-dev/auth/providers/Email";
import { Resend as ResendAPI } from "resend";
import { alphabet, generateRandomString } from "oslo/crypto";

type Locale = "en" | "ko" | "ja";

interface SendVerificationRequestArgs {
  identifier: string;
  provider: any;
  token: string;
}

interface SendVerificationRequestArgs {
  identifier: string;
  provider: any;
  token: string;
}

const RESEND_API_KEY = process.env.AUTH_RESEND_KEY;

const emailTemplates: Record<
  Locale,
  { subject: string; text: (token: string) => string }
> = {
  en: {
    subject: "Please verify your email for Cross-Platform Korea",
    text: (token: string) =>
      `Hello, this is Cross-Platform Korea,\n\nVerification code: ${token}\n\nPlease enter the above code in the app to complete the login process.`,
  },
  ko: {
    subject: "크로스플랫폼 코리아 이메일 인증 안내",
    text: (token: string) =>
      `안녕하세요 크로스플랫퐄 코리아에요,\n\n인증 코드: ${token}\n\n위 코드를 앱에 입력하여 로그인 절차를 완료해 주세요.`,
  },
  ja: {
    subject: "メール認証のご案内",
    text: (token: string) =>
      `こんにちは、クロスプラットフォーム・コリアです、\n\n認証コード: ${token}\n\n上記のコードをアプリに入力して、ログイン手続きを完了してください。`,
  },
};

const fromEmail =
  process.env.ENVIRONMENT !== "production"
    ? "onboarding@resend.dev"
    : "auth@crossplatformkorea.com";

export const ResendOtpEn = Email({
  id: "resend-otp-en",
  apiKey: RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
  }: SendVerificationRequestArgs) {
    const template = emailTemplates["en"];
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: `Cross-Platform Korea <${fromEmail}>`,
      to: [email],
      subject: template.subject,
      text: template.text(token),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});

export const ResendOtpKo = Email({
  id: "resend-otp-ko",
  apiKey: RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
  }: SendVerificationRequestArgs) {
    const template = emailTemplates["ko"];
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: `크로스플랫폼 코리아 <${fromEmail}>`,
      to: [email],
      subject: template.subject,
      text: template.text(token),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});

export const ResendOtpJa = Email({
  id: "resend-otp-ja",
  apiKey: RESEND_API_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
  }: SendVerificationRequestArgs) {
    const template = emailTemplates["ja"];
    const resend = new ResendAPI(provider.apiKey);

    const { error } = await resend.emails.send({
      from: `クロスプラットフォーム・コリア <${fromEmail}>`,
      to: [email],
      subject: template.subject,
      text: template.text(token),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
