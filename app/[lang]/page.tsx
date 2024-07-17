import VideoPage from '@/components/videoSubPage';
import React from 'react';
import type { Locale } from "@/config/i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function Home({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <main>
      <VideoPage dict={dict} />
    </main>
  );
}
