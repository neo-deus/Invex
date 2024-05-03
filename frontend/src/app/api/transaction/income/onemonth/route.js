import { connect } from "@/dbConfig/dbConfig";
import TransactionData from "@/models/transactionModel";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

connect();
export async function GET(request) {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) {
        return new NextResponse(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    try {
        const transactionData = await TransactionData.findOne({ userId: email });
        if (!transactionData) {
            return new NextResponse(JSON.stringify({ msg: "User Not Found" }), { status: 404 });
        }

        const now = new Date();
        const lastMonthDate = new Date();
        lastMonthDate.setDate(now.getDate() - 30);

        const endDate = now.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"
        const startDate = lastMonthDate.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

        let results = [];

        // Assuming years are stored as keys in a Map
        if (transactionData.years) {
            for (let [yearKey, yearValue] of transactionData.years.entries()) {
                for (let [monthKey, monthValue] of yearValue.months.entries()) {
                    if (monthValue.INCOME) {
                        for (let income of monthValue.INCOME) {
                            const incomeDate = new Date(income.date).toISOString().split('T')[0];
                            if (incomeDate >= startDate && incomeDate <= endDate) {
                                results.push({
                                    id: income._id.toString(), 
                                    source: income.source,
                                    amount: income.amount,
                                    date: incomeDate
                                });
                            }
                        }
                    }
                }
            }
        }

        return new NextResponse(JSON.stringify(results), { status: 200 });
    } catch (error) {
        console.error("Error processing GET request:", error);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}