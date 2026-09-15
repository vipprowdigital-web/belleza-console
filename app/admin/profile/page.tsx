import { useUser } from "~/hooks/useUser";
import { EditProfileForm } from "~/components/edit-profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function ProfilePage() {
  const { user, branch, isLoading } = useUser();

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
            <p className="text-md font-medium">{user.name}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Email</h3>
            <p className="text-md font-medium">{user.email}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">Provider</h3>
            <p className="text-md font-medium capitalize">{user.provider}</p>
          </div>
          {user.avatar && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Avatar</h3>
              <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branch Information Card */}
      {branch && (
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
            <CardDescription>
              Your branch and domain details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Branch Name</h3>
              <p className="text-md font-medium">{branch.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Slug</h3>
              <p className="text-md font-medium">{branch.slug}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">Subdomain</h3>
              <p className="text-md font-medium">{branch.subdomain}</p>
            </div>
            {branch.customDomain && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Custom Domain</h3>
                <p className="text-md font-medium">{branch.customDomain}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Card */}
      <EditProfileForm />
    </div>
  );
}
