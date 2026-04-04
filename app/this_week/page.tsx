"use client";

import { useState } from "react";

interface Task {
  id: string;
  time: string;
  duration: string;
  title: string;
  subtitle?: string;
  isRest?: boolean;
}

interface DaySchedule {
  day: string;
  shortDay: string;
  tasks: Task[];
}

const schedule: DaySchedule[] = [
  {
    day: "Monday",
    shortDay: "Mon",
    tasks: [
      {
        id: "mon-am",
        time: "Morning",
        duration: "25 min",
        title: "DSA problem",
      },
      {
        id: "mon-pm",
        time: "Evening",
        duration: "45 min",
        title: "System design",
      },
    ],
  },
  {
    day: "Tuesday",
    shortDay: "Tue",
    tasks: [
      {
        id: "tue-am",
        time: "Morning",
        duration: "25 min",
        title: "DSA problems",
      },
      {
        id: "tue-af",
        time: "Afternoon",
        duration: "25 min",
        title: "System design",
      },
    ],
  },
  {
    day: "Wednesday",
    shortDay: "Wed",
    tasks: [
      {
        id: "wed-am",
        time: "Morning",
        duration: "25 min",
        title: "DSA problems",
      },
      {
        id: "wed-pm",
        time: "Evening",
        duration: "25 min",
        title: "System design",
      },
    ],
  },
  {
    day: "Thursday",
    shortDay: "Thu",
    tasks: [
      {
        id: "thu-am",
        time: "Morning",
        duration: "25 min",
        title: "1 DSA problem",
      },
      {
        id: "thu-af",
        time: "Afternoon",
        duration: "25 min",
        title: "System design",
      },
    ],
  },
  {
    day: "Friday",
    shortDay: "Fri",
    tasks: [
      {
        id: "fri-am",
        time: "Morning",
        duration: "25 min",
        title: "DSA problems",
      },
      {
        id: "fri-af",
        time: "Afternoon",
        duration: "25 min",
        title: "System design",
      },
      {
        id: "fri-pm",
        time: "Evening",
        duration: "REST",
        title: "Let the week settle",
        isRest: true,
      },
    ],
  },
  {
    day: "Saturday",
    shortDay: "Sat",
    tasks: [
      {
        id: "sat-morning",
        time: "Flexible",
        duration: "3–4 hours",
        title: "DSA Problems",
      },
      {
        id: "sat",
        time: "Flexible",
        duration: "3–4 hours",
        title: "Build: side project or system",
      },
      {
        id: "sat-af",
        time: "Flexible",
        duration: "3–4 hours",
        title: "AI News and tools",
      },
    ],
  },
  {
    day: "Sunday",
    shortDay: "Sun",
    tasks: [
      {
        id: "sun-morning",
        time: "Flexible",
        duration: "3–4 hours",
        title: "DSA Problems",
      },
      {
        id: "sun",
        time: "Flexible",
        duration: "1–2 hours",
        title: "Build: side project or system",
      },
      {
        id: "sun-afternoon",
        time: "Flexible",
        duration: "1–2 hours",
        title: "Plan next week · reflect · light reading",
      },
    ],
  },
];

function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const week = Math.ceil((diff / 86400000 + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getStoredChecks(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("weekly-checks");
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function getStoredNotes(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(`weekly-notes-${getWeekKey()}`) ?? "";
  } catch {
    return "";
  }
}

function getDayAccent(shortDay: string) {
  const accents: Record<string, string> = {
    Mon: "border-l-blue-500",
    Tue: "border-l-violet-500",
    Wed: "border-l-emerald-500",
    Thu: "border-l-amber-500",
    Fri: "border-l-rose-500",
    Sat: "border-l-cyan-500",
    Sun: "border-l-orange-400",
  };
  return accents[shortDay] ?? "border-l-gray-400";
}

function getDayBadge(shortDay: string) {
  const badges: Record<string, string> = {
    Mon: "bg-blue-100 text-blue-700",
    Tue: "bg-violet-100 text-violet-700",
    Wed: "bg-emerald-100 text-emerald-700",
    Thu: "bg-amber-100 text-amber-700",
    Fri: "bg-rose-100 text-rose-700",
    Sat: "bg-cyan-100 text-cyan-700",
    Sun: "bg-orange-100 text-orange-700",
  };
  return badges[shortDay] ?? "bg-gray-100 text-gray-700";
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function getTodayShortDay() {
  return DAY_NAMES[new Date().getDay()];
}

export default function ThisWeekPage() {
  const [checked, setChecked] =
    useState<Record<string, boolean>>(getStoredChecks);
  const [selectedDay, setSelectedDay] = useState<string>(getTodayShortDay);
  const [notes, setNotes] = useState<string>(getStoredNotes);

  function handleNotesChange(value: string) {
    setNotes(value);
    localStorage.setItem(`weekly-notes-${getWeekKey()}`, value);
  }

  const todayDay = getTodayShortDay();
  const activeSchedule = schedule.filter((d) => d.shortDay === selectedDay);

  function toggle(taskId: string) {
    setChecked((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      localStorage.setItem("weekly-checks", JSON.stringify(next));
      return next;
    });
  }

  function resetAll() {
    setChecked({});
    localStorage.removeItem("weekly-checks");
  }

  const totalTasks = schedule.reduce((s, d) => s + d.tasks.length, 0);
  const doneTasks = schedule.reduce(
    (s, d) => s + d.tasks.filter((t) => checked[t.id]).length,
    0,
  );
  const pct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-16">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Your week — mapped out
        </h1>
        <p className="text-sm text-muted-foreground">
          Check tasks off as you go. Progress resets when you clear it.
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {doneTasks} / {totalTasks} tasks done
          </span>
          <button
            onClick={resetAll}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Reset week
          </button>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {schedule.map((d) => {
          const isActive = d.shortDay === selectedDay;
          const isToday = d.shortDay === todayDay;
          const allDone = d.tasks.every((t) => checked[t.id]);
          return (
            <button
              key={d.shortDay}
              onClick={() => setSelectedDay(d.shortDay)}
              className={`relative flex flex-col items-center rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? `${getDayBadge(d.shortDay)} border-current`
                  : "bg-card hover:bg-accent/40"
              }`}
            >
              {d.shortDay}
              {isToday && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-current" />
              )}
              {allDone && (
                <span className="absolute -right-1 -top-1 text-[10px] text-green-600">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Today's card */}
      <div className="space-y-4">
        {activeSchedule.map((day) => {
          const dayDone = day.tasks.every((t) => checked[t.id]);
          return (
            <div
              key={day.shortDay}
              className={`rounded-lg border border-l-4 bg-card transition-opacity ${getDayAccent(day.shortDay)} ${dayDone ? "opacity-60" : ""}`}
            >
              {/* Day header */}
              <div className="flex items-center gap-3 border-b px-5 py-3">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDayBadge(day.shortDay)}`}
                >
                  {day.shortDay}
                </span>
                <span className="text-sm font-medium">{day.day}</span>
                {dayDone && (
                  <span className="ml-auto text-xs text-green-600 font-medium">
                    ✓ Complete
                  </span>
                )}
              </div>

              {/* Tasks */}
              <div className="divide-y">
                {day.tasks.map((task) => {
                  const isDone = !!checked[task.id];
                  return (
                    <label
                      key={task.id}
                      className="flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-accent/40 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(task.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 accent-primary"
                      />
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}
                          >
                            {task.title}
                          </span>
                          {task.isRest && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                              Rest
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly notes */}
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <span className="text-sm font-medium">📝 Week notes</span>
          <span className="text-[11px] text-muted-foreground">
            {getWeekKey()} · auto-saved
          </span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Jot down wins, blockers, ideas, or anything worth remembering this week…"
          className="w-full resize-none bg-transparent px-5 py-4 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none min-h-[120px]"
          rows={5}
        />
      </div>
    </div>
  );
}
