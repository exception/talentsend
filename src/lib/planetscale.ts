import { env } from '@/env.mjs';
import { connect } from '@planetscale/database';

export const pscale_config = {
    url: env.DATABASE_URL,
};

export const conn = env.DATABASE_URL
    ? connect(pscale_config)
    : null;

// Used only when runtime = 'edge'
export const getOfferAndTeamViaEdge = async (offerId: string) => {
    if (!conn) return null;

    try {
        const { rows } = await conn.execute(
            'SELECT targetFirstName, organizationId, Organization.imageUrl, Organization.name FROM Offer LEFT JOIN Organization ON Organization.id = Offer.organizationId WHERE Offer.id = ?;',
            [offerId],
        );

        return rows && Array.isArray(rows) && rows.length > 0
            ? (rows[0] as {
                  targetFirstName: string;
                  imageUrl: string;
                  name: string;
              })
            : null;
    } catch (err) {
        console.error(err);
    }
};
