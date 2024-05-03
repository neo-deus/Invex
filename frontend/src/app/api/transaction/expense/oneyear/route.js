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
  
      const now = new Date();
      const last365DaysDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 364);
      const today = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const last365Days = last365DaysDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  
      let results = [];
      if (transactionData.years) {
        const yearData = transactionData.years.get(now.getFullYear().toString());
        if (yearData && yearData.months) {
          yearData.months.forEach((monthData, monthKey) => {  // Changed iteration method
            if (monthData.EXPENSE) {
              monthData.EXPENSE.forEach((expenses, category) => {
                
                expenses.forEach((expense) => {
                  const expenseDate = expense.date.toISOString().split('T')[0];
                  //console.log(`Checking Expense: ${expense.title}, Date: ${expenseDate}`);  // Detailed expense log
                  if (expenseDate >= last365Days && expenseDate <= today) {
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
          });
        } else {
          console.log("No months data found in the year data");
        }
      } else {
        console.log("No years data found");
      }
  
      console.log(`Final Results Count: ${results.length}`);
      return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (error) {
      console.error("Error processing GET request:", error);
      return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  