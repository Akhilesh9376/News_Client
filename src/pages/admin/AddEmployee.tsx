import { useState } from "react";
import { Menu, UserPlus, Mail, Key, Copy, Check } from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAppDispatch } from "@/hooks/redux";
import { addEmployee } from "@/store/slices/adminSlice";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/config/axiosInstance";

interface GeneratedCredentials {
  email: string;
  password: string;
  name: string;
}

export const AddEmployee = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    phoneNumber: "",
  });
  
  const [generatedCredentials, setGeneratedCredentials] =
    useState<GeneratedCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // calling the API to create employee
        const registerEmployee = axiosInstance.post('/register_user',{
          name: formData.name,
          email: formData.email,
          // department: formData.department,
          phoneNumber: formData.phoneNumber,
          role: "employee",
          password: generatePassword(),
        })
      const response = await registerEmployee;
      if (response.status === 201) {
        toast({
          title: "Employee Created Successfully! 🎉",
          description: `${formData.name} has been added to the team.`,
          variant: "success",
        });
      }
    } catch (error: any) {
      console.error("Error creating employee:", error);
      setIsLoading(false);
      toast({
        title: "Error Creating Employee ❌",
        description: error.response?.data?.message || "Something went wrong.",
        variant: "destructive",
      });
      return;
    } 
    // Generate password
    const password = generatePassword();

    // Simulate API call
    setTimeout(() => {
      const newEmployee = {
        id: `emp-${Date.now()}`,
        email: formData.email,
        name: formData.name,
        role: "employee" as const,
        createdAt: new Date().toISOString(),
        department: formData.department,
        phoneNumber: formData.phoneNumber,
      };

      dispatch(addEmployee(newEmployee));

      setGeneratedCredentials({
        email: formData.email,
        password,
        name: formData.name,
      });

      toast({
        title: "Employee Created Successfully! 🎉",
        description: `${formData.name} has been added to the team. Share the credentials securely.`,
        variant: "success",
      });

      setIsLoading(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        department: "",
        phoneNumber: "",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-background shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <UserPlus className="h-6 w-6 text-brand-600" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Add New Employee
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Create a new contributor account for the team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Add Employee Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5" />
                    <span>Employee Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
  placeholder="employee@upudaynews.com"
                        required
                      />
                    </div>

            
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone No. *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, phoneNumber: e.target.value })
                        }
                        placeholder="9876543210"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-brand-600 hover:bg-brand-700"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Creating Account..."
                        : "Create Employee Account"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

             

              {/* Instructions */}
              {!generatedCredentials && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="h-5 w-5" />
                      <span>How it Works</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          1
                        </div>
                        <div>
                          <h4 className="font-medium">Fill Employee Details</h4>
                          <p className="text-sm text-muted-foreground">
                            Enter the new employee's information in the form.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h4 className="font-medium">
                            System Generates Credentials
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            A secure password will be automatically generated.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          3
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Share Credentials Securely
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Copy the email template and send it to the employee.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="bg-brand-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">Employee Can Login</h4>
                          <p className="text-sm text-muted-foreground">
                            Employee uses credentials to access the portal.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Alert>
                      <Key className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Security Note:</strong> Always share credentials
                        through secure channels. Employees should change their
                        password after first login.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
