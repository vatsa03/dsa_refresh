"use client";

import { deleteProblem, rescheduleProblem } from "@/app/actions";

interface Problem {
  id: number;
  name: string;
  link: string;
  difficulty: string;
  remind_in_days: number;
  created_at: string;
  due_date: string;
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-green-100 text-green-700";
    case "medium":
      return "bg-yellow-100 text-yellow-700";
    case "hard":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <a
          href={problem.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {problem.name}
        </a>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Due: {new Date(problem.due_date).toLocaleDateString()}
        </span>

        <div className="flex items-center gap-2">
          <form
            action={rescheduleProblem}
            className="flex items-center gap-1.5"
          >
            <input type="hidden" name="problemId" value={problem.id} />
            <input
              type="number"
              name="days"
              min={1}
              placeholder="Days"
              defaultValue={5}
              className="h-8 w-20 rounded-md border px-2 text-sm"
            />
            <button
              type="submit"
              className="h-8 rounded-md border px-3 text-sm font-medium hover:bg-accent"
            >
              Mark as done
            </button>
          </form>

          <form action={deleteProblem}>
            <input type="hidden" name="problemId" value={problem.id} />
            <button
              type="submit"
              className="h-8 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Do not remind again.
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
