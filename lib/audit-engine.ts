export function auditTool(tool: any) {
  let recommendation = "Current plan is optimal";
  let savings = 0;
  let reason = "Your current setup looks cost efficient.";

  // ChatGPT Team downgrade
  if (
    tool.tool === "chatgpt" &&
    tool.plan === "team" &&
    tool.seats <= 2
  ) {
    recommendation = "Switch to ChatGPT Plus";

    savings = tool.monthlySpend - 40;

    reason =
      "Small teams usually don't need ChatGPT Team collaboration features.";
  }

  // Cursor Business downgrade
  if (
    tool.tool === "cursor" &&
    tool.plan === "business" &&
    tool.seats <= 3
  ) {
    recommendation = "Switch to Cursor Pro";

    savings = tool.monthlySpend - 60;

    reason =
      "Cursor Business is typically unnecessary for small engineering teams.";
  }

  return {
    recommendation,
    savings,
    reason,
  };
}