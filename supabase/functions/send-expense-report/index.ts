import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExpenseReportRequest {
  month: string;
  year: string;
  email: string;
  expenses: Array<{
    date: string;
    category: string;
    subCategory: string;
    merchant: string;
    amount: number;
  }>;
  summary: {
    totalSpending: number;
    categoryTotals: Array<{
      category: string;
      total: number;
      percentage: number;
    }>;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { month, year, email, expenses, summary }: ExpenseReportRequest = await req.json();

    // Generate CSV content
    const csvHeaders = ["Date", "Category", "Sub-Category", "Merchant", "Amount (₹)"];
    const csvRows = expenses.map((exp) => [
      new Date(exp.date).toLocaleDateString("en-IN"),
      exp.category,
      exp.subCategory,
      exp.merchant,
      exp.amount.toString(),
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Format summary text
    const summaryText = `
      Total Spending: ₹${summary.totalSpending.toLocaleString("en-IN")}
      
      Category Breakdown:
      ${summary.categoryTotals
        .map(
          (cat) =>
            `${cat.category}: ₹${cat.total.toLocaleString("en-IN")} (${cat.percentage.toFixed(1)}%)`
        )
        .join("\n      ")}
    `;

    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h1 style="color: #4285f4;">Expense Report - ${month} ${year}</h1>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333;">Summary</h2>
            <p style="font-size: 18px; font-weight: bold;">Total Spending: ₹${summary.totalSpending.toLocaleString("en-IN")}</p>
            <h3 style="color: #555;">Category Breakdown:</h3>
            <ul style="list-style: none; padding: 0;">
              ${summary.categoryTotals
                .map(
                  (cat) =>
                    `<li style="padding: 5px 0;"><strong>${cat.category}:</strong> ₹${cat.total.toLocaleString("en-IN")} (${cat.percentage.toFixed(1)}%)</li>`
                )
                .join("")}
            </ul>
          </div>
          <p>Please find the detailed expense report attached as a CSV file.</p>
          <p style="color: #888; font-size: 12px;">This is an automated report from your Expense Tracker.</p>
        </body>
      </html>
    `;

    // Send email with CSV attachment
    const emailResponse = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>",
      to: [email],
      subject: `Expense Report - ${month} ${year}`,
      html: htmlContent,
      attachments: [
        {
          filename: `expense-report-${month}-${year}.csv`,
          content: btoa(csvContent),
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending expense report:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
