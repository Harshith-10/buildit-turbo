"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ============================================================================
// Types
// ============================================================================

// Role type matches the roles configured in auth.ts (defaultRole: "student", adminRole: "admin")
export type UserRole = "student" | "admin" | "faculty";

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole | UserRole[];
  data?: Record<string, unknown>;
}

export interface ListUsersInput {
  searchValue?: string;
  searchField?: "email" | "name";
  searchOperator?: "contains" | "starts_with" | "ends_with";
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  filterField?: string;
  filterValue?: string | number | boolean;
  filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte";
}

export interface SetUserRoleInput {
  userId: string;
  role: UserRole | UserRole[];
}

export interface SetUserPasswordInput {
  userId: string;
  newPassword: string;
}

export interface UpdateUserInput {
  userId: string;
  data: Record<string, unknown>;
}

export interface BanUserInput {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
}

export interface UnbanUserInput {
  userId: string;
}

export interface ListUserSessionsInput {
  userId: string;
}

export interface RevokeUserSessionInput {
  sessionToken: string;
}

export interface RevokeUserSessionsInput {
  userId: string;
}

export interface ImpersonateUserInput {
  userId: string;
}

export interface RemoveUserInput {
  userId: string;
}

export interface HasPermissionInput {
  userId?: string;
  role?: UserRole;
  permissions?: {
    user?: (
      | "create"
      | "update"
      | "delete"
      | "set-role"
      | "set-password"
      | "list"
      | "ban"
      | "impersonate"
      | "get"
    )[];
    session?: ("delete" | "list" | "revoke")[];
  };
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============================================================================
// Admin Server Actions
// ============================================================================

/**
 * Create a new user (admin only)
 */
export async function createUser(
  input: CreateUserInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.createUser({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
        // Type assertion needed: BetterAuth types expect "admin"|"user" but we use custom roles
        role: input.role as "admin" | "user" | ("admin" | "user")[] | undefined,
        data: input.data,
      },
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create user",
    };
  }
}

/**
 * List all users with optional filtering, sorting, and pagination (admin only)
 */
export async function listUsers(input?: ListUsersInput): Promise<ActionResult> {
  try {
    const result = await auth.api.listUsers({
      query: {
        searchValue: input?.searchValue,
        searchField: input?.searchField,
        searchOperator: input?.searchOperator,
        limit: input?.limit,
        offset: input?.offset,
        sortBy: input?.sortBy,
        sortDirection: input?.sortDirection,
        filterField: input?.filterField,
        filterValue: input?.filterValue,
        filterOperator: input?.filterOperator,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to list users",
    };
  }
}

/**
 * Set a user's role (admin only)
 */
export async function setUserRole(
  input: SetUserRoleInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.setRole({
      body: {
        userId: input.userId,
        // Type assertion needed: BetterAuth types expect "admin"|"user" but we use custom roles
        role: input.role as "admin" | "user" | ("admin" | "user")[],
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set user role",
    };
  }
}

/**
 * Set a user's password (admin only)
 */
export async function setUserPassword(
  input: SetUserPasswordInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.setUserPassword({
      body: {
        userId: input.userId,
        newPassword: input.newPassword,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to set user password",
    };
  }
}

/**
 * Update a user's details (admin only)
 */
export async function updateUser(
  input: UpdateUserInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.adminUpdateUser({
      body: {
        userId: input.userId,
        data: input.data,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update user",
    };
  }
}

/**
 * Ban a user (admin only)
 */
export async function banUser(input: BanUserInput): Promise<ActionResult> {
  try {
    const result = await auth.api.banUser({
      body: {
        userId: input.userId,
        banReason: input.banReason,
        banExpiresIn: input.banExpiresIn,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to ban user",
    };
  }
}

/**
 * Unban a user (admin only)
 */
export async function unbanUser(input: UnbanUserInput): Promise<ActionResult> {
  try {
    const result = await auth.api.unbanUser({
      body: {
        userId: input.userId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unban user",
    };
  }
}

/**
 * List all sessions for a user (admin only)
 */
export async function listUserSessions(
  input: ListUserSessionsInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.listUserSessions({
      body: {
        userId: input.userId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to list user sessions",
    };
  }
}

/**
 * Revoke a specific session (admin only)
 */
export async function revokeUserSession(
  input: RevokeUserSessionInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.revokeUserSession({
      body: {
        sessionToken: input.sessionToken,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to revoke session",
    };
  }
}

/**
 * Revoke all sessions for a user (admin only)
 */
export async function revokeUserSessions(
  input: RevokeUserSessionsInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.revokeUserSessions({
      body: {
        userId: input.userId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to revoke user sessions",
    };
  }
}

/**
 * Impersonate a user (admin only)
 * Creates a session that mimics the specified user
 */
export async function impersonateUser(
  input: ImpersonateUserInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.impersonateUser({
      body: {
        userId: input.userId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to impersonate user",
    };
  }
}

/**
 * Stop impersonating a user and return to admin session
 */
export async function stopImpersonating(): Promise<ActionResult> {
  try {
    const result = await auth.api.stopImpersonating({
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to stop impersonating",
    };
  }
}

/**
 * Permanently delete a user (admin only)
 */
export async function removeUser(
  input: RemoveUserInput,
): Promise<ActionResult> {
  try {
    const result = await auth.api.removeUser({
      body: {
        userId: input.userId,
      },
      headers: await headers(),
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove user",
    };
  }
}

/**
 * Check if a user has specific permissions (admin only)
 */
export async function hasUserPermission(
  input: HasPermissionInput,
): Promise<ActionResult<boolean>> {
  try {
    if (!input.permissions) {
      return {
        success: false,
        error: "Permissions object is required",
      };
    }

    const result = await auth.api.userHasPermission({
      body: {
        userId: input.userId,
        // Type assertion needed: BetterAuth types expect "admin"|"user" but we use custom roles
        role: input.role as "admin" | "user" | undefined,
        permissions: input.permissions,
      },
    });

    return { success: true, data: result.success };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to check user permission",
    };
  }
}
