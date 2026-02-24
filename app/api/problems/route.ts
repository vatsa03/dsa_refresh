import { supabase } from "@/utilities/supabase_client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight (OPTIONS) request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + body.remind_in_days);

  const { error } = await supabase.from("problems").insert({
    name: body.name,
    link: body.link,
    difficulty: body.difficulty,
    remind_in_days: body.remind_in_days,
    due_date: dueDate.toISOString().split("T")[0],
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders },
    );
  }

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}
