import { useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const MATH_SYMBOLS = ["∫", "∑", "∂", "√", "π", "∞", "Δ", "∇", "α", "β", "γ", "θ", "λ", "μ", "σ", "φ", "ψ", "Ω", "≈", "≠", "≤", "≥", "×", "÷"];

interface FloatingSymbol {
  id: number;
  symbol: string;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

function useFloatingSymbols(count = 18): FloatingSymbol[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
    x: Math.random() * 100,
    size: 16 + Math.random() * 28,
    duration: 18 + Math.random() * 20,
    delay: Math.random() * 15,
  }));
}

const FEATURES = [
  {
    icon: "Calculator",
    title: "Научный калькулятор",
    desc: "Тригонометрия, логарифмы, степени, корни и комплексные операции в одном месте",
  },
  {
    icon: "Ruler",
    title: "Единицы измерения",
    desc: "Мгновенный перевод: метры, сантиметры, дюймы, футы, миллиметры и другие единицы",
  },
  {
    icon: "BookOpen",
    title: "Справочник формул",
    desc: "Математика, физика, геометрия — все ключевые формулы под рукой с пояснениями",
  },
  {
    icon: "TrendingUp",
    title: "Диаграммы",
    desc: "Визуализация вычислений и зависимостей через интерактивные графики",
  },
];

const STATS = [
  { value: "200+", label: "Формул в базе" },
  { value: "15+", label: "Единиц измерения" },
  { value: "8", label: "Разделов математики" },
  { value: "∞", label: "Точность вычислений" },
];

export default function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const symbols = useFloatingSymbols(20);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating symbols background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {symbols.map((s) => (
          <span
            key={s.id}
            className="absolute font-serif select-none"
            style={{
              left: `${s.x}%`,
              bottom: "-5%",
              fontSize: `${s.size}px`,
              color: "hsl(43, 74%, 66%)",
              animation: `float-up ${s.duration}s ${s.delay}s linear infinite`,
              opacity: 0,
            }}
          >
            {s.symbol}
          </span>
        ))}
      </div>

      {/* Hero */}
      <section className="relative pt-20 md:pt-28 pb-12 md:pb-20 px-4 md:px-6 text-center math-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/0 to-background pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs md:text-sm font-sans mb-4 md:mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="font-mono text-xs tracking-widest opacity-70">v1.0</span>
            <span className="w-px h-3 bg-primary/40" />
            Научный инструмент нового поколения
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-black leading-tight mb-4 md:mb-6 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="gold-text">Мат</span>
            <span className="text-foreground">Калк</span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed mb-7 md:mb-10 animate-fade-in-up"
            style={{ animationDelay: "0.35s" }}
          >
            Профессиональный научный калькулятор с поддержкой единиц измерения,
            обширным справочником формул и визуализацией данных
          </p>

          <div
            className="flex flex-wrap gap-4 justify-center animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => onNavigate("calc")}
              className="px-5 py-3 md:px-8 md:py-3.5 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm md:text-base hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 animate-pulse-glow min-h-[44px]"
            >
              Открыть калькулятор
            </button>
            <button
              onClick={() => onNavigate("formulas")}
              className="px-5 py-3 md:px-8 md:py-3.5 rounded-lg border border-border bg-card text-foreground font-sans font-medium text-sm md:text-base hover:border-primary/50 hover:bg-secondary transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            >
              Справочник формул
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 md:py-12 px-4 md:px-6 border-y border-border/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="text-center animate-fade-in-up"
              style={{ animationDelay: `${0.6 + i * 0.1}s` }}
            >
              <div className="text-2xl md:text-3xl font-mono font-bold gold-text mb-1">{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground font-sans">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Возможности
          </h2>
          <p className="text-muted-foreground text-center mb-8 md:mb-12 font-sans text-sm md:text-base animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Всё необходимое для научных вычислений
          </p>

          <div className="grid sm:grid-cols-2 gap-3 md:gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group p-4 md:p-6 rounded-xl border border-border/60 bg-card hover:border-primary/40 hover:bg-secondary/30 transition-all duration-300 cursor-default animate-fade-in-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="p-2 md:p-2.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors flex-shrink-0">
                    <Icon name={f.icon} size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-foreground mb-1 text-sm md:text-base">{f.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground font-sans leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-16 px-4 md:px-6 text-center">
        <div className="max-w-2xl mx-auto p-6 md:p-10 rounded-2xl border border-primary/20 bg-primary/5 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 text-7xl md:text-9xl font-serif opacity-5 text-primary select-none">∫</div>
          <div className="absolute -bottom-6 -left-6 text-6xl md:text-8xl font-serif opacity-5 text-primary select-none">Σ</div>
          <h2 className="text-xl md:text-3xl font-serif font-bold mb-3">Готовы к вычислениям?</h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base mb-5 md:mb-7">Начните работу с профессиональным инструментом прямо сейчас</p>
          <button
            onClick={() => onNavigate("calc")}
            className="px-6 py-3 md:px-8 md:py-3.5 rounded-lg bg-primary text-primary-foreground font-sans font-semibold text-sm md:text-base hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
          >
            Начать вычисление
          </button>
        </div>
      </section>
    </div>
  );
}