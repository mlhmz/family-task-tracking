import NextAuth, { NextAuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

const refreshToken = async (token: JWT) => {
  try {
    // https://{KEYCLOAK_URL}/realms/{REALM}/.well-known/openid-configuration
    // We need the `token_endpoint`.
    const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.KEYCLOAK_CLIENT_ID ?? "",
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
        grant_type: "refresh_token",
        refresh_token: `${token.refresh_token}`,
      }),
      method: "POST",
    });
    const tokenSet: TokenSet = await response.json();

    if (!response.ok) throw tokenSet;
    const expiresAt = tokenSet.expires_in
      ? Math.floor(Date.now() / 1000 + Number(tokenSet.expires_in))
      : undefined;

    return {
      ...token, // Keep the previous token properties
      access_token: tokenSet.access_token,
      expires_at: expiresAt,
      // Fall back to old refresh token, but note that
      // many providers may only allow using a refresh token once.
      refresh_token: tokenSet.refresh_token ?? token.refresh_token,
    };
  } catch (error) {
    // The error property will be used client-side to handle the refresh token error
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
      issuer: process.env.KEYCLOAK_ISSUER ?? "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // Accounts are only passed on initial sign in so we use the fresh data.
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        };
      } else if (Date.now() / 1000 < Number(token.expires_at)) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        return refreshToken(token);
      }
    },
  },
  jwt: {
    async encode(params: { token: JWT; secret: string; maxAge: number }): Promise<string> {
      return `${params.token.access_token}:${params.token.refresh_token}:${params.token.expires_at}`;
    },
    async decode(params: { token: string; secret: string }): Promise<JWT | null> {
      const [access_token, refresh_token, expires_at] = params.token.split(":");
      return {
        access_token: access_token,
        expires_at: +expires_at,
        refresh_token: refresh_token,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
