import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/hooks/redux";
import { loginSuccess } from "@/store/slices/authSlice";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();


  const handleLogin = async (e:React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");
  
      try {
        // Simulate API call
        const response = await axiosInstance.post("login_user", {
          email,
          password,
        });
        
        const employee = response.data.user;
        
        // console.log("Employee Data:", employee.role);
        dispatch(
          loginSuccess({
            id: employee.id,
            email: employee.email,
            name: employee.name,
            role: employee.role || "admin",
            createdAt: new Date().toISOString(),
          }),
        );
  
        toast({
          title: "Welcome Back! 👋",
          description: `Successfully logged in as ${employee.name}`,
          variant: "success",
        });
  
        navigate("/admin/dashboard");
        // /admin/dashboard"
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - In real app, this would be an API call
    setTimeout(() => {
      // Check credentials (mock validation)
  if (email === "admin@upudaynews.com" && password === "admin123") {
        dispatch(
          loginSuccess({
            id: "admin-1",
            email,
            name: "Admin User",
            role: "admin",
            createdAt: new Date().toISOString(),
          }),
        );

        toast({
          title: "Login Successful! 🎉",
  description: "Welcome back to UP Uday News Admin Dashboard.",
          variant: "success",
        });

        setIsLoading(false);
        navigate("/admin/dashboard");
      } else {
        setIsLoading(false);
        toast({
          title: "Login Failed ❌",
          description:
            "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }, 1000);
  };

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
          <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
          <p className="text-muted-foreground">
            Access the administrative dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
  placeholder="admin@upudaynews.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-brand-50 rounded-lg">
              <p className="text-sm text-brand-700 font-medium mb-2">
                Demo Credentials:
              </p>
              <p className="text-xs text-brand-600">
  Email: admin@upudaynews.com
              </p>
              <p className="text-xs text-brand-600">Password: admin123</p>
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
