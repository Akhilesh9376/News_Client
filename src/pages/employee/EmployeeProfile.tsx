import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/hooks/redux";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

export const EmployeeProfile = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // UI state
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  // Profile validation
  const validateProfile = () => {
    const errors: Record<string, string> = {};

    if (!profileForm.name.trim()) {
      errors.name = "Name is required";
    } else if (profileForm.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Password validation
  const validatePassword = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)
    ) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, and a number";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfile()) {
      toast({
        title: "Please Fix Errors ⚠️",
        description: "Check the form for any validation errors.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingProfile(true);

    // Simulate API call
    setTimeout(() => {
      // In real app, this would update the user in backend and Redux store
      console.log("Profile updated:", profileForm);

      toast({
        title: "Profile Updated Successfully! ✅",
        description: "Your profile information has been updated.",
        variant: "success",
      });

      setIsUpdatingProfile(false);
    }, 1000);
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      toast({
        title: "Please Fix Password Errors ⚠️",
        description: "Check the password requirements and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await axiosInstance.post("/auth/v1/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast({
        title: "Password Updated Successfully! 🔒",
        description:
          "Your password has been changed. Please use your new password for future logins.",
        variant: "success",
      });

      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({});
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to update password";
      if (message.toLowerCase().includes("current password")) {
        setPasswordErrors({ currentPassword: message });
      } else if (message.toLowerCase().includes("new password")) {
        setPasswordErrors({ newPassword: message });
      }
      toast({ title: "Password Update Failed ❌", description: message, variant: "destructive" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;

    if (strength <= 25) return { text: "Weak", color: "bg-red-500" };
    if (strength <= 50) return { text: "Fair", color: "bg-yellow-500" };
    if (strength <= 75) return { text: "Good", color: "bg-blue-500" };
    return { text: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/employee/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="bg-brand-600 p-2 rounded-lg">
                <Newspaper className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-700">NewsHub</h1>
                <p className="text-xs text-brand-500 -mt-1">Employee Portal</p>
              </div>
            </Link>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Link
                to="/employee/dashboard"
                className="text-muted-foreground hover:text-brand-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your personal information and account security
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      placeholder="Enter your full name"
                      className={profileErrors.name ? "border-red-500" : ""}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-600">
                        {profileErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter your email address"
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-600">
                        {profileErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="w-full bg-brand-600 hover:bg-brand-700"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Change Password</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className={
                          passwordErrors.currentPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-600">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className={
                          passwordErrors.newPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{
                                width: `${getPasswordStrength(passwordForm.newPassword).text === "Weak" ? "25%" : getPasswordStrength(passwordForm.newPassword).text === "Fair" ? "50%" : getPasswordStrength(passwordForm.newPassword).text === "Good" ? "75%" : "100%"}`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {passwordStrength.text}
                          </span>
                        </div>
                      </div>
                    )}
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-600">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className={
                          passwordErrors.confirmPassword
                            ? "border-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-600">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Security Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Account Type</Label>
                    <p className="text-sm text-muted-foreground">Employee</p>
                  </div>
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-sm text-muted-foreground">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <p className="text-sm text-muted-foreground font-mono">
                      {user?.id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Tips:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>
                        • Use a strong, unique password that you don't use
                        elsewhere
                      </li>
                      <li>• Never share your login credentials with anyone</li>
                      <li>• Log out when using shared or public computers</li>
                      <li>
                        • Contact administration if you suspect unauthorized
                        access
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
