"use client";

import { useState } from "react";
import "./AddProblem.css";
import { supabase } from "@/utilities/supabase_client";

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

    await supabase.from("problems").insert({
      name: problem.name,
      link: problem.link,
      difficulty: problem.difficulty,
      remind_in_days: problem.remindInDays,
    });

    setProblem({
      name: "",
      link: "",
      difficulty: "",
      remindInDays: 0,
    });
  }

  return (
    <div className="add-problem">
      <h2 className="add-problem__title">Add a New Problem</h2>
      <form className="add-problem__form" onSubmit={handleSubmit}>
        <div className="add-problem__field">
          <label className="add-problem__label">Problem Name</label>
          <input
            className="add-problem__input"
            type="text"
            placeholder="Two Sum"
            value={problem.name}
            onChange={(e) => setProblem({ ...problem, name: e.target.value })}
          />
        </div>
        <div className="add-problem__field">
          <label className="add-problem__label">Problem Link</label>
          <input
            className="add-problem__input"
            type="text"
            placeholder="https://leetcode.com/..."
            value={problem.link}
            onChange={(e) => setProblem({ ...problem, link: e.target.value })}
          />
        </div>
        <div className="add-problem__field">
          <label className="add-problem__label">Difficulty</label>
          <select
            className="add-problem__select"
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
        <div className="add-problem__field">
          <label className="add-problem__label">Remind In (Days)</label>
          <input
            className="add-problem__input"
            type="number"
            value={problem.remindInDays}
            onChange={(e) =>
              setProblem({ ...problem, remindInDays: parseInt(e.target.value) })
            }
          />
        </div>
        <button className="add-problem__button" type="submit">
          Remind Me
        </button>
      </form>
    </div>
  );
}
