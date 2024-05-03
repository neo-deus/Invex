// import { connect } from "@/dbConfig/dbConfig";
// import TransactionModel from "@/models/transactionModel";
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose"

// connect();

// export async function GET(request) {
//     try {
//         const email = request.nextUrl.searchParams.get('email');
//         if (!email) {
//             return new NextResponse(JSON.stringify({ message: "Email is required" }), { status: 400 });
//         }
//         console.log("1"+email);
//         // Get current year and month
//         const now = new Date();
//         const currentYear = now.getFullYear().toString();
//         const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0'); // Month as 'MM' string

//             // Find the user's transaction data for the current year and month
//             const userTransactions = await TransactionModel.findOne(
//                 { userId: email },
//                 { [`years.${currentYear}.months.${currentMonth}`]: 1 }
//             );

//            // console.log("2."+userTransactions);
//             if (!userTransactions || !userTransactions.years || !userTransactions.years.get(currentYear)) {
//                 return {}; // No data for the year
//             }

//             const monthlyData = userTransactions.years.get(currentYear).months.get(currentMonth);
//             console.log("3."+monthlyData);
//             if (!monthlyData) {
//                 return {}; // No data for the month
//             }

//             // Initialize an object to hold the sum of expenses for each category
//             let categoryTotals = {};

//             // Traverse through the categories in the EXPENSE map
//             for (let [category, expenses] of monthlyData.EXPENSE.entries()) {
//                 // Calculate the total expense for each category
//                 const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
//                 categoryTotals[category] = totalExpense; //"fees":4000
//                 //console.log("4. "+categoryTotals[category]+" "+totalExpense);
//             }
//             //console.log(JSON.stringify(categoryTotals, null, 2));

//              return new NextResponse(JSON.stringify({ month: categoryTotals }), {status: 200});
//     } catch (error) {
//         console.error('Error processing GET request:', error);
//         return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
//     }
// }

import { connect } from "@/dbConfig/dbConfig";
import TransactionModel from "@/models/transactionModel";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

connect();

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // Get current year and month
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0"); // Month as 'MM' string

    // Find the user's transaction data for the current year and month
    const userTransactions = await TransactionModel.findOne(
      { userId: email },
      { [`years.${currentYear}.months.${currentMonth}`]: 1 }
    );

    if (
      !userTransactions ||
      !userTransactions.years ||
      !userTransactions.years.get(currentYear)
    ) {
      return new NextResponse(
        JSON.stringify({ message: "No data for the year" }),
        { status: 404 }
      );
    }

    const monthlyData = userTransactions.years
      .get(currentYear)
      .months.get(currentMonth);
    if (!monthlyData) {
      return new NextResponse(
        JSON.stringify({ message: "No data for the month" }),
        { status: 404 }
      );
    }

    // Initialize an object to hold the sum of expenses for each category
    let categoryTotals = {};

    // Traverse through the categories in the EXPENSE map
    for (let [category, expenses] of monthlyData.EXPENSE.entries()) {
      // Calculate the total expense for each category
      const totalExpense = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );
      categoryTotals[category] = totalExpense;
    }

    return new NextResponse(JSON.stringify({ month: categoryTotals }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
