import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { useUser } from "~/hooks/useUser";

interface EditProfileFormProps {
  onSuccess?: () => void;
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const { user, branch, isLoading, isUpdating, updateUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    branchName: "",
    subdomain: "",
    customDomain: "",
  });

  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with user and branch data
  useEffect(() => {
    if (user && branch) {
      setFormData({
        name: user.name || "",
        branchName: branch.name || "",
        subdomain: branch.subdomain || "",
        customDomain: branch.customDomain || "",
      });
    }
  }, [user, branch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const { name, branchName, subdomain, customDomain } = formData;

    if (!name || !branchName || !subdomain) {
      return setMessage({ type: "error", text: "Name, Branch Name, and Subdomain are required." });
    }

    // Validate subdomain format
    if (!/^[a-zA-Z0-9-]+$/.test(subdomain)) {
      return setMessage({
        type: "error",
        text: "Subdomain can only contain alphanumeric characters and hyphens.",
      });
    }

    updateUser(
      {
        name,
        branchName,
        subdomain,
        customDomain: customDomain || undefined,
      },
      {
        onSuccess: () => {
          setMessage({ type: "success", text: "Profile updated successfully!" });
          setIsEditing(false);
          setTimeout(() => {
            setMessage(null);
            onSuccess?.();
          }, 2000);
        },
        onError: (error: any) => {
          setMessage({
            type: "error",
            text: error?.message || "Failed to update profile.",
          });
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage(null);
    if (user && branch) {
      setFormData({
        name: user.name,
        branchName: branch.name,
        subdomain: branch.subdomain,
        customDomain: branch.customDomain || "",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">Loading profile...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal and branch information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <div
              className={`text-sm p-3 rounded ${
                message.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="your@gmail.com"
              value={user?.email || ""}
              disabled
            />
            <FieldDescription>Email cannot be changed</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="branchName">Branch Name</FieldLabel>
            <Input
              id="branchName"
              type="text"
              placeholder="Your Branch Name"
              value={formData.branchName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="subdomain">Subdomain</FieldLabel>
            <Input
              id="subdomain"
              type="text"
              placeholder="your-subdomain"
              value={formData.subdomain}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <FieldDescription>
              Alphanumeric and hyphens only (e.g., my-branch)
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="customDomain">Custom Domain</FieldLabel>
            <Input
              id="customDomain"
              type="text"
              placeholder="yourdomain.com"
              value={formData.customDomain}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <FieldDescription>Leave empty if not using a custom domain</FieldDescription>
          </Field>

          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
