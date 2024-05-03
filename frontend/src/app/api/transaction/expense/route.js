import { connect } from "@/dbConfig/dbConfig";
import TransactionData from "@/models/transactionModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, title, amount, date, category, year, month } = reqBody;

    // Convert email to userId in the query to match the database schema
    const transactiondata = await TransactionData.findOne({ userId: email });

    const Expense = { title, amount, date: new Date(date) };
    if (transactiondata) {
      // User exists, add the new expense under the correct year, month, and category
      const updatePath = `years.${year}.months.${month}.EXPENSE.${category}`;
      await TransactionData.updateOne(
        { userId: email },
        { $push: { [updatePath]: Expense } },
        { upsert: true } // Ensures that the document and path are created if not exist
      );
      return NextResponse.json(
        { message: "Expense saved successfully" },
        { status: 200 }
      );
    } else {
      // User does not exist, create a new user with the given details
      const newExpense = new TransactionData({
        userId: email,
        years: {
          [year]: {
            months: {
              [month]: {
                EXPENSE: {
                  [category]: [Expense],
                },
              },
            },
          },
        },
      });
      await newExpense.save();
      return NextResponse.json(
        { message: "New user created with expense" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const reqBody = await request.json();
    const { email, year, month, expenseId, category } = reqBody;
    
    console.log("Request Body:", reqBody); // Confirm the structure and content of the incoming request
    
    // Construct the path to the array element
    const userPath = `years.${year}.months.${month}.EXPENSE.${category}`;
    console.log("Constructed path for update:", userPath);
    
    // Attempt to convert expenseId to ObjectId and catch any errors
    let objExpenseId;
    try {
      objExpenseId = new mongoose.Types.ObjectId(expenseId);
      console.log(objExpenseId);
    } catch (error) {
      console.error("Invalid ObjectId format:", expenseId);
      return new Response(JSON.stringify({ error: "Invalid ObjectId format" }), { status: 400 });
    }

    // Perform the update operation
    const result = await TransactionData.updateOne(
      { userId: email }, // Filter to find the correct user
      { $pull: { [userPath]: { _id: objExpenseId } } } // Command to remove the specific expense entry
    );

    console.log("Database operation result:", result); // Check the MongoDB operation result

    if (result.modifiedCount === 0) {
      console.log("No expense entry was deleted, check your identifiers.");
      return new Response(JSON.stringify({ message: "No expense entry was deleted, check your identifiers." }), { status: 404 });
    } else {
      return new Response(JSON.stringify({ message: "Expense deleted" }), { status: 200 });
    }
  } catch (error) {
    console.error("Error processing DELETE request:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
