import { prisma } from "@/db";
import { env } from "@/env.mjs";
import { Organization } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const getStripeCustomerId = async (team: Organization): Promise<string> => {
  if (team.stripeCustomerId) {
    return team.stripeCustomerId;
  }

  const customer = await stripe.customers.create();

  await prisma.organization.update({
    where: {
      id: team.id,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer.id;
};

export const getCustomerAndCheckoutSession = async (
  checkoutSessionId: string,
) => {
  const checkoutSession =
    await stripe.checkout.sessions.retrieve(checkoutSessionId);
  const customerOrCustomerId = checkoutSession.customer;
  let customerId = null;

  if (!customerOrCustomerId) {
    return { checkoutSession, stripeCustomer: null };
  }

  if (typeof customerOrCustomerId === "string") {
    customerId = customerOrCustomerId;
  } else if (customerOrCustomerId.deleted) {
    return { checkoutSession, stripeCustomer: null };
  } else {
    customerId = customerOrCustomerId.id;
  }
  const stripeCustomer = await stripe.customers.retrieve(customerId);
  if (stripeCustomer.deleted) {
    return { checkoutSession, stripeCustomer: null };
  }
  return { stripeCustomer, checkoutSession };
};

export default stripe;
