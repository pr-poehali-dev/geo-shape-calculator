import { useState } from "react";
import Icon from "@/components/ui/icon";
import HomePage from "./HomePage";
import CalcPage from "./CalcPage";
import ReferencePage from "./ReferencePage";
import FormulasPage from "./FormulasPage";

type Page = "home" | "calc" | "reference" | "formulas";

const NAV = [
  { id: "home" as Page, label: "Главная", icon: "Home" },
  { id: "calc" as Page, label: "Калькулятор", icon: "Calculator" },
  { id: "reference" as Page, label: "Справочник", icon: "BookOpen" },
  { id: "formulas" as Page, label: "Формулы", icon: "FlaskConical" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background math-grid">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
              <span className="font-mono text-primary font-bold text-sm">∑</span>
            </div>
            <span className="font-serif font-bold text-lg">
              <span className="gold-text">Мат</span>
              <span className="text-foreground">Калк</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`nav-link flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-sans font-medium transition-all ${
                  page === item.id
                    ? "text-primary bg-primary/10 active"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Icon name={mobileOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-sm animate-fade-in-up">
            {NAV.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-sans transition-colors ${
                  page === item.id
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="pt-14">
        {page === "home" && <HomePage onNavigate={(p) => setPage(p as Page)} />}
        {page === "calc" && <CalcPage />}
        {page === "reference" && <ReferencePage />}
        {page === "formulas" && <FormulasPage />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary font-bold">∑</span>
            <span className="font-serif font-semibold text-sm">
              <span className="gold-text">Мат</span>Калк
            </span>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            Научный калькулятор · {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            {NAV.slice(1).map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className="text-xs text-muted-foreground hover:text-primary font-sans transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
