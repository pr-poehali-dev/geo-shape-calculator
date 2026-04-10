import { useState } from "react";
import Icon from "@/components/ui/icon";

const CATEGORIES = [
  { id: "all", label: "Все" },
  { id: "algebra", label: "Алгебра" },
  { id: "geometry", label: "Геометрия" },
  { id: "trig", label: "Тригонометрия" },
  { id: "physics", label: "Физика" },
  { id: "calculus", label: "Анализ" },
];

const FORMULAS = [
  {
    id: 1, cat: "algebra", title: "Квадратное уравнение",
    formula: "x = (−b ± √(b²−4ac)) / 2a",
    desc: "Корни уравнения ax² + bx + c = 0",
    vars: [["a, b, c", "коэффициенты уравнения"], ["D = b²−4ac", "дискриминант"]],
  },
  {
    id: 2, cat: "algebra", title: "Формула разности квадратов",
    formula: "a² − b² = (a + b)(a − b)",
    desc: "Разложение разности квадратов на множители",
    vars: [["a, b", "произвольные числа или выражения"]],
  },
  {
    id: 3, cat: "algebra", title: "Логарифм",
    formula: "logₐ(x·y) = logₐ(x) + logₐ(y)",
    desc: "Логарифм произведения равен сумме логарифмов",
    vars: [["a", "основание (a > 0, a ≠ 1)"], ["x, y", "положительные числа"]],
  },
  {
    id: 4, cat: "geometry", title: "Площадь круга",
    formula: "S = π · r²",
    desc: "Площадь круга через радиус",
    vars: [["r", "радиус окружности"], ["π ≈ 3.14159", "число Пи"]],
  },
  {
    id: 5, cat: "geometry", title: "Теорема Пифагора",
    formula: "c² = a² + b²",
    desc: "Связь катетов и гипотенузы прямоугольного треугольника",
    vars: [["a, b", "катеты"], ["c", "гипотенуза"]],
  },
  {
    id: 6, cat: "geometry", title: "Объём шара",
    formula: "V = (4/3) · π · r³",
    desc: "Объём шара через радиус",
    vars: [["r", "радиус шара"]],
  },
  {
    id: 7, cat: "geometry", title: "Длина окружности",
    formula: "C = 2 · π · r",
    desc: "Длина окружности через радиус",
    vars: [["r", "радиус"]],
  },
  {
    id: 8, cat: "trig", title: "Основное тригонометрическое тождество",
    formula: "sin²α + cos²α = 1",
    desc: "Связь синуса и косинуса одного угла",
    vars: [["α", "угол в радианах или градусах"]],
  },
  {
    id: 9, cat: "trig", title: "Формула двойного угла",
    formula: "sin(2α) = 2 · sin(α) · cos(α)",
    desc: "Синус удвоенного угла",
    vars: [["α", "произвольный угол"]],
  },
  {
    id: 10, cat: "trig", title: "Теорема косинусов",
    formula: "c² = a² + b² − 2ab·cos(C)",
    desc: "Обобщение теоремы Пифагора для произвольного треугольника",
    vars: [["a, b, c", "стороны треугольника"], ["C", "угол напротив стороны c"]],
  },
  {
    id: 11, cat: "physics", title: "Второй закон Ньютона",
    formula: "F = m · a",
    desc: "Сила равна произведению массы на ускорение",
    vars: [["F", "сила (Ньютоны, Н)"], ["m", "масса (кг)"], ["a", "ускорение (м/с²)"]],
  },
  {
    id: 12, cat: "physics", title: "Закон всемирного тяготения",
    formula: "F = G · (m₁·m₂) / r²",
    desc: "Гравитационная сила между двумя телами",
    vars: [["G = 6.674×10⁻¹¹", "гравитационная постоянная"], ["m₁, m₂", "массы тел"], ["r", "расстояние между ними"]],
  },
  {
    id: 13, cat: "physics", title: "Кинетическая энергия",
    formula: "E = mv² / 2",
    desc: "Энергия движущегося тела",
    vars: [["m", "масса (кг)"], ["v", "скорость (м/с)"]],
  },
  {
    id: 14, cat: "calculus", title: "Производная степенной функции",
    formula: "(xⁿ)' = n · xⁿ⁻¹",
    desc: "Правило дифференцирования степенной функции",
    vars: [["x", "переменная"], ["n", "показатель степени"]],
  },
  {
    id: 15, cat: "calculus", title: "Интеграл степенной функции",
    formula: "∫xⁿdx = xⁿ⁺¹ / (n+1) + C",
    desc: "Первообразная степенной функции",
    vars: [["n ≠ −1", "показатель степени"], ["C", "константа интегрирования"]],
  },
  {
    id: 16, cat: "calculus", title: "Формула Ньютона-Лейбница",
    formula: "∫ₐᵇ f(x)dx = F(b) − F(a)",
    desc: "Вычисление определённого интеграла через первообразную",
    vars: [["F(x)", "первообразная функции f(x)"], ["a, b", "пределы интегрирования"]],
  },
];

export default function ReferencePage() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = FORMULAS.filter(f => {
    const matchCat = activeCat === "all" || f.cat === activeCat;
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.formula.toLowerCase().includes(search.toLowerCase()) ||
      f.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-serif font-bold gold-text mb-2">Справочник</h1>
          <p className="text-muted-foreground font-sans text-sm">Математика, физика, тригонометрия, анализ</p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Icon name="Search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск формулы..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground font-sans focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium border transition-all hover:scale-105 ${activeCat === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="text-xs text-muted-foreground font-mono mb-4">
          Найдено: {filtered.length} {filtered.length === 1 ? "формула" : filtered.length < 5 ? "формулы" : "формул"}
        </div>

        {/* Formula cards */}
        <div className="space-y-3">
          {filtered.map((f, i) => (
            <div
              key={f.id}
              className="rounded-xl border border-border/60 bg-card overflow-hidden hover:border-primary/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <button
                className="w-full p-5 text-left flex items-start justify-between gap-4"
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md font-mono border ${
                      f.cat === "algebra" ? "border-blue-500/30 text-blue-400 bg-blue-500/8" :
                      f.cat === "geometry" ? "border-green-500/30 text-green-400 bg-green-500/8" :
                      f.cat === "trig" ? "border-purple-500/30 text-purple-400 bg-purple-500/8" :
                      f.cat === "physics" ? "border-orange-500/30 text-orange-400 bg-orange-500/8" :
                      "border-teal-500/30 text-teal-400 bg-teal-500/8"
                    }`}>
                      {CATEGORIES.find(c => c.id === f.cat)?.label}
                    </span>
                  </div>
                  <div className="font-sans font-semibold text-foreground text-sm mb-2">{f.title}</div>
                  <div className="font-mono text-primary text-base tracking-wide">{f.formula}</div>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`text-muted-foreground mt-1 flex-shrink-0 transition-transform ${expanded === f.id ? "rotate-180" : ""}`}
                />
              </button>

              {expanded === f.id && (
                <div className="px-5 pb-5 border-t border-border/40 pt-4 animate-fade-in-up">
                  <p className="text-sm text-muted-foreground font-sans mb-4 leading-relaxed">{f.desc}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground font-sans uppercase tracking-wider mb-2">Обозначения</div>
                    {f.vars.map(([sym, def]) => (
                      <div key={sym} className="flex gap-3 text-sm">
                        <span className="font-mono text-primary min-w-[80px] flex-shrink-0">{sym}</span>
                        <span className="text-muted-foreground font-sans">— {def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl font-serif mb-3">∅</div>
              <p className="font-sans">Ничего не найдено по запросу «{search}»</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
