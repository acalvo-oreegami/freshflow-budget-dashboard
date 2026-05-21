import React, { useMemo } from 'react';
import { projections, totalProjection, META } from '../data/freshflow';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Vue 3 : Projections (Extrapolation Futur)
// ─────────────────────────────────────────────────────────────────────────────

export default function Vue3() {
  const [scenario, setScenario] = useLocalStorage('vue3_scenario', 'A');

  // Données pour bar chart
  const chartData = useMemo(() => {
    return projections.map((p) => ({
      nom: p.nom.split(' ')[0],
      budget: p.budget,
      projection: p.projectionFinale,
      depassement: Math.max(0, p.depassement),
    }));
  }, []);

  // Données comparaison 1 vs 3 magasins
  const comparisonData = [
    { name: 'Scénario A\n(1 magasin)', A: totalProjection.projectionScenarioA, B: null },
    { name: 'Scénario B\n(3 magasins)', A: null, B: totalProjection.projectionScenarioB },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">
          Vue 3 — Projections
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Mesurer l'impact futur. Projection = (Dépensé / Temps écoulé) × Durée totale.
        </p>
      </div>

      {/* Scenario toggle */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
        <p className="text-sm font-bold text-slate-700">Scénario :</p>
        <button
          onClick={() => setScenario('A')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            scenario === 'A' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          }`}
        >
          A — 1 Magasin (€{totalProjection.projectionScenarioA.toLocaleString()})
        </button>
        <button
          onClick={() => setScenario('B')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            scenario === 'B' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
          }`}
        >
          B — 3 Magasins (€{totalProjection.projectionScenarioB.toLocaleString()})
        </button>
      </div>

      {/* Comparaison A vs B */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Impact scénario : 1 vs 3 magasins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scénario A */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <p className="text-xs font-bold text-blue-900 uppercase tracking-widest mb-2">Scénario A — 1 magasin</p>
            <p className="text-3xl font-bold text-blue-900">€{totalProjection.projectionScenarioA.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${(totalProjection.projectionScenarioA / 15000) * 100}%` }} />
              </div>
              <p className="text-xs text-blue-800 font-semibold">{Math.round((totalProjection.projectionScenarioA / 15000) * 100)}%</p>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              <strong>Marge :</strong> €{(15000 - totalProjection.projectionScenarioA).toLocaleString()} ({Math.round(((15000 - totalProjection.projectionScenarioA) / 15000) * 100)}%)
            </p>
            <p className="text-xs text-green-700 font-bold mt-1">✓ Confortable</p>
          </div>

          {/* Scénario B */}
          <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
            <p className="text-xs font-bold text-orange-900 uppercase tracking-widest mb-2">Scénario B — 3 magasins</p>
            <p className="text-3xl font-bold text-orange-900">€{totalProjection.projectionScenarioB.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-2 bg-orange-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-600" style={{ width: `${(totalProjection.projectionScenarioB / 15000) * 100}%` }} />
              </div>
              <p className="text-xs text-orange-800 font-semibold">{Math.round((totalProjection.projectionScenarioB / 15000) * 100)}%</p>
            </div>
            <p className="text-xs text-orange-700 mt-2">
              <strong>Marge :</strong> €{(15000 - totalProjection.projectionScenarioB).toLocaleString()} ({Math.round(((15000 - totalProjection.projectionScenarioB) / 15000) * 100)}%)
            </p>
            <p className="text-xs text-amber-700 font-bold mt-1">⚠ À surveiller</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            <strong>Différence :</strong> €{(totalProjection.projectionScenarioB - totalProjection.projectionScenarioA).toLocaleString()} supplémentaires pour scénario B (API Claude).
          </p>
        </div>
      </div>

      {/* Tableau projections */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Détail par poste</h2>
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500">Poste</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Budget Prévu</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Dépensé</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Ratio €/jour</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Projection</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Dépassement</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p) => {
              const statusBg = {
                '🟢 VERT': '#f0fdf4',
                '🟠 ORANGE': '#fffbeb',
                '🔴 ROUGE': '#fef2f2',
              };
              return (
                <React.Fragment key={p.id}>
                  <tr className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-900 font-medium">{p.nom}</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">€{p.budget.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">€{p.consomme.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">€{p.ratioJournalier.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-slate-900 font-bold font-mono">€{p.projectionFinale.toLocaleString()}</td>
                    <td className={`py-2 px-3 text-right font-mono font-bold ${p.depassement > 0 ? 'text-red-700' : 'text-green-700'}`}>
                      {p.depassement > 0 ? '+' : '−'}€{Math.abs(p.depassement).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: statusBg[p.statut],
                          color: p.statut === '🟢 VERT' ? '#166534' : p.statut === '🟠 ORANGE' ? '#92400e' : '#991b1b',
                        }}
                      >
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50 border-b border-slate-50">
                    <td colSpan="7" className="py-2 px-3">
                      <p className="text-xs text-slate-600 italic">📌 {p.note}</p>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bar chart comparaison Budget vs Projection */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
          Comparaison Budget vs Projection par poste
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="nom" />
            <YAxis />
            <Tooltip formatter={(val) => `€${Math.round(val).toLocaleString()}`} />
            <Legend />
            <Bar dataKey="budget" fill="#16A34A" name="Budget alloué" />
            <Bar dataKey="projection" fill="#F59E0B" name="Projection fin J+120" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Interprétation */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-green-900 uppercase tracking-wider mb-2">📊 Interprétation</p>
        <ul className="text-xs text-green-800 space-y-1">
          <li>
            <strong>Projection globale :</strong> Au rythme actuel (37.5% du temps écoulé), le budget total atteindra ~€
            {(totalProjection.budgetPrevu).toLocaleString()} en fin de projet (avant dépassements).
          </li>
          <li>
            <strong>Scénario A (1 magasin) :</strong> €{totalProjection.projectionScenarioA.toLocaleString()} — marge saine de €
            {(15000 - totalProjection.projectionScenarioA).toLocaleString()}.
          </li>
          <li>
            <strong>Scénario B (3 magasins) :</strong> €{totalProjection.projectionScenarioB.toLocaleString()} — marge réduite de €
            {(15000 - totalProjection.projectionScenarioB).toLocaleString()}. Décision Sarah requise avant J+52.
          </li>
        </ul>
      </div>
    </div>
  );
}
