import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { budgetPostes } from '../data/freshflow';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Vue 1 : Répartition Budgétaire (Classification par Risque)
// ─────────────────────────────────────────────────────────────────────────────

const risqueColors = {
  VERT: { color: '#16A34A', bg: '#f0fdf4', border: '#dcfce7', text: 'text-green-800' },
  ORANGE: { color: '#F59E0B', bg: '#fffbeb', border: '#fde68a', text: 'text-amber-800' },
  ROUGE: { color: '#DC2626', bg: '#fef2f2', border: '#fecaca', text: 'text-red-800' },
};

export default function Vue1() {
  const [filterRisque, setFilterRisque] = useLocalStorage('vue1_filterRisque', 'tous');
  const [showMontants, setShowMontants] = useLocalStorage('vue1_showMontants', true);
  const [selectedSlice, setSelectedSlice] = useState(null);

  // Filtrer par risque
  const filtered = useMemo(() => {
    if (filterRisque === 'tous') return budgetPostes;
    return budgetPostes.filter((p) => p.risque === filterRisque);
  }, [filterRisque]);

  // Données pour le pie chart
  const pieData = useMemo(() => {
    return filtered.map((p) => ({
      name: p.nom,
      value: showMontants ? p.budget : p.consomme,
      id: p.id,
      risque: p.risque,
    }));
  }, [filtered, showMontants]);

  // Grouper par risque pour résumé
  const parRisque = useMemo(() => {
    return {
      VERT: filtered.filter((p) => p.risque === 'VERT'),
      ORANGE: filtered.filter((p) => p.risque === 'ORANGE'),
      ROUGE: filtered.filter((p) => p.risque === 'ROUGE'),
    };
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">
          Vue 1 — Répartition Budgétaire
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Classification par risque. Identifier les postes vulnérables.
        </p>
      </div>

      {/* Toggles & Filtres */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Affichage :</label>
            <button
              onClick={() => setShowMontants(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                showMontants ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              Budget alloué
            </button>
            <button
              onClick={() => setShowMontants(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                !showMontants ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              Dépensé
            </button>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Filtre risque :</label>
            {['tous', 'VERT', 'ORANGE', 'ROUGE'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRisque(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  filterRisque === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {r === 'tous' ? 'Tous' : r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pie chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            Distribution par risque
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name.split(' ')[0]}: €${(value / 1000).toFixed(1)}k`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                onClick={(entry) => setSelectedSlice(entry.payload.id)}
              >
                {pieData.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={risqueColors[entry.risque].color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => `€${Math.round(val).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary cards */}
        <div className="space-y-3">
          {['VERT', 'ORANGE', 'ROUGE'].map((r) => {
            const total = parRisque[r].reduce((s, p) => s + p.budget, 0);
            const count = parRisque[r].length;
            const pct = ((total / 15000) * 100).toFixed(1);
            return (
              <div
                key={r}
                className="rounded-2xl p-4 border-2"
                style={{
                  background: risqueColors[r].bg,
                  borderColor: risqueColors[r].color,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-bold text-sm ${risqueColors[r].text}`}>{r}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${risqueColors[r].text}`} style={{ background: risqueColors[r].border }}>
                    {count} poste{count > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xl font-bold text-slate-900">€{(total / 1000).toFixed(1)}k</p>
                <p className="text-xs text-slate-600 mt-0.5">{pct} % du total</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Détail poste sélectionné */}
      {selectedSlice && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5">
          {(() => {
            const p = budgetPostes.find((x) => x.id === selectedSlice);
            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-lg">{p.nom}</h3>
                  <button onClick={() => setSelectedSlice(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="text-lg font-bold text-slate-900">€{p.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Consommé</p>
                    <p className="text-lg font-bold text-slate-900">€{p.consomme.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Reste</p>
                    <p className={`text-lg font-bold ${p.reste > 0 ? 'text-green-700' : 'text-red-700'}`}>€{p.reste.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nature</p>
                    <p className="text-sm text-slate-700 capitalize">{p.nature.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Raison du risque</p>
                    <p className="text-sm text-slate-700">{p.raison}</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Tableau récapitulatif */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Détail des postes</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500">Poste</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Budget</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Consommé</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Reste</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">Risque</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="py-2 px-3 text-slate-900 font-medium">{p.nom}</td>
                <td className="py-2 px-3 text-right text-slate-600 font-mono">€{p.budget.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-slate-600 font-mono">€{p.consomme.toLocaleString()}</td>
                <td className={`py-2 px-3 text-right font-mono font-bold ${p.reste > 0 ? 'text-green-700' : 'text-red-700'}`}>
                  €{p.reste.toLocaleString()}
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: risqueColors[p.risque].border,
                      color: risqueColors[p.risque].color,
                    }}
                  >
                    {p.risque}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
