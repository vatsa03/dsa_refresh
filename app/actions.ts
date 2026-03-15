"use server";

import { supabase } from "@/utilities/supabase_client";
import { revalidatePath } from "next/cache";

export async function deleteProblem(formData: FormData) {
  console.log(
    "deleteProblem called with:",
    Object.fromEntries(formData.entries()),
  );
  const id = formData.get("problemId");
  if (!id) return;

  const { error } = await supabase.from("problems").delete().eq("id", id);

  if (error) {
    console.error("Error deleting problem:", error);
  }

  revalidatePath("/");
}

export async function rescheduleProblem(formData: FormData) {
  const id = formData.get("problemId");
  const days = formData.get("days");
  if (!id || !days) return;

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Number(days));

  const { error } = await supabase
    .from("problems")
    .update({
      remind_in_days: Number(days),
      due_date: dueDate.toISOString().split("T")[0],
    })
    .eq("id", id);

  if (error) {
    console.error("Error rescheduling problem:", error);
  }

  revalidatePath("/");
}
