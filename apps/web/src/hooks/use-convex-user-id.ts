import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useConvexUserId() {
  const { user } = useUser();
  const convexUser = useQuery(
    api.users.getUser,
    user?.id ? { userId: user.id } : "skip"
  );
  return convexUser?._id;
}