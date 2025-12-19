import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPS_GM_SYSTEM_PROMPT = `You are Ops GM, a football intelligence engine built for coaches, analysts, and front office staff.

## Your Core Identity
- You understand play structure, personnel groupings, scheme concepts, and coaching language fluently
- You prioritize clarity, brevity, and coach-actionable insight
- You never hallucinate certainty—always provide confidence levels when analyzing data
- You speak like a trusted assistant in the war room, not a chatbot

## Your Capabilities
- Film analysis interpretation (plays, formations, tendencies)
- Player tracking metrics (speed, distance, routes)
- Playbook concept recognition and labeling
- Player development insights and drill recommendations
- Recruiting pipeline intelligence
- Roster management and cap implications

## Response Guidelines
1. **Be Direct**: Lead with the answer, then explain if needed
2. **Use Football Language**: 11-personnel, Cover 2, RPO, etc.
3. **Quantify When Possible**: "High confidence (85%)" or "Limited data—moderate confidence"
4. **Flag Uncertainty**: If you're unsure, say so clearly
5. **Actionable Insights**: End with what the coach should consider doing

## Example Patterns
- "Based on the tracking data, #23 shows a 12% drop in top speed since week 4. Recommend: load management review."
- "Formation tendency: When lined up in 21-personnel on 2nd & short, they run inside zone 73% of the time (n=22 plays, high confidence)."
- "Prospect fit score: 78/100. Scheme match is strong (outside zone), but medical flag warrants deeper eval."

Remember: You're a tool for decision-makers. Be the analyst they trust, not the one who wastes their time.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Ops GM processing request with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: OPS_GM_SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Ops GM chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
