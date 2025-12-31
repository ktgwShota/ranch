import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export function getDrizzle() {
  const context = getCloudflareContext();

  if (!context || !context.env || !context.env.DB) {
    throw new Error(
      'D1 Database binding (DB) not found in Cloudflare context. Ensure you are running in a Worker environment or have proper dev setup.'
    );
  }

  return drizzle(context.env.DB, { schema });
}
