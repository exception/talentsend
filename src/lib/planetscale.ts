import { env } from "@/env.mjs";
import { connect } from "@planetscale/database";
import { type User } from "@prisma/client";

export const pscale_config = {
  url: env.DATABASE_URL,
};

export const conn = env.DATABASE_URL ? connect(pscale_config) : null;

// Used only when runtime = 'edge'
export const getUserViaEdge = async (
  username: string,
): Promise<User | null> => {
  if (!conn) return null;

  const { rows } = await conn.execute("SELECT * FROM User WHERE username = ?", [
    username,
  ]);

  return rows && Array.isArray(rows) && rows.length > 0
    ? (rows[0] as User)
    : null;
};
