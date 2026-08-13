import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  Copy,
  Database,
  FileSpreadsheet,
  Github,
  Laptop,
  Package,
  Sun,
  Waves,
  Workflow,
} from "lucide-react";

const GITHUB_URL = "https://github.com";
const PYPI_URL = "https://pypi.org";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "testbricks — Run Databricks workflows on your laptop" },
      {
        name: "description",
        content:
          "testbricks is a Python library that runs Databricks workflows locally. SparkMock routes delta reads and writes to CSV, dbutils is a drop-in mock, and LocalWorkflowRunner executes notebooks in dependency order.",
      },
      {
        property: "og:title",
        content: "testbricks — Run Databricks workflows on your laptop",
      },
      {
        property: "og:description",
        content:
          "Local-first Databricks development: a SparkMock backed by CSV, a drop-in dbutils replacement, and a workflow runner that reads your workflow JSON.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "testbricks — Run Databricks workflows on your laptop",
      },
      {
        name: "twitter:description",
        content:
          "Local-first Databricks development with SparkMock, a dbutils mock, and a JSON workflow runner.",
      },
    ],
  }),
  component: Index,
});

/* ---------------------------------- data --------------------------------- */

type Snippet = {
  id: string;
  label: string;
  blurb: string;
  code: string;
};

const SNIPPETS: Snippet[] = [
  {
    id: "spark",
    label: "SparkMock",
    blurb:
      "Point it at a folder. Delta table reads and writes land as plain CSV files you can open anywhere.",
    code: `from testbricks import SparkMock

spark = SparkMock("./data")

df = spark.read.table("sales.orders")
df.write.saveAsTable("sales.orders_clean")`,
  },
  {
    id: "dbutils",
    label: "dbutils",
    blurb:
      "A drop-in replacement for the Databricks dbutils object. Widgets, fs and secrets behave the way your notebooks expect.",
    code: `from testbricks.dbutils import dbutils

dbutils.widgets.text("filter_country", "ALL")
country = dbutils.widgets.get("filter_country")

dbutils.fs.ls("./data")`,
  },
  {
    id: "runner",
    label: "LocalWorkflowRunner",
    blurb:
      "Feed it your exported workflow JSON. It resolves the task graph and runs every notebook in dependency order.",
    code: `from testbricks import LocalWorkflowRunner

runner = LocalWorkflowRunner(
    source_dir="./notebooks",
    workflow_json_path="./workflow.json",
    base_path="./data",
)

runner.run_workflow(extra_globals={"spark": spark})`,
  },
];

const FEATURES = [
  {
    icon: Database,
    title: "SparkProxy",
    body: "A SparkSession stand-in that speaks the same API. Every delta table read and write is routed to CSV files on disk — no cluster, no metastore, no waiting.",
  },
  {
    icon: FileSpreadsheet,
    title: "Drop-in dbutils",
    body: "Widgets, filesystem helpers and secrets, all mocked. Import it instead of the real thing and your notebook runs unchanged.",
  },
  {
    icon: Workflow,
    title: "Workflow runner",
    body: "Parses a Databricks workflow JSON, builds the task dependency graph, and executes notebooks in the right order with shared globals.",
  },
  {
    icon: Laptop,
    title: "Zero cluster time",
    body: "Iterate in seconds on your laptop. Debug with breakpoints, run it in CI, and keep your compute bill for the things that matter.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Swap in the mocks",
    body: "Replace the Spark session and dbutils object with the testbricks equivalents at the top of your notebook.",
  },
  {
    n: "02",
    title: "Drop your data in a folder",
    body: "CSV files in a base directory stand in for delta tables. Read, write and inspect them with any tool you like.",
  },
  {
    n: "03",
    title: "Run the whole workflow",
    body: "Hand the runner your workflow JSON and it walks the dependency graph, notebook by notebook, right on your machine.",
  },
];

/* -------------------------------- helpers -------------------------------- */

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(value: string, key: string) {
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    });
  }

  return { copied, copy };
}

const PY_KEYWORDS = new Set([
  "from",
  "import",
  "def",
  "return",
  "class",
  "with",
  "as",
  "for",
  "in",
  "if",
  "else",
]);

function highlight(code: string) {
  // Lightweight token pass: keywords, strings, comments. Keeps the bundle tiny.
  const parts = code.split(/("(?:[^"\\]|\\.)*"|#[^\n]*|\b[A-Za-z_][A-Za-z0-9_]*\b)/g);

  return parts.map((part, i) => {
    if (!part) return null;
    if (part.startsWith('"')) {
      return (
        <span key={i} className="text-primary">
          {part}
        </span>
      );
    }
    if (part.startsWith("#")) {
      return (
        <span key={i} className="text-muted-foreground italic">
          {part}
        </span>
      );
    }
    if (PY_KEYWORDS.has(part)) {
      return (
        <span key={i} className="font-semibold text-accent">
          {part}
        </span>
      );
    }
    if (/^[A-Z]/.test(part)) {
      return (
        <span key={i} className="font-semibold text-foreground">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

/* -------------------------------- sections ------------------------------- */

function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Waves className="size-4" aria-hidden />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            testbricks
          </span>
        </a>

        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="#features"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Features
          </a>
          <a
            href="#code"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Examples
          </a>
          <a
            href={PYPI_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Package className="size-4" aria-hidden />
            PyPI
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Github className="size-4" aria-hidden />
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  const { copied, copy } = useCopy();
  const install = "pip install testbricks";

  return (
    <section id="top" className="sand-grain relative overflow-hidden">
      <div className="mx-auto max-w-5xl px-5 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          <Sun className="size-3.5 text-accent" aria-hidden />
          Local-first Databricks
        </span>

        <h1 className="font-display mt-6 max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl">
          Run Databricks workflows
          <span className="text-primary"> on your laptop</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          testbricks is a Python library with genuinely useful mocks — a Spark
          proxy that reads and writes delta tables as CSV, a drop-in{" "}
          <code className="font-mono text-[0.92em] text-foreground">dbutils</code>{" "}
          replacement, and a runner that executes a whole workflow JSON in
          dependency order. No cluster. No waiting around.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={() => copy(install, "install")}
            className="group inline-flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 font-mono text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Copy install command"
          >
            <span className="text-muted-foreground select-none">$</span>
            <span className="font-medium">{install}</span>
            {copied === "install" ? (
              <Check className="size-4 text-primary" aria-hidden />
            ) : (
              <Copy
                className="size-4 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden
              />
            )}
          </button>

          <a
            href="#code"
            className="inline-flex items-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
          >
            See it in action
          </a>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Python 3.9+ · works in notebooks, scripts and CI
        </p>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="border-t border-border/60">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Mocks that actually hold up
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Everything your notebook reaches for in a Databricks runtime, quietly
          reimplemented for a machine that fits on your desk.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-display mt-5 text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CodeSection() {
  const [active, setActive] = useState(SNIPPETS[0].id);
  const { copied, copy } = useCopy();
  const snippet = SNIPPETS.find((s) => s.id === active) ?? SNIPPETS[0];

  return (
    <section id="code" className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Three imports, and you're local
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          The same notebook code you'd ship to a job cluster, running on your
          machine.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div
            role="tablist"
            aria-label="Code examples"
            className="flex flex-wrap gap-1 border-b border-border bg-secondary/50 p-2"
          >
            {SNIPPETS.map((s) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={s.id === active}
                onClick={() => setActive(s.id)}
                className={`rounded-lg px-3.5 py-2 font-mono text-sm font-medium transition-all ${
                  s.id === active
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {snippet.blurb}
            </p>
            <button
              onClick={() => copy(snippet.code, snippet.id)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label={`Copy ${snippet.label} example`}
            >
              {copied === snippet.id ? (
                <>
                  <Check className="size-3.5 text-primary" aria-hidden />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden />
                  Copy
                </>
              )}
            </button>
          </div>

          <pre className="overflow-x-auto px-5 py-6 font-mono text-[0.84rem] leading-relaxed sm:text-sm">
            <code>{highlight(snippet.code)}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-t border-border/60">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>

        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n}>
              <span className="font-display text-4xl font-extrabold text-accent">
                {s.n}
              </span>
              <h3 className="font-display mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="sand-grain mt-16 rounded-2xl border border-border p-8 text-center sm:p-12">
          <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Give your cluster the afternoon off
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Install testbricks and run your next workflow without leaving your
            editor.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={PYPI_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
            >
              <Package className="size-4" aria-hidden />
              Get it on PyPI
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <Github className="size-4" aria-hidden />
              Read the source
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Waves className="size-3.5" aria-hidden />
          </span>
          <span className="font-display font-bold">testbricks</span>
          <span className="text-sm text-muted-foreground">
            — Databricks, locally.
          </span>
        </div>

        <div className="flex items-center gap-5 text-sm text-muted-foreground">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={PYPI_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            PyPI
          </a>
          <span>Built with a chill vibe.</span>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Nav />
      <main>
        <Hero />
        <Features />
        <CodeSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
