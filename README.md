# Wahl-O-Mat · Strasbourg 2026

Outil citoyen d'aide à la décision pour les élections municipales de Strasbourg des 15 et 22 mars 2026.

👉 **[Accéder à l'outil](https://sgoger.github.io/wahl-o-mat-municipales-strasbourg-2026/)**

---

## À propos

Ce Wahl-O-Mat compare vos positions à celles des 6 principaux candidats à la mairie de Strasbourg sur 33 thèses issues des grands enjeux de la campagne : mobilité, logement, sécurité, finances, écologie, démocratie, tourisme, social, urbanisme et économie.

**Ce que cet outil est :**
- Un aide-mémoire pédagogique sur les programmes
- Un outil de comparaison personnel et non contraignant
- Un projet citoyen indépendant, sans affiliation partisane

**Ce que cet outil n'est pas :**
- Une recommandation de vote
- Un sondage ou une étude d'opinion
- Une publication officielle d'un parti, d'un candidat ou d'un média

---

## Transparence : création assistée par intelligence artificielle

Ce projet a été intégralement réalisé avec l'aide de **[Claude](https://claude.ai)**, l'assistant IA développé par [Anthropic](https://anthropic.com).

### Pourquoi le mentionner ?

La transparence sur l'utilisation de l'IA dans la production de contenu à dimension civique est une exigence éthique. Les visiteurs ont le droit de savoir comment cet outil a été construit.

### Comment l'IA a été utilisée

L'IA a servi d'outil technique pour :
- La conception et le développement du code (HTML, CSS, JavaScript)
- La structuration et la mise en forme des données
- La rédaction des textes de présentation

L'IA **n'a pas été utilisée** pour :
- Inventer ou interpréter des positions de candidats
- Choisir les thèses ou orienter leur formulation dans un sens partisan
- Remplacer la vérification humaine des sources

### Les instructions données à l'IA

Dès le début du projet, des instructions explicites de neutralité ont été données :

> *"Tout doit être sourcé et documenté. Chaque position attribuée à un candidat doit être tirée d'une source de presse indépendante vérifiable. L'outil doit être strictement non-partisan : aucune thèse ne doit être formulée pour avantager ou désavantager un candidat en particulier."*

Ces principes ont guidé chaque étape du développement.

### Ce que cela implique

L'utilisation de l'IA ne garantit pas l'absence d'erreurs. Elle peut introduire des biais involontaires dans la formulation, manquer des nuances programmatiques, ou refléter les limites de ses données d'entraînement. C'est pourquoi **toutes les positions sont sourcées**, que les sources sont accessibles, et que des corrections peuvent être proposées (voir [Contribuer](#contribuer)).

---

## Méthodologie

### Choix des candidats

Strasbourg compte 10 listes officiellement déposées. Seuls 6 candidats figurent dans cet outil, pour une raison unique : ce sont les seuls dont il a été possible de documenter des positions **suffisamment précises et vérifiables** sur chacune des 33 thèses. Ce critère est purement méthodologique et ne reflète aucun jugement sur la valeur des candidatures absentes.

Les candidats absents et les raisons de leur absence sont expliqués dans l'outil lui-même.

### Choix des thèses

Les 33 thèses ont été sélectionnées à partir des sujets les plus présents dans la couverture de campagne par la presse locale (Rue89 Strasbourg, Pokaa, StrasInfo, Vert.eco, France Bleu, France 3, CNews). Elles couvrent 10 thèmes : mobilité, logement, sécurité, finances, écologie, démocratie, tourisme, social, urbanisme et économie.

Tout choix de thèses implique un cadrage. Certains sujets sont absents faute de sources permettant d'attribuer des positions claires à tous les candidats. Ce biais de documentation est inhérent à l'exercice.

### Attribution des positions

Chaque position (`D'accord` / `Neutre` / `Pas d'accord`) est :
- Tirée d'une source de presse indépendante citée dans l'outil
- Accompagnée d'un extrait du programme ou d'une déclaration publique
- Attribuée `Neutre` lorsqu'aucune position documentée n'a pu être trouvée

### Calcul du score

Pour chaque thèse répondue :
- Accord avec le candidat → **2 points**
- Position de l'un des deux côtés `Neutre` → **1 point**
- Désaccord → **0 point**

Les thèses marquées "×2" comptent double. Le score final est le ratio entre les points obtenus et le maximum possible, exprimé en pourcentage.

---

## Données

Les données (candidats, thèses, positions, sources) sont dans le fichier `wahlomat-data.js`. Elles sont volontairement séparées du code applicatif pour faciliter leur vérification et leur mise à jour.

**Dernière mise à jour des données :** mars 2026

---

## Contribuer

Une position incorrecte ? Une source expirée ? Un candidat absent qui devrait figurer ?

→ Voir [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Structure du projet

```
wahlomat-strasbourg-2026.html   ← Application complète (autonome, fonctionne en local)
wahlomat-data.js                ← Source des données éditables
wahlomat.js                     ← Logique applicative
wahlomat.css                    ← Styles
README.md                       ← Ce fichier
CONTRIBUTING.md                 ← Guide de contribution
LICENSE                         ← Licence MIT
```

---

## Licence

MIT — voir [LICENSE](LICENSE).

Vous pouvez librement réutiliser, adapter et redistribuer ce projet, y compris pour d'autres villes ou élections, sous réserve de mentionner l'origine et de conserver la licence.

---

## Avertissement

Cet outil est fourni à titre informatif et pédagogique. L'auteur ne garantit pas l'exactitude, l'exhaustivité ou l'actualité des informations présentées. Les positions des candidats sont susceptibles d'évoluer. Aucune responsabilité ne saurait être engagée quant aux décisions prises sur la base de cet outil.

L'auteur n'est membre d'aucun parti politique et n'a reçu aucune rémunération ni instruction de la part d'un candidat, d'un parti ou d'une organisation dans le cadre de ce projet.
