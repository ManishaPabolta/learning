
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
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-900">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative overflow-hidden">

        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 25, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-green-300/25 blur-3xl"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-200/30 blur-3xl"
          />

          {/* Floating particles */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="absolute right-[15%] top-[20%] h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-400/50"
          />

          <motion.div
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute left-[15%] top-[35%] h-2 w-2 rounded-full bg-green-500 shadow-lg shadow-green-400/50"
          />

          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute right-[35%] bottom-[15%] h-2 w-2 rounded-full bg-lime-500"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* =================================================
                CONTENT
            ================================================= */}
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

              {/* Badge */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.2,
                }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm shadow-emerald-100 backdrop-blur"
              >
                <Sparkles className="h-4 w-4 animate-pulse" />
                Learn. Grow. Achieve.
              </motion.div>

              {/* Heading */}
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Your journey to

                <span className="block bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 bg-clip-text text-transparent">
                  better skills
                </span>

                starts here.
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Explore practical courses, learn at your own pace, complete
                assignments, and build the skills you need for your future.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  to="/courses"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  Explore Courses

                  <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white/80 px-6 py-3.5 font-semibold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <PlayCircle className="h-5 w-5 transition group-hover:scale-110" />

                  Start Learning
                </Link>

              </div>

              {/* Small trust text */}
              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Practical Learning
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Flexible Access
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Skill Focused
                </div>
              </div>
            </motion.div>

            {/* =================================================
                HERO VISUAL
            ================================================= */}
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

              {/* Outer Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute -inset-8 rounded-[3rem] bg-gradient-to-r from-emerald-300/30 via-green-200/20 to-lime-300/30 blur-3xl"
              />

              {/* Floating Card */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-2xl shadow-emerald-200/40 backdrop-blur-xl"
              >

                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-6 shadow-inner">

                  {/* Header */}
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        My Learning
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        Continue Learning
                      </h3>
                    </div>

                    <motion.div
                      whileHover={{
                        rotate: 8,
                        scale: 1.08,
                      }}
                      className="rounded-xl bg-emerald-100 p-3"
                    >
                      <BookOpen className="h-6 w-6 text-emerald-600" />
                    </motion.div>

                  </div>

                  {/* Featured Course */}
                  <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-600 to-green-500 p-5 text-white shadow-lg shadow-emerald-500/20">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs uppercase tracking-wider text-emerald-100">
                          Featured Course
                        </p>

                        <h4 className="mt-2 text-lg font-bold">
                          Full Stack Development
                        </h4>
                      </div>

                      <motion.div
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur"
                      >
                        <PlayCircle className="h-6 w-6" />
                      </motion.div>

                    </div>

                    {/* Progress */}
                    <div className="mt-6">

                      <div className="mb-2 flex justify-between text-xs text-emerald-50">
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
                          className="h-full rounded-full bg-white shadow-sm"
                        />

                      </div>

                    </div>
                  </div>

                  {/* Mini Stats */}
                  <div className="mt-5 grid grid-cols-2 gap-4">

                    <motion.div
                      whileHover={{
                        y: -4,
                      }}
                      className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition"
                    >
                      <p className="text-xs text-slate-500">
                        Completed
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        12
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{
                        y: -4,
                      }}
                      className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm transition"
                    >
                      <p className="text-xs text-slate-500">
                        Assignments
                      </p>

                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        08
                      </p>
                    </motion.div>

                  </div>

                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}
      <section className="border-y border-emerald-100 bg-white/80 backdrop-blur">

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
              whileHover={{
                y: -3,
              }}
              className="group px-4 text-center"
            >

              <p className="text-3xl font-black text-emerald-600 transition group-hover:text-green-500">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {stat.label}
              </p>

            </motion.div>
          ))}

        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}
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

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
            Why choose us
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Everything you need to keep learning
          </h2>

          <p className="mt-4 text-slate-600">
            A simple and powerful learning experience designed around your
            growth.
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
                className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-7 shadow-lg shadow-emerald-100/40 transition duration-300 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-200/50"
              >

                {/* Decorative Glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-100 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                  }}
                  className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100"
                >
                  <Icon className="h-7 w-7" />
                </motion.div>

                <h3 className="relative text-xl font-bold text-slate-900 transition group-hover:text-emerald-700">
                  {feature.title}
                </h3>

                <p className="relative mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-500 group-hover:w-full" />

              </motion.div>
            );
          })}

        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}
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
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 p-10 text-center text-white shadow-2xl shadow-emerald-200/50 sm:p-16"
        >

          {/* Decorative Circles */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white blur-3xl"
          />

          <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-white" />
            </motion.div>

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Ready to start learning?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-emerald-50">
              Discover courses, enroll, complete assignments and track your
              learning journey.
            </p>

            <Link
              to="/courses"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-emerald-700 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              Browse Courses

              <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
            </Link>

          </div>
        </motion.div>
      </section>
    </div>
  );
}

