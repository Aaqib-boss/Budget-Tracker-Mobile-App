const mongoose = require('mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/budget-tracker');
  const TransactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    category: String,
    date: Date,
    note: String,
    account: String
  }, { collection: 'transactions' });
  const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
  const docs = await Transaction.find().sort({ _id: -1 }).limit(5);
  console.log(JSON.stringify(docs, null, 2));
  await mongoose.disconnect();
}

main().catch(console.error);
