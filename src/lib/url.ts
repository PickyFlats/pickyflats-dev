import { API_SERVER } from '@/lib/api';
import { APP_URL } from '@/lib/client-old';

export default function withAppURL(path: string) {
  return APP_URL + path;
}

export function withCDNURL(path: string) {
  return API_SERVER + path;
}
