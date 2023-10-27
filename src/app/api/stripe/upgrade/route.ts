import { prisma } from "@/db";
import { authOptions } from "@/lib/auth/options";
import { APP_URL } from "@/lib/constants"
import { plans } from "@/lib/plans";
import stripe, { getStripeCustomerId } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const queryParams = z.object({
  teamId: z.string(),
  plan: z.enum(["PREMIUM", "ENTERPRISE"]),
  yearly: z.coerce.boolean().default(false)
});

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { teamId, plan, yearly } = queryParams.parse(
      Object.fromEntries(url.searchParams),
    );

    const team = await prisma.organization.findFirst({
      where: {
        id: teamId,
        members: {
          some: {
            userId: session.user.id,
            role: {
                not: "MEMBER"
            }
          }
        }
      }
    });

    if (!team) {
      return new Response(null, { status: 403 });
    }

    const customerId = await getStripeCustomerId(team);
    if (!customerId) {
      return Response.redirect(
        `${APP_URL}/t/${team.slug}/settings/billing?error=Stripe ID not available`,
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      return Response.redirect(
        `${APP_URL}/t/${team.slug}/settings/billing?error=Stripe customer no longer available`,
      );
    }

    const returnUrl = `${APP_URL}/t/${team.slug}/settings/billing`;

    const stripePlan = plans.find(p => p.type === plan);
    if (!stripePlan) {
        return Response.redirect(
            `${APP_URL}/t/${team.slug}/settings/billing?error=Unknown Stripe Plan`,
          );
    }

    // this is called when we know the cuota of the team has exceeded the max allowed.
    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: `${returnUrl}?success=true`,
      cancel_url: returnUrl,
      mode: "subscription",
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
      automatic_tax: {
        enabled: true
      },
      tax_id_collection: {
        enabled: true
      },
      allow_promotion_codes: true,
      customer: customer.id,
      line_items: [
        {
          quantity: 1,
          // @ts-expect-error
          price: stripePlan.stripePlans[yearly ? "YEARLY" : "MONTHLY"].priceId
        },
      ],
      client_reference_id: team.id
    });

    if (!checkoutSession || !checkoutSession.url) {
      return Response.redirect(
        `${APP_URL}/t/${team.slug}/settings/billing?error=Stripe checkout failed to create`,
      );
    }

    return Response.redirect(checkoutSession.url);
  } catch (err) {
    console.error("Failed stripe checkout", err);
    return Response.redirect(
      `${APP_URL}?error=Stripe checkout failed`,
    );
  }
};
