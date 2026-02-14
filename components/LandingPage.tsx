import React from 'react';
import { Leaf, Zap, BarChart3, Globe, ChevronRight, CheckCircle2, Database } from 'lucide-react';
import GlassCard from './GlassCard';
import dashboardImg from '../assets/dashboard_ui.jpg';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20">
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg className="w-[800px] h-[800px] animate-rotate-slow" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#00F5A0" strokeWidth="0.5" strokeDasharray="4 2" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#00D9FF" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="20" y1="100" x2="180" y2="100" stroke="#00F5A0" strokeWidth="0.2" />
            <line x1="100" y1="20" x2="100" y2="180" stroke="#00F5A0" strokeWidth="0.2" />
            <path d="M60 60 L140 140 M140 60 L60 140" stroke="#00D9FF" strokeWidth="0.2" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-[1200px] mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter leading-[1.1] mb-8" style={{ letterSpacing: '-0.02em', fontWeight: 700, textShadow: '0 2px 20px rgba(0, 255, 200, 0.3)' }}>
            Redefining Sustainable <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-cyberCyan drop-shadow-[0_0_15px_rgba(0,245,160,0.3)]">
              Lending with AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/85 max-w-[680px] mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            An intelligent platform that evaluates financial risk and environmental impact in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={onEnter}
              className="group relative h-14 px-10 rounded-xl bg-gradient-to-r from-electricGreen to-cyberCyan text-navy font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,245,160,0.5)] active:scale-95"
            >
              Get Started
            </button>
            <button
              onClick={onEnter}
              className="h-14 px-10 rounded-xl border border-electricGreen/40 bg-white/5 backdrop-blur-md text-white font-semibold transition-all hover:bg-white/10 hover:border-electricGreen"
            >
              Explore Platform
            </button>
          </div>
        </motion.div>
      </section>

      {/* 2. PROBLEM / VALUE SECTION */}
      <section className="py-32 px-6 bg-navy/40 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <span className="text-xs font-black tracking-widest text-electricGreen uppercase">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Traditional Loan Systems <br /> Ignore Sustainability
            </h2>
            <div className="w-32 h-[1px] bg-gradient-to-r from-electricGreen to-transparent" />
            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
              Most risk models fail to account for environmental transitions. SustainScore bridges the gap between financial stability and ecological responsibility, ensuring your capital drives long-term value.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-emerald/40 to-cyan-900/40 animate-pulse-soft blur-3xl absolute" />
            <div className="relative w-64 h-64 md:w-80 md:h-80 border border-electricGreen/20 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 animate-rotate-slow border border-dashed border-cyberCyan/30 rounded-full" />
              <Globe className="w-32 h-32 text-electricGreen animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW SUSTAINSCORE WORKS */}
      <section className="py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How SustainScore Works</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Our proprietary engine synchronizes ESG telemetry with traditional fiscal metrics.</p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Database,
              title: "Unified Data Ingestion",
              desc: "Seamlessly aggregate revenue streams and real-time carbon telemetry."
            },
            {
              icon: Zap,
              title: "AI Risk Evaluation",
              desc: "Deep-learning models assess default probability alongside ESG transition risks."
            },
            {
              icon: CheckCircle2,
              title: "Precision Decisions",
              desc: "Instant, transparent credit approvals backed by intelligent sustainability scoring."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: "easeOut" }}
            >
              <GlassCard delay={0} className="group hover:-translate-y-2 cursor-default h-full">
                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-electricGreen/10 transition-colors">
                  <item.icon className="w-8 h-8 text-electricGreen" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. PLATFORM PREVIEW */}
      <section className="py-32 px-6 bg-darkGreen/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[1200px] mx-auto text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-6">Built for Modern Financial Institutions</h2>
          <div className="relative mt-12 mx-auto max-w-[1000px] group cursor-pointer" onClick={onEnter}>
            <div className="rounded-2xl border border-white/10 bg-navy/80 overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.01] group-hover:border-electricGreen/30">
              <img
                src={dashboardImg}
                alt="SustainScore Dashboard Preview"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="absolute -inset-4 bg-electricGreen/5 blur-3xl pointer-events-none -z-10" />
          </div>
        </motion.div>
      </section>

      {/* 5. FEATURE HIGHLIGHTS */}
      <section className="py-32 px-6 space-y-40">
        {[
          {
            label: "AI Risk Modeling",
            title: "Real-Time Predictive Intelligence",
            desc: "Leverage global datasets to predict sustainability impact before capital is deployed.",
            bullets: ["Dynamic ESG weighing", "Sector-specific risk patterns", "Regional benchmark syncing"],
            imgSide: 'right'
          },
          {
            label: "Enterprise Dashboard",
            title: "Transparent Portfolio Management",
            desc: "Monitor your entire green asset portfolio with granular data visualization.",
            bullets: ["Drill-down analytics", "Automated compliance reporting", "Investor-ready exports"],
            imgSide: 'left'
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`max-w-[1200px] mx-auto flex flex-col ${feature.imgSide === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20`}
          >
            <div className="flex-1 space-y-6">
              <span className="text-xs font-black tracking-widest text-cyberCyan uppercase">{feature.label}</span>
              <h2 className="text-4xl font-bold text-white">{feature.title}</h2>
              <p className="text-lg text-slate-400">{feature.desc}</p>
              <ul className="space-y-4 pt-4">
                {feature.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-electricGreen" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyberCyan/10 to-transparent" />
              <BarChart3 className="w-32 h-32 text-cyberCyan group-hover:scale-110 transition-transform duration-500" />
            </div>
          </motion.div>
        ))}
      </section>

      {/* 6. TRUST SECTION */}
      <section className="py-32 px-6 text-center border-t border-white/5">
        <h2 className="text-2xl font-bold text-white mb-16 opacity-60">Trusted by Forward-Thinking Institutions</h2>
        <div className="max-w-[1000px] mx-auto flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
          <div className="text-3xl font-black italic tracking-tighter">FIN-TECH</div>
          <div className="text-3xl font-black italic tracking-tighter">GLOBAL BANK</div>
          <div className="text-3xl font-black italic tracking-tighter">ECO-FUND</div>
          <div className="text-3xl font-black italic tracking-tighter">VENTURE-X</div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[1200px] mx-auto rounded-3xl bg-gradient-to-br from-emerald/40 to-navy p-12 md:p-24 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Transform the Future of Sustainable Finance</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-12">Start using AI-driven green credit intelligence today.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={onEnter}
                className="h-14 px-12 rounded-xl bg-electricGreen text-navy font-bold text-lg hover:shadow-[0_0_30px_rgba(0,245,160,0.5)] transition-all transform hover:scale-105"
              >
                Launch Platform
              </button>
              <button
                onClick={onEnter}
                className="text-white font-semibold flex items-center gap-2 hover:text-electricGreen transition-colors group"
              >
                Schedule a Demo <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-20 px-6 border-t border-white/10 mt-20">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li onClick={onEnter} className="hover:text-electricGreen cursor-pointer transition-colors">Risk Engine</li>
              <li onClick={onEnter} className="hover:text-electricGreen cursor-pointer transition-colors">ESG Metrics</li>
              <li onClick={onEnter} className="hover:text-electricGreen cursor-pointer transition-colors">Integrations</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-electricGreen cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Press</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Documentation</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Research</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">API Keys</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Privacy</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Terms</li>
              <li className="hover:text-electricGreen cursor-pointer transition-colors">Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
          <span>&copy; 2025 SUSTAINSCORE INTELLIGENCE SYSTEMS</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-electricGreen cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-electricGreen cursor-pointer transition-colors">LinkedIn</span>
            <span className="hover:text-electricGreen cursor-pointer transition-colors">GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;