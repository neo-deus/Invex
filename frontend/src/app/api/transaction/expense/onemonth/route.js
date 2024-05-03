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

    // Define the current date and the date 30 days ago
    const now = new Date();
    const last30DaysDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    const today = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const last30Days = last30DaysDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Define paths to access the data
    const yearData = transactionData.years.get(now.getFullYear().toString());
    if (!yearData) {
      return new NextResponse(JSON.stringify({ msg: "No data found for this year" }), { status: 404 });
    }

    let results = [];
    // Loop through each month within the range if necessary
    for (let m = last30DaysDate.getMonth(); m <= now.getMonth(); ++m) {
      let monthKey = (m + 1).toString().padStart(2, '0');
      let monthData = yearData.months.get(monthKey);
      if (monthData && monthData.EXPENSE) {
        monthData.EXPENSE.forEach((expenses, category) => {
          expenses.forEach((expense) => {
            const expenseDate = expense.date.toISOString().split('T')[0];
            if (expenseDate >= last30Days && expenseDate <= today) {
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
      }
    }

    // Return the formatted results
    return new NextResponse(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
