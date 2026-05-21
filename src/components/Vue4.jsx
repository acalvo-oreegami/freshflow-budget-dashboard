import React, { useMemo } from 'react';
import { alertesAutomatiques } from '../data/freshflow';
import { useLocalStorage } from '../hooks/useLocalStorage';

// ─────────────────────────────────────────────────────────────────────────────
// Vue 4 : Alertes Intelligentes (Actions)
// ─────────────────────────────────────────────────────────────────────────────

const severiteColor = {
  VERT: { bg: '#f0fdf4', border: '#dcfce7', text: '#166534', dot: '#16A34A' },
  ORANGE: { bg: '#fffbeb', border: '#fde68a', text: '#92400e', dot: '#F59E0B' },
  ROUGE: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', dot: '#DC2626' },
};

export default function Vue4() {
  const [readAlerts, setReadAlerts] = useLocalStorage('vue4_readAlerts', []);
  const [filterMode, setFilterMode] = useLocalStorage('vue4_filterMode', 'non_lues');
  const [filterSeverite, setFilterSeverite] = useLocalStorage('vue4_filterSeverite', 'tous');

  // Marquer comme lue
  const toggleRead = (id) => {
    if (readAlerts.includes(id)) {
      setReadAlerts(readAlerts.filter((x) => x !== id));
    } else {
      setReadAlerts([...readAlerts, id]);
    }
  };

  // Filtrer les alertes
  const filtered = useMemo(() => {
    let arr = [...alertesAutomatiques];

    // Filtre mode
    if (filterMode === 'non_lues') arr = arr.filter((a) => !readAlerts.includes(a.id));
    if (filterMode === 'lues') arr = arr.filter((a) => readAlerts.includes(a.id));

    // Filtre sévérité
    if (filterSeverite !== 'tous') arr = arr.filter((a) => a.severite === filterSeverite);

    return arr;
  }, [readAlerts, filterMode, filterSeverite]);

  // Stats
  const stats = useMemo(() => {
    const total = alertesAutomatiques.length;
    const lues = alertesAutomatiques.filter((a) => readAlerts.includes(a.id)).length;
    const nonLues = total - lues;
    const rouges = alertesAutomatiques.filter((a) => a.severite === 'ROUGE').length;
    return { total, lues, nonLues, rouges };
  }, [readAlerts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">
          Vue 4 — Alertes Intelligentes
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Automatisation de la vigilance. Alertes déclenchées sur événements budgétaires.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-bold">Alertes totales</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 shadow-sm border border-blue-200">
          <p className="text-xs text-blue-700 font-bold">Non lues</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{stats.nonLues}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-200">
          <p className="text-xs text-slate-600 font-bold">Lues</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.lues}</p>
        </div>
        {stats.rouges > 0 && (
          <div className="bg-red-50 rounded-xl p-4 shadow-sm border-2 border-red-200 animate-urgency">
            <p className="text-xs text-red-700 font-bold">🚨 Critiques</p>
            <p className="text-2xl font-bold text-red-900 mt-1">{stats.rouges}</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Affichage :</label>
            {['non_lues', 'toutes', 'lues'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  filterMode === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {m === 'non_lues' ? 'Non lues' : m === 'toutes' ? 'Toutes' : 'Lues'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Sévérité :</label>
            {['tous', 'VERT', 'ORANGE', 'ROUGE'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverite(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  filterSeverite === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {s === 'VERT' ? '🟢' : s === 'ORANGE' ? '🟠' : s === 'ROUGE' ? '🔴' : 'Toutes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
            <p className="text-lg font-bold text-green-700">✓ Aucune alerte</p>
            <p className="text-sm text-green-600 mt-1">Bravo ! Le budget est maîtrisé.</p>
          </div>
        ) : (
          filtered.map((a) => {
            const isRead = readAlerts.includes(a.id);
            const c = severiteColor[a.severite];
            const daysUntilDeadline = a.deadline
              ? Math.ceil((new Date(a.deadline) - new Date()) / (1000 * 60 * 60 * 24))
              : null;
            const isUrgent = daysUntilDeadline !== null && daysUntilDeadline < 7 && daysUntilDeadline > 0;

            return (
              <div
                key={a.id}
                className={`rounded-2xl border-2 p-5 transition-opacity ${isRead ? 'opacity-60' : 'opacity-100'} ${isUrgent ? 'animate-urgency' : ''}`}
                style={{ background: c.bg, borderColor: c.border }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left */}
                  <div className="flex gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => toggleRead(a.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all ${
                          isRead
                            ? 'bg-white text-slate-400 border-slate-300'
                            : `text-white border-2 ${a.severite === 'VERT' ? 'bg-green-500 border-green-600' : a.severite === 'ORANGE' ? 'bg-amber-500 border-amber-600' : 'bg-red-600 border-red-700'}`
                        }`}
                      >
                        {isRead ? '✓' : a.id}
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-bold ${c.text}`}>{a.type}</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: c.border, color: c.text }}>
                          {a.severite}
                        </span>
                        {isUrgent && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-200 text-red-700 animate-urgency">
                            ⚡ {daysUntilDeadline} jours
                          </span>
                        )}
                      </div>
                      {a.poste && <p className="text-xs text-slate-600 mb-1">Poste : <strong>{a.poste}</strong></p>}
                      <p className="text-sm font-medium text-slate-900 mb-2">{a.message}</p>
                      <div className="bg-white bg-opacity-50 rounded-lg p-3">
                        <p className="text-xs font-bold text-slate-600 uppercase mb-1">Action requise</p>
                        <p className="text-sm text-slate-700">{a.action}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="md:text-right space-y-2">
                    <div>
                      <p className="text-xs text-slate-600 font-bold">Responsable</p>
                      <p className="text-sm font-semibold text-slate-900">{a.responsable}</p>
                    </div>
                    {a.deadline && (
                      <div>
                        <p className="text-xs text-slate-600 font-bold">Deadline</p>
                        <p className={`text-sm font-semibold ${isUrgent ? 'text-red-700' : 'text-slate-900'}`}>{a.deadline}</p>
                        {daysUntilDeadline !== null && (
                          <p className="text-xs text-slate-500 mt-0.5">
                            {daysUntilDeadline > 0 ? `dans ${daysUntilDeadline}j` : 'DÉPASSÉE'}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Historique */}
      {readAlerts.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
            Historique (alertes lues)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {alertesAutomatiques
              .filter((a) => readAlerts.includes(a.id))
              .map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleRead(a.id)}
                  className="text-left px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-slate-400 transition-colors text-xs"
                >
                  <p className="font-bold text-slate-900 line-clamp-2">{a.message}</p>
                  <p className="text-slate-500 text-xs mt-0.5">Cliquer pour réafficher</p>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Mode strict/permissif info */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">💡 Mode d'alerte</p>
        <p className="text-xs text-blue-800">
          Ce dashboard en mode <strong>permissif</strong> affiche toutes les alertes (VERT+ORANGE+ROUGE). En production, un <strong>mode strict</strong> afficherait
          seulement ORANGE+ROUGE pour éviter la surcharge d'information. Vous pouvez filtrer manuellement ci-dessus.
        </p>
      </div>
    </div>
  );
}
