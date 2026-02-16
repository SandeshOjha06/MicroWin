import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
    Puzzle,
    ArrowRight,
    CheckCircle2,

} from "lucide-react"
import { Button } from "@/components/ui/button"
import { FontSwitcher } from "@/components/FontSwitcher"
import { Logo } from "@/components/Logo"


const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" as const },
    }),
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.08,
            staggerDirection: -1,
        },
    }
}

const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: "easeOut" as const }
    },
    exit: {
        opacity: 0,
        x: 40,
        transition: { duration: 0.6, ease: "easeIn" as const }
    }
}

const steps = [
    "Tell the AI your goal or challenge",
    "Get personalized micro-win suggestions",
    "Complete one small step at a time",
    "Build confidence and momentum daily",
]

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/10 selection:text-primary">
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="flex items-center justify-center transition-all duration-300">
                            <Logo className="h-14 w-auto object-contain" />
                        </div>




                    </Link>
                    <div className="flex items-center gap-3">
                        <FontSwitcher darkMode={false} />
                        <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">

                            <Link to="/login">Sign in</Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative pt-32 pb-16 px-6">
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
                    </motion.div>
                </div>
            </section>



            {/* How it works */}
            <section className="py-16 px-6 border-t border-border/50">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <motion.h2
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight mb-5"
                        >
                            How it works
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-muted-foreground font-medium"
                        >
                            Four simple steps to start making progress.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={{ once: false, amount: 0.3, margin: "50px" }}
                    >
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary shadow-inner">
                                    {i + 1}
                                </div>
                                <span className="text-sm font-semibold text-foreground/80">{step}</span>
                                <div className="ml-auto w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>



            {/* CTA */}
            <section className="py-16 px-6 border-t border-border/50">
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
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                    </motion.div>
                </motion.div>
            </section>

        </div>
    )
}