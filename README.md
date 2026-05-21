# FreshFlow — Budget Intelligence Dashboard

Dashboard analytique de pilotage budgétaire pour **FreshFlow** (GreenBasket, 25 magasins bio).

**Philosophie :** Transformer les données brutes en intelligence décisionnelle. Anticipation des dérives 4-6 semaines avant qu'elles ne deviennent critiques.

---

## Démarrage rapide

```bash
cd freshflow-budget-dashboard
npm install
npm run dev
```

Ouvrez **http://localhost:5173** dans votre navigateur.

---

## Les 4 Vues

### Vue 1 — 📊 Répartition Budgétaire
**Leçon :** Classification du risque (pas des montants).

- Pie chart interactif par risque (Vert/Orange/Rouge)
- Filtres et toggle €/pourcentages
- Détail poste sélectionné
- Tableau récapitulatif

**Question clé :** Où sont les risques budgétaires ?

### Vue 2 — 📈 Tableau de Consommation
**Leçon :** Détection de dérive (% consommé vs % temps écoulé = 37.5%).

- Tableau 8 colonnes avec code couleur auto
- Interprétation textuelle auto-générée
- Tri par écart / filtre par statut
- Légende éducative

**Question clé :** Sommes-nous en dérive ?

### Vue 3 — 🔮 Projections
**Leçon :** Anticipation (ratio journalier × durée totale).

- Comparaison scénario A (1 magasin) vs B (3 magasins)
- Bar chart budget vs projection
- Détail par poste avec ratio €/jour
- Notes contextuelles (dépassements attendus)

**Question clé :** Quel sera le coût final ?

### Vue 4 — 🚨 Alertes Intelligentes
**Leçon :** Action et responsabilité.

- Alertes auto-générées sur événements budgétaires
- Marquer comme lue / historique
- Filtres non lues / sévérité
- Deadline urgent (< 7 jours) avec animation

**Question clé :** Qu'est-ce que je dois faire maintenant ?

---

## Stack Technique

| Outil       | Rôle                         |
|-------------|------------------------------|
| React 18    | UI (hooks, state management) |
| Vite        | Build + dev server           |
| Tailwind 3  | Styling                      |
| Recharts 2  | Graphiques                   |

---

## Persistance

**Tous les réglages utilisateur sont sauvegardés en localStorage :**

- Vue 1 : filtre risque, affichage (€ vs %), poste sélectionné
- Vue 2 : tri, filtre statut, interprétations ON/OFF
- Vue 3 : scénario (A vs B)
- Vue 4 : alertes lues, filtres mode/sévérité

Rafraîchir la page = tous les préférences sont restaurées.

---

## Données Mockées

Contexte fictif au 9 décembre 2025 (J+45 / 120 jours total) :

| Budget     | Consommé | Restant | Avancement |
|------------|----------|---------|------------|
| 15 000 €   | 3 280 €  | 11 720 €| 22 %       |

**4 postes :**
- Conseil Stratégique Philippe : 8 000€ (forfait acté, Vert)
- Développement Marc : 3 500€ (freelance, Orange)
- Licences outils : 2 000€ (monthly, Vert mais dérive détectée)
- API Claude : 1 500€ (variable, Orange — risque 3 magasins)

---

## Cas d'Usage

### Pour Thomas (chef de projet)
1. **Lundi :** Lancer Vue 2 → vérifier les dérives → e-mail à Sarah
2. **Mercredi :** Lancer Vue 3 → présenter scénario A/B
3. **Vendredi :** Lancer Vue 4 → valider deadlines urgentes

### Pour Sarah (DG)
1. Vue 3 : décision scénario A vs B (impact budget)
2. Vue 4 : voir alertes critiques (Rouges)

---

## Fichiers

```
src/
├── App.jsx                      # Navigation 4 vues
├── index.css                    # Tailwind + custom
├── main.jsx                     # Entrée React
├── hooks/
│   └── useLocalStorage.js       # Persistance
├── data/
│   └── freshflow.js             # Données mockées
└── components/
    ├── Vue1.jsx                 # Répartition
    ├── Vue2.jsx                 # Consommation
    ├── Vue3.jsx                 # Projections
    └── Vue4.jsx                 # Alertes
```

---

## Notes Pédagogiques

Chaque vue enseigne une **leçon de pilotage budgétaire :**

1. **Vue 1 :** Classifiez le risque, pas le montant
2. **Vue 2 :** Comparez les trajectoires (réel vs attendu)
3. **Vue 3 :** Extrapolez et anticipez
4. **Vue 4 :** Déclenchez des actions basées sur seuils

Un étudiant utilisant ce dashboard doit pouvoir anticiper les problèmes **4–6 semaines avant qu'ils deviennent critiques**.

---

## License

Fictif à visée pédagogique — Formation Oreegami Bloc 2.
