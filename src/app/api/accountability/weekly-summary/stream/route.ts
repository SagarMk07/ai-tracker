import { NextResponse } from "next/server";
import { requireUser } from "@/services/supabaseServer";
import { streamWeeklyAccountabilityNarrative } from "@/services/aiClient";
import type { PersonalityMode } from "@/types";
import { loadWeeklyAccountabilityInput } from "../_metrics";

export async function POST(request: Request) {
  try {
    const { user, supabase } = await requireUser();
    const body = await request.json();
    const requestedMode = body.personalityMode as PersonalityMode | undefined;

    const metrics = await loadWeeklyAccountabilityInput(user, supabase);
    let stream;
    try {
      stream = await streamWeeklyAccountabilityNarrative({
        weeklyFocusHours: metrics.weeklyFocusHours,
        completionRate: metrics.completionRate,
        distractionCount: metrics.distractionCount,
        streakDays: metrics.streakDays,
        incompleteSessions: metrics.incompleteSessions,
        personality: requestedMode || metrics.personalityMode,
      });
    } catch (aiError) {
      console.error("Weekly summary stream failed, using fallback:", aiError);
      const fallback = `AI quota unavailable. Weekly focus: ${metrics.weeklyFocusHours}h, completion: ${metrics.completionRate}%, distractions: ${metrics.distractionCount}, streak: ${metrics.streakDays} days. Keep execution blocks realistic and consistent.`;
      return new NextResponse(fallback, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) {
            controller.enqueue(encoder.encode(token));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to stream summary" }, { status: 500 });
  }
}
