import { useState } from "react";
import Icon from "@/components/ui/icon";

const TOPICS = [
  {
    id: "arithmetic",
    icon: "Hash",
    title: "Арифметика",
    color: "gold",
    formulas: [
      { name: "Среднее арифметическое", expr: "x̄ = (x₁ + x₂ + … + xₙ) / n" },
      { name: "Степень числа", expr: "aⁿ = a × a × … × a (n раз)" },
      { name: "Корень", expr: "ⁿ√a = a^(1/n)" },
      { name: "Процент от числа", expr: "P% от N = (P × N) / 100" },
    ],
  },
  {
    id: "algebra",
    icon: "Variable",
    title: "Алгебра",
    color: "blue",
    formulas: [
      { name: "Квадратный трёхчлен", expr: "ax² + bx + c = a(x−x₁)(x−x₂)" },
      { name: "Дискриминант", expr: "D = b² − 4ac" },
      { name: "Формула корней", expr: "x₁,₂ = (−b ± √D) / 2a" },
      { name: "Куб суммы", expr: "(a+b)³ = a³ + 3a²b + 3ab² + b³" },
      { name: "Геометрическая прогрессия", expr: "Sₙ = a₁(qⁿ−1) / (q−1)" },
      { name: "Арифметическая прогрессия", expr: "Sₙ = n(a₁ + aₙ) / 2" },
    ],
  },
  {
    id: "geometry",
    icon: "Triangle",
    title: "Геометрия",
    color: "green",
    formulas: [
      { name: "Площадь треугольника", expr: "S = (1/2) · a · h" },
      { name: "Площадь прямоугольника", expr: "S = a · b" },
      { name: "Площадь трапеции", expr: "S = (a + b) · h / 2" },
      { name: "Площадь круга", expr: "S = π · r²" },
      { name: "Длина окружности", expr: "C = 2πr" },
      { name: "Объём куба", expr: "V = a³" },
      { name: "Объём цилиндра", expr: "V = π · r² · h" },
      { name: "Объём конуса", expr: "V = (1/3) · π · r² · h" },
      { name: "Объём шара", expr: "V = (4/3) · π · r³" },
    ],
  },
  {
    id: "trig",
    icon: "Waves",
    title: "Тригонометрия",
    color: "purple",
    formulas: [
      { name: "Основное тождество", expr: "sin²x + cos²x = 1" },
      { name: "Тангенс", expr: "tg x = sin x / cos x" },
      { name: "Котангенс", expr: "ctg x = cos x / sin x" },
      { name: "sin двойного угла", expr: "sin 2x = 2 sin x · cos x" },
      { name: "cos двойного угла", expr: "cos 2x = cos²x − sin²x" },
      { name: "Теорема синусов", expr: "a/sin A = b/sin B = c/sin C = 2R" },
      { name: "Теорема косинусов", expr: "c² = a² + b² − 2ab·cos C" },
    ],
  },
  {
    id: "physics",
    icon: "Zap",
    title: "Физика",
    color: "orange",
    formulas: [
      { name: "Скорость", expr: "v = s / t" },
      { name: "Ускорение", expr: "a = Δv / Δt" },
      { name: "Сила", expr: "F = m · a" },
      { name: "Работа", expr: "A = F · s · cos α" },
      { name: "Мощность", expr: "P = A / t = F · v" },
      { name: "Давление", expr: "p = F / S" },
      { name: "Закон Ома", expr: "I = U / R" },
      { name: "Мощность тока", expr: "P = U · I = I²R" },
    ],
  },
  {
    id: "calculus",
    icon: "TrendingUp",
    title: "Матанализ",
    color: "teal",
    formulas: [
      { name: "Производная суммы", expr: "(f + g)' = f' + g'" },
      { name: "Производная произведения", expr: "(fg)' = f'g + fg'" },
      { name: "Производная частного", expr: "(f/g)' = (f'g − fg') / g²" },
      { name: "Производная сложной", expr: "(f(g(x)))' = f'(g) · g'" },
      { name: "Интеграл суммы", expr: "∫(f+g)dx = ∫f dx + ∫g dx" },
      { name: "Интегрирование по частям", expr: "∫u dv = uv − ∫v du" },
    ],
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  gold: { border: "border-yellow-500/30", bg: "bg-yellow-500/8", text: "text-yellow-400", badge: "bg-yellow-500/12 text-yellow-400 border-yellow-500/25" },
  blue: { border: "border-blue-500/30", bg: "bg-blue-500/8", text: "text-blue-400", badge: "bg-blue-500/12 text-blue-400 border-blue-500/25" },
  green: { border: "border-green-500/30", bg: "bg-green-500/8", text: "text-green-400", badge: "bg-green-500/12 text-green-400 border-green-500/25" },
  purple: { border: "border-purple-500/30", bg: "bg-purple-500/8", text: "text-purple-400", badge: "bg-purple-500/12 text-purple-400 border-purple-500/25" },
  orange: { border: "border-orange-500/30", bg: "bg-orange-500/8", text: "text-orange-400", badge: "bg-orange-500/12 text-orange-400 border-orange-500/25" },
  teal: { border: "border-teal-500/30", bg: "bg-teal-500/8", text: "text-teal-400", badge: "bg-teal-500/12 text-teal-400 border-teal-500/25" },
};

export default function FormulasPage() {
  const [activeTopics, setActiveTopics] = useState<string[]>(["algebra"]);
  const [search, setSearch] = useState("");

  const toggleTopic = (id: string) => {
    setActiveTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const visibleTopics = TOPICS.filter(t =>
    activeTopics.length === 0 || activeTopics.includes(t.id)
  ).filter(t => {
    if (!search) return true;
    return t.formulas.some(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.expr.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getFilteredFormulas = (topic: typeof TOPICS[0]) => {
    if (!search) return topic.formulas;
    return topic.formulas.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.expr.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen py-6 md:py-12 px-3 md:px-4">
      <div className="max-w-5xl mx-auto animate-fade-in-up">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-4xl font-serif font-bold gold-text mb-1 md:mb-2">Формулы</h1>
          <p className="text-muted-foreground font-sans text-xs md:text-sm">Полная база математических и физических формул</p>
        </div>

        {/* Search */}
        <div className="relative mb-4 md:mb-6">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Найти формулу..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-sans text-sm focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Topic toggles */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-10">
          {TOPICS.map(t => {
            const c = COLOR_MAP[t.color];
            const active = activeTopics.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTopic(t.id)}
                className={`flex items-center gap-1 md:gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border text-xs md:text-sm font-sans font-medium transition-all hover:scale-105 min-h-[36px] ${active ? `${c.bg} ${c.border} ${c.text}` : "bg-card border-border text-muted-foreground hover:text-foreground"}`}
              >
                <Icon name={t.icon} size={12} />
                {t.title}
              </button>
            );
          })}
          <button
            onClick={() => setActiveTopics(TOPICS.map(t => t.id))}
            className="px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-dashed border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all min-h-[36px]"
          >
            Все
          </button>
        </div>

        {/* Formula grid */}
        <div className="space-y-6 md:space-y-8">
          {visibleTopics.map((topic, ti) => {
            const c = COLOR_MAP[topic.color];
            const formulas = getFilteredFormulas(topic);
            if (formulas.length === 0) return null;
            return (
              <div
                key={topic.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${ti * 0.08}s` }}
              >
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                  <div className={`p-1.5 md:p-2 rounded-lg border ${c.border} ${c.bg}`}>
                    <Icon name={topic.icon} size={16} className={c.text} />
                  </div>
                  <h2 className="font-serif font-bold text-lg md:text-xl text-foreground">{topic.title}</h2>
                  <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full border ${c.badge}`}>
                    {formulas.length}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2 md:gap-3">
                  {formulas.map((f, fi) => (
                    <div
                      key={f.name}
                      className={`p-3 md:p-4 rounded-xl border ${c.border} ${c.bg} group hover:scale-[1.01] transition-all cursor-default animate-fade-in-up`}
                      style={{ animationDelay: `${ti * 0.08 + fi * 0.04}s` }}
                    >
                      <div className="text-xs text-muted-foreground font-sans mb-1.5 group-hover:text-foreground/70 transition-colors">
                        {f.name}
                      </div>
                      <div className={`font-mono text-xs md:text-sm leading-relaxed ${c.text} tracking-wide break-all`}>
                        {f.expr}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {visibleTopics.length === 0 && (
          <div className="text-center py-12 md:py-16 text-muted-foreground">
            <div className="text-4xl font-serif mb-3">∅</div>
            <p className="font-sans text-sm">Ничего не найдено</p>
          </div>
        )}

        {/* Big formula showcase */}
        <div className="mt-8 md:mt-12 p-5 md:p-8 rounded-2xl border border-primary/20 bg-primary/5 text-center relative overflow-hidden">
          <div className="absolute top-4 left-6 text-5xl md:text-7xl font-serif opacity-5 text-primary">∫</div>
          <div className="absolute bottom-2 right-6 text-4xl md:text-6xl font-serif opacity-5 text-primary">∑</div>
          <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mb-3">Формула Эйлера</div>
          <div className="text-2xl md:text-4xl font-mono gold-text mb-3 tracking-wide">e^(iπ) + 1 = 0</div>
          <p className="text-xs md:text-sm text-muted-foreground font-sans max-w-sm mx-auto">
            Одна из красивейших формул математики, связывающая пять фундаментальных констант
          </p>
        </div>
      </div>
    </div>
  );
}