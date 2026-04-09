import React, { useState, useEffect } from 'react';
import { User, UserRole, Loan, Payment } from './types';
import { 
  LayoutDashboard, 
  Wallet, 
  History, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut,
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  PieChart as PieChartIcon,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helpers ---
const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APPROVED: 'bg-blue-100 text-blue-800 border-blue-200',
    ACTIVE: 'bg-green-100 text-green-800 border-green-200',
    COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200',
    REJECTED: 'bg-red-100 text-red-800 border-red-200',
    DEFAULTED: 'bg-black text-white border-black',
  };
  return (
    <Badge variant="outline" className={`${colors[status] || ''} font-medium`}>
      {status}
    </Badge>
  );
};

// --- Pages ---

const HomePage = ({ onLogin, loans }: { onLogin: () => void, loans: Loan[] }) => {
  // Process real loan data for the graph
  const chartData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Create a baseline of last 6 months
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      last6Months.push({
        name: months[d.getMonth()],
        amount: 0,
        count: 0
      });
    }

    // Populate with real data
    loans.forEach(loan => {
      const loanDate = new Date(loan.createdAt);
      const monthName = months[loanDate.getMonth()];
      const dataPoint = last6Months.find(d => d.name === monthName);
      if (dataPoint) {
        dataPoint.amount += loan.amount;
        dataPoint.count += 1;
      }
    });

    // Add some "seed" data if the system is empty to make it look "real" for the landing page
    if (loans.length <= 1) {
      last6Months[0].amount = 120000;
      last6Months[1].amount = 250000;
      last6Months[2].amount = 180000;
      last6Months[3].amount = 450000;
      last6Months[4].amount = 320000;
      if (last6Months[5].amount === 0) last6Months[5].amount = 550000;
    }

    return last6Months;
  }, [loans]);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="h-20 border-b flex items-center justify-between px-8 md:px-24">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <Wallet className="w-8 h-8" />
          <span>LendTrack Pro</span>
        </div>
        <Button onClick={onLogin} className="rounded-full px-8">Login</Button>
      </nav>

      {/* Hero */}
      <section className="py-20 px-8 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <Badge variant="secondary" className="px-4 py-1 rounded-full text-blue-600 bg-blue-50 border-blue-100">
            Next-Gen Lending Platform
          </Badge>
          <h1 className="text-6xl font-bold tracking-tight leading-tight">
            Smart Loans for <span className="text-blue-600">Smarter</span> Growth.
          </h1>
          <p className="text-xl text-muted-foreground max-w-lg">
            Empowering lenders and borrowers with real-time tracking, automated interest calculations, and advanced financial analytics.
          </p>
          <div className="flex gap-4">
            <Button size="lg" onClick={onLogin} className="rounded-full px-8 gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">Learn More</Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-100 rounded-3xl blur-3xl opacity-30 animate-pulse" />
          <Card className="relative border-2 shadow-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" /> Platform Growth
                </CardTitle>
                <CardDescription className="text-xs">Total Loan Volume (Last 6 Months)</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-muted-foreground">Current Volume</p>
                <p className="text-lg font-bold text-blue-600">{formatINR(chartData[chartData.length - 1].amount)}</p>
              </div>
            </CardHeader>
            <CardContent className="p-6 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 10000', 'dataMax + 10000']}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [formatINR(val), 'Volume']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2563eb" 
                    strokeWidth={4} 
                    dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-24 px-8 md:px-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">Why Choose LendTrack?</h2>
          <p className="text-muted-foreground">Built for reliability, speed, and transparency.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Secure & Verified", desc: "Advanced risk assessment and identity verification for every user." },
            { icon: Zap, title: "Instant Decisions", desc: "Automated workflows ensure loan approvals happen in minutes, not days." },
            { icon: TrendingUp, title: "Real-time Analytics", desc: "Track your portfolio health and repayment schedules with live data." }
          ].map((f, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>{f.title}</CardTitle>
                <CardDescription className="text-base">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

const LoginPage = ({ users, onSelect }: { users: User[], onSelect: (user: User) => void }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Wallet className="w-10 h-10" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Select an account to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {users.map(user => (
              <Button 
                key={user.id} 
                variant="outline" 
                className="h-16 justify-start gap-4 hover:border-blue-600 hover:bg-blue-50 group transition-all"
                onClick={() => onSelect(user)}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {user.name[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.role}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Role Dashboards ---

const BorrowerDashboard = ({ user, loans, onApply, onPay }: { user: User, loans: Loan[], onApply: (data: any) => void, onPay: (loanId: string, amount: number) => void }) => {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [purpose, setPurpose] = useState('');

  const activeLoan = loans.find(l => l.status === 'ACTIVE');
  const totalBorrowed = loans.reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Borrowed</CardDescription>
            <CardTitle className="text-2xl">{formatINR(totalBorrowed)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Loans</CardDescription>
            <CardTitle className="text-2xl">{loans.filter(l => l.status === 'ACTIVE').length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Next Payment</CardDescription>
            <CardTitle className="text-2xl flex items-center justify-between">
              <span>{activeLoan ? formatINR(activeLoan.monthlyPayment) : '--'}</span>
              {activeLoan && (
                <Button size="sm" variant="outline" onClick={() => onPay(activeLoan.id, activeLoan.monthlyPayment)}>
                  Pay Now
                </Button>
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Apply for a Loan</CardTitle>
            <CardDescription>Get a quick decision on your loan application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Loan Amount (₹)</Label>
              <Input id="amount" type="number" placeholder="e.g. 50000" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term (Months)</Label>
              <Select value={term} onValueChange={setTerm}>
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input id="purpose" placeholder="e.g. Business Expansion" value={purpose} onChange={e => setPurpose(e.target.value)} />
            </div>
            <Button className="w-full" onClick={() => onApply({ amount: Number(amount), term: Number(term), purpose })}>
              Submit Application
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans.map(loan => (
                  <TableRow key={loan.id}>
                    <TableCell className="font-medium">{formatINR(loan.amount)}</TableCell>
                    <TableCell><StatusBadge status={loan.status} /></TableCell>
                    <TableCell>{format(new Date(loan.createdAt), 'MMM dd, yyyy')}</TableCell>
                  </TableRow>
                ))}
                {loans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">No loans found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LenderDashboard = ({ user, loans, onApprove }: { user: User, loans: Loan[], onApprove: (loanId: string) => void }) => {
  const pendingLoans = loans.filter(l => l.status === 'PENDING');
  const activePortfolio = loans.filter(l => l.lenderId === user.id && l.status === 'ACTIVE');
  const totalInvested = activePortfolio.reduce((acc, l) => acc + l.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invested</CardDescription>
            <CardTitle className="text-2xl">{formatINR(totalInvested)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active Portfolio</CardDescription>
            <CardTitle className="text-2xl">{activePortfolio.length} Loans</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-2xl">{pendingLoans.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="portfolio">Active Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Review Applications</CardTitle>
              <CardDescription>Approve or reject loan requests from borrowers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingLoans.map(loan => (
                    <TableRow key={loan.id}>
                      <TableCell>User_{loan.borrowerId}</TableCell>
                      <TableCell>{formatINR(loan.amount)}</TableCell>
                      <TableCell>{loan.purpose}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => onApprove(loan.id)}>Approve</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {pendingLoans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">No pending applications</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Borrower</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePortfolio.map(loan => (
                    <TableRow key={loan.id}>
                      <TableCell>User_{loan.borrowerId}</TableCell>
                      <TableCell>{formatINR(loan.amount)}</TableCell>
                      <TableCell>{loan.interestRate}%</TableCell>
                      <TableCell className="w-[200px]">
                        <div className="flex items-center gap-2">
                          <Progress value={33} className="h-2" />
                          <span className="text-xs">33%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AnalystDashboard = ({ loans }: { loans: Loan[] }) => {
  const data = [
    { name: 'Jan', amount: 400000 },
    { name: 'Feb', amount: 300000 },
    { name: 'Mar', amount: 200000 },
    { name: 'Apr', amount: 278000 },
    { name: 'May', amount: 189000 },
    { name: 'Jun', amount: 239000 },
  ];

  const statusData = [
    { name: 'Active', value: loans.filter(l => l.status === 'ACTIVE').length },
    { name: 'Pending', value: loans.filter(l => l.status === 'PENDING').length },
    { name: 'Completed', value: loans.filter(l => l.status === 'COMPLETED').length },
    { name: 'Defaulted', value: loans.filter(l => l.status === 'DEFAULTED').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Volume Trend (₹)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(val: number) => formatINR(val)} />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Current market risk indicators and portfolio health.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-muted-foreground">Default Rate</p>
              <p className="text-2xl font-bold text-red-600">2.4%</p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-muted-foreground">Avg. Interest</p>
              <p className="text-2xl font-bold text-blue-600">11.2%</p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-muted-foreground">Recovery Rate</p>
              <p className="text-2xl font-bold text-green-600">84%</p>
            </div>
            <div className="p-4 border rounded-lg bg-slate-50">
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold text-yellow-600">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Views ---

const TransactionsView = ({ payments, loans }: { payments: Payment[], loans: Loan[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A complete log of all payments made on the platform.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Loan ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell>{format(new Date(payment.date), 'MMM dd, yyyy HH:mm')}</TableCell>
                <TableCell className="font-mono text-xs">{payment.loanId}</TableCell>
                <TableCell className="font-medium text-green-600">{formatINR(payment.amount)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {payment.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const UsersView = ({ users }: { users: User[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage platform users and their roles.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                      {user.name[0]}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'home' | 'login' | 'dashboard'>('home');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'analytics' | 'users'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, loansRes, paymentsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/loans'),
          fetch('/api/payments')
        ]);
        const usersData = await usersRes.json();
        const loansData = await loansRes.json();
        const paymentsData = await paymentsRes.json();
        setUsers(usersData);
        setLoans(loansData);
        setPayments(paymentsData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [view]);

  const handleApply = async (data: any) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, borrowerId: currentUser.id })
      });
      const newLoan = await res.json();
      setLoans([...loans, newLoan]);
    } catch (err) {
      console.error('Error applying for loan:', err);
    }
  };

  const handleApprove = async (loanId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/loans/${loanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE', lenderId: currentUser.id })
      });
      const updatedLoan = await res.json();
      setLoans(loans.map(l => l.id === loanId ? updatedLoan : l));
    } catch (err) {
      console.error('Error approving loan:', err);
    }
  };

  const handlePayment = async (loanId: string, amount: number) => {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loanId, amount })
      });
      const newPayment = await res.json();
      setPayments([...payments, newPayment]);
      alert('Payment successful!');
    } catch (err) {
      console.error('Error making payment:', err);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  if (view === 'home') return <HomePage onLogin={() => setView('login')} loans={loans} />;
  if (view === 'login') return <LoginPage users={users} onSelect={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 font-bold text-xl text-blue-600 cursor-pointer" onClick={() => setView('home')}>
            <Wallet className="w-8 h-8" />
            <span>LendTrack Pro</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full justify-start gap-2 ${activeTab === 'dashboard' ? 'bg-slate-100' : ''}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('transactions')}
            className={`w-full justify-start gap-2 ${activeTab === 'transactions' ? 'bg-slate-100' : ''}`}
          >
            <History className="w-4 h-4" /> Transactions
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setActiveTab('analytics')}
            className={`w-full justify-start gap-2 ${activeTab === 'analytics' ? 'bg-slate-100' : ''}`}
          >
            <TrendingUp className="w-4 h-4" /> Analytics
          </Button>
          {currentUser?.role === 'ADMIN' && (
            <Button 
              variant="ghost" 
              onClick={() => setActiveTab('users')}
              className={`w-full justify-start gap-2 ${activeTab === 'users' ? 'bg-slate-100' : ''}`}
            >
              <Users className="w-4 h-4" /> Users
            </Button>
          )}
        </nav>
        <div className="p-4 border-t space-y-4">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">{currentUser?.role} Dashboard</h1>
            <Badge variant="secondary">{currentUser?.name}</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {currentUser?.name[0]}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentUser?.role}-${activeTab}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <>
                  {currentUser?.role === 'BORROWER' && (
                    <BorrowerDashboard 
                      user={currentUser} 
                      loans={loans.filter(l => l.borrowerId === currentUser.id)} 
                      onApply={handleApply} 
                      onPay={handlePayment}
                    />
                  )}
                  {currentUser?.role === 'LENDER' && (
                    <LenderDashboard user={currentUser} loans={loans} onApprove={handleApprove} />
                  )}
                  {currentUser?.role === 'ANALYST' && (
                    <AnalystDashboard loans={loans} />
                  )}
                  {currentUser?.role === 'ADMIN' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Total Users</CardDescription>
                          <CardTitle className="text-2xl">{users.length}</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>System Status</CardDescription>
                          <CardTitle className="text-2xl text-green-600">Healthy</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'transactions' && (
                <TransactionsView 
                  payments={currentUser?.role === 'BORROWER' 
                    ? payments.filter(p => loans.find(l => l.id === p.loanId && l.borrowerId === currentUser.id))
                    : payments
                  } 
                  loans={loans} 
                />
              )}

              {activeTab === 'analytics' && (
                <AnalystDashboard loans={loans} />
              )}

              {activeTab === 'users' && currentUser?.role === 'ADMIN' && (
                <UsersView users={users} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
