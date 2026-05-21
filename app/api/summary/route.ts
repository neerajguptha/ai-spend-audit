import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ SAFE JSON PARSE (prevents crash)
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    const {
      totalSavings = 0,
      annualSavings = 0,
      tools = [],
    } = body;

    // ✅ Validate tools
    if (!Array.isArray(tools)) {
      return NextResponse.json(
        {
          success: false,
          message: "Tools must be an array",
        },
        { status: 400 }
      );
    }

    // ✅ Safe formatting
    const toolsList = tools
      .map((tool: any) => {
        return `- ${tool.tool || "Unknown"} (${
          tool.plan || "N/A"
        }) - $${tool.monthlySpend || 0}/month`;
      })
      .join("\n");

    // ✅ Summary
    const summary = `
AI Spend Audit Summary

Total Monthly Savings: $${totalSavings}
Annual Savings: $${annualSavings}

Tools Audited:
${toolsList || "No tools provided"}
`.trim();

    return NextResponse.json({
      success: true,
      data: {
        totalSavings,
        annualSavings,
        toolsCount: tools.length,
        summary,
      },
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}