# Audit d'objectivité des thèses

Analyse toutes les thèses du Wahl-O-Mat pour détecter les biais de formulation.

## Instructions

1. Utilise le **Read tool** pour lire `index.html` et extraire le tableau `THESES`.
2. Pour chaque thèse, applique les 5 critères ci-dessous.
3. Produis le rapport complet en français.

## Critères d'analyse

Pour chaque thèse, évalue :

### 1. Charge lexicale
Présence de mots chargés émotionnellement ou politiquement : « enfin », « vraiment », « grave », « nécessaire », « indispensable », adverbes d'intensité (« absolument », « clairement »), superlatifs injustifiés.

### 2. Présupposé implicite
La thèse tient-elle pour acquis un fait contestable avant même que l'utilisateur réponde ?
Exemple problématique : *« La ville doit accélérer la transition écologique »* (présuppose que la vitesse actuelle est insuffisante).
Formulation neutre préférable : *« La ville doit adopter un rythme plus rapide de transition écologique »*.

### 3. Falsifiabilité
Un citoyen raisonnable peut-il légitimement répondre AUSSI BIEN « d'accord » que « pas d'accord » sans être perçu comme extrémiste ou irrationnel ? Si seule une réponse semble défendable, la thèse est biaisée.

### 4. Asymétrie de charge argumentative
L'une des réponses nécessite-t-elle beaucoup plus d'explication ou de justification que l'autre pour paraître crédible ?

### 5. Clarté du périmètre
La thèse est-elle suffisamment précise pour permettre une comparaison significative entre candidats ? Éviter les thèses trop vagues (« La ville doit améliorer les services publics ») qui recueilleraient l'accord de tous.

## Format de sortie

### Tableau d'analyse

| ID | Thèse (extrait) | Critère | Sévérité | Problème constaté | Reformulation suggérée |
|----|-----------------|---------|----------|-------------------|------------------------|
| T1 | … | Présupposé | 🟡 Mineur | … | … |
| T5 | … | Falsifiabilité | 🔴 Majeur | … | … |

Sévérités :
- ✅ Aucun problème
- 🟡 Mineur — formulation perfectible mais acceptable
- 🔴 Majeur — reformulation nécessaire avant publication

### Résumé

```
Thèses sans problème :  XX / 33
Problèmes mineurs (🟡) : XX
Problèmes majeurs (🔴) : XX
```

Si des problèmes majeurs sont trouvés, suggère de créer un GitHub issue avec le label `chore` pour chaque thèse concernée.
