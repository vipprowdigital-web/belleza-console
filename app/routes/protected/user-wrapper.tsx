// import ProfilePage from "~/admin/users/profile/page";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import ProfilePage from "~/admin/profile/page";

export default function UserWrapper() {
  return (
    <ProtectedRoute>
      {/* <ProfilePage /> */}
      <ProfilePage />
    </ProtectedRoute>
  );
}
