const { exec } = require('child_process');

const API_URL = 'http://localhost:5000/api';

async function runTests() {
  const email = `tester_${Date.now()}@example.com`;
  const name = 'Test Tester';
  const password = 'password123';
  let token = '';
  let userId = '';

  console.log('--- Starting API Integration Tests ---');
  console.log(`Using email: ${email}`);

  // Helpers
  const request = async (path, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
    const text = await res.text();
    try {
      return { status: res.status, data: JSON.parse(text) };
    } catch {
      return { status: res.status, data: text };
    }
  };

  try {
    // 1. SIGNUP
    console.log('\n[1] Testing Signup...');
    const signupRes = await request('/auth/signup', 'POST', { name, email, password });
    if (signupRes.status !== 201) {
      throw new Error(`Signup failed: ${JSON.stringify(signupRes.data)}`);
    }
    console.log('✓ Signup Successful!');
    token = signupRes.data.token;
    userId = signupRes.data._id;

    // 2. LOGIN
    console.log('\n[2] Testing Login...');
    const loginRes = await request('/auth/login', 'POST', { email, password });
    if (loginRes.status !== 200 || !loginRes.data.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.data)}`);
    }
    console.log('✓ Login Successful!');
    token = loginRes.data.token; // update token

    // 3. GET SEEDED CATEGORIES
    console.log('\n[3] Testing Seeded Categories...');
    const catRes = await request('/categories');
    if (catRes.status !== 200 || !Array.isArray(catRes.data)) {
      throw new Error(`Get Categories failed: ${JSON.stringify(catRes.data)}`);
    }
    console.log(`✓ Categories fetched! Count: ${catRes.data.length} (Seeded list)`);
    if (catRes.data.length === 0) {
      throw new Error('No categories were seeded on signup!');
    }
    const foodCat = catRes.data.find(c => c.name.includes('Food'));
    console.log(`✓ Seeded category check passed (Found Food: ${!!foodCat})`);

    // 4. CREATE TRANSACTION (INCOME & EXPENSE)
    console.log('\n[4] Testing Transaction Creation...');
    const today = new Date().toISOString().split('T')[0];
    
    // Income
    const incRes = await request('/transactions', 'POST', {
      type: 'income',
      amount: 5000,
      category: 'Salary',
      date: today,
      note: 'Monthly salary payout'
    });
    if (incRes.status !== 201) {
      throw new Error(`Create Income failed: ${JSON.stringify(incRes.data)}`);
    }
    console.log('✓ Income Transaction Created!');

    // Expense
    const expRes = await request('/transactions', 'POST', {
      type: 'expense',
      amount: 200,
      category: 'Food & Dining',
      date: today,
      note: 'Lunch at pizzeria'
    });
    if (expRes.status !== 201) {
      throw new Error(`Create Expense failed: ${JSON.stringify(expRes.data)}`);
    }
    console.log('✓ Expense Transaction Created!');

    // 5. CREATE BUDGET
    console.log('\n[5] Testing Budget Creation & Progress...');
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const budgetRes = await request('/budgets', 'POST', {
      category: 'Food & Dining',
      monthlyLimit: 500,
      month: currentMonth,
      year: currentYear
    });
    if (budgetRes.status !== 201) {
      throw new Error(`Create Budget failed: ${JSON.stringify(budgetRes.data)}`);
    }
    console.log(`✓ Budget limit set to ${budgetRes.data.monthlyLimit} for category "${budgetRes.data.category}"`);

    // GET BUDGETS TO VERIFY PROGRESS
    const getBudgetRes = await request(`/budgets?month=${currentMonth}&year=${currentYear}`);
    if (getBudgetRes.status !== 200) {
      throw new Error(`Get Budgets failed: ${JSON.stringify(getBudgetRes.data)}`);
    }
    const foodBudget = getBudgetRes.data.find(b => b.category === 'Food & Dining');
    if (!foodBudget || foodBudget.spent !== 200 || foodBudget.remaining !== 300) {
      throw new Error(`Budget calculations incorrect: ${JSON.stringify(foodBudget)}`);
    }
    console.log(`✓ Budget Progress Verification: Spent = ${foodBudget.spent}, Remaining = ${foodBudget.remaining}, OverBudget = ${foodBudget.isOverBudget}`);

    // 6. SAVINGS GOALS & ADD MONEY
    console.log('\n[6] Testing Goals & Savings Progress...');
    const goalDeadline = new Date(currentYear + 1, currentMonth, 1).toISOString();
    const createGoalRes = await request('/goals', 'POST', {
      title: 'New Developer Laptop',
      targetAmount: 1200,
      savedAmount: 100,
      deadline: goalDeadline
    });
    if (createGoalRes.status !== 201) {
      throw new Error(`Create Goal failed: ${JSON.stringify(createGoalRes.data)}`);
    }
    console.log(`✓ Savings Goal "${createGoalRes.data.title}" created with target ${createGoalRes.data.targetAmount}`);
    const goalId = createGoalRes.data._id;

    // ADD MONEY TO GOAL
    const addMoneyRes = await request(`/goals/${goalId}/add-money`, 'PUT', { amount: 150 });
    if (addMoneyRes.status !== 200) {
      throw new Error(`Add Money failed: ${JSON.stringify(addMoneyRes.data)}`);
    }
    if (addMoneyRes.data.savedAmount !== 250) {
      throw new Error(`Add Money amount calculation incorrect, expected 250, got ${addMoneyRes.data.savedAmount}`);
    }
    console.log(`✓ Saved amount updated successfully! New saved: ${addMoneyRes.data.savedAmount}`);

    // 7. GET DASHBOARD SUMMARY
    console.log('\n[7] Testing Dashboard Summary calculation...');
    const dashRes = await request('/dashboard/summary');
    if (dashRes.status !== 200) {
      throw new Error(`Dashboard Summary failed: ${JSON.stringify(dashRes.data)}`);
    }
    const { totalBalance, totalIncome, totalExpense, thisMonthIncome, thisMonthExpense, categoryBreakdown, monthlyTrend } = dashRes.data;
    
    if (totalBalance !== 4800 || totalIncome !== 5000 || totalExpense !== 200) {
      throw new Error(`Dashboard totals incorrect: ${JSON.stringify(dashRes.data)}`);
    }
    if (thisMonthIncome !== 5000 || thisMonthExpense !== 200) {
      throw new Error(`Dashboard monthly totals incorrect: ${JSON.stringify(dashRes.data)}`);
    }
    const foodBreakdown = categoryBreakdown.find(c => c.category === 'Food & Dining');
    if (!foodBreakdown || foodBreakdown.amount !== 200) {
      throw new Error(`Dashboard category breakdown incorrect: ${JSON.stringify(categoryBreakdown)}`);
    }
    const currentTrend = monthlyTrend[monthlyTrend.length - 1];
    if (!currentTrend || currentTrend.income !== 5000 || currentTrend.expense !== 200) {
      throw new Error(`Dashboard trend calculations incorrect: ${JSON.stringify(monthlyTrend)}`);
    }
    console.log('✓ Dashboard Summary validation passed!');
    console.log(`  - Total Balance: $${totalBalance}`);
    console.log(`  - This Month Income: $${thisMonthIncome}`);
    console.log(`  - This Month Expenses: $${thisMonthExpense}`);
    console.log(`  - Category breakdown check: ${foodBreakdown.category} = $${foodBreakdown.amount}`);
    console.log(`  - Latest Month Trend: ${currentTrend.monthName} (Inc: $${currentTrend.income}, Exp: $${currentTrend.expense})`);

    console.log('\n=========================================');
    console.log(' ALL ENDPOINT INTEGRATION TESTS PASSED! ');
    console.log('=========================================');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run the tests
runTests();
