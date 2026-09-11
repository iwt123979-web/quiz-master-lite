import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

type Question = {
  category: string;
  prompt: string;
  options: string[];
  correct: number;
};

const QUESTIONS: Question[] = [
  {
    category: "Science",
    prompt: "What is the hardest natural substance on Earth?",
    options: ["Quartz", "Diamond", "Titanium", "Granite"],
    correct: 1,
  },
  {
    category: "Geography",
    prompt: "Which country has the most natural lakes?",
    options: ["USA", "Russia", "Canada", "Finland"],
    correct: 2,
  },
  {
    category: "Music",
    prompt: "How many strings does a standard guitar have?",
    options: ["4", "5", "6", "7"],
    correct: 2,
  },
  {
    category: "Science",
    prompt: "What is the speed of light approximately?",
    options: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"],
    correct: 0,
  },
  {
    category: "History",
    prompt: "Who was the first Emperor of China?",
    options: ["Han Wudi", "Qin Shi Huang", "Kublai Khan", "Sun Yat-sen"],
    correct: 1,
  },
  {
    category: "Geography",
    prompt: "Which desert is the largest in the world?",
    options: ["Sahara", "Gobi", "Antarctic", "Kalahari"],
    correct: 2,
  },
  {
    category: "Art",
    prompt: "Which artist cut off part of his own ear?",
    options: ["Claude Monet", "Vincent van Gogh", "Pablo Picasso", "Edvard Munch"],
    correct: 1,
  },
  {
    category: "Science",
    prompt: "What organ pumps blood through the human body?",
    options: ["Liver", "Lungs", "Heart", "Kidney"],
    correct: 2,
  },
  {
    category: "History",
    prompt: "The Great Wall was built primarily to defend against whom?",
    options: ["Mongols", "Romans", "Persians", "Vikings"],
    correct: 0,
  },
  {
    category: "Music",
    prompt: "How many keys are on a standard piano?",
    options: ["61", "76", "88", "100"],
    correct: 2,
  },
];

type Phase = "start" | "playing" | "results";

type AnswerRecord = {
  question: Question;
  selected: number;
  correct: boolean;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bravo! — A Rapid-Fire Quiz" },
      {
        name: "description",
        content:
          "Ten rapid-fire trivia questions. Four bold answers each. Take the stage and top the board.",
      },
      { property: "og:title", content: "Bravo! — A Rapid-Fire Quiz" },
      {
        property: "og:description",
        content:
          "Ten rapid-fire trivia questions. Four bold answers each. Take the stage and top the board.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizApp,
});

function QuizApp() {
  const [phase, setPhase] = useState<Phase>("start");
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const score = answers.filter((a) => a.correct).length;
  const total = QUESTIONS.length;

  function start() {
    setPhase("playing");
    setQIndex(0);
    setSelected(null);
    setAnswers([]);
  }

  function pickAnswer(i: number) {
    if (selected !== null) return;
    const q = QUESTIONS[qIndex]!;
    const correct = i === q.correct;
    setSelected(i);
    setAnswers((prev) => [...prev, { question: q, selected: i, correct }]);
  }

  function next() {
    if (qIndex + 1 >= total) {
      setPhase("results");
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (phase === "start") {
    return <StartScreen onStart={start} total={total} />;
  }

  if (phase === "results") {
    return (
      <ResultsScreen
        score={score}
        total={total}
        answers={answers}
        onRestart={start}
      />
    );
  }

    return (
      <QuestionScreen
        question={QUESTIONS[qIndex]!}
        qIndex={qIndex}
      total={total}
      score={score}
      selected={selected}
      onPick={pickAnswer}
      onNext={next}
    />
  );
}

/* ---------- Start Screen ---------- */

function StartScreen({ onStart, total }: { onStart: () => void; total: number }) {
  return (
    <div className="min-h-dvh bg-paper font-body text-ink antialiased">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <span className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
            Bravo! Quiz
          </span>
          <span className="font-display font-medium text-sm text-ink/60">
            Studio game-show
          </span>
        </div>

        <div className="flex flex-col gap-6 rounded-2xl bg-cream p-6 sm:p-8 ring-1 ring-black/5">
          <div className="rounded-xl bg-brand p-6 text-cream">
            <p className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              The trivia stage
            </p>
            <p className="mt-2 max-w-30ch text-sm sm:text-base text-cream/85 text-pretty">
              Ten rapid-fire questions. Four bold answers each. One sure-handed
              play to top the board.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-tile p-3">
              <p className="font-display text-2xl font-semibold">{total}</p>
              <p className="text-xs text-ink/55">Questions</p>
            </div>
            <div className="rounded-lg bg-tile p-3">
              <p className="font-display text-2xl font-semibold">4</p>
              <p className="text-xs text-ink/55">Per round</p>
            </div>
            <div className="rounded-lg bg-tile p-3">
              <p className="font-display text-2xl font-semibold">+100</p>
              <p className="text-xs text-ink/55">Per win</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              Science
            </span>
            <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-medium text-brand">
              History
            </span>
            <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-medium text-ink/70">
              Geography
            </span>
            <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-medium text-ink/70">
              Art
            </span>
          </div>

          <button
            onClick={onStart}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 font-display text-base font-semibold text-cream shadow-[0_6px_0_0_var(--brand-ink)] transition-transform active:translate-y-[3px] active:shadow-[0_3px_0_0_var(--brand-ink)]"
          >
            Take the stage
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Question Screen ---------- */

function QuestionScreen({
  question,
  qIndex,
  total,
  score,
  selected,
  onPick,
  onNext,
}: {
  question: Question;
  qIndex: number;
  total: number;
  score: number;
  selected: number | null;
  onPick: (i: number) => void;
  onNext: () => void;
}) {
  const progress = ((qIndex + 1) / total) * 100;
  const answered = selected !== null;
  const isCorrect = selected === question.correct;

  function tileClasses(i: number): string {
    const base =
      "rounded-xl p-4 text-left font-display text-sm font-semibold transition-all tile-in";
    if (!answered) {
      return `${base} bg-tile text-ink ring-1 ring-black/5 active:translate-y-[2px] hover:bg-tile/70`;
    }
    if (i === question.correct) {
      return `${base} bg-accent text-cream shadow-[0_5px_0_0_var(--accent-ink)]`;
    }
    if (i === selected) {
      return `${base} bg-brand text-cream shadow-[0_5px_0_0_var(--brand-ink)]`;
    }
    return `${base} bg-tile text-ink/40 ring-1 ring-black/5`;
  }

  return (
    <div className="min-h-dvh bg-paper font-body text-ink antialiased">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <span className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
            Bravo! Quiz
          </span>
          <span className="font-display font-medium text-sm text-ink/60">
            {qIndex + 1} of {total}
          </span>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-cream p-6 sm:p-8 ring-1 ring-black/5">
          {/* Progress bar + score */}
          <div className="flex items-center justify-between gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="rounded-full bg-ink px-3 py-1 font-display text-sm font-semibold text-cream">
              {score * 100} pts
            </span>
          </div>

          {/* Question card */}
          <div key={qIndex} className="q-pop rounded-xl bg-ink p-5 sm:p-6 text-cream">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/55">
              {question.category} · Question {String(qIndex + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl font-semibold leading-tight text-balance">
              {question.prompt}
            </h2>
          </div>

          {/* Answer tiles */}
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onPick(i)}
                disabled={answered}
                className={tileClasses(i)}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="block font-mono text-xs text-ink/50 mb-1">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {/* Feedback + next */}
          {answered && (
            <div className="flex items-center justify-between gap-4 mt-1">
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <span className="grid place-items-center size-5 rounded-full bg-accent text-white text-xs font-bold">
                      ✓
                    </span>
                    <span className="text-sm font-semibold text-accent-ink">
                      Correct! +100 points
                    </span>
                  </>
                ) : (
                  <>
                    <span className="grid place-items-center size-5 rounded-full bg-brand text-white text-xs font-bold">
                      ✗
                    </span>
                    <span className="text-sm font-semibold text-brand">
                      Missed — the answer was{" "}
                      {question.options[question.correct]}.
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={onNext}
                className="inline-flex items-center gap-1.5 bg-ink text-cream text-sm font-semibold px-4 py-2.5 rounded-xl ring-1 ring-black/5 shadow-[0_4px_0_0_#000] transition-transform active:translate-y-[2px] active:shadow-[0_2px_0_0_#000]"
              >
                {qIndex + 1 >= total ? "See results" : "Next question"} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Results Screen ---------- */

function ResultsScreen({
  score,
  total,
  answers,
  onRestart,
}: {
  score: number;
  total: number;
  answers: AnswerRecord[];
  onRestart: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const points = score * 100;

  let rank: string;
  if (pct === 100) rank = "Perfect run — top 1%";
  else if (pct >= 80) rank = `Top ${100 - pct}%`;
  else if (pct >= 50) rank = "Solid effort";
  else rank = "Keep practicing";

  return (
    <div className="min-h-dvh bg-paper font-body text-ink antialiased">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-16">
        <div className="flex items-center justify-between mb-8">
          <span className="inline-flex items-center rounded-full bg-ink/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
            Bravo! Quiz
          </span>
          <span className="font-display font-medium text-sm text-ink/60">
            Final
          </span>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-cream p-6 sm:p-8 ring-1 ring-black/5">
          {/* Score banner */}
          <div className="rounded-xl bg-ink p-6 text-center text-cream">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-cream/55">
              Your score
            </p>
            <p className="mt-1 font-display text-5xl font-semibold text-balance">
              {score} / {total}
            </p>
            <p className="mt-1 font-display text-sm text-cream/75">
              {points} points · {rank}
            </p>
          </div>

          {/* Answer review */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink/50 mt-2 mb-1">
              Answer review
            </p>
            {answers.map((a, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-3 rounded-lg bg-tile p-3"
              >
                <div className="min-w-0">
                  <p className="text-xs text-ink/55">
                    Q{i + 1} · {a.question.category}
                  </p>
                  <p className="font-display text-sm font-semibold">
                    {a.question.options[a.question.correct]}
                  </p>
                  {!a.correct && (
                    <p className="font-body text-xs text-brand mt-0.5">
                      You said {a.question.options[a.selected]}
                    </p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                    a.correct
                      ? "bg-accent/15 text-accent"
                      : "bg-brand/15 text-brand"
                  }`}
                >
                  {a.correct ? "Correct" : "Missed"}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={onRestart}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 font-display text-base font-semibold text-cream shadow-[0_6px_0_0_var(--accent-ink)] transition-transform active:translate-y-[3px] active:shadow-[0_3px_0_0_var(--accent-ink)]"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
