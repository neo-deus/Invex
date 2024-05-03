// import { connect } from "@/dbConfig/dbConfig";
// import TransactionModel from "@/models/transactionModel";
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from "mongoose";

// connect();

// export async function GET(request) {
//   try {
//     const email = request.nextUrl.searchParams.get("email");
//     if (!email) {
//       return new NextResponse(
//         JSON.stringify({ message: "Email is required" }),
//         { status: 400 }
//       );
//     }
//     //console.log("1" + email);
//     // Get current year and month
//     const now = new Date();
//     const year = now.getFullYear().toString();
//     const userTransactions = await TransactionModel.findOne(
//       { userId: email },
//       { [`years.${year}.months`]: 1 }
//     );

//     //console.log("2." + userTransactions);
//     // If there's no transaction data for the year, return all months with 0 values
//     if (
//       !userTransactions ||
//       !userTransactions.years ||
//       !userTransactions.years.get(year)
//     ) {
//       const allMonths = {};
//       for (let i = 1; i <= 12; i++) {
//         const month = i.toString().padStart(2, "0");
//         allMonths[month] = { Income: 0, Expense: 0 };
//       }
//       return allMonths;
//     }

//     // Initialize an object to hold the income and expense totals for each month
//     const yearData = userTransactions.years.get(year).months;
//     //console.log("3. " + yearData);
//     const monthlyAnalysis = [];

//     for (let i = 1; i <= 12; i++) {
//       const month = i.toString().padStart(2, "0");
//       const monthData = yearData.get(month);

//       // Initialize totals
//       let totalIncome = 0;
//       let totalExpense = 0;

//       // Calculate totals only if there's data for the month
//       if (monthData) {
//         // Calculate total income if INCOME array is present
//         if (monthData.INCOME) {
//           totalIncome = monthData.INCOME.reduce(
//             (sum, { amount }) => sum + amount,
//             0
//           );
//         }
//         // Calculate total expense if EXPENSE map is present
//         if (
//           monthData.EXPENSE &&
//           typeof monthData.EXPENSE.values === "function"
//         ) {
//           // Ensure that EXPENSE is a Map and has values
//           for (const expenses of monthData.EXPENSE.values()) {
//             totalExpense += expenses.reduce(
//               (sum, { amount }) => sum + amount,
//               0
//             );
//           }
//         }

//         monthlyAnalysis.push({ Month: month, Income: totalIncome, Expense: totalExpense });
//       } else {
//         // Default to 0 for months without data
//         monthlyAnalysis.push({ Month: month, Income: 0, Expense: 0 });
//       }
//     }
//     //console.log("4." + JSON.stringify(monthlyAnalysis, null, 2));
//     return new NextResponse(JSON.stringify({ yearly: monthlyAnalysis }), {status: 200});
//   } catch (error) {
//     console.error("Error processing GET request:", error);
//     return new NextResponse(JSON.stringify({ error: error.message }), {
//       status: 500,
//     });
//   }
// }

import { connect } from "@/dbConfig/dbConfig";
import TransactionModel from "@/models/transactionModel";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

connect(); // Ensure the database connection is established

export async function GET(request) {
  try {

    const url=new URL(request.url);
    const email=url.searchParams.get("email");

    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: "Email is required" }),
        { status: 400 }
      );
    }

    // Get current year
    const now = new Date();
    const year = now.getFullYear().toString();

    // Query for user transaction data of the year
    const userTransactions = await TransactionModel.findOne(
      { userId: email },
      { [`years.${year}.months`]: 1 }
    );

    if (
      !userTransactions ||
      !userTransactions.years ||
      !userTransactions.years.get(year)
    ) {
      // If there's no transaction data for the year, return all months with 0 values
      const allMonths = {};
      for (let i = 1; i <= 12; i++) {
        const month = i.toString().padStart(2, "0");
        allMonths[month] = { Income: 0, Expense: 0 };
      }
      return new NextResponse(JSON.stringify({ yearly: allMonths }), {
        status: 200,
      });
    }

    const yearData = userTransactions.years.get(year).months;
    const monthlyAnalysis = [];

    for (let i = 1; i <= 12; i++) {
      const month = i.toString().padStart(2, "0");
      const monthData = yearData.get(month) || {
        INCOME: [],
        EXPENSE: new Map(),
      };

      let totalIncome = monthData.INCOME
        ? monthData.INCOME.reduce((sum, { amount }) => sum + amount, 0)
        : 0;
      let totalExpense = 0;
      if (monthData.EXPENSE && typeof monthData.EXPENSE.values === "function") {
        for (const expenses of monthData.EXPENSE.values()) {
          totalExpense += expenses.reduce((sum, { amount }) => sum + amount, 0);
        }
      }

      monthlyAnalysis.push({
        Month: month,
        Income: totalIncome,
        Expense: totalExpense,
      });
    }

    return new NextResponse(JSON.stringify({ yearly: monthlyAnalysis }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing GET request:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
