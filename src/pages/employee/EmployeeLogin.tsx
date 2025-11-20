import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, ArrowLeft, Users, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppDispatch } from "@/hooks/redux";
import { loginSuccess } from "@/store/slices/authSlice";

import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

export const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      const response = await axiosInstance.post("auth/v1/login", {
        email,
        password,
      });
      
      const employee = response.data.user;
      
      const { token } = response.data ;
      
      localStorage.setItem("token", token); // Store token in localStorage
      dispatch(
        loginSuccess({
          id: employee.id,
          email: employee.email,
          name: employee.name,
          createdAt: new Date().toISOString(),
          role: "employee"
        }),
      );

      toast({
        title: "Welcome Back! 👋",
        description: `Successfully logged in as ${employee.name}`,
        variant: "success",
      });

      navigate("/employee/dashboard");
    } catch (err) {
      setError("Invalid email or password. Please check your credentials.");
      toast({
        title: "Login Failed ❌",
        description:
          "Invalid email or password. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="bg-brand-600 p-2 rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <div>
  <h1 className="text-xl font-bold text-brand-700">UP Uday News</h1>
              <p className="text-xs text-brand-500 -mt-1">360°</p>
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-foreground">
            Employee Portal
          </h2>
          <p className="text-muted-foreground">Access for news contributors</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Employee Login</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
  placeholder="your.email@upudaynews.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

           

            {/* Help Text */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Need Help?</strong> If you don't have login credentials,
                please contact your administrator. They will create an account
                and share your login details with you.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
