// MongoDB seed script — exécuté automatiquement au premier démarrage du container
// (via /docker-entrypoint-initdb.d/) et manuellement via `make seed`
//
// Données : 5 ingrédients + 4 recettes calées sur les données initiales du mobile

// biome-ignore lint/correctness/noInvalidUseBeforeDeclaration: db is a mongosh global
const cmdb = db.getSiblingDB('CMDB')

// ─── Idempotence : ne re-seede pas si des données existent déjà ───────────────
if (cmcmdb.ingredients.countDocuments() > 0) {
  print('✓ Seed déjà effectué — base non vide, on passe.')
  quit(0)
}

// ─── Ingrédients ──────────────────────────────────────────────────────────────
const ingredients = [
  { title: 'Saumon', unit: 'grammes' },
  { title: 'Haricots verts', unit: 'grammes' },
  { title: 'Carottes', unit: 'grammes' },
  { title: 'Riz arborio', unit: 'grammes' },
  { title: 'Champignons', unit: 'grammes' },
  { title: 'Oignon', unit: 'sans' },
  { title: 'Bouillon de légumes', unit: 'litres' },
  { title: 'Crème fraîche', unit: 'litres' },
  { title: 'Vin blanc sec', unit: 'litres' },
  { title: 'Parmesan râpé', unit: 'grammes' },
  { title: 'Beurre', unit: 'grammes' },
  { title: 'Poulet entier', unit: 'sans' },
  { title: 'Ail', unit: 'sans' },
  { title: "Huile d'olive", unit: 'cuillere_a_soupe' },
  { title: 'Jus de citron', unit: 'cuillere_a_soupe' },
  { title: 'Romarin', unit: 'sans' },
  { title: 'Thym', unit: 'sans' },
  { title: 'Gingembre frais', unit: 'cuillere_a_cafe' },
]

const ingResult = cmdb.ingredients.insertMany(ingredients)
const ingMap = {}
ingredients.forEach((ing, i) => {
  ingMap[ing.title] = ingResult.insertedIds[i]
})
print(`✓ ${Object.keys(ingMap).length} ingrédients insérés`)

// ─── Recettes ─────────────────────────────────────────────────────────────────
const SEED_USER = 'seed-user'

const recipes = [
  {
    name: 'Saumon aux haricots verts',
    idCreator: SEED_USER,
    category: 'poissons',
    isLiked: false,
    steps:
      "1. Cuire les haricots verts dans une casserole d'eau salée puis égoutter. " +
      "2. Dans une poêle chaude avec l'huile d'olive, saisir les pavés de saumon 3 à 4 minutes sur la première face, puis 2 à 3 minutes sur l'autre. " +
      '3. Assaisonner avec sel, poivre et jus de citron. Servir chaud.',
    ingredients: [
      { ingredient: ingMap['Saumon'], quantity: 300 },
      { ingredient: ingMap['Haricots verts'], quantity: 300 },
      { ingredient: ingMap['Ail'], quantity: 1 },
      { ingredient: ingMap["Huile d'olive"], quantity: 1 },
      { ingredient: ingMap['Jus de citron'], quantity: 1 },
    ],
  },
  {
    name: 'Velouté de carottes',
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: false,
    steps:
      "1. Émincer l'oignon puis faire revenir dans l'huile d'olive. " +
      '2. Ajouter les carottes en rondelles, couvrir de bouillon et cuire 20 minutes. ' +
      "3. Mixer avec la crème et le gingembre. Rectifier l'assaisonnement et servir chaud.",
    ingredients: [
      { ingredient: ingMap['Carottes'], quantity: 500 },
      { ingredient: ingMap['Oignon'], quantity: 1 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 0.75 },
      { ingredient: ingMap['Crème fraîche'], quantity: 0.1 },
      { ingredient: ingMap['Gingembre frais'], quantity: 1 },
      { ingredient: ingMap["Huile d'olive"], quantity: 1 },
    ],
  },
  {
    name: 'Risotto aux champignons',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: true,
    steps:
      "1. Faire revenir l'oignon et les champignons au beurre. " +
      '2. Ajouter le riz et nacrer une minute. ' +
      '3. Mouiller avec le vin blanc puis ajouter le bouillon progressivement en remuant. ' +
      '4. Terminer avec le parmesan pour un risotto bien crémeux.',
    ingredients: [
      { ingredient: ingMap['Riz arborio'], quantity: 300 },
      { ingredient: ingMap['Champignons'], quantity: 250 },
      { ingredient: ingMap['Oignon'], quantity: 1 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.15 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 1 },
      { ingredient: ingMap['Parmesan râpé'], quantity: 60 },
      { ingredient: ingMap['Beurre'], quantity: 40 },
    ],
  },
  {
    name: 'Poulet rôti aux herbes',
    idCreator: SEED_USER,
    category: 'viandes',
    isLiked: false,
    steps:
      '1. Préchauffer le four à 200°C. ' +
      '2. Frotter le poulet avec beurre, ail, thym, romarin, sel et poivre. ' +
      '3. Enfourner environ 1 heure en arrosant régulièrement. ' +
      '4. Ajouter un trait de citron avant de servir.',
    ingredients: [
      { ingredient: ingMap['Poulet entier'], quantity: 1 },
      { ingredient: ingMap['Ail'], quantity: 4 },
      { ingredient: ingMap['Romarin'], quantity: 3 },
      { ingredient: ingMap['Thym'], quantity: 3 },
      { ingredient: ingMap['Beurre'], quantity: 50 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
      { ingredient: ingMap['Jus de citron'], quantity: 1 },
    ],
  },
]

cmdb.recipes.insertMany(recipes)
print(`✓ ${recipes.length} recettes insérées`)
print('✓ Seed terminé.')
