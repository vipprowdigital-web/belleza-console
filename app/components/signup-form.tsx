import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // for redirect
import { useAuth } from "~/hooks/useAuth";
import belleza_logo from "@/welcome/belleza_logo.svg";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branchName: "",
    subdomain: "",
    customDomain: "",
  });

  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const navigate = useNavigate();

  // handle field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // handle submit via TanStack mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const { name, email, password, confirmPassword, branchName, subdomain, customDomain } = formData;

    if (!name || !email || !password || !confirmPassword || !branchName || !subdomain)
      return setMessage({ type: "error", text: "All required fields must be filled." });

    if (password !== confirmPassword)
      return setMessage({ type: "error", text: "Passwords do not match." });

    if (password.length < 8)
      return setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });

    // Validate subdomain format (alphanumeric and hyphens only)
    if (!/^[a-zA-Z0-9-]+$/.test(subdomain))
      return setMessage({
        type: "error",
        text: "Subdomain can only contain alphanumeric characters and hyphens.",
      });

    register(
      { name, email, password, branchName, subdomain, customDomain: customDomain || undefined },
      {
        onSuccess: () => {
          setMessage({
            type: "success",
            text: "Account created successfully! Redirecting...",
          });
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            branchName: "",
            subdomain: "",
            customDomain: "",
          });
          setTimeout(() => navigate("/sign-in"), 1500);
        },
        onError: (error: any) => {
          setMessage({
            type: "error",
            text: error?.message || "Registration failed. Please try again.",
          });
        },
      },
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="px-4 py-6 sm:p-6 md:px-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your details below to create your account
                </p>
              </div>

              {message && (
                <div
                  className={`text-sm p-2 rounded ${
                    message.type === "error"
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

                <div className="grid sm:grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      />
                    {/* <FieldDescription>Input Description</FieldDescription> */}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      />
                    {/* <FieldDescription>Input Description</FieldDescription> */}
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="branchName">Branch Name</FieldLabel>
                    <Input
                      id="branchName"
                      type="text"
                      placeholder="Your Branch Name"
                      value={formData.branchName}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="customDomain">Custom Domain (Optional)</FieldLabel>
                    <Input
                      id="customDomain"
                      type="text"
                      placeholder="yourdomain.com"
                      value={formData.customDomain}
                      onChange={handleChange}
                    />
                  </Field>
                  
               </div>
               <Field>
                    <FieldLabel htmlFor="subdomain">Subdomain</FieldLabel>
                    <Input
                      id="subdomain"
                      type="text"
                      placeholder="your-subdomain"
                      value={formData.subdomain}
                      onChange={handleChange}
                      required
                    />
                    <FieldDescription>
                      Alphanumeric and hyphens only (e.g., my-branch)
                    </FieldDescription>
                  </Field>

          

              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm</FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Already have an account? <Link to="/sign-in">Sign In</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden md:block bg-[#791535] dark:bg-[#791535]">
            <img
              src={belleza_logo}
              alt="Image"
              className="absolute inset-0 h-full w-full object-contain p-5"
            />
          </div>
        </CardContent>
      </Card>
      {/* <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription> */}
    </div>
  );
}
