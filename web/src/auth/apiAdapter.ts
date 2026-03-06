import type { Adapter } from "next-auth/adapters";

const API_URL = process.env.API_URL || 'http://localhost:3001';
const API_SECRET = process.env.INTERNAL_API_SECRET || '';

// Centralized fetch helper for internal API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}/api/internal/auth${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_SECRET,
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API Adapter Error: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Custom NextAuth Adapter for strict database separation.
 * NextAuth (running in the `web` app) uses this to query the `api` app over HTTP.
 */
export function PrecisionFitApiAdapter(): Adapter {
  return {
    async createUser(user: any) {
      return await fetchAPI('/user', {
        method: 'POST',
        body: JSON.stringify(user),
      });
    },
    async getUser(id: string) {
      return await fetchAPI(`/user/${id}`);
    },
    async getUserByEmail(email: string) {
      return await fetchAPI(`/user-by-email?email=${encodeURIComponent(email)}`);
    },
    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }) {
      return await fetchAPI(`/user-by-account?provider=${encodeURIComponent(provider)}&providerAccountId=${encodeURIComponent(providerAccountId)}`);
    },
    async updateUser(user: any) {
      return await fetchAPI(`/user/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
      });
    },
    async deleteUser(userId: string) {
      return await fetchAPI(`/user/${userId}`, {
        method: 'DELETE',
      });
    },
    async linkAccount(account: any) {
      return await fetchAPI('/account', {
        method: 'POST',
        body: JSON.stringify(account),
      });
    },
    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }) {
      await fetchAPI(`/account?provider=${encodeURIComponent(provider)}&providerAccountId=${encodeURIComponent(providerAccountId)}`, {
        method: 'DELETE',
      });
    },
    async createSession({ sessionToken, userId, expires }: any) {
      return await fetchAPI('/session', {
        method: 'POST',
        body: JSON.stringify({ sessionToken, userId, expires }),
      });
    },
    async getSessionAndUser(sessionToken: string) {
      const result = await fetchAPI(`/session?sessionToken=${encodeURIComponent(sessionToken)}`);
      if (!result) return null;
      return result; // returns { session, user }
    },
    async updateSession({ sessionToken, ...data }: any) {
      return await fetchAPI('/session', {
        method: 'PUT',
        body: JSON.stringify({ sessionToken, ...data }),
      });
    },
    async deleteSession(sessionToken: string) {
      return await fetchAPI(`/session?sessionToken=${encodeURIComponent(sessionToken)}`, {
        method: 'DELETE',
      });
    },
    async createVerificationToken(verificationToken: any) {
      return await fetchAPI('/verification-token', {
        method: 'POST',
        body: JSON.stringify(verificationToken),
      });
    },
    async useVerificationToken({ identifier, token }: { identifier: string, token: string }) {
      return await fetchAPI(`/verification-token?identifier=${encodeURIComponent(identifier)}&token=${encodeURIComponent(token)}`, {
        method: 'DELETE',
      });
    },
  };
}
