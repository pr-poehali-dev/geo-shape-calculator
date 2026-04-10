import { useState, useCallback } from "react";
import Icon from "@/components/ui/icon";

type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume";

const UNIT_CONVERSIONS: Record<UnitCategory, { label: string; units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }> = {
  length: {
    label: "Длина",
    units: [
      { key: "mm", label: "Миллиметры (мм)", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: "cm", label: "Сантиметры (см)", toBase: v => v / 100, fromBase: v => v * 100 },
      { key: "m", label: "Метры (м)", toBase: v => v, fromBase: v => v },
      { key: "km", label: "Километры (км)", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "in", label: "Дюймы (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { key: "ft", label: "Футы (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: "mi", label: "Мили (mi)", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
    ],
  },
  weight: {
    label: "Масса",
    units: [
      { key: "mg", label: "Миллиграммы (мг)", toBase: v => v / 1_000_000, fromBase: v => v * 1_000_000 },
      { key: "g", label: "Граммы (г)", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: "kg", label: "Килограммы (кг)", toBase: v => v, fromBase: v => v },
      { key: "t", label: "Тонны (т)", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "lb", label: "Фунты (lb)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { key: "oz", label: "Унции (oz)", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    ],
  },
  temperature: {
    label: "Температура",
    units: [
      { key: "c", label: "Цельсий (°C)", toBase: v => v, fromBase: v => v },
      { key: "f", label: "Фаренгейт (°F)", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { key: "k", label: "Кельвин (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ],
  },
  area: {
    label: "Площадь",
    units: [
      { key: "mm2", label: "мм²", toBase: v => v / 1_000_000, fromBase: v => v * 1_000_000 },
      { key: "cm2", label: "см²", toBase: v => v / 10_000, fromBase: v => v * 10_000 },
      { key: "m2", label: "м²", toBase: v => v, fromBase: v => v },
      { key: "km2", label: "км²", toBase: v => v * 1_000_000, fromBase: v => v / 1_000_000 },
      { key: "ha", label: "Гектары (га)", toBase: v => v * 10_000, fromBase: v => v / 10_000 },
    ],
  },
  volume: {
    label: "Объём",
    units: [
      { key: "ml", label: "Миллилитры (мл)", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: "l", label: "Литры (л)", toBase: v => v, fromBase: v => v },
      { key: "m3", label: "м³", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "gal", label: "Галлоны (gal)", toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
    ],
  },
};

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "−"],
  ["1", "2", "3", "+"],
  ["0", ".", "⌫", "="],
];

const SCI_BUTTONS = [
  ["sin", "cos", "tan", "π"],
  ["√", "x²", "xⁿ", "e"],
  ["log", "ln", "(", ")"],
  ["1/x", "!", "abs", "±"],
];

function formatNumber(n: number): string {
  if (!isFinite(n)) return n > 0 ? "∞" : "-∞";
  if (isNaN(n)) return "Ошибка";
  if (Math.abs(n) > 1e12 || (Math.abs(n) < 1e-6 && n !== 0)) {
    return n.toExponential(6);
  }
  const str = parseFloat(n.toPrecision(12)).toString();
  return str;
}

export default function CalcPage() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [prevResult, setPrevResult] = useState<number | null>(null);
  const [newNum, setNewNum] = useState(true);
  const [sciMode, setSciMode] = useState(false);

  // Unit converter state
  const [activeTab, setActiveTab] = useState<"calc" | "convert" | "geo">("calc");
  const [unitCat, setUnitCat] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");
  const [unitInput, setUnitInput] = useState("");
  const [unitResult, setUnitResult] = useState("");

  const handleCalc = useCallback((btn: string) => {
    if (btn === "C") {
      setDisplay("0");
      setExpression("");
      setPrevResult(null);
      setNewNum(true);
      return;
    }

    if (btn === "⌫") {
      if (display.length > 1) setDisplay(display.slice(0, -1));
      else setDisplay("0");
      return;
    }

    if (btn === "=") {
      try {
        let expr = expression + display;
        expr = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
         
        const result = Function('"use strict"; return (' + expr + ')')();
        const formatted = formatNumber(result);
        setExpression(formatted + " =");
        setDisplay(formatted);
        setPrevResult(result);
        setNewNum(true);
      } catch {
        setDisplay("Ошибка");
        setNewNum(true);
      }
      return;
    }

    if (["÷", "×", "+", "−"].includes(btn)) {
      setExpression(display + " " + btn + " ");
      setNewNum(true);
      return;
    }

    if (btn === "±") {
      setDisplay((parseFloat(display) * -1).toString());
      return;
    }

    if (btn === "%") {
      setDisplay((parseFloat(display) / 100).toString());
      return;
    }

    // Scientific
    const num = parseFloat(display);
    if (btn === "sin") { setDisplay(formatNumber(Math.sin(num * Math.PI / 180))); setNewNum(true); return; }
    if (btn === "cos") { setDisplay(formatNumber(Math.cos(num * Math.PI / 180))); setNewNum(true); return; }
    if (btn === "tan") { setDisplay(formatNumber(Math.tan(num * Math.PI / 180))); setNewNum(true); return; }
    if (btn === "√") { setDisplay(formatNumber(Math.sqrt(num))); setNewNum(true); return; }
    if (btn === "x²") { setDisplay(formatNumber(num ** 2)); setNewNum(true); return; }
    if (btn === "log") { setDisplay(formatNumber(Math.log10(num))); setNewNum(true); return; }
    if (btn === "ln") { setDisplay(formatNumber(Math.log(num))); setNewNum(true); return; }
    if (btn === "1/x") { setDisplay(formatNumber(1 / num)); setNewNum(true); return; }
    if (btn === "abs") { setDisplay(formatNumber(Math.abs(num))); setNewNum(true); return; }
    if (btn === "!") {
      let f = 1;
      for (let i = 2; i <= Math.floor(num); i++) f *= i;
      setDisplay(formatNumber(f)); setNewNum(true); return;
    }
    if (btn === "π") { setDisplay(formatNumber(Math.PI)); setNewNum(true); return; }
    if (btn === "e") { setDisplay(formatNumber(Math.E)); setNewNum(true); return; }
    if (btn === "xⁿ") { setExpression(display + "**"); setNewNum(true); return; }
    if (btn === "(") { setExpression(expression + display + "×("); setNewNum(true); return; }
    if (btn === ")") { setExpression(expression + display + ")"); setNewNum(true); return; }

    // Digits / dot
    if (newNum) {
      setDisplay(btn === "." ? "0." : btn);
      setNewNum(false);
    } else {
      if (btn === "." && display.includes(".")) return;
      setDisplay(display === "0" && btn !== "." ? btn : display + btn);
    }
  }, [display, expression, newNum]);

  const handleConvert = () => {
    const val = parseFloat(unitInput);
    if (isNaN(val)) { setUnitResult("Введите число"); return; }
    const cat = UNIT_CONVERSIONS[unitCat];
    const from = cat.units.find(u => u.key === fromUnit);
    const to = cat.units.find(u => u.key === toUnit);
    if (!from || !to) return;
    const base = from.toBase(val);
    const result = to.fromBase(base);
    setUnitResult(formatNumber(result));
  };

  const getBtnStyle = (btn: string) => {
    if (btn === "=") return "bg-primary text-primary-foreground hover:bg-primary/90 col-span-1 row-span-1";
    if (["÷", "×", "+", "−"].includes(btn)) return "bg-secondary border-primary/30 text-primary hover:bg-primary/15";
    if (["C", "±", "%"].includes(btn)) return "bg-secondary text-muted-foreground hover:bg-secondary/80";
    return "bg-card hover:bg-secondary border-border/80";
  };

  const getSciStyle = (btn: string) => {
    if (["sin", "cos", "tan"].includes(btn)) return "bg-card border-primary/20 text-teal-400 hover:bg-primary/10 text-xs";
    if (["π", "e"].includes(btn)) return "bg-card border-primary/25 text-primary hover:bg-primary/10";
    return "bg-card border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground text-xs";
  };

  // Geometry state
  const [geoMode, setGeoMode] = useState<"area" | "volume">("area");
  const [geoShape, setGeoShape] = useState("circle");
  const [geoInputs, setGeoInputs] = useState<Record<string, string>>({});
  const [geoResult, setGeoResult] = useState<{ area?: string; volume?: string; perimeter?: string } | null>(null);

  const GEO_SHAPES = [
    {
      id: "circle", label: "Круг", emoji: "⭕",
      fields: [{ key: "r", label: "Радиус (r)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(Math.PI * v.r ** 2),
        perimeter: formatNumber(2 * Math.PI * v.r),
      }),
      formulas: { area: "π · r²", perimeter: "2 · π · r" },
    },
    {
      id: "rect", label: "Прямоугольник", emoji: "▭",
      fields: [{ key: "a", label: "Длина (a)" }, { key: "b", label: "Ширина (b)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(v.a * v.b),
        perimeter: formatNumber(2 * (v.a + v.b)),
      }),
      formulas: { area: "a · b", perimeter: "2 · (a + b)" },
    },
    {
      id: "triangle", label: "Треугольник", emoji: "△",
      fields: [{ key: "a", label: "Основание (a)" }, { key: "h", label: "Высота (h)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(0.5 * v.a * v.h),
      }),
      formulas: { area: "½ · a · h" },
    },
    {
      id: "trapeze", label: "Трапеция", emoji: "⏢",
      fields: [{ key: "a", label: "Основание a" }, { key: "b", label: "Основание b" }, { key: "h", label: "Высота h" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(0.5 * (v.a + v.b) * v.h),
      }),
      formulas: { area: "½ · (a + b) · h" },
    },
    {
      id: "sphere", label: "Шар", emoji: "🔵",
      fields: [{ key: "r", label: "Радиус (r)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(4 * Math.PI * v.r ** 2),
        volume: formatNumber((4 / 3) * Math.PI * v.r ** 3),
      }),
      formulas: { area: "4 · π · r²", volume: "4/3 · π · r³" },
    },
    {
      id: "cylinder", label: "Цилиндр", emoji: "🥫",
      fields: [{ key: "r", label: "Радиус (r)" }, { key: "h", label: "Высота (h)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(2 * Math.PI * v.r * (v.r + v.h)),
        volume: formatNumber(Math.PI * v.r ** 2 * v.h),
      }),
      formulas: { area: "2π·r·(r+h)", volume: "π · r² · h" },
    },
    {
      id: "cone", label: "Конус", emoji: "🔺",
      fields: [{ key: "r", label: "Радиус (r)" }, { key: "h", label: "Высота (h)" }],
      calc: (v: Record<string, number>) => {
        const l = Math.sqrt(v.r ** 2 + v.h ** 2);
        return {
          area: formatNumber(Math.PI * v.r * (v.r + l)),
          volume: formatNumber((1 / 3) * Math.PI * v.r ** 2 * v.h),
        };
      },
      formulas: { area: "π·r·(r+l)", volume: "⅓ · π · r² · h" },
    },
    {
      id: "cube", label: "Куб", emoji: "⬛",
      fields: [{ key: "a", label: "Сторона (a)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(6 * v.a ** 2),
        volume: formatNumber(v.a ** 3),
      }),
      formulas: { area: "6 · a²", volume: "a³" },
    },
    {
      id: "box", label: "Параллелепипед", emoji: "📦",
      fields: [{ key: "a", label: "Длина (a)" }, { key: "b", label: "Ширина (b)" }, { key: "c", label: "Высота (c)" }],
      calc: (v: Record<string, number>) => ({
        area: formatNumber(2 * (v.a * v.b + v.b * v.c + v.a * v.c)),
        volume: formatNumber(v.a * v.b * v.c),
      }),
      formulas: { area: "2(ab+bc+ac)", volume: "a · b · c" },
    },
  ];

  const handleGeoCalc = () => {
    const shape = GEO_SHAPES.find(s => s.id === geoShape);
    if (!shape) return;
    const vals: Record<string, number> = {};
    for (const f of shape.fields) {
      const v = parseFloat(geoInputs[f.key] || "");
      if (isNaN(v) || v <= 0) { setGeoResult(null); return; }
      vals[f.key] = v;
    }
    setGeoResult(shape.calc(vals));
  };

  const currentShape = GEO_SHAPES.find(s => s.id === geoShape)!;

  const catEntries = Object.entries(UNIT_CONVERSIONS) as [UnitCategory, typeof UNIT_CONVERSIONS[UnitCategory]][];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold gold-text mb-2">Калькулятор</h1>
          <p className="text-muted-foreground font-sans text-sm">Научные вычисления и перевод единиц</p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-6">
          <button
            onClick={() => setActiveTab("calc")}
            className={`flex-1 py-2.5 text-sm font-sans font-medium transition-colors ${activeTab === "calc" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            <Icon name="Calculator" size={14} className="inline mr-2" />
            Калькулятор
          </button>
          <button
            onClick={() => setActiveTab("geo")}
            className={`flex-1 py-2.5 text-sm font-sans font-medium transition-colors ${activeTab === "geo" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            <Icon name="Shapes" size={14} className="inline mr-2" />
            Геометрия
          </button>
          <button
            onClick={() => setActiveTab("convert")}
            className={`flex-1 py-2.5 text-sm font-sans font-medium transition-colors ${activeTab === "convert" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
          >
            <Icon name="ArrowLeftRight" size={14} className="inline mr-2" />
            Единицы
          </button>
        </div>

        {activeTab === "calc" && (
          <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-2xl">
            {/* Display */}
            <div className="p-5 bg-background/60 border-b border-border/50 min-h-[90px]">
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-mono min-h-[18px] mb-1 truncate">{expression || "\u00A0"}</div>
                <div className="text-4xl font-mono font-semibold text-foreground truncate leading-tight"
                  style={{ fontSize: display.length > 12 ? "1.6rem" : display.length > 8 ? "2rem" : "2.5rem" }}>
                  {display}
                </div>
              </div>
            </div>

            {/* Sci mode toggle */}
            <div className="px-4 pt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-sans">Режим</span>
              <button
                onClick={() => setSciMode(v => !v)}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg border font-sans text-sm font-medium transition-all hover:scale-105 active:scale-95 ${sciMode ? "border-primary/50 bg-primary/15 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
              >
                <div className={`w-8 h-4 rounded-full border transition-colors relative ${sciMode ? "bg-primary border-primary" : "bg-muted border-border"}`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${sciMode ? "left-4" : "left-0.5"}`} />
                </div>
                {sciMode ? "Научный режим" : "Научный режим"}
                <Icon name={sciMode ? "FlaskConical" : "FlaskConical"} size={14} className={sciMode ? "text-primary" : "text-muted-foreground"} />
              </button>
            </div>

            {/* Scientific buttons */}
            {sciMode && (
              <div className="px-4 pt-3 grid grid-cols-4 gap-2">
                {SCI_BUTTONS.flat().map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className={`calc-btn h-10 rounded-lg border font-mono text-sm transition-all hover:scale-105 active:scale-95 ${getSciStyle(btn)}`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            )}

            {/* Main buttons */}
            <div className="p-4 grid grid-cols-4 gap-2.5">
              {BUTTONS.flat().map((btn, i) => (
                <button
                  key={`${btn}-${i}`}
                  onClick={() => handleCalc(btn)}
                  className={`calc-btn h-14 rounded-xl border font-mono text-lg font-medium transition-all hover:scale-105 active:scale-95 ${getBtnStyle(btn)}`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "geo" && (
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xl animate-scale-in">
            {/* Area / Volume toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden mb-6">
              <button
                onClick={() => { setGeoMode("area"); setGeoShape("circle"); setGeoInputs({}); setGeoResult(null); }}
                className={`flex-1 py-2.5 text-sm font-sans font-medium transition-colors flex items-center justify-center gap-2 ${geoMode === "area" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                <Icon name="Square" size={14} />
                Площадь
              </button>
              <button
                onClick={() => { setGeoMode("volume"); setGeoShape("sphere"); setGeoInputs({}); setGeoResult(null); }}
                className={`flex-1 py-2.5 text-sm font-sans font-medium transition-colors flex items-center justify-center gap-2 ${geoMode === "volume" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
              >
                <Icon name="Box" size={14} />
                Объём
              </button>
            </div>

            {/* Shape selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {GEO_SHAPES.filter(s => geoMode === "area" ? !s.formulas.volume : !!s.formulas.volume).map(s => (
                <button
                  key={s.id}
                  onClick={() => { setGeoShape(s.id); setGeoInputs({}); setGeoResult(null); }}
                  className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-xs font-sans font-medium transition-all hover:scale-105 ${geoShape === s.id ? "bg-primary/15 border-primary/50 text-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Formulas hint */}
            <div className="mb-5 p-3 rounded-lg bg-background/60 border border-border/50">
              <div className="text-xs text-muted-foreground font-sans mb-1.5">Формулы</div>
              <div className="flex flex-wrap gap-3">
                {currentShape.formulas.area && (
                  <div className="text-xs font-mono text-primary">S = {currentShape.formulas.area}</div>
                )}
                {currentShape.formulas.volume && (
                  <div className="text-xs font-mono text-teal-400">V = {currentShape.formulas.volume}</div>
                )}
                {currentShape.formulas.perimeter && (
                  <div className="text-xs font-mono text-blue-400">P = {currentShape.formulas.perimeter}</div>
                )}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-5">
              {currentShape.fields.map(f => (
                <div key={f.key}>
                  <label className="text-xs text-muted-foreground font-sans mb-1.5 block">{f.label}</label>
                  <input
                    type="number"
                    value={geoInputs[f.key] || ""}
                    onChange={e => setGeoInputs(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder="Введите значение..."
                    className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-mono text-lg focus:outline-none focus:border-primary/60 transition-colors"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGeoCalc}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] mb-4"
            >
              Вычислить
            </button>

            {geoResult && (
              <div className="grid gap-3 animate-scale-in">
                {geoResult.area && (
                  <div className="p-4 rounded-xl bg-primary/8 border border-primary/25 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-sans mb-0.5">Площадь (S)</div>
                      <div className="text-xs font-mono text-muted-foreground">S = {currentShape.formulas.area}</div>
                    </div>
                    <div className="text-2xl font-mono font-bold gold-text">{geoResult.area}</div>
                  </div>
                )}
                {geoResult.volume && (
                  <div className="p-4 rounded-xl bg-teal-500/8 border border-teal-500/25 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-sans mb-0.5">Объём (V)</div>
                      <div className="text-xs font-mono text-muted-foreground">V = {currentShape.formulas.volume}</div>
                    </div>
                    <div className="text-2xl font-mono font-bold teal-text">{geoResult.volume}</div>
                  </div>
                )}
                {geoResult.perimeter && (
                  <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/25 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground font-sans mb-0.5">Периметр / длина (P)</div>
                      <div className="text-xs font-mono text-muted-foreground">P = {currentShape.formulas.perimeter}</div>
                    </div>
                    <div className="text-2xl font-mono font-bold text-blue-400">{geoResult.perimeter}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "convert" && (
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-2xl animate-scale-in">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {catEntries.map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => {
                    setUnitCat(key);
                    setFromUnit(val.units[0].key);
                    setToUnit(val.units[1].key);
                    setUnitInput("");
                    setUnitResult("");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium border transition-all ${unitCat === key ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {val.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground font-sans mb-1.5 block">Значение</label>
                <input
                  type="number"
                  value={unitInput}
                  onChange={e => setUnitInput(e.target.value)}
                  placeholder="Введите число..."
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground font-mono text-lg focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground font-sans mb-1.5 block">Из</label>
                  <select
                    value={fromUnit}
                    onChange={e => setFromUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-primary/60"
                  >
                    {UNIT_CONVERSIONS[unitCat].units.map(u => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground font-sans mb-1.5 block">В</label>
                  <select
                    value={toUnit}
                    onChange={e => setToUnit(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-border text-foreground font-sans text-sm focus:outline-none focus:border-primary/60"
                  >
                    {UNIT_CONVERSIONS[unitCat].units.map(u => (
                      <option key={u.key} value={u.key}>{u.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleConvert}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-sans font-semibold hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Перевести
              </button>

              {unitResult && (
                <div className="p-4 rounded-xl bg-primary/8 border border-primary/25 text-center animate-scale-in">
                  <div className="text-xs text-muted-foreground font-sans mb-1">Результат</div>
                  <div className="text-3xl font-mono font-bold gold-text">{unitResult}</div>
                  <div className="text-xs text-muted-foreground font-sans mt-1">
                    {UNIT_CONVERSIONS[unitCat].units.find(u => u.key === toUnit)?.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}