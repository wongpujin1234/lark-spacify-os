// app/welcome/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function WelcomeContent() {
  const searchParams = useSearchParams();

  const name = searchParams.get("name");
  const enName = searchParams.get("en_name");
  const userId = searchParams.get("user_id");
  const openId = searchParams.get("open_id");
  const employeeId = searchParams.get("employee_id");
  const email = searchParams.get("email");
  const avatar = searchParams.get("avatar");

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-slate-50 to-white text-slate-900 antialiased">
      <div className="mx-auto max-w-lg px-4 py-12 sm:py-16">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5">
          <div className="flex flex-col items-center text-center">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg ring-2 ring-slate-200"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-3xl text-slate-500">
                ?
              </div>
            )}
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-lg font-semibold text-indigo-600">
              {name || "User"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Signed in with Lark SSO
            </p>
          </div>

          <dl className="mt-8 space-y-0 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/80">
            <InfoRow label="Display name" value={name} />
            <InfoRow label="English name" value={enName} />
            <InfoRow label="User ID" value={userId} mono />
            <InfoRow label="Open ID" value={openId} mono />
            <InfoRow label="Employee ID" value={employeeId} />
            <InfoRow label="Email" value={email} />
          </dl>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
}) {
  const empty = !value || value.trim() === "";
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-sm font-semibold text-slate-600">{label}</dt>
      <dd
        className={`text-right text-sm text-slate-900 sm:max-w-[65%] sm:truncate ${
          mono ? "font-mono text-xs sm:text-sm" : ""
        } ${empty ? "text-slate-400 italic" : ""}`}
        title={value ?? undefined}
      >
        {empty ? "Not available" : value}
      </dd>
    </div>
  );
}

function WelcomeFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-700">
      <p className="text-base font-medium">Loading…</p>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={<WelcomeFallback />}>
      <WelcomeContent />
    </Suspense>
  );
}
