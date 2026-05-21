// ─────────────────────────────────────────────────────────────────────────────
// Contexte Projet
// ─────────────────────────────────────────────────────────────────────────────
export const META = {
  nomProjet: 'FreshFlow',
  client: 'GreenBasket',
  dateCopil: '9 décembre 2025',
  jourCourant: 45,
  dureeTotalProjet: 120,
  budgetTotal: 15000,
};

const joursEcoulés = 45;
const dureeTotalProjet = 120;
const percentageTempsEcoulé = (joursEcoulés / dureeTotalProjet) * 100;

// ─────────────────────────────────────────────────────────────────────────────
// VUE 1 : Répartition Budgétaire
// ─────────────────────────────────────────────────────────────────────────────
export const budgetPostes = [
  {
    id: 1,
    nom: 'Conseil Stratégique (Philippe)',
    budget: 8000,
    consomme: 8000,
    reste: 0,
    nature: 'forfait_prestation',
    risque: 'VERT',
    raison: 'Forfait acté. Montant fermé, pas de dérive possible.',
  },
  {
    id: 2,
    nom: 'Développement No-Code (Marc)',
    budget: 3500,
    consomme: 1200,
    reste: 2300,
    nature: 'prestation_risquee',
    risque: 'ORANGE',
    raison: 'Freelance remote. 5 workflows complexes en retard. Risque dépassement.',
  },
  {
    id: 3,
    nom: 'Licences Outils',
    budget: 2000,
    consomme: 1300,
    reste: 700,
    nature: 'cout_fixe_mensuel',
    risque: 'VERT',
    raison: 'Abonnements mensuels, prévisibles.',
  },
  {
    id: 4,
    nom: 'API Claude & Services IA',
    budget: 1500,
    consomme: 780,
    reste: 720,
    nature: 'cout_variable',
    risque: 'ORANGE',
    raison: 'Peut exploser si extension 3 magasins. Décision Sarah en attente.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VUE 2 : Tableau de Consommation (Détection Dérive)
// ─────────────────────────────────────────────────────────────────────────────
export const tableauConsommation = budgetPostes.map((p) => {
  const percentageConsomme = (p.consomme / p.budget) * 100;
  const ecart = percentageConsomme - percentageTempsEcoulé;

  let statut = '🟢 VERT';
  let interpretation = 'Consommation alignée sur planning.';
  if (Math.abs(ecart) > 20) {
    statut = '🔴 ROUGE';
    interpretation = 'Dérive majeure : action requise immédiatement.';
  } else if (Math.abs(ecart) > 5) {
    statut = '🟠 ORANGE';
    interpretation = ecart > 0
      ? `Dépassement : consommation +${ecart.toFixed(1)} points au-dessus de la trajectoire.`
      : `Avance : consommation ${Math.abs(ecart).toFixed(1)} points en-dessous. Vigilance si accélération J+52.`;
  }

  return {
    ...p,
    percentageConsomme: Math.round(percentageConsomme),
    percentageTempsEcoulé: Math.round(percentageTempsEcoulé),
    ecart: Math.round(ecart * 10) / 10,
    statut,
    interpretation,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// VUE 3 : Projections
// ─────────────────────────────────────────────────────────────────────────────
const calculateProjection = (budget, consomme, joursEcoulés, dureeTotal) => {
  const ratioJournalier = consomme / joursEcoulés;
  const projectionFinale = Math.round(ratioJournalier * dureeTotal);
  const depassement = projectionFinale - budget;
  return { ratioJournalier: Math.round(ratioJournalier * 100) / 100, projectionFinale, depassement };
};

export const projections = budgetPostes.map((p) => {
  const proj = calculateProjection(p.budget, p.consomme, joursEcoulés, dureeTotalProjet);

  let statut = '🟢 VERT';
  if (proj.depassement > 500) statut = '🔴 ROUGE';
  else if (proj.depassement > 0) statut = '🟠 ORANGE';

  const note = p.id === 1
    ? 'Forfait acté, impact zéro.'
    : p.id === 2
    ? 'En avance, mais 5 workflows risquent de consommer la marge.'
    : p.id === 3
    ? 'À ce rythme, dépassement de 73%. Vérifier abonnements inutilisés.'
    : 'Projection 2080€ (1 magasin) vs 3280€ (3 magasins). Décision Sarah.';

  return {
    ...p,
    ...proj,
    statut,
    note,
  };
});

// Total pour Vue 3 (calcul global)
export const totalProjection = {
  budgetPrevu: budgetPostes.reduce((s, p) => s + p.budget, 0),
  depenseDate: budgetPostes.reduce((s, p) => s + p.consomme, 0),
  ratioJournalier: Math.round((budgetPostes.reduce((s, p) => s + p.consomme, 0) / joursEcoulés) * 100) / 100,
  projectionScenarioA: 9746, // Scénario 1 magasin
  projectionScenarioB: 10946, // Scénario 3 magasins
};

// ─────────────────────────────────────────────────────────────────────────────
// VUE 4 : Alertes Intelligentes
// ─────────────────────────────────────────────────────────────────────────────
export const alertesAutomatiques = [
  {
    id: 1,
    type: 'DÉRIVE_POSTE',
    severite: 'ORANGE',
    poste: 'Licences Outils',
    message: 'Poste passé en ORANGE : 65% consommé pour 37.5% du temps écoulé',
    action: 'Audit des abonnements. Résilier les doublons.',
    responsable: 'Thomas',
    deadline: '2025-12-15',
    statut: 'Nouvelle',
  },
  {
    id: 2,
    type: 'DÉRIVE_POSTE',
    severite: 'ORANGE',
    poste: 'API Claude',
    message: 'Poste passé en ORANGE : 52% consommé pour 37.5% du temps écoulé',
    action: 'Valider avec Sarah avant J+52 : 1 magasin vs 3 magasins ?',
    responsable: 'Thomas',
    deadline: '2025-12-20',
    statut: 'Nouvelle',
  },
  {
    id: 3,
    type: 'PROJECTION_DÉPASSEMENT',
    severite: 'ORANGE',
    message: 'Projection globale (hors conseil) : 9746€ vs budget 7000€ = marge saine mais à surveiller.',
    action: 'Continuer suivi. Décision 3 magasins impactent directement API.',
    responsable: 'Thomas',
    deadline: '2025-12-20',
    statut: 'Nouvelle',
  },
  {
    id: 4,
    type: 'SEUIL_CRITIQUE',
    severite: 'ROUGE',
    message: 'Dev Marc : 5 workflows complexes estimés 4-5 jours chacun = risque débordement des 2300€ restants.',
    action: 'Point avec Marc cette semaine : confirmer délais ou réduire périmètre.',
    responsable: 'Thomas',
    deadline: '2025-12-12',
    statut: 'Nouvelle',
  },
  {
    id: 5,
    type: 'TEMPS_RESTANT',
    severite: 'VERT',
    message: 'Reste 11720€ sur 15000€ = 78% marge. Confortable pour 68 jours restants.',
    action: 'Continuer suivi. Tolérance raisonnable.',
    responsable: 'Thomas',
    deadline: null,
    statut: 'Nouvelle',
  },
];
