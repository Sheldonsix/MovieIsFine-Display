import {getRequestConfig} from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // 通过读取 Cookie 获取用户选择的语言，默认兜底为中文
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'zh';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
