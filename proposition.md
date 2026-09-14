# Proposition — Parcours unifié « Fioul Groupé »

**BTS SIO · option SLAM — lycée Suzanne Valadon**
Fusion des trois cours *MongoDB*, *Spring Boot* et *Flutter* en un parcours unique, cousu par un projet fil rouge et versionné sur une forge (GitHub).

---

## 1. Le constat de départ

Tu disposes aujourd'hui de **trois supports de cours complets et autonomes**, tous bâtis sur le même système visuel (site statique `index.html` + `chapitre-XX.html`, palette verte, mode sombre) :

| Cours | Chapitres | Volume | Rôle dans le parcours |
|-------|-----------|--------|-----------------------|
| **MongoDB** | 17 | ~93 leçons | La donnée |
| **Spring Boot** | 19 | ~88 leçons | Le back-end / l'API |
| **Flutter** | 19 | ~150 leçons | Le mobile |

Ces trois cours sont excellents mais **cloisonnés** : l'étudiant apprend MongoDB sur un exemple, Spring sur un autre (le projet *Dyma Tennis*), Flutter sur un troisième. Le lien entre les couches — pourtant le cœur du métier de développeur SLAM — n'apparaît jamais explicitement.

Ton cours Spring montre déjà la bonne recette : il **alterne chapitres théoriques et chapitres « projet »** (*Dyma Tennis*, en 10 parties). La proposition consiste à généraliser ce principe **à tout le parcours**, avec un projet commun aux trois technos.

## 2. La vision

> **Un seul projet, quatre parcours qui en construisent chacun une couche.**

Le fil rouge est une application de **commande groupée de fioul** — un sujet local, concret et techniquement riche. Chaque techno prend en charge une couche du même produit :

- **Forge & Git (GitHub)** — on met en place le dépôt, le suivi de projet et le déploiement *avant* de coder.
- **MongoDB** — on modélise et on stocke les données du domaine.
- **Spring Boot** — on expose et on sécurise ces données via une API REST.
- **Flutter** — on construit l'appli mobile qui consomme l'API.

L'étudiant ne change jamais de contexte métier : il approfondit toujours le même domaine, mais sous un angle technique nouveau à chaque bloc. Il termine l'année avec **une vraie application utilisable**, et non trois exercices jetables.

## 3. Le domaine « Fioul Groupé »

### 3.1 Le principe métier

En zone rurale sans gaz de ville (une réalité du Limousin), le chauffage se fait souvent au fioul. Commander **à plusieurs**, en gros volume, permet de négocier un meilleur prix au litre. L'application coordonne ces achats groupés :

1. Un **coordinateur** ouvre une *campagne* pour une zone géographique, avec une date limite et un fournisseur pressenti.
2. Des **particuliers** rejoignent la campagne en indiquant une quantité (litres) et une adresse de livraison.
3. Le **volume cumulé** franchit des paliers qui débloquent un **prix au litre dégressif** pour tous.
4. À la clôture, les commandes sont **consolidées** puis livrées.

### 3.2 Les acteurs

- **Particulier** — parcourt les campagnes ouvertes de sa zone, s'inscrit, suit en direct le palier atteint et le prix.
- **Coordinateur** — ouvre et pilote une campagne, suit le volume, clôture et déclenche la commande.
- **Fournisseur (distributeur)** — définit ses paliers dégressifs (volume → prix/L) et ses zones desservies.

### 3.3 Modèle de données (MongoDB)

Trois collections principales. La collection `campagnes` embarque les commandes (fort lien de composition, lues ensemble) ; `fournisseurs` et `utilisateurs` sont référencés.

```
campagnes {
  _id, zone, statut: OUVERTE|CLOTUREE|LIVREE,
  dateOuverture, dateLimite,
  fournisseurId, coordinateurId,
  localisation: { type: "Point", coordinates: [lon, lat] },   // 2dsphere
  commandes: [
    { participantId, litres, commune, adresse, statutPaiement }
  ]
}

fournisseurs {
  _id, nom, zonesDesservies: [...],
  paliers: [ { volumeMin: 3000, prixLitre: 1.05 }, { volumeMin: 8000, prixLitre: 0.98 } ]
}

utilisateurs { _id, email, motDePasseHash, roles: [PARTICULIER|COORDINATEUR] }
```

Les chapitres MongoDB mobilisés : modélisation (ch. 8), agrégations `$group`/`$sum` pour le volume total et le palier courant (ch. 14–15), index et recherches géospatiales `2dsphere` pour regrouper par commune (ch. 11, 13), validation de schéma (ch. 10), Atlas pour l'hébergement (ch. 17).

### 3.4 API REST (Spring Boot)

```
POST   /api/auth/register            inscription
POST   /api/auth/login               connexion → JWT
GET    /api/campagnes                lister les campagnes ouvertes (filtre zone)
GET    /api/campagnes/{id}           détail + volume total + prix courant
POST   /api/campagnes                ouvrir une campagne          [COORDINATEUR]
POST   /api/campagnes/{id}/commandes rejoindre avec une quantité  [PARTICULIER]
PUT    /api/campagnes/{id}/cloturer  clôturer                     [COORDINATEUR]
GET    /api/fournisseurs             lister les fournisseurs / paliers
```

Architecture en trois couches (controller / service / repository) directement calquée sur la progression du cours Spring, mais posée sur `spring-boot-starter-data-mongodb` au lieu de PostgreSQL. Validation des saisies (quantité minimale, date limite non dépassée), rôles `COORDINATEUR`/`PARTICULIER` en Spring Security + JWT, tests unitaires et d'intégration (MockMvc), documentation Swagger/OpenAPI.

### 3.5 Application mobile (Flutter)

Écrans : liste des campagnes ouvertes → détail d'une campagne (jauge de volume, palier atteint, prix courant) → formulaire d'inscription (litres + adresse) → mes commandes → connexion / inscription → carte des zones de livraison. Chapitres Flutter mobilisés : listes (ch. 7), navigation (ch. 10), Provider (ch. 12), HTTP + JSON (ch. 13), formulaires (ch. 14), Google Maps (ch. 17), authentification JWT (ch. 19).

## 4. Le parcours 0 — Forge & Git (GitHub)

C'est l'ajout central de ta demande : un TD **progressif et transversal**, réalisé sur le projet réel plutôt que sur des exemples abstraits.

1. **Pourquoi une forge ?** — Git vs GitHub, création de compte, authentification (clé SSH / token).
2. **Premier dépôt** — `git init`, `add`, `commit`, `.gitignore` (Java, Dart, Node), README.
3. **Travailler à plusieurs** — branches, `merge`, résolution de conflits, `pull`/`push`.
4. **Le flux GitHub** — issues, Pull Requests, revue de code entre binômes, protection de `main`.
5. **Organiser le travail** — GitHub Projects (kanban), milestones par bloc, labels.
6. **Intégration continue** — GitHub Actions : build Maven + tests à chaque PR, build/lint Flutter.
7. **Déploiement** — GitHub Pages (le site du cours !), gestion des secrets (identifiants Atlas), releases.
8. **Bonnes pratiques & sécurité** — commits conventionnels, aucun secret dans le dépôt, Dependabot.

**Accroche proposée :** la toute première mise en ligne du parcours est **le portail du cours lui-même**, publié sur GitHub Pages dès la séance 1. Les étudiants voient leur travail en ligne avant même d'avoir écrit une ligne de MongoDB — un déclic motivant.

## 5. Progression annuelle indicative

| Bloc | Parcours | Jalon fil rouge | Livrable vérifiable |
|------|----------|-----------------|---------------------|
| Semaines 1–2 | Forge & Git | Dépôt, board, issues, site en ligne | Repo + Pages actifs |
| Bloc données | MongoDB | Modéliser campagnes/commandes/fournisseurs, agrégation du volume, requête géo | Base Atlas + scripts |
| Bloc back-end | Spring Boot | API REST sécurisée (JWT, rôles), tests, Swagger | API déployée + CI verte |
| Bloc mobile | Flutter | Appli : liste, détail, inscription, auth, carte | APK fonctionnel |
| Fin d'année | Transversal | Consolidation, documentation, soutenance | Produit complet + oral |

La séquence est **strictement ordonnée** par dépendance technique : pas d'API sans modèle de données, pas d'appli mobile sans API.

## 6. Évaluation

**Livrables :** dépôt GitHub à l'historique propre, board de projet bouclé, base MongoDB + jeux de données, API Spring déployée + Swagger, APK Flutter, README et dossier de synthèse.

**Critères :** qualité de la modélisation et pertinence des agrégations ; architecture et robustesse de l'API (couches, validation, tests) ; ergonomie et fiabilité de l'appli mobile ; hygiène Git (granularité des commits, PR, revues) ; CI verte et déploiement effectif ; qualité de la soutenance.

**Passerelle avec ton cours de Cybersécurité** — le projet se prête naturellement à un volet sécurité évaluable : modèle de menaces de l'application, authentification JWT et gestion fine des rôles, validation systématique des entrées côté API, absence de secret dans le dépôt (Dependabot, secrets GitHub), HTTPS et durcissement au déploiement, revue de code orientée sécurité.

## 7. Site unifié — mise en œuvre technique

Le prototype livré (`portail-fioul-groupe.html`) est un **portail statique autonome**, en HTML/CSS/JS pur, dans l'esprit visuel de tes trois sites. Il joue le rôle de page d'accueil du parcours : présentation du fil rouge, du modèle de données, des quatre parcours (avec la liste réelle de tes chapitres), de la progression et de l'évaluation.

**Pour l'assembler en un vrai site multi-cours**, deux options :

- **Option A — simple et immédiate (recommandée pour démarrer).** Un dépôt `fioul-groupe` avec la structure ci-dessous ; le portail devient l'`index.html` racine, et chaque parcours conserve tes fichiers existants tels quels. Les cartes de parcours pointent vers `mongodb/index.html`, `spring/index.html`, `flutter/index.html`, et un nouveau dossier `forge/`. Rien à réécrire.

```
fioul-groupe/
├── index.html            ← le portail (prototype livré)
├── assets/               ← css/js partagés
├── forge/                ← nouveau parcours Git/GitHub
├── mongodb/              ← ton cours actuel, inchangé
├── spring/               ← ton cours actuel, inchangé
├── flutter/              ← ton cours actuel, inchangé
└── projet/               ← le fil rouge (énoncés de TD, code de départ)
```

- **Option B — harmonisation complète.** Fusionner les feuilles de style en un seul `assets/css/style.css` partagé, uniformiser l'en-tête/navigation des trois cours, et donner à chaque parcours son accent de couleur (vert MongoDB, vert Spring, bleu Flutter, graphite Forge). Plus long, mais visuellement homogène.

Dans les deux cas, l'ensemble se publie tel quel sur **GitHub Pages** — ce qui referme la boucle avec le parcours Forge.

## 8. Prochaines étapes possibles

- Rédiger les **énoncés de TD** du parcours Forge (8 séances) et les **jalons projet** de chaque bloc.
- Fournir un **code de départ** du projet Fioul Groupé (squelette Spring + MongoDB, squelette Flutter) à cloner en séance 1.
- Assembler concrètement le dépôt `fioul-groupe` (Option A) à partir de tes trois dossiers existants.

Dis-moi ce que tu veux que je produise en premier.
