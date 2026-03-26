import { supabase } from "@/utilities/supabase_client";
import ProblemCard from "@/components/ProblemCard";

export const dynamic = "force-dynamic";

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
  const { data: overdue_problems, error: overdue_error } = await supabase
    .from("problems")
    .select("*")
    .lt("due_date", new Date().toISOString())
    .overrideTypes<Problem[]>();

  const { data: problems, error: problem_error } = await supabase
    .from("problems")
    .select("*")
    .eq("due_date", new Date().toISOString())
    .overrideTypes<Problem[]>();

  if (overdue_error || problem_error) {
    console.error("Error fetching problems:", overdue_error || problem_error);
    return (
      <div className="flex items-center justify-center p-12 text-destructive">
        Error loading problems.
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12">
      <section>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">
          Overdue Problems
        </h1>
        <hr className="mb-6" />
        {overdue_problems?.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            🎉 No overdue problems — you&apos;re all caught up!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {overdue_problems?.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">
          Today&apos;s Problems
        </h1>
        <hr className="mb-6" />
        {problems?.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            🎉 No problems due today — you&apos;re all caught up!
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {problems?.map((problem) => (
              <ProblemCard key={problem.id} problem={problem} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
