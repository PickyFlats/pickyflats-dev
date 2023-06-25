import { APP_URL } from '@/lib/client-old';

export default function withAppURL(path: string) {
  return APP_URL + path;
}

export function withCDNURL(path: string) {
  return process.env.NEXT_PUBLIC_API_SERVER + path;
}
