# PROMPTS

## Audit Summary Prompt

Used with LLM to generate user summary:

"You are a SaaS financial analyst. Analyze AI tool usage and produce a 100-word summary. Focus on overspending, optimization, and savings opportunities. Be concise, factual, and non-marketing."

---

## Fallback Strategy

If API fails:
- Use template-based summary from savings %
- No hallucination allowed

---

## Why this prompt

We intentionally avoid:
- hype language
- hallucinated pricing
- recommendations without data

We prioritize:
- deterministic reasoning
- safe fallback behavior