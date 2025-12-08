import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExpenseReportRequest {
  month: string;
  year: string;
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
    console.log("Starting send-expense-report function");
    
    // Check for Resend API key
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return new Response(JSON.stringify({ 
        error: "Email service not configured. Please configure RESEND_API_KEY." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resend = new Resend(RESEND_API_KEY);

    // Authenticate user and get their email
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(JSON.stringify({ error: 'Unauthorized - No authorization header' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("User authenticated:", user.id);

    // Get user's email from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError);
      return new Response(JSON.stringify({ error: 'User profile not found' }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const email = profile.email;
    console.log("Sending report to email:", email);

    const requestBody = await req.json();
    const { month, year, expenses, summary }: ExpenseReportRequest = requestBody;

    if (!month || !year || !expenses || !summary) {
      console.error("Missing required fields in request body");
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

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

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: #4285f4; margin-bottom: 20px;">📊 Expense Report - ${month} ${year}</h1>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin: 0 0 10px 0; font-size: 16px; opacity: 0.9;">Total Spending</h2>
              <p style="font-size: 32px; font-weight: bold; margin: 0;">₹${summary.totalSpending.toLocaleString("en-IN")}</p>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">Category Breakdown</h3>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              ${summary.categoryTotals
                .map(
                  (cat) => `
                    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5;">
                      <span style="font-weight: 500;">${cat.category}</span>
                      <span>₹${cat.total.toLocaleString("en-IN")} <span style="color: #888; font-size: 12px;">(${cat.percentage.toFixed(1)}%)</span></span>
                    </div>
                  `
                )
                .join("")}
            </div>
            
            <p style="margin-top: 30px; color: #666;">📎 Please find the detailed expense report attached as a CSV file.</p>
            
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            
            <p style="color: #888; font-size: 12px; text-align: center;">
              This is an automated report from FinGuide - Your Personal Finance Manager
            </p>
          </div>
        </body>
      </html>
    `;

    // Convert CSV to base64
    const encoder = new TextEncoder();
    const csvBytes = encoder.encode(csvContent);
    const base64Csv = btoa(String.fromCharCode(...csvBytes));

    console.log("Attempting to send email via Resend...");

    const emailResponse = await resend.emails.send({
      from: "FinGuide <onboarding@resend.dev>",
      to: [email],
      subject: `📊 Expense Report - ${month} ${year}`,
      html: htmlContent,
      attachments: [
        {
          filename: `expense-report-${month}-${year}.csv`,
          content: base64Csv,
        },
      ],
    });

    console.log("Email sent successfully:", JSON.stringify(emailResponse));

    // Update last report sent timestamp
    await supabase
      .from('profiles')
      .update({ last_report_sent_at: new Date().toISOString() })
      .eq('id', user.id);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending expense report:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Provide more helpful error messages
    let errorMessage = error.message || "Failed to send report";
    let hint = "";
    
    if (error.message?.includes("API key")) {
      hint = "Please ensure your Resend API key is correctly configured.";
    } else if (error.message?.includes("domain")) {
      hint = "Please verify your email domain at https://resend.com/domains";
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      hint: hint || "Make sure your Resend API key is valid and your email domain is verified."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
