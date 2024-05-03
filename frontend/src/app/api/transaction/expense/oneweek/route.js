import { connect } from "@/dbConfig/dbConfig";
import TransactionData from "@/models/transactionModel";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

connect();

export async function GET(request) {
  try {
    const url=new URL(request.url);
    const email=url.searchParams.get("email");
    if (!email) {
      return new NextResponse(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const transactionData = await TransactionData.findOne({ userId: email });
    if (!transactionData) {
      return new NextResponse(JSON.stringify({ msg: "User Not Found" }), { status: 404 });
    }

    // Get current date and extract year, month, and day
    const now = new Date();
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // 7 days including today
    const today = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const weekAgo = lastWeek.toISOString().split('T')[0]; // "YYYY-MM-DD"

    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");

    const yearData = transactionData.years.get(year);
    if (!yearData) {
      return new NextResponse(JSON.stringify({ msg: "No data found for this year" }), { status: 404 });
    }

    const monthData = yearData.months.get(month);
    if (!monthData || !monthData.EXPENSE) {
      return new NextResponse(JSON.stringify({ msg: "No expenses found for this month" }), { status: 404 });
    }

    let results = [];
    monthData.EXPENSE.forEach((expenses, category) => {
      expenses.forEach((expense) => {
        const expenseDate = expense.date.toISOString().split('T')[0];
        // Check if the expense date is within the last week
        if (expenseDate >= weekAgo && expenseDate <= today) {
          results.push({
            id: expense._id.toString(), 
            title: expense.title,
            amount: expense.amount,
            date: expenseDate,
            category: category,
          });
        }
      });
    });

    // Return the formatted results
    return new NextResponse(JSON.stringify(results), { status: 200 });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
