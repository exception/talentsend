import { type CookieOption } from "next-auth";
import { IS_ON_VERCEL } from ".";

export const defaultCookies = (secure: boolean) => {
  const cookiePrefix = secure ? "__Secure-" : "";

  const options: CookieOption["options"] = {
    domain: IS_ON_VERCEL ? ".talentsend.com" : undefined,
    sameSite: "lax",
    path: "/",
    secure,
  };

  return {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        ...options,
        httpOnly: true,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options,
    },
    csrfToken: {
      name: `${cookiePrefix}next-auth.csrf-token`,
      options: {
        ...options,
        httpOnly: true,
      },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: {
        ...options,
        httpOnly: true,
      },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: {
        ...options,
        httpOnly: true,
      },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure,
      },
    },
  };
};
