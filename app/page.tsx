import { supabase } from "@/utilities/supabase_client";

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
  return (
    <div>
      Today's Problems
      {problems?.map((problem) => (
        <div key={problem.id} className="my-4 rounded-lg border p-4">
          <a href={problem.link} className="text-lg font-semibold text-primary">
            {problem.name}
          </a>
          <p className="text-sm text-muted-foreground">
            Difficulty: {problem.difficulty} | Remind in:{" "}
            {problem.remind_in_days} days
          </p>
        </div>
      ))}
    </div>
  );
}
