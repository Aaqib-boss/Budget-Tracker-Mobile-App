const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/budget-tracker');
  const TransactionSchema = new mongoose.Schema({}, { strict: false, collection: 'transactions' });
  const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
  const count = await Transaction.countDocuments({ account: { $exists: true } });
  console.log('Total transactions with account field:', count);
  const samples = await Transaction.find({ account: { $exists: true } }).limit(5);
  console.log('Samples:', JSON.stringify(samples, null, 2));
  await mongoose.disconnect();
}

main().catch(console.error);
