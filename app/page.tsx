import { supabase } from "@/utilities/supabase_client";
import ProblemCard from "@/components/ProblemCard";

interface Problem {
  id: number;
  name: string;
  link: string;
  difficulty: string;
  remind_in_days: number;
  created_at: string;
  due_date: string;
}

export default async function Home() {
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*")
    .lte("due_date", new Date().toISOString())
    .overrideTypes<Problem[]>();

  if (error) {
    console.error("Error fetching problems:", error);
    return (
      <div className="flex items-center justify-center p-12 text-destructive">
        Error loading problems.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 border-b pb-4 text-2xl font-semibold tracking-tight">
        Today&apos;s Problems
      </h1>

      {problems?.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          🎉 No problems due today — you&apos;re all caught up!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {problems?.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
