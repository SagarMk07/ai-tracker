import "server-only";
import OpenAI from "openai";
import type { PersonalityMode, TaskIntelligence } from "@/types";
import { getEnvVar } from "@/lib/env";

const client = new OpenAI({ apiKey: getEnvVar("OPENAI_API_KEY") });
const model = "gpt-4o-mini";

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function personalityInstruction(mode: PersonalityMode) {
  if (mode === "soft") return "Supportive and compassionate with gentle accountability.";
  if (mode === "ruthless") return "Direct, firm, and accountability-first. No fluff.";
  return "Tactical and practical with concise, execution-focused coaching.";
}

export async function generateIntentionStatement(input: {
  goal: string;
  durationMinutes: number;
  riskFactors: string[];
  personality: PersonalityMode;
}) {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)} Return one concise intention statement (max 30 words).`,
      },
      {
        role: "user",
        content: `Goal: ${input.goal}\nDuration: ${input.durationMinutes} minutes\nRisk factors: ${input.riskFactors.join(", ") || "none"}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || `I will complete ${input.goal} in ${input.durationMinutes} minutes with full focus.`;
}

export async function generateSessionReflection(input: {
  goal: string;
  durationMinutes: number;
  completed: boolean;
  distractions: Array<{ distraction_type?: string; intensity?: number; notes?: string }>;
  personality: PersonalityMode;
}) {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)} Return JSON with keys: summary:string,wins:string[],blockers:string[],nextAction:string`,
      },
      {
        role: "user",
        content: `Goal: ${input.goal}\nPlanned duration: ${input.durationMinutes}\nCompleted: ${input.completed}\nDistractions: ${JSON.stringify(input.distractions)}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return parseJSON(completion.choices[0]?.message?.content, {
    summary: input.completed ? "Session completed with acceptable focus." : "Session was incomplete and needs process adjustment.",
    wins: input.completed ? ["You showed execution consistency."] : ["You started despite resistance."],
    blockers: ["Attention drift"],
    nextAction: "Schedule the next 25-minute block now.",
  });
}

export async function generateWeeklyAccountabilitySummary(input: {
  weeklyFocusHours: number;
  completionRate: number;
  distractionCount: number;
  streakDays: number;
  incompleteSessions: number;
  personality: PersonalityMode;
}) {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.35,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)} Return JSON with keys: summary:string,priorities:string[],riskAlert:string`,
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
    response_format: { type: "json_object" },
  });

  return parseJSON(completion.choices[0]?.message?.content, {
    summary: "Execution trend is improving, but consistency and interruption control still need tightening.",
    priorities: ["Protect your first deep-work block", "Reduce context switching", "Pre-commit tomorrow's top task"],
    riskAlert: "Frequent incomplete sessions usually indicate overlong blocks. Trim planned durations by 10-15 minutes next week.",
  });
}

export async function streamWeeklyAccountabilityNarrative(input: {
  weeklyFocusHours: number;
  completionRate: number;
  distractionCount: number;
  streakDays: number;
  incompleteSessions: number;
  personality: PersonalityMode;
}) {
  return client.chat.completions.create({
    model,
    stream: true,
    temperature: 0.4,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)} Produce one concise weekly narrative summary in 80 words or fewer.`,
      },
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });
}

export async function generateTaskIntelligence(input: {
  goal: string;
  availableWindows?: string[];
  personality: PersonalityMode;
}): Promise<TaskIntelligence> {
  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content: `You are Focus Guardian AI. ${personalityInstruction(input.personality)} Return JSON with keys: difficultyScore:number,suggestedTime:string,focusBlocks:{title:string,minutes:number,reason:string}[]. There must be exactly 3 focus blocks.`,
      },
      {
        role: "user",
        content: `Goal: ${input.goal}\nAvailable windows: ${(input.availableWindows || []).join(", ") || "none"}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  return parseJSON(completion.choices[0]?.message?.content, {
    difficultyScore: 6,
    suggestedTime: "09:00-11:00",
    focusBlocks: [
      { title: "Clarify deliverable", minutes: 20, reason: "Remove ambiguity before execution" },
      { title: "Deep execution", minutes: 60, reason: "Core progress block" },
      { title: "Review and close", minutes: 20, reason: "Quality pass and next-step capture" },
    ],
  });
}
