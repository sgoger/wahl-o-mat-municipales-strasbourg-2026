# Vérification des sources

Vérifie que les positions candidates dans le Wahl-O-Mat sont fidèles à leurs sources.

## Arguments acceptés : $ARGUMENTS

- Aucun argument → vérifie toutes les positions (peut être long : ~100+ URLs)
- Un identifiant de candidat (`barseghian`, `trautmann`, `vetter`, `joron`, `kobryn`, `jakubowicz`) → limite à ce candidat
- Un identifiant de thèse (`T1`…`T33`) → limite à cette thèse pour tous les candidats

## Instructions

1. Utilise le **Read tool** pour lire `index.html` et extraire `POSITIONS` et `CANDIDATES`.
2. Si `$ARGUMENTS` est un identifiant de candidat connu, filtre les positions à ce candidat.
3. Si `$ARGUMENTS` correspond au format `T\d+`, filtre à cette thèse pour tous les candidats.
4. Pour chaque position dans le périmètre, utilise **WebFetch** avec le prompt suivant :
   > « Cet extrait est-il présent ou fidèlement résumé dans cet article ? L'article permet-il de conclure que le candidat est d'accord / neutre / pas d'accord avec cette idée ? Extrait : "[excerpt]" | Position déclarée : [stance] »
5. Produis le rapport complet en français.

## Ce que tu vérifies pour chaque position

### 1. Accessibilité de l'URL
L'article est-il accessible ? (pas de 404, pas de paywall bloquant intégralement le contenu)

### 2. Fidélité de l'extrait
L'`excerpt` est-il présent textuellement dans l'article, ou en est-il un résumé fidèle sans déformation ?
Signale toute paraphrase qui change le sens ou amplifie une position.

### 3. Exactitude de la stance
La valeur `stance` (`agree` / `neutral` / `disagree`) correspond-elle à ce que l'article dit réellement ?
Attention aux :
- Citations sorties de contexte
- Positions conditionnelles présentées comme fermes
- Prises de position passées présentées comme actuelles

## Format de sortie

### Tableau de vérification

| Candidat | Thèse | URL | Extrait fidèle | Stance exacte | Sévérité | Notes |
|----------|-------|-----|----------------|---------------|----------|-------|
| Barseghian | T1 | ✅ Accessible | ✅ Fidèle | ✅ Correcte | ✅ OK | — |
| Trautmann | T3 | ⚠️ Paywall | ❓ Non vérifiable | ❓ Non vérifiable | 🟡 Mineur | Contenu inaccessible |
| Vetter | T7 | ✅ Accessible | ❌ Déformé | ✅ Correcte | 🔴 Majeur | L'extrait omet une condition importante |

Sévérités :
- ✅ OK — position vérifiée, aucun problème
- 🟡 Mineur — URL injoignable ou paywall (non falsifiable, mais structurellement valide)
- 🔴 Majeur — extrait inexact ou stance incorrecte → correction nécessaire

### Résumé

```
Positions vérifiées :      XX
  dont ✅ OK :             XX
  dont 🟡 Mineures :       XX (URL inaccessible)
  dont 🔴 Majeures :       XX (contenu incorrect)
```

Si des problèmes majeurs sont trouvés, suggère de créer un GitHub issue avec le label `chore` pour chaque position concernée, en indiquant le candidat, la thèse, et la correction à apporter.
