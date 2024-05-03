import mongoose from "mongoose"

const ExpenseEntrySchema = new mongoose.Schema({
    title: String,
    amount: Number,
    date: Date
});

const IncomeEntrySchema = new mongoose.Schema({
    source: String,
    amount: Number,
    date: Date
});

const MonthSchema = new mongoose.Schema({
    INCOME: [IncomeEntrySchema],
    EXPENSE: {
        type: Map,
        of: [ExpenseEntrySchema]
    }
}, { _id: false });

const YearSchema = new mongoose.Schema({
    months: {
        type: Map,
        of: MonthSchema
    }
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
    userId: String,
    years: {
        type: Map,
        of: YearSchema
    }
});

const TransactionModel = mongoose.models.Transaction ||mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;
