import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
    Sparkles,
    Target,
    Zap,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Brain,
    Puzzle,
    BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" as const },
    }),
}

const features = [
    {
        icon: <Target className="w-5 h-5" />,
        title: "Break Down Goals",
        desc: "Transform overwhelming tasks into small, achievable micro-wins that build momentum.",
    },
    {
        icon: <Brain className="w-5 h-5" />,
        title: "Personalized Support",
        desc: "Tailored experience for neurodivergent learners with autism and dyslexia support.",
    },
    {
        icon: <Zap className="w-5 h-5" />,
        title: "AI-Powered",
        desc: "Intelligent assistant that understands your pace and adapts to your learning style.",
    },
    {
        icon: <TrendingUp className="w-5 h-5" />,
        title: "Track Progress",
        desc: "Visualize your journey and celebrate every win, no matter how small.",
    },
]

const steps = [
    "Tell the AI your goal or challenge",
    "Get personalized micro-win suggestions",
    "Complete one small step at a time",
    "Build confidence and momentum daily",
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/10 selection:text-primary">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">μ-Wins</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                            <Link to="/login">Sign in</Link>
                        </Button>
                        <Button asChild className="rounded-lg shadow-sm">
                            <Link to="/signup">Get started</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-6">
                {/* Soft, muted background glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-3xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/30 text-xs font-medium text-muted-foreground mb-10 transition-colors hover:bg-muted/50"
                    >
                        <Puzzle className="w-3.5 h-3.5" />
                        Built for neurodivergent learners
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-8"
                    >
                        Big goals,
                        <br />
                        <span className="text-muted-foreground/60 font-medium">micro wins.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-medium"
                    >
                        An AI assistant designed for kids with autism and dyslexia. Break
                        overwhelming goals into small, achievable steps — one micro-win at
                        a time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="rounded-xl px-10 text-sm font-semibold shadow-lg shadow-primary/10"
                        >
                            <Link to="/signup">
                                Start for free
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-xl px-8 border-border hover:bg-muted/30"
                        >
                            <Link to="/login">I already have an account</Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 px-6 border-t border-border/50 bg-muted/10">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-20"
                    >
                        <motion.h2
                            custom={0}
                            variants={fadeUp}
                            className="text-3xl md:text-4xl font-bold tracking-tight mb-5"
                        >
                            Designed to help, not overwhelm
                        </motion.h2>
                        <motion.p
                            custom={1}
                            variants={fadeUp}
                            className="text-muted-foreground max-w-lg mx-auto font-medium"
                        >
                            Every feature is built with neurodivergent kids in mind —
                            simple, clear, and encouraging.
                        </motion.p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                custom={i + 2}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeUp}
                                className="p-8 rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 group"
                            >
                                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                    {f.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 px-6 border-t border-border/50">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-20"
                    >
                        <motion.h2
                            custom={0}
                            variants={fadeUp}
                            className="text-3xl md:text-4xl font-bold tracking-tight mb-5"
                        >
                            How it works
                        </motion.h2>
                        <motion.p custom={1} variants={fadeUp} className="text-muted-foreground font-medium">
                            Four simple steps to start making progress.
                        </motion.p>
                    </motion.div>

                    <div className="space-y-5">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                custom={i + 2}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                className="flex items-center gap-5 p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-bold text-primary shadow-inner">
                                    {i + 1}
                                </div>
                                <span className="text-sm font-semibold text-foreground/80">{step}</span>
                                <div className="ml-auto w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who it's for */}
            <section className="py-24 px-6 border-t border-border/50 bg-secondary/20">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-20"
                    >
                        <motion.h2
                            custom={0}
                            variants={fadeUp}
                            className="text-3xl md:text-4xl font-bold tracking-tight mb-5"
                        >
                            Built for every learner
                        </motion.h2>
                        <motion.p custom={1} variants={fadeUp} className="text-muted-foreground max-w-lg mx-auto font-medium">
                            Personalized support for different learning needs.
                        </motion.p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <motion.div
                            custom={2}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6 text-accent-foreground">
                                <Puzzle className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">Autism Support</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Clear structure, predictable patterns, and step-by-step
                                guidance tailored for autistic learners.
                            </p>
                        </motion.div>

                        <motion.div
                            custom={3}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeUp}
                            className="p-8 rounded-2xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-500"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-3">Dyslexia Support</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                Simple language, visual cues, and manageable chunks designed
                                to reduce cognitive overload.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 border-t border-border/50">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <motion.h2
                        custom={0}
                        variants={fadeUp}
                        className="text-3xl md:text-4xl font-bold tracking-tight mb-6"
                    >
                        Ready to start winning?
                    </motion.h2>
                    <motion.p
                        custom={1}
                        variants={fadeUp}
                        className="text-lg text-muted-foreground mb-12 font-medium"
                    >
                        Join μ-Wins today and turn big goals into daily progress.
                    </motion.p>
                    <motion.div custom={2} variants={fadeUp}>
                        <Button
                            asChild
                            size="lg"
                            className="rounded-2xl px-12 py-7 text-base font-bold shadow-xl shadow-primary/20"
                        >
                            <Link to="/signup">
                                Get started — it's free
                                <ArrowRight className="w-5 h-5 ml-2.5" />
                            </Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border/40 py-12 px-6 bg-muted/5">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm font-bold tracking-tight">μ-Wins</span>
                    </div>
                    <p className="text-xs text-muted-foreground/60 font-medium">
                        &copy; {new Date().getFullYear()} μ-Wins. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
