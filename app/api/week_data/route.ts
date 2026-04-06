import { supabase } from "@/utilities/supabase_client";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { error } = await supabase.from("week_data").upsert(
    {
      week_key: body.id,
      notes: body.notes,
      tasks_completed: body.tasks_completed,
      ...(body.weekly_checks !== undefined && {
        weekly_checks: body.weekly_checks,
      }),
    },
    { onConflict: "week_key" },
  );

  if (error) {
    console.error("Error saving week data:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders },
    );
  }

  return NextResponse.json({ success: true }, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weekKey = searchParams.get("weekKey");
  const { data, error } = await supabase
    .from("week_data")
    .select("*")
    .eq("week_key", weekKey)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching week data:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders },
    );
  }

  return NextResponse.json({ data: data ?? {} }, { headers: corsHeaders });
}
