import React, { useState } from 'react';
import Vue1 from './components/Vue1';
import Vue2 from './components/Vue2';
import Vue3 from './components/Vue3';
import Vue4 from './components/Vue4';

// ─────────────────────────────────────────────────────────────────────────────
// App — Navigation 4 vues
// ─────────────────────────────────────────────────────────────────────────────

const VUES = [
  { id: 1, label: 'Répartition', icon: '📊', component: Vue1, lecon: 'Classification du risque' },
  { id: 2, label: 'Consommation', icon: '📈', component: Vue2, lecon: 'Détection de dérive' },
  { id: 3, label: 'Projections', icon: '🔮', component: Vue3, lecon: 'Anticipation futur' },
  { id: 4, label: 'Alertes', icon: '🚨', component: Vue4, lecon: 'Actions & responsabilité' },
];

export default function App() {
  const [activeVue, setActiveVue] = useState(1);
  const currentVue = VUES.find((v) => v.id === activeVue);
  const ViewComponent = currentVue.component;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">FreshFlow — Budget Intelligence</h1>
            <p className="text-xs text-slate-300 mt-0.5">De la vulnérabilité à l'anticipation · J+45 / 120</p>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-2">
            {VUES.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVue(v.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeVue === v.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title={v.lecon}
              >
                <span>{v.icon}</span>
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ViewComponent />
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap justify-between gap-4 text-xs text-slate-600">
          <p>FreshFlow Budget Dashboard · GreenBasket · Formation Oreegami Bloc 2</p>
          <p>Toutes les données sont persisted en localStorage | Données fictives pédagogiques</p>
        </div>
      </footer>
    </div>
  );
}
