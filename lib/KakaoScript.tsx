"use client"

import Script from "next/script"

declare global {
  interface Window {
    Kakao: {
      init: (key: string) => void;
      Share: {
        sendDefault: (options: Record<string, unknown>) => void;
        sendCustom: (options: Record<string, unknown>) => Promise<void>;
        uploadImage: (options: Record<string, unknown>) => Promise<void>;
      };
    };
  }
}

export default function KakaoScript() {
  const onLoad = () => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!);
  };

  return (
    <Script
      src="https://developers.kakao.com/sdk/js/kakao.js"
      async
      onLoad={onLoad}
    />
  );
}