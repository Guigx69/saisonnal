# Sources de donnees saisonnieres

Saisonnal doit eviter les donnees inventees. Une saison, une origine locale ou un conseil eco ne doit etre publie comme fiable que si une source identifiable le justifie.

## Sources a privilegier

- Organismes publics ou parapublics : Ministere de l'Agriculture, ADEME, FranceAgriMer, Ifremer, Interfel, CNIEL, chambres d'agriculture.
- Calendriers saisonniers reconnus et datables : guides officiels, publications professionnelles, fiches filieres.
- Sources regionales quand la saison depend du territoire : regions, departements, interprofessions locales, parcs naturels, labels AOP/IGP.
- Pour les poissons : sources liees aux zones de peche, periodes de reproduction, tailles minimales, recommandations de durabilite et etat des stocks.
- Pour les fromages : sources liees aux periodes de production, affinage, AOP/IGP, disponibilite locale et saison laitiere.

## Validation d'une saison

1. Identifier le produit, sa categorie et le territoire concerne.
2. Relever les mois de disponibilite et, si possible, les mois de pleine saison.
3. Distinguer clairement :
   - `seasonMonths` : mois recommandes pour consommer le produit.
   - `peakMonths` : mois de pleine saison lorsque la source le precise.
   - `availabilityMonths` : mois ou le produit peut exister sans etre forcement optimal.
4. Ajouter au moins une entree `sourceRefs` avec `label`, `url` si disponible, et `accessedAt`.
5. Renseigner `confidenceLevel` :
   - `high` : source officielle ou plusieurs sources concordantes.
   - `medium` : source reconnue mais regionale, incomplete ou non exhaustive.
   - `low` : source utile mais insuffisante pour une recommandation forte.
   - `unknown` : donnees non validees, ne pas presenter comme fiable.

## Cas incertains

- Laisser les tableaux de mois vides si la saison n'est pas validee.
- Utiliser `localNotes` pour noter ce qui doit etre verifie.
- Garder `sourceRefs` vide uniquement pour les produits pilotes non publies comme recommandations.
- Ne pas deduire une saison d'une intuition, d'une habitude culinaire ou d'un produit similaire.
- Si la saison varie fortement selon la region, mettre `isRegional: true` et preciser `regionScope`.

## Regles anti-donnees inventees

- Ne jamais ajouter de mois "probables" sans source.
- Ne jamais transformer une disponibilite commerciale en saison eco-responsable sans verification.
- Ne jamais marquer `confidenceLevel: "high"` sans source solide.
- Ne jamais utiliser une source ancienne sans verifier si elle est encore applicable.
- Preferer une fiche incomplete mais honnete a une fiche complete non sourcee.
