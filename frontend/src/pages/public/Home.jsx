import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  PlayCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Quality Courses",
    description:
      "Learn from carefully structured courses designed for practical learning.",
  },
  {
    icon: Users,
    title: "Learn Together",
    description:
      "Join a growing learning community and stay connected with your journey.",
  },
  {
    icon: Award,
    title: "Build Your Skills",
    description:
      "Develop real-world skills that help you grow academically and professionally.",
  },
];

const stats = [
  { value: "100+", label: "Learning Resources" },
  { value: "50+", label: "Expert Courses" },
  { value: "1K+", label: "Active Learners" },
  { value: "24/7", label: "Learning Access" },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-200/50 blur-3xl" />

          <div className="absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-green-100/70 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-teal-100/50 blur-3xl" />

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute right-[15%] top-[20%] h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-300"
          />

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-[15%] top-[35%] h-2 w-2 rounded-full bg-green-500"
          />

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute left-[48%] top-[18%] h-2 w-2 rounded-full bg-emerald-500"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* CONTENT */}
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                Learn. Grow. Achieve.
              </div>

              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                Your journey to

                <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  better skills
                </span>

                starts here.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Explore practical courses, learn at your own pace,
                complete assignments, and build the skills you need
                for your future.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200"
                >
                  Explore Courses

                  <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <PlayCircle className="h-5 w-5" />
                  Start Learning
                </Link>
              </div>
            </motion.div>

            {/* HERO VISUAL */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
              }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-emerald-200/60 via-green-100/50 to-teal-100/60 blur-3xl" />

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="relative rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-2xl shadow-emerald-100/60 backdrop-blur-xl"
              >
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        My Learning
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        Continue Learning
                      </h3>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3">
                      <BookOpen className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-500 p-5 text-white shadow-lg shadow-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-emerald-100">
                          Featured Course
                        </p>

                        <h4 className="mt-2 text-lg font-bold">
                          Full Stack Development
                        </h4>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                        <PlayCircle className="h-6 w-6" />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex justify-between text-xs text-emerald-100">
                        <span>Progress</span>
                        <span>72%</span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-white/20">
                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: "72%",
                          }}
                          transition={{
                            duration: 1.2,
                            delay: 0.5,
                          }}
                          className="h-full rounded-full bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">
                        Completed
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        12
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <p className="text-xs text-slate-500">
                        Assignments
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        08
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-emerald-100 bg-emerald-50/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-emerald-100 px-6 py-10 md:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                delay: index * 0.1,
              }}
              className="px-4 text-center"
            >
              <p className="text-3xl font-black text-emerald-700">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Why choose us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything you need to keep learning
          </h2>

          <p className="mt-4 text-slate-500">
            A simple and powerful learning experience designed
            around your growth.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                }}
                className="group relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-7 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/50"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-100/60 blur-2xl transition duration-500 group-hover:bg-emerald-200/70" />

                <div className="relative">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-100">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 group-hover:w-full" />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 p-10 text-center shadow-lg shadow-emerald-100/40 sm:p-16"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-green-200/50 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">
              Ready to start learning?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Discover courses, enroll, complete assignments and
              track your learning journey.
            </p>

            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-200"
            >
              Browse Courses

              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}