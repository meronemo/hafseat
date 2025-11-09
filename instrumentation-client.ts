// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js"

Sentry.init({
  dsn: "https://27d3369f0db62637c43b0e7adc94f454@o1306592.ingest.us.sentry.io/4510298135330816",

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
    Sentry.feedbackIntegration({
      // Additional SDK configuration goes in here, for example:
      colorScheme: "system",
      isEmailRequired: true,
      showBranding: false,
      triggerLabel: "오류 제보",
      triggerAreaLabel: "오류 제보",
      formTitle: "오류 제보",
      submitButtonLabel: "제출",
      cancelButtonLabel: "취소",
      addScreenshotButtonLabel: "스크린샷 추가",
      removeScreenshotButtonLabel: "스크린샷 제거",
      nameLabel: "이름",
      namePlaceholder: "이름",
      emailLabel: "이메일",
      emailPlaceholder: "example@hafs.hs.kr",
      isRequiredLabel: "(필수)",
      messageLabel: "설명",
      messagePlaceholder: "어떤 상황에서 발생한 오류인지 구체적으로 적어주세요. 현재 로그인한 계정의 이메일 주소와 오류가 발생한 시각을 알려주시면 오류 추적에 도움이 됩니다.",
      successMessageText: "제보해주셔서 감사합니다!",
      highlightToolText: "강조하기",
      hideToolText: "가리기",
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24'
});