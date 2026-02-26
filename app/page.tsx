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
  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const { data: problems, error } = await supabase
    .from("problems")
    .select("*")
    .lte("due_date", new Date().toISOString())
    .overrideTypes<Problem[]>();
  if (error) {
    console.error("Error fetching problems:", error);
    return <div>Error loading problems.</div>;
  }
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
