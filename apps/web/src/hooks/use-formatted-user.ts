import { useUser } from "@clerk/nextjs";

/**
 * Formatted user data interface
 */
interface FormattedUser {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's full name */
  fullName: string;
  /** User's primary email address */
  email: string;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Original Clerk user ID */
  id?: string;
}

/**
 * Custom hook for formatted user data
 *
 * Provides a clean interface for accessing user information with fallback values.
 * Handles cases where user data might be incomplete or unavailable.
 *
 * @returns Formatted user data with sensible defaults
 *
 * @example
 * ```tsx
 * const userInfo = useFormattedUser()
 *
 * return (
 *   <div>
 *     <h1>Welcome back, {userInfo.firstName}</h1>
 *     <p>Email: {userInfo.email}</p>
 *   </div>
 * )
 * ```
 */
export function useFormattedUser(): FormattedUser {
  const { user, isLoaded } = useUser();

  const firstName = user?.firstName || "User";
  const lastName = user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const email = user?.emailAddresses?.[0]?.emailAddress || "user@example.com";
  const isAuthenticated = isLoaded && !!user;

  return {
    firstName,
    lastName,
    fullName,
    email,
    isAuthenticated,
    id: user?.id,
  };
}
