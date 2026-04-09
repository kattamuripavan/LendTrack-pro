import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Loan, Payment, LoanStatus, UserRole } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store
  let users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@lendtrack.com', role: 'ADMIN' },
    { id: '2', name: 'Alice Lender', email: 'alice@lender.com', role: 'LENDER' },
    { id: '3', name: 'Bob Borrower', email: 'bob@borrower.com', role: 'BORROWER' },
    { id: '4', name: 'Charlie Analyst', email: 'charlie@analyst.com', role: 'ANALYST' },
  ];

  let loans: Loan[] = [
    {
      id: 'loan_1',
      borrowerId: '3',
      lenderId: '2',
      amount: 5000,
      interestRate: 12,
      term: 12,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      purpose: 'Home Renovation',
      monthlyPayment: 444.24,
      totalRepayable: 5330.88
    }
  ];

  let payments: Payment[] = [
    { id: 'pay_1', loanId: 'loan_1', amount: 444.24, date: new Date().toISOString(), status: 'SUCCESS' }
  ];

  // API Routes
  app.get('/api/users', (req, res) => res.json(users));
  
  app.get('/api/loans', (req, res) => {
    const { role, userId } = req.query;
    if (role === 'BORROWER') {
      return res.json(loans.filter(l => l.borrowerId === userId));
    }
    if (role === 'LENDER') {
      return res.json(loans.filter(l => l.lenderId === userId || l.status === 'PENDING'));
    }
    res.json(loans);
  });

  app.post('/api/loans', (req, res) => {
    const { borrowerId, amount, term, purpose } = req.body;
    const interestRate = 10; // Default rate for demo
    const totalRepayable = amount * (1 + (interestRate / 100));
    const monthlyPayment = totalRepayable / term;

    const newLoan: Loan = {
      id: `loan_${Date.now()}`,
      borrowerId,
      amount,
      term,
      purpose,
      interestRate,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      monthlyPayment,
      totalRepayable
    };

    loans.push(newLoan);
    res.status(201).json(newLoan);
  });

  app.patch('/api/loans/:id', (req, res) => {
    const { id } = req.params;
    const { status, lenderId } = req.body;
    const loanIndex = loans.findIndex(l => l.id === id);
    if (loanIndex > -1) {
      loans[loanIndex] = { ...loans[loanIndex], status, lenderId: lenderId || loans[loanIndex].lenderId };
      res.json(loans[loanIndex]);
    } else {
      res.status(404).send('Loan not found');
    }
  });

  app.get('/api/payments', (req, res) => {
    res.json(payments);
  });

  app.get('/api/payments/:loanId', (req, res) => {
    const { loanId } = req.params;
    res.json(payments.filter(p => p.loanId === loanId));
  });

  app.post('/api/payments', (req, res) => {
    const { loanId, amount } = req.body;
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      loanId,
      amount,
      date: new Date().toISOString(),
      status: 'SUCCESS'
    };
    payments.push(newPayment);
    res.status(201).json(newPayment);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
