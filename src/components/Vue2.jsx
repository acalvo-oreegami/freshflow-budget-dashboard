import React, { useState, useMemo } from 'react';
import { tableauConsommation } from '../data/freshflow';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Vue 2 : Tableau de Consommation (Détection Dérive)
// ─────────────────────────────────────────────────────────────────────────────

const statusColor = (status) => {
  if (status.includes('VERT')) return { bg: '#f0fdf4', border: '#dcfce7', text: '#166534' };
  if (status.includes('ORANGE')) return { bg: '#fffbeb', border: '#fde68a', text: '#92400e' };
  return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
};

export default function Vue2() {
  const [showInterpretation, setShowInterpretation] = useLocalStorage('vue2_showInterpretation', true);
  const [sortBy, setSortBy] = useLocalStorage('vue2_sortBy', 'none');
  const [filterStatus, setFilterStatus] = useLocalStorage('vue2_filterStatus', 'tous');

  // Filtrer par statut
  const filtered = useMemo(() => {
    if (filterStatus === 'tous') return tableauConsommation;
    return tableauConsommation.filter((t) => t.statut.includes(filterStatus));
  }, [filterStatus]);

  // Trier
  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === 'ecart_desc') arr.sort((a, b) => b.ecart - a.ecart);
    if (sortBy === 'ecart_asc') arr.sort((a, b) => a.ecart - b.ecart);
    if (sortBy === 'consomme_desc') arr.sort((a, b) => b.percentageConsomme - a.percentageConsomme);
    return arr;
  }, [filtered, sortBy]);

  // Calcul récapitulatif
  const recap = useMemo(() => {
    const totalBudget = tableauConsommation.reduce((s, t) => s + t.budget, 0);
    const totalConsomme = tableauConsommation.reduce((s, t) => s + t.consomme, 0);
    const verts = tableauConsommation.filter((t) => t.statut.includes('VERT')).length;
    const oranges = tableauConsommation.filter((t) => t.statut.includes('ORANGE')).length;
    const rouges = tableauConsommation.filter((t) => t.statut.includes('ROUGE')).length;
    return {
      totalBudget,
      totalConsomme,
      percentageGlobal: Math.round((totalConsomme / totalBudget) * 100),
      verts,
      oranges,
      rouges,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">
          Vue 2 — Tableau de Consommation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Détection de dérive : comparaison % consommé vs % temps écoulé (37.5%).
        </p>
      </div>

      {/* Recap cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-bold">Budget total</p>
          <p className="text-lg font-bold mt-1">€{(recap.totalBudget / 1000).toFixed(1)}k</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-bold">Consommé</p>
          <p className="text-lg font-bold mt-1">€{(recap.totalConsomme / 1000).toFixed(1)}k</p>
          <p className="text-xs text-slate-400 mt-0.5">{recap.percentageGlobal}%</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 shadow-sm border-2 border-green-200">
          <p className="text-xs text-green-700 font-bold">Vert</p>
          <p className="text-lg font-bold text-green-700 mt-1">{recap.verts}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 shadow-sm border-2 border-amber-200">
          <p className="text-xs text-amber-700 font-bold">Orange</p>
          <p className="text-lg font-bold text-amber-700 mt-1">{recap.oranges}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 shadow-sm border-2 border-red-200">
          <p className="text-xs text-red-700 font-bold">Rouge</p>
          <p className="text-lg font-bold text-red-700 mt-1">{recap.rouges}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Trier par :</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-600 font-semibold hover:border-slate-400"
            >
              <option value="none">Défaut</option>
              <option value="ecart_desc">Écart décroissant</option>
              <option value="ecart_asc">Écart croissant</option>
              <option value="consomme_desc">% Consommé desc.</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Filtre :</label>
            {['tous', 'VERT', 'ORANGE', 'ROUGE'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  filterStatus === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s === 'VERT' ? '🟢' : s === 'ORANGE' ? '🟠' : s === 'ROUGE' ? '🔴' : 'Tous'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowInterpretation(!showInterpretation)}
            className={`ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              showInterpretation ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
            }`}
          >
            {showInterpretation ? '✓' : ''} Interprétations ON
          </button>
        </div>
      </div>

      {/* Tableau principal */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm min-w-max">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500">Poste</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Budget</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Dépensé</th>
              <th className="text-right py-2 px-3 text-xs font-bold text-slate-500">Reste</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">% Consommé</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">% Temps (ref)</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">Écart</th>
              <th className="text-center py-2 px-3 text-xs font-bold text-slate-500">Statut</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => {
              const c = statusColor(t.statut);
              const ecartColor = t.ecart > 10 ? '#DC2626' : t.ecart > 5 ? '#F59E0B' : t.ecart < -5 ? '#F59E0B' : '#16A34A';
              return (
                <React.Fragment key={t.id}>
                  <tr className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-900 font-medium">{t.nom}</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">€{t.budget.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right text-slate-600 font-mono">€{t.consomme.toLocaleString()}</td>
                    <td className={`py-2 px-3 text-right font-mono font-bold ${t.reste > 0 ? 'text-green-700' : 'text-red-700'}`}>
                      €{t.reste.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-900">{t.percentageConsomme}%</span>
                        <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(t.percentageConsomme, 100)}%`,
                              background: t.percentageConsomme > 50 ? '#DC2626' : t.percentageConsomme > 30 ? '#F59E0B' : '#16A34A',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center text-slate-600 font-mono">37.5%</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded-full font-bold text-xs"
                        style={{
                          color: ecartColor,
                          background: ecartColor === '#16A34A' ? '#f0fdf4' : '#fffbeb',
                        }}
                      >
                        {t.ecart > 0 ? '+' : ''}{t.ecart}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-bold"
                        style={{
                          background: c.bg,
                          border: `1px solid ${c.border}`,
                          color: c.text,
                        }}
                      >
                        {t.statut}
                      </span>
                    </td>
                  </tr>
                  {showInterpretation && (
                    <tr className="bg-slate-50 border-b border-slate-50">
                      <td colSpan="8" className="py-2 px-3">
                        <p className="text-xs text-slate-600 italic">
                          💡 {t.interpretation}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Légende */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Comment lire ce tableau ?</p>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>
            <strong>Écart :</strong> Différence entre % consommé et % temps écoulé (37.5%). Un écart positif = consommation accélérée.
          </li>
          <li>
            <strong>🟢 Vert :</strong> Écart entre −5% et +5% — dans la trajectoire budgétaire nominale.
          </li>
          <li>
            <strong>🟠 Orange :</strong> Écart entre ±5% et ±20% — vigilance, tendance à surveiller.
          </li>
          <li>
            <strong>🔴 Rouge :</strong> Écart &gt; ±20% — action requise.
          </li>
        </ul>
      </div>
    </div>
  );
}
