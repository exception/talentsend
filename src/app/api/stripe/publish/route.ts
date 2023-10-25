import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { APP_URL } from "@/lib/constants"
import stripe, { getStripeCustomerId } from "@/lib/stripe";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const queryParams = z.object({
  orgId: z.string(),
  offerId: z.string()
});

export const GET = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { orgId, offerId } = queryParams.parse(
      Object.fromEntries(url.searchParams),
    );

    const team = await prisma.organization.findFirst({
      where: {
        id: orgId,
        members: {
          some: {
            userId: session.user.id
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
        `${APP_URL}/t/${team.slug}?error=Stripe ID not available`,
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
      return Response.redirect(
        `${APP_URL}/t/${team.slug}/?error=Stripe customer no longer available`,
      );
    }

    const offer = await prisma.offer.findUnique({
      where: {
        id: offerId
      }
    });

    if (!offer) {
      return new Response(null, { status: 404 });
    }
    
    if (offer.status != "PENDING") {
      console.log("offer tried to be published via stripe but was already paid for", offer.id);
      return new Response(null, { status: 403 });
    }

    const returnUrl = `${APP_URL}/api/stripe/callback?checkoutId={CHECKOUT_SESSION_ID}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      mode: "payment",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      customer: customer.id,
      line_items: [
        {
          quantity: 1,
          price: env.STRIPE_ONE_TIME_PAYMENT_ID,
        },
      ],
      metadata: {
        offerId: offerId
      }
    });

    if (!checkoutSession || !checkoutSession.url) {
      return Response.redirect(
        `${APP_URL}/t/${team.slug}?error=Stripe checkout failed to create`,
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
