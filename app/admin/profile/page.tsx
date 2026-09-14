import { useUser } from "~/hooks/useUser";
import { EditProfileForm } from "~/components/edit-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center text-muted-foreground">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>
            Your account and branch information
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Full Name</h3>
            <p className="text-lg font-medium">{user.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Email</h3>
            <p className="text-lg font-medium">{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Branch Name</h3>
            <p className="text-lg font-medium">{user.branchName}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Subdomain</h3>
            <p className="text-lg font-medium text-blue-600">{user.subdomain}</p>
          </div>
          {user.customDomain && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Custom Domain</h3>
              <p className="text-lg font-medium text-blue-600">{user.customDomain}</p>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Account Created</h3>
            <p className="text-lg font-medium">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Card */}
      <EditProfileForm />
    </div>
  );
}
