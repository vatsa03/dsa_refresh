"use client";

import { useState } from "react";
import { supabase } from "@/utilities/supabase_client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Problem {
  name: string;
  link: string;
  difficulty: string;
  remindInDays: number;
}

export default function AddProblem() {
  const [problem, setProblem] = useState<Problem>({
    name: "",
    link: "",
    difficulty: "",
    remindInDays: 0,
  });

  async function handleSubmit(e: React.ChangeEvent) {
    e.preventDefault();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + problem.remindInDays);

    await supabase.from("problems").insert({
      name: problem.name,
      link: problem.link,
      difficulty: problem.difficulty,
      remind_in_days: problem.remindInDays,
      due_date: dueDate.toISOString(),
    });

    setProblem({
      name: "",
      link: "",
      difficulty: "",
      remindInDays: 0,
    });
  }

  return (
    <div className="mx-auto mt-12 max-w-md">
      <h2 className="mb-8 border-b pb-4 text-2xl font-semibold tracking-tight">
        Add a New Problem
      </h2>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Problem Name
          </label>
          <Input
            type="text"
            placeholder="Two Sum"
            value={problem.name}
            onChange={(e) => setProblem({ ...problem, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Problem Link
          </label>
          <Input
            type="text"
            placeholder="https://leetcode.com/..."
            value={problem.link}
            onChange={(e) => setProblem({ ...problem, link: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Difficulty
          </label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={problem.difficulty}
            onChange={(e) =>
              setProblem({ ...problem, difficulty: e.target.value })
            }
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Remind In (Days)
          </label>
          <Input
            type="number"
            value={problem.remindInDays}
            onChange={(e) =>
              setProblem({ ...problem, remindInDays: parseInt(e.target.value) })
            }
          />
        </div>
        <Button type="submit" className="mt-2">
          Remind Me
        </Button>
      </form>
    </div>
  );
}
