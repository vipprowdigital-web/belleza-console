import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile, updateUserProfile } from "~/api/auth.api";
import { useSelector } from "react-redux";
import type { RootState } from "~/redux/store";

export function useUser() {
    const queryClient = useQueryClient();
    const reduxUser = useSelector((state: RootState) => state.user);

    // Fetch user profile
    const userQuery = useQuery({
        queryKey: ["user", "profile"],
        queryFn: getUserProfile,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });

    // Update user profile
    const updateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            // Update cache with new data
            queryClient.setQueryData(["user", "profile"], data);
            console.info("Profile updated successfully.", data);
        },
        onError: (error: any) => {
            console.error("Profile update failed:", error.message);
        },
    });

    // Extract user and branch from response
    const profileData = userQuery.data;
    const user = profileData?.user;
    const branch = profileData?.branch;

    return {
        user,
        branch,
        reduxUser, // Also return redux user for fallback
        isLoading: userQuery.isLoading,
        isFetching: userQuery.isFetching,
        error: userQuery.error,
        updateUser: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
        updateError: updateMutation.error,
    };
}
