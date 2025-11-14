import { useState, useEffect } from "react";
import {
  Menu,
  Users,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  Trash2,
  UserCheck,
} from "lucide-react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setEmployees,
  blockEmployee,
  removeEmployee,
} from "@/store/slices/adminSlice";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization?: string;
  role: "employee";
  createdAt: string;
  isBlocked?: boolean;
  lastActive?: string;
  articlesCount: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
}

const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "John Smith",
  email: "john.smith@upudaynews.com",
    department: "technology",
    specialization: "AI and Machine Learning",
    role: "employee",
    createdAt: "2024-01-10T00:00:00Z",
    lastActive: "2024-01-15T14:30:00Z",
    articlesCount: 15,
    approvedCount: 12,
    pendingCount: 2,
    rejectedCount: 1,
  },
  {
    id: "emp-2",
    name: "Jane Doe",
  email: "jane.doe@upudaynews.com",
    department: "sports",
    specialization: "Football and Basketball",
    role: "employee",
    createdAt: "2024-01-08T00:00:00Z",
    lastActive: "2024-01-15T10:15:00Z",
    articlesCount: 22,
    approvedCount: 18,
    pendingCount: 3,
    rejectedCount: 1,
  },
  {
    id: "emp-3",
    name: "Mike Johnson",
  email: "mike.johnson@upudaynews.com",
    department: "politics",
    specialization: "International Relations",
    role: "employee",
    createdAt: "2024-01-05T00:00:00Z",
    lastActive: "2024-01-14T16:45:00Z",
    isBlocked: true,
    articlesCount: 8,
    approvedCount: 5,
    pendingCount: 0,
    rejectedCount: 3,
  },
  {
    id: "emp-4",
    name: "Sarah Williams",
  email: "sarah.williams@upudaynews.com",
    department: "business",
    specialization: "Market Analysis and Economics",
    role: "employee",
    createdAt: "2024-01-12T00:00:00Z",
    lastActive: "2024-01-15T09:20:00Z",
    articlesCount: 11,
    approvedCount: 9,
    pendingCount: 1,
    rejectedCount: 1,
  },
];

export const ManageEmployees = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [employees, setEmployeesLocal] = useState<Employee[]>([]);

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  useEffect(() => {
    setEmployeesLocal(mockEmployees);
    dispatch(setEmployees(mockEmployees));
  }, [dispatch]);

  const handleBlockEmployee = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    const isCurrentlyBlocked = employee?.isBlocked;

    setEmployeesLocal((prev) =>
      prev.map((emp) =>
        emp.id === employeeId ? { ...emp, isBlocked: !emp.isBlocked } : emp,
      ),
    );
    dispatch(blockEmployee(employeeId));

    toast({
      title: `Employee ${isCurrentlyBlocked ? "Unblocked" : "Blocked"}! ${isCurrentlyBlocked ? "✅" : "🚫"}`,
      description: `${employee?.name} has been ${isCurrentlyBlocked ? "unblocked and can now" : "blocked and cannot"} access the system.`,
      variant: isCurrentlyBlocked ? "success" : "destructive",
    });
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);

    if (
      confirm(
        "Are you sure you want to delete this employee? This action cannot be undone.",
      )
    ) {
      setEmployeesLocal((prev) => prev.filter((emp) => emp.id !== employeeId));
      dispatch(removeEmployee(employeeId));

      toast({
        title: "Employee Deleted ❌",
        description: `${employee?.name} has been permanently removed from the system.`,
        variant: "destructive",
      });
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !employee.isBlocked) ||
      (statusFilter === "blocked" && employee.isBlocked);

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    totalItems: filteredEmployees.length,
    itemsPerPage: 8,
  });

  const currentEmployees = filteredEmployees.slice(
    paginatedData.startIndex,
    paginatedData.endIndex,
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      technology: "bg-blue-100 text-blue-800",
      sports: "bg-green-100 text-green-800",
      politics: "bg-red-100 text-red-800",
      business: "bg-yellow-100 text-yellow-800",
      entertainment: "bg-purple-100 text-purple-800",
      health: "bg-pink-100 text-pink-800",
      editorial: "bg-gray-100 text-gray-800",
    };
    return (
      colors[department as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculatePerformanceScore = (employee: Employee) => {
    const total = employee.articlesCount;
    if (total === 0) return 0;
    return Math.round((employee.approvedCount / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
                <Users className="h-6 w-6 text-brand-600" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Manage Employees
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    View and manage all contributor accounts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Employees
                    </p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-brand-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-2xl font-bold text-green-600">
                      {employees.filter((emp) => !emp.isBlocked).length}
                    </p>
                  </div>
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Blocked</p>
                    <p className="text-2xl font-bold text-red-600">
                      {employees.filter((emp) => emp.isBlocked).length}
                    </p>
                  </div>
                  <Ban className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Avg Performance
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {Math.round(
                        employees.reduce(
                          (acc, emp) => acc + calculatePerformanceScore(emp),
                          0,
                        ) / employees.length,
                      )}
                      %
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="politics">Politics</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="editorial">Editorial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getDepartmentColor(employee.department)}
                        >
                          {employee.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {employee.articlesCount} total
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {employee.approvedCount} approved,{" "}
                            {employee.pendingCount} pending
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium">
                            {calculatePerformanceScore(employee)}%
                          </div>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-brand-600 h-2 rounded-full"
                              style={{
                                width: `${calculatePerformanceScore(employee)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.isBlocked ? "destructive" : "secondary"
                          }
                        >
                          {employee.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {employee.lastActive
                          ? formatDate(employee.lastActive)
                          : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEmployee(employee);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Employee
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleBlockEmployee(employee.id)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {employee.isBlocked ? "Unblock" : "Block"}{" "}
                              Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedData.startIndex + 1} to{" "}
                    {Math.min(paginatedData.endIndex, filteredEmployees.length)}{" "}
                    of {filteredEmployees.length} employees
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={goToPreviousPage}
                          className={
                            !hasPreviousPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                      {getPageNumbers().map((pageNumber, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={pageNumber === currentPage}
                            onClick={() => goToPage(pageNumber)}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={goToNextPage}
                          className={
                            !hasNextPage
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>

          {/* View Employee Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Employee Details</DialogTitle>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">
                        {getInitials(selectedEmployee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {selectedEmployee.name}
                      </h3>
                      <p className="text-muted-foreground">
                        {selectedEmployee.email}
                      </p>
                      <Badge
                        className={getDepartmentColor(
                          selectedEmployee.department,
                        )}
                      >
                        {selectedEmployee.department}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Specialization</Label>
                      <p className="text-sm">
                        {selectedEmployee.specialization || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <Label>Join Date</Label>
                      <p className="text-sm">
                        {formatDate(selectedEmployee.createdAt)}
                      </p>
                    </div>
                    <div>
                      <Label>Last Active</Label>
                      <p className="text-sm">
                        {selectedEmployee.lastActive
                          ? formatDate(selectedEmployee.lastActive)
                          : "Never"}
                      </p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p className="text-sm">
                        {selectedEmployee.isBlocked ? "Blocked" : "Active"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Performance Metrics</Label>
                    <div className="grid grid-cols-4 gap-4 mt-2">
                      <div className="text-center p-3 bg-brand-50 rounded-lg">
                        <div className="text-xl font-bold">
                          {selectedEmployee.articlesCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total Articles
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {selectedEmployee.approvedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Approved
                        </div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">
                          {selectedEmployee.pendingCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pending
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">
                          {selectedEmployee.rejectedCount}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Rejected
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Employee Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Employee</DialogTitle>
              </DialogHeader>
              {selectedEmployee && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      defaultValue={selectedEmployee.name}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      defaultValue={selectedEmployee.email}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-department">Department</Label>
                    <Select defaultValue={selectedEmployee.department}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="politics">Politics</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="entertainment">
                          Entertainment
                        </SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="editorial">Editorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-specialization">Specialization</Label>
                    <Textarea
                      id="edit-specialization"
                      defaultValue={selectedEmployee.specialization}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => setEditDialogOpen(false)}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};
