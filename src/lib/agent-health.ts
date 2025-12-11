/**
 * BuildIT Agent health check utilities
 * Safe for client-side use (no Node.js dependencies)
 */

const AGENT_API_URL = process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8910";

/**
 * Check if BuildIT Agent is available
 * @returns true if agent is healthy
 */
export async function checkAgentHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${AGENT_API_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the agent API URL
 */
export function getAgentApiUrl(): string {
  return AGENT_API_URL;
}
