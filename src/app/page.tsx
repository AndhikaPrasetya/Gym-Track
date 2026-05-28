import Link from "next/link"
import { Dumbbell, TrendingUp, BookOpen, Trophy } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-orange-500" />
          <span className="text-xl font-bold text-white">GymTrack</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link href="/auth/register" className="px-4 py-2 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium">
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="flex flex-col items-center text-center px-6 pt-24 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
            <span>1,000+ exercises powered by ExerciseDB</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white max-w-3xl leading-tight mb-6">
            Track your gym progress like a <span className="text-orange-500">pro</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mb-10">
            Log workouts, monitor personal records, visualize your progress, and browse thousands of exercises — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-lg font-semibold transition-colors">
              Start for free
            </Link>
            <Link href="/auth/login" className="px-8 py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-xl text-lg font-semibold transition-colors">
              Log in
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Dumbbell className="w-8 h-8 text-orange-500" />,
              title: "Log Workouts",
              desc: "Record every set, rep, and weight with an intuitive workout logger.",
            },
            {
              icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
              title: "Track Progress",
              desc: "Visualize strength gains and body measurements over time with charts.",
            },
            {
              icon: <BookOpen className="w-8 h-8 text-green-500" />,
              title: "Exercise Library",
              desc: "Browse 1,000+ exercises with GIFs, instructions, and muscle targets.",
            },
            {
              icon: <Trophy className="w-8 h-8 text-yellow-500" />,
              title: "Personal Records",
              desc: "Automatically track your all-time best lifts per exercise.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-zinc-600 text-sm">
        GymTrack &copy; {new Date().getFullYear()} — Built with Next.js &amp; Supabase
      </footer>
    </div>
  )
}
