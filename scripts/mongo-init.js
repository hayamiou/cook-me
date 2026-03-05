// MongoDB seed script — exécuté automatiquement au premier démarrage du container
// (via /docker-entrypoint-initdb.d/) et manuellement via `make seed`

// biome-ignore lint/correctness/noInvalidUseBeforeDeclaration: db is a mongosh global
const cmdb = db.getSiblingDB('CMDB')

if (cmdb.ingredients.countDocuments() > 0) {
  print('✓ Seed déjà effectué — base non vide, on passe.')
  quit(0)
}

// ─── INGRÉDIENTS (300) ────────────────────────────────────────────────────────

const ingredients = [
  // Légumes
  { title: 'Carotte', unit: 'grammes' },
  { title: 'Oignon', unit: 'sans' },
  { title: 'Ail', unit: 'sans' },
  { title: 'Poireau', unit: 'sans' },
  { title: 'Courgette', unit: 'sans' },
  { title: 'Aubergine', unit: 'sans' },
  { title: 'Poivron rouge', unit: 'sans' },
  { title: 'Poivron vert', unit: 'sans' },
  { title: 'Poivron jaune', unit: 'sans' },
  { title: 'Tomate', unit: 'sans' },
  { title: 'Tomate cerise', unit: 'grammes' },
  { title: 'Pomme de terre', unit: 'grammes' },
  { title: 'Patate douce', unit: 'grammes' },
  { title: 'Brocoli', unit: 'grammes' },
  { title: 'Chou-fleur', unit: 'sans' },
  { title: 'Chou blanc', unit: 'grammes' },
  { title: 'Chou rouge', unit: 'grammes' },
  { title: 'Épinards frais', unit: 'grammes' },
  { title: 'Salade verte', unit: 'sans' },
  { title: 'Roquette', unit: 'grammes' },
  { title: 'Endive', unit: 'sans' },
  { title: 'Fenouil', unit: 'sans' },
  { title: 'Céleri branche', unit: 'sans' },
  { title: 'Céleri-rave', unit: 'grammes' },
  { title: 'Betterave', unit: 'sans' },
  { title: 'Radis', unit: 'grammes' },
  { title: 'Navet', unit: 'sans' },
  { title: 'Panais', unit: 'grammes' },
  { title: 'Artichaut', unit: 'sans' },
  { title: 'Asperge', unit: 'grammes' },
  { title: 'Haricots verts', unit: 'grammes' },
  { title: 'Petits pois', unit: 'grammes' },
  { title: 'Maïs', unit: 'grammes' },
  { title: 'Avocat', unit: 'sans' },
  { title: 'Concombre', unit: 'sans' },
  { title: 'Butternut', unit: 'grammes' },
  { title: 'Potiron', unit: 'grammes' },
  { title: 'Champignons de Paris', unit: 'grammes' },
  { title: 'Champignons shiitake', unit: 'grammes' },
  { title: 'Champignons portobello', unit: 'grammes' },
  { title: 'Girolles', unit: 'grammes' },
  { title: 'Cèpes', unit: 'grammes' },
  { title: 'Tomate séchée', unit: 'grammes' },
  { title: 'Olive noire', unit: 'grammes' },
  { title: 'Olive verte', unit: 'grammes' },
  { title: 'Câpres', unit: 'grammes' },
  { title: 'Cornichon', unit: 'grammes' },
  { title: 'Piment rouge', unit: 'sans' },
  { title: 'Gingembre frais', unit: 'grammes' },
  { title: 'Curcuma frais', unit: 'grammes' },
  { title: 'Citronnelle', unit: 'sans' },
  { title: 'Haricots blancs', unit: 'grammes' },
  { title: 'Lentilles vertes', unit: 'grammes' },
  { title: 'Lentilles corail', unit: 'grammes' },
  { title: 'Pois chiches', unit: 'grammes' },
  { title: 'Fèves', unit: 'grammes' },
  { title: 'Chou de Bruxelles', unit: 'grammes' },
  { title: 'Bette à carde', unit: 'grammes' },
  { title: 'Persil plat', unit: 'grammes' },
  { title: 'Ciboulette', unit: 'grammes' },

  // Fruits
  { title: 'Citron', unit: 'sans' },
  { title: 'Citron vert', unit: 'sans' },
  { title: 'Orange', unit: 'sans' },
  { title: 'Pamplemousse', unit: 'sans' },
  { title: 'Pomme', unit: 'sans' },
  { title: 'Poire', unit: 'sans' },
  { title: 'Banane', unit: 'sans' },
  { title: 'Fraise', unit: 'grammes' },
  { title: 'Framboise', unit: 'grammes' },
  { title: 'Myrtille', unit: 'grammes' },
  { title: 'Cerise', unit: 'grammes' },
  { title: 'Abricot', unit: 'sans' },
  { title: 'Pêche', unit: 'sans' },
  { title: 'Mangue', unit: 'sans' },
  { title: 'Ananas', unit: 'sans' },
  { title: 'Kiwi', unit: 'sans' },
  { title: 'Melon', unit: 'sans' },
  { title: 'Raisin', unit: 'grammes' },
  { title: 'Figue', unit: 'sans' },
  { title: 'Datte', unit: 'grammes' },
  { title: 'Prune', unit: 'sans' },
  { title: 'Grenade', unit: 'sans' },
  { title: 'Noix de coco râpée', unit: 'grammes' },
  { title: 'Zeste de citron', unit: 'sans' },
  { title: "Zeste d'orange", unit: 'sans' },
  { title: 'Jus de citron', unit: 'cuillere_a_soupe' },
  { title: "Jus d'orange", unit: 'litres' },
  { title: 'Citron confit', unit: 'sans' },
  { title: 'Pastèque', unit: 'grammes' },
  { title: 'Nectarine', unit: 'sans' },

  // Viandes
  { title: 'Poulet entier', unit: 'sans' },
  { title: 'Blanc de poulet', unit: 'grammes' },
  { title: 'Cuisse de poulet', unit: 'sans' },
  { title: 'Escalope de dinde', unit: 'grammes' },
  { title: 'Bœuf haché', unit: 'grammes' },
  { title: 'Steak de bœuf', unit: 'grammes' },
  { title: 'Rôti de bœuf', unit: 'grammes' },
  { title: 'Joue de bœuf', unit: 'grammes' },
  { title: 'Veau haché', unit: 'grammes' },
  { title: 'Escalope de veau', unit: 'grammes' },
  { title: 'Côte de porc', unit: 'sans' },
  { title: 'Filet de porc', unit: 'grammes' },
  { title: 'Lardons', unit: 'grammes' },
  { title: 'Jambon blanc', unit: 'grammes' },
  { title: 'Chorizo', unit: 'grammes' },
  { title: 'Saucisse de Toulouse', unit: 'sans' },
  { title: 'Merguez', unit: 'sans' },
  { title: "Gigot d'agneau", unit: 'grammes' },
  { title: "Épaule d'agneau", unit: 'grammes' },
  { title: "Côtelette d'agneau", unit: 'sans' },
  { title: 'Canard confit', unit: 'sans' },
  { title: 'Magret de canard', unit: 'sans' },
  { title: 'Bacon', unit: 'grammes' },
  { title: 'Pancetta', unit: 'grammes' },
  { title: 'Prosciutto', unit: 'grammes' },

  // Poissons & fruits de mer
  { title: 'Filet de saumon', unit: 'grammes' },
  { title: 'Pavé de saumon', unit: 'sans' },
  { title: 'Thon frais', unit: 'grammes' },
  { title: 'Cabillaud', unit: 'grammes' },
  { title: 'Filet de sole', unit: 'sans' },
  { title: 'Bar', unit: 'sans' },
  { title: 'Dorade', unit: 'sans' },
  { title: 'Truite', unit: 'sans' },
  { title: 'Crevettes décortiquées', unit: 'grammes' },
  { title: 'Gambas', unit: 'sans' },
  { title: 'Moules', unit: 'grammes' },
  { title: 'Palourdes', unit: 'grammes' },
  { title: 'Poulpe', unit: 'grammes' },
  { title: 'Saint-Jacques', unit: 'sans' },
  { title: 'Thon en boîte', unit: 'grammes' },

  // Produits laitiers & œufs
  { title: 'Beurre', unit: 'grammes' },
  { title: 'Crème fraîche épaisse', unit: 'grammes' },
  { title: 'Crème liquide entière', unit: 'litres' },
  { title: 'Lait entier', unit: 'litres' },
  { title: 'Lait demi-écrémé', unit: 'litres' },
  { title: 'Lait de coco', unit: 'litres' },
  { title: 'Crème de coco', unit: 'litres' },
  { title: 'Yaourt nature', unit: 'sans' },
  { title: 'Yaourt grec', unit: 'grammes' },
  { title: 'Œuf', unit: 'sans' },
  { title: "Jaune d'œuf", unit: 'sans' },
  { title: "Blanc d'œuf", unit: 'sans' },
  { title: 'Fromage blanc', unit: 'grammes' },
  { title: 'Ricotta', unit: 'grammes' },
  { title: 'Mascarpone', unit: 'grammes' },
  { title: 'Parmesan râpé', unit: 'grammes' },
  { title: 'Gruyère râpé', unit: 'grammes' },
  { title: 'Emmental râpé', unit: 'grammes' },
  { title: 'Mozzarella', unit: 'grammes' },
  { title: 'Burrata', unit: 'sans' },
  { title: 'Gorgonzola', unit: 'grammes' },
  { title: 'Roquefort', unit: 'grammes' },
  { title: 'Chèvre frais', unit: 'grammes' },
  { title: 'Feta', unit: 'grammes' },
  { title: 'Comté râpé', unit: 'grammes' },
  { title: 'Beurre demi-sel', unit: 'grammes' },

  // Féculents & céréales
  { title: 'Farine de blé', unit: 'grammes' },
  { title: 'Farine de riz', unit: 'grammes' },
  { title: 'Fécule de maïs', unit: 'grammes' },
  { title: 'Semoule fine', unit: 'grammes' },
  { title: 'Riz basmati', unit: 'grammes' },
  { title: 'Riz arborio', unit: 'grammes' },
  { title: 'Riz complet', unit: 'grammes' },
  { title: 'Riz thaï', unit: 'grammes' },
  { title: 'Pâtes tagliatelles', unit: 'grammes' },
  { title: 'Pâtes spaghetti', unit: 'grammes' },
  { title: 'Pâtes penne', unit: 'grammes' },
  { title: 'Pâtes fusilli', unit: 'grammes' },
  { title: 'Feuilles de lasagne', unit: 'sans' },
  { title: 'Pâtes orzo', unit: 'grammes' },
  { title: 'Quinoa', unit: 'grammes' },
  { title: 'Boulgour', unit: 'grammes' },
  { title: "Flocons d'avoine", unit: 'grammes' },
  { title: 'Chapelure', unit: 'grammes' },
  { title: 'Polenta', unit: 'grammes' },
  { title: 'Vermicelles de riz', unit: 'grammes' },
  { title: 'Pain de mie', unit: 'sans' },
  { title: 'Baguette', unit: 'sans' },
  { title: 'Levure chimique', unit: 'grammes' },
  { title: 'Bicarbonate de soude', unit: 'grammes' },
  { title: 'Levure boulangère', unit: 'grammes' },

  // Huiles & vinaigres
  { title: "Huile d'olive", unit: 'cuillere_a_soupe' },
  { title: 'Huile de sésame', unit: 'cuillere_a_soupe' },
  { title: 'Huile de tournesol', unit: 'cuillere_a_soupe' },
  { title: 'Huile de noix de coco', unit: 'cuillere_a_soupe' },
  { title: 'Vinaigre balsamique', unit: 'cuillere_a_soupe' },
  { title: 'Vinaigre de vin rouge', unit: 'cuillere_a_soupe' },
  { title: 'Vinaigre de cidre', unit: 'cuillere_a_soupe' },
  { title: 'Vinaigre de riz', unit: 'cuillere_a_soupe' },

  // Condiments & sauces
  { title: 'Sauce soja', unit: 'cuillere_a_soupe' },
  { title: 'Sauce nuoc-mam', unit: 'cuillere_a_soupe' },
  { title: 'Sauce worcestershire', unit: 'cuillere_a_soupe' },
  { title: 'Sauce tabasco', unit: 'cuillere_a_cafe' },
  { title: 'Moutarde de Dijon', unit: 'cuillere_a_soupe' },
  { title: "Moutarde à l'ancienne", unit: 'cuillere_a_soupe' },
  { title: 'Mayonnaise', unit: 'cuillere_a_soupe' },
  { title: 'Ketchup', unit: 'cuillere_a_soupe' },
  { title: 'Concentré de tomate', unit: 'cuillere_a_soupe' },
  { title: 'Tomates pelées en boîte', unit: 'grammes' },
  { title: 'Coulis de tomate', unit: 'litres' },
  { title: 'Pesto verde', unit: 'cuillere_a_soupe' },
  { title: 'Tapenade', unit: 'cuillere_a_soupe' },
  { title: 'Harissa', unit: 'cuillere_a_cafe' },
  { title: 'Crème de balsamique', unit: 'cuillere_a_soupe' },
  { title: 'Tahini', unit: 'cuillere_a_soupe' },
  { title: 'Beurre de cacahuète', unit: 'cuillere_a_soupe' },
  { title: 'Sauce hoisin', unit: 'cuillere_a_soupe' },
  { title: 'Sauce huître', unit: 'cuillere_a_soupe' },
  { title: 'Sauce teriyaki', unit: 'cuillere_a_soupe' },

  // Bouillons & alcools
  { title: 'Bouillon de poulet', unit: 'litres' },
  { title: 'Bouillon de légumes', unit: 'litres' },
  { title: 'Bouillon de bœuf', unit: 'litres' },
  { title: 'Fond de veau', unit: 'litres' },
  { title: 'Vin blanc sec', unit: 'litres' },
  { title: 'Vin rouge', unit: 'litres' },
  { title: 'Cognac', unit: 'cuillere_a_soupe' },
  { title: 'Rhum brun', unit: 'cuillere_a_soupe' },
  { title: 'Bière blonde', unit: 'litres' },
  { title: 'Calvados', unit: 'cuillere_a_soupe' },
  { title: 'Porto', unit: 'cuillere_a_soupe' },
  { title: 'Amaretto', unit: 'cuillere_a_soupe' },
  { title: 'Café expresso', unit: 'sans' },

  // Épices & herbes séchées
  { title: 'Sel fin', unit: 'sans' },
  { title: 'Fleur de sel', unit: 'sans' },
  { title: 'Poivre noir moulu', unit: 'sans' },
  { title: 'Paprika doux', unit: 'cuillere_a_cafe' },
  { title: 'Paprika fumé', unit: 'cuillere_a_cafe' },
  { title: 'Cumin moulu', unit: 'cuillere_a_cafe' },
  { title: 'Curcuma moulu', unit: 'cuillere_a_cafe' },
  { title: 'Curry en poudre', unit: 'cuillere_a_cafe' },
  { title: 'Garam masala', unit: 'cuillere_a_cafe' },
  { title: 'Coriandre moulue', unit: 'cuillere_a_cafe' },
  { title: 'Cannelle moulue', unit: 'cuillere_a_cafe' },
  { title: 'Cardamome moulue', unit: 'cuillere_a_cafe' },
  { title: 'Clous de girofle', unit: 'sans' },
  { title: 'Muscade râpée', unit: 'cuillere_a_cafe' },
  { title: 'Anis étoilé', unit: 'sans' },
  { title: 'Piment de Cayenne', unit: 'cuillere_a_cafe' },
  { title: "Piment d'Espelette", unit: 'cuillere_a_cafe' },
  { title: 'Herbes de Provence', unit: 'cuillere_a_cafe' },
  { title: 'Origan séché', unit: 'cuillere_a_cafe' },
  { title: 'Thym séché', unit: 'cuillere_a_cafe' },
  { title: 'Romarin séché', unit: 'cuillere_a_cafe' },
  { title: 'Laurier', unit: 'sans' },
  { title: 'Basilic frais', unit: 'grammes' },
  { title: 'Coriandre fraîche', unit: 'grammes' },
  { title: 'Menthe fraîche', unit: 'grammes' },
  { title: 'Aneth frais', unit: 'grammes' },
  { title: 'Estragon frais', unit: 'grammes' },
  { title: 'Safran', unit: 'sans' },
  { title: 'Ras el hanout', unit: 'cuillere_a_cafe' },
  { title: 'Cinq épices', unit: 'cuillere_a_cafe' },
  { title: 'Sumac', unit: 'cuillere_a_cafe' },

  // Sucre & pâtisserie
  { title: 'Sucre blanc', unit: 'grammes' },
  { title: 'Sucre roux', unit: 'grammes' },
  { title: 'Sucre glace', unit: 'grammes' },
  { title: 'Miel', unit: 'cuillere_a_soupe' },
  { title: "Sirop d'érable", unit: 'cuillere_a_soupe' },
  { title: "Sirop d'agave", unit: 'cuillere_a_soupe' },
  { title: 'Chocolat noir 70%', unit: 'grammes' },
  { title: 'Chocolat au lait', unit: 'grammes' },
  { title: 'Chocolat blanc', unit: 'grammes' },
  { title: 'Cacao en poudre non sucré', unit: 'grammes' },
  { title: 'Gousse de vanille', unit: 'sans' },
  { title: 'Extrait de vanille', unit: 'cuillere_a_cafe' },
  { title: 'Amandes entières', unit: 'grammes' },
  { title: 'Amandes effilées', unit: 'grammes' },
  { title: 'Noisettes', unit: 'grammes' },
  { title: 'Noix', unit: 'grammes' },
  { title: 'Pistaches', unit: 'grammes' },
  { title: 'Noix de cajou', unit: 'grammes' },
  { title: 'Noix de pécan', unit: 'grammes' },
  { title: 'Pignons de pin', unit: 'grammes' },
  { title: 'Sésame blanc', unit: 'grammes' },
  { title: 'Confiture de framboise', unit: 'cuillere_a_soupe' },
  { title: "Confiture d'abricot", unit: 'cuillere_a_soupe' },
  { title: 'Pâte de spéculoos', unit: 'grammes' },
  { title: 'Gélatine en feuilles', unit: 'sans' },
  { title: 'Biscuits spéculoos', unit: 'grammes' },
  { title: 'Biscuits à la cuillère', unit: 'sans' },
  { title: 'Pâte feuilletée', unit: 'sans' },
  { title: 'Pâte brisée', unit: 'sans' },
  { title: 'Pâte sablée', unit: 'sans' },
  { title: 'Sucre vanillé', unit: 'grammes' },

  // Divers
  { title: "Huile d'olive extra vierge", unit: 'cuillere_a_soupe' },
  { title: 'Sauce de soja sucrée', unit: 'cuillere_a_soupe' },
  { title: 'Fumet de poisson', unit: 'litres' },
  { title: 'Câpres à la grecque', unit: 'grammes' },
  { title: 'Anchois en boîte', unit: 'grammes' },
  { title: 'Sardines en boîte', unit: 'grammes' },
  { title: 'Lait de soja', unit: 'litres' },
  { title: 'Levure de bière', unit: 'grammes' },
  { title: 'Huile de pépins de raisin', unit: 'cuillere_a_soupe' },
  { title: "Eau de fleur d'oranger", unit: 'cuillere_a_soupe' },
]

const ingResult = cmdb.ingredients.insertMany(ingredients)
const ingMap = {}
ingredients.forEach((ing, i) => {
  ingMap[ing.title] = ingResult.insertedIds[i]
})
print(`✓ ${Object.keys(ingMap).length} ingrédients insérés`)

// ─── RECETTES (30) ────────────────────────────────────────────────────────────

const SEED_USER = 'seed-user'

const recipes = [
  // ── POTAGES ──────────────────────────────────────────────────────────────────
  {
    name: 'Velouté de carottes au gingembre',
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200',
    steps:
      "1. Émincer l'oignon et faire revenir dans l'huile d'olive. " +
      '2. Ajouter les carottes en rondelles et le gingembre râpé, couvrir de bouillon. ' +
      '3. Cuire 20 min puis mixer avec la crème. Assaisonner et servir chaud.',
    ingredients: [
      { ingredient: ingMap['Carotte'], quantity: 600 },
      { ingredient: ingMap['Oignon'], quantity: 1 },
      { ingredient: ingMap['Gingembre frais'], quantity: 20 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 0.8 },
      { ingredient: ingMap['Crème liquide entière'], quantity: 0.1 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
    ],
  },
  {
    name: "Soupe à l'oignon gratinée",
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: true,
    imageKey: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200',
    steps:
      '1. Émincer finement les oignons et les faire caraméliser à feu doux dans le beurre 30 min. ' +
      '2. Déglacer au vin blanc, ajouter le bouillon de bœuf. Cuire 20 min. ' +
      '3. Verser dans des ramequins, déposer une tranche de baguette et du gruyère, gratiner au four.',
    ingredients: [
      { ingredient: ingMap['Oignon'], quantity: 6 },
      { ingredient: ingMap['Beurre'], quantity: 40 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.15 },
      { ingredient: ingMap['Bouillon de bœuf'], quantity: 1.2 },
      { ingredient: ingMap['Baguette'], quantity: 1 },
      { ingredient: ingMap['Gruyère râpé'], quantity: 120 },
    ],
  },
  {
    name: 'Gaspacho andalou',
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1529566652340-2c41a1eb6d19?w=1200',
    steps:
      '1. Mixer tomates, concombre, poivron rouge, ail et pain de mie trempé. ' +
      "2. Ajouter l'huile d'olive et le vinaigre de vin rouge, assaisonner. " +
      '3. Réfrigérer 2h minimum. Servir très frais avec des dés de légumes.',
    ingredients: [
      { ingredient: ingMap['Tomate'], quantity: 6 },
      { ingredient: ingMap['Concombre'], quantity: 1 },
      { ingredient: ingMap['Poivron rouge'], quantity: 1 },
      { ingredient: ingMap['Ail'], quantity: 2 },
      { ingredient: ingMap['Pain de mie'], quantity: 3 },
      { ingredient: ingMap["Huile d'olive"], quantity: 4 },
      { ingredient: ingMap['Vinaigre de vin rouge'], quantity: 2 },
    ],
  },
  {
    name: 'Velouté de butternut rôti',
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: true,
    imageKey: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=1200',
    steps:
      '1. Couper le butternut en cubes, rôtir au four 25 min avec huile et herbes de Provence. ' +
      '2. Mixer avec le bouillon et le lait de coco. ' +
      '3. Assaisonner avec curry et muscade, servir avec des pignons de pin grillés.',
    ingredients: [
      { ingredient: ingMap['Butternut'], quantity: 800 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 0.6 },
      { ingredient: ingMap['Lait de coco'], quantity: 0.2 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
      { ingredient: ingMap['Curry en poudre'], quantity: 1 },
      { ingredient: ingMap['Muscade râpée'], quantity: 1 },
      { ingredient: ingMap['Pignons de pin'], quantity: 30 },
    ],
  },
  {
    name: 'Soupe de lentilles corail au curry',
    idCreator: SEED_USER,
    category: 'potages',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200',
    steps:
      '1. Faire revenir oignon et ail, ajouter les lentilles rincées, le lait de coco et le bouillon. ' +
      '2. Incorporer curry, cumin et curcuma. Cuire 20 min. ' +
      '3. Mixer partiellement pour une texture crémeuse avec quelques morceaux.',
    ingredients: [
      { ingredient: ingMap['Lentilles corail'], quantity: 300 },
      { ingredient: ingMap['Oignon'], quantity: 1 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Lait de coco'], quantity: 0.4 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 0.6 },
      { ingredient: ingMap['Curry en poudre'], quantity: 2 },
      { ingredient: ingMap['Cumin moulu'], quantity: 1 },
      { ingredient: ingMap['Curcuma moulu'], quantity: 1 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
    ],
  },

  // ── VÉGÉS ─────────────────────────────────────────────────────────────────────
  {
    name: 'Risotto aux champignons',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: true,
    imageKey: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200',
    steps:
      "1. Faire revenir l'oignon et les champignons dans le beurre. " +
      '2. Ajouter le riz et nacrer 1 min. Déglacer au vin blanc. ' +
      '3. Incorporer le bouillon progressivement en remuant. Terminer avec le parmesan.',
    ingredients: [
      { ingredient: ingMap['Riz arborio'], quantity: 300 },
      { ingredient: ingMap['Champignons de Paris'], quantity: 250 },
      { ingredient: ingMap['Champignons shiitake'], quantity: 100 },
      { ingredient: ingMap['Oignon'], quantity: 1 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.15 },
      { ingredient: ingMap['Bouillon de légumes'], quantity: 1 },
      { ingredient: ingMap['Parmesan râpé'], quantity: 60 },
      { ingredient: ingMap['Beurre'], quantity: 40 },
    ],
  },
  {
    name: 'Gratin dauphinois',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1601024445121-e5b82f020549?w=1200',
    steps:
      "1. Préchauffer le four à 180°C. Frotter le plat avec de l'ail. " +
      '2. Disposer les pommes de terre en fines lamelles, assaisonner, verser la crème et le lait. ' +
      "3. Gratiner au four 1h jusqu'à ce que les pommes de terre soient tendres et dorées.",
    ingredients: [
      { ingredient: ingMap['Pomme de terre'], quantity: 1000 },
      { ingredient: ingMap['Ail'], quantity: 2 },
      { ingredient: ingMap['Crème liquide entière'], quantity: 0.3 },
      { ingredient: ingMap['Lait entier'], quantity: 0.3 },
      { ingredient: ingMap['Muscade râpée'], quantity: 1 },
      { ingredient: ingMap['Gruyère râpé'], quantity: 100 },
    ],
  },
  {
    name: 'Quiche épinards feta',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200',
    steps:
      '1. Précuire la pâte brisée 10 min. ' +
      '2. Faire revenir les épinards à la poêle, les égoutter. Mélanger œufs, crème, feta. ' +
      "3. Garnir la pâte des épinards et de l'appareil. Cuire 35 min à 180°C.",
    ingredients: [
      { ingredient: ingMap['Pâte brisée'], quantity: 1 },
      { ingredient: ingMap['Épinards frais'], quantity: 400 },
      { ingredient: ingMap['Feta'], quantity: 150 },
      { ingredient: ingMap['Œuf'], quantity: 3 },
      { ingredient: ingMap['Crème liquide entière'], quantity: 0.2 },
      { ingredient: ingMap['Muscade râpée'], quantity: 1 },
    ],
  },
  {
    name: 'Curry de pois chiches épinards',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: true,
    imageKey: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=1200',
    steps:
      '1. Faire revenir oignon et ail avec les épices (curry, cumin, coriandre, garam masala). ' +
      '2. Ajouter tomates concassées, pois chiches et lait de coco. Mijoter 20 min. ' +
      '3. Incorporer les épinards en fin de cuisson. Servir avec du riz basmati.',
    ingredients: [
      { ingredient: ingMap['Pois chiches'], quantity: 400 },
      { ingredient: ingMap['Épinards frais'], quantity: 200 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Tomates pelées en boîte'], quantity: 400 },
      { ingredient: ingMap['Lait de coco'], quantity: 0.4 },
      { ingredient: ingMap['Curry en poudre'], quantity: 2 },
      { ingredient: ingMap['Cumin moulu'], quantity: 1 },
      { ingredient: ingMap['Garam masala'], quantity: 1 },
      { ingredient: ingMap['Riz basmati'], quantity: 300 },
    ],
  },
  {
    name: 'Ratatouille provençale',
    idCreator: SEED_USER,
    category: 'végés',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=1200',
    steps:
      '1. Couper en cubes aubergines, courgettes, poivrons et tomates. ' +
      "2. Faire revenir séparément chaque légume dans l'huile d'olive, réserver. " +
      '3. Tout réunir avec ail, herbes de Provence et laisser mijoter 30 min à feu doux.',
    ingredients: [
      { ingredient: ingMap['Aubergine'], quantity: 2 },
      { ingredient: ingMap['Courgette'], quantity: 2 },
      { ingredient: ingMap['Poivron rouge'], quantity: 2 },
      { ingredient: ingMap['Poivron jaune'], quantity: 1 },
      { ingredient: ingMap['Tomate'], quantity: 4 },
      { ingredient: ingMap['Ail'], quantity: 4 },
      { ingredient: ingMap["Huile d'olive"], quantity: 4 },
      { ingredient: ingMap['Herbes de Provence'], quantity: 2 },
      { ingredient: ingMap['Basilic frais'], quantity: 20 },
    ],
  },

  // ── VIANDES ───────────────────────────────────────────────────────────────────
  {
    name: 'Poulet rôti aux herbes',
    idCreator: SEED_USER,
    category: 'viandes',
    isLiked: false,
    imageKey: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=1200',
    steps:
      '1. Préchauffer le four à 200°C. ' +
      '2. Frotter le poulet avec beurre, ail, thym, romarin, sel et poivre. ' +
      '3. Enfourner environ 1h en arrosant régulièrement. Ajouter un trait de jus de citron avant de servir.',
    ingredients: [
      { ingredient: ingMap['Poulet entier'], quantity: 1 },
      { ingredient: ingMap['Ail'], quantity: 4 },
      { ingredient: ingMap['Beurre'], quantity: 50 },
      { ingredient: ingMap['Thym séché'], quantity: 2 },
      { ingredient: ingMap['Romarin séché'], quantity: 2 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
      { ingredient: ingMap['Jus de citron'], quantity: 2 },
    ],
  },
  {
    name: 'Bœuf bourguignon',
    idCreator: SEED_USER,
    category: 'viandes',
    isLiked: true,
    imageKey: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=1200',
    steps:
      '1. Faire revenir les lardons et réserver. Saisir le bœuf coupé en cubes. ' +
      '2. Ajouter oignons, carottes, bouquet garni, fariner et couvrir de vin rouge. ' +
      '3. Mijoter 2h30 à couvert. Ajouter champignons en fin de cuisson.',
    ingredients: [
      { ingredient: ingMap['Joue de bœuf'], quantity: 800 },
      { ingredient: ingMap['Lardons'], quantity: 150 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Carotte'], quantity: 200 },
      { ingredient: ingMap['Champignons de Paris'], quantity: 200 },
      { ingredient: ingMap['Vin rouge'], quantity: 0.75 },
      { ingredient: ingMap['Bouillon de bœuf'], quantity: 0.3 },
      { ingredient: ingMap['Farine de blé'], quantity: 30 },
      { ingredient: ingMap['Laurier'], quantity: 2 },
      { ingredient: ingMap['Thym séché'], quantity: 1 },
    ],
  },
  {
    name: "Tajine d'agneau aux pruneaux et amandes",
    idCreator: SEED_USER,
    category: 'viandes',
    imageKey: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
    isLiked: false,
    steps:
      "1. Faire dorer l'épaule d'agneau avec oignon et épices (ras el hanout, cannelle, gingembre). " +
      '2. Ajouter bouillon, miel et pruneaux. Couvrir et mijoter 1h30. ' +
      "3. Parsemer d'amandes grillées et de coriandre fraîche. Servir avec semoule.",
    ingredients: [
      { ingredient: ingMap["Épaule d'agneau"], quantity: 800 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ras el hanout'], quantity: 2 },
      { ingredient: ingMap['Cannelle moulue'], quantity: 1 },
      { ingredient: ingMap['Gingembre frais'], quantity: 15 },
      { ingredient: ingMap['Datte'], quantity: 100 },
      { ingredient: ingMap['Miel'], quantity: 2 },
      { ingredient: ingMap['Bouillon de poulet'], quantity: 0.4 },
      { ingredient: ingMap['Amandes entières'], quantity: 60 },
      { ingredient: ingMap['Coriandre fraîche'], quantity: 20 },
      { ingredient: ingMap['Semoule fine'], quantity: 300 },
    ],
  },
  {
    name: 'Poulet tikka masala',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200',
    category: 'viandes',
    isLiked: true,
    steps:
      '1. Mariner les blancs de poulet en cubes dans yaourt grec, curry, cumin et garam masala. ' +
      '2. Saisir le poulet mariné, réserver. Faire la sauce avec oignons, tomates et lait de coco. ' +
      '3. Réunir et mijoter 15 min. Servir avec riz basmati et coriandre fraîche.',
    ingredients: [
      { ingredient: ingMap['Blanc de poulet'], quantity: 600 },
      { ingredient: ingMap['Yaourt grec'], quantity: 150 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Gingembre frais'], quantity: 20 },
      { ingredient: ingMap['Tomates pelées en boîte'], quantity: 400 },
      { ingredient: ingMap['Lait de coco'], quantity: 0.2 },
      { ingredient: ingMap['Curry en poudre'], quantity: 2 },
      { ingredient: ingMap['Garam masala'], quantity: 2 },
      { ingredient: ingMap['Coriandre fraîche'], quantity: 20 },
      { ingredient: ingMap['Riz basmati'], quantity: 300 },
    ],
  },
  {
    name: 'Côtes de porc à la moutarde',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=1200',
    category: 'viandes',
    isLiked: false,
    steps:
      '1. Saisir les côtes de porc dans le beurre, assaisonner. ' +
      "2. Déglacer au vin blanc, ajouter la crème et la moutarde à l'ancienne. " +
      '3. Laisser réduire la sauce 5 min. Servir avec des pommes de terre sautées.',
    ingredients: [
      { ingredient: ingMap['Côte de porc'], quantity: 4 },
      { ingredient: ingMap["Moutarde à l'ancienne"], quantity: 3 },
      { ingredient: ingMap['Crème fraîche épaisse'], quantity: 150 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.1 },
      { ingredient: ingMap['Beurre'], quantity: 30 },
      { ingredient: ingMap['Pomme de terre'], quantity: 600 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
    ],
  },

  // ── POISSONS ──────────────────────────────────────────────────────────────────
  {
    name: 'Saumon aux haricots verts',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200',
    category: 'poissons',
    isLiked: false,
    steps:
      "1. Cuire les haricots verts dans une casserole d'eau salée, égoutter. " +
      "2. Saisir les pavés de saumon dans l'huile d'olive 3-4 min par face. " +
      '3. Assaisonner avec jus de citron, sel et poivre. Servir avec les haricots.',
    ingredients: [
      { ingredient: ingMap['Pavé de saumon'], quantity: 4 },
      { ingredient: ingMap['Haricots verts'], quantity: 400 },
      { ingredient: ingMap['Ail'], quantity: 2 },
      { ingredient: ingMap["Huile d'olive"], quantity: 2 },
      { ingredient: ingMap['Jus de citron'], quantity: 2 },
    ],
  },
  {
    name: 'Cabillaud en croûte de parmesan',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=1200',
    category: 'poissons',
    isLiked: false,
    steps:
      '1. Préchauffer le four à 200°C. Mélanger parmesan, chapelure, herbes et beurre. ' +
      '2. Déposer le cabillaud dans un plat, étaler la croûte sur les filets. ' +
      '3. Cuire 15-20 min. Servir avec une salade verte et des quartiers de citron.',
    ingredients: [
      { ingredient: ingMap['Cabillaud'], quantity: 600 },
      { ingredient: ingMap['Parmesan râpé'], quantity: 60 },
      { ingredient: ingMap['Chapelure'], quantity: 40 },
      { ingredient: ingMap['Beurre'], quantity: 30 },
      { ingredient: ingMap['Persil plat'], quantity: 15 },
      { ingredient: ingMap['Jus de citron'], quantity: 2 },
      { ingredient: ingMap['Salade verte'], quantity: 1 },
    ],
  },
  {
    name: 'Crevettes sautées ail beurre',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200',
    category: 'poissons',
    isLiked: true,
    steps:
      '1. Faire fondre le beurre dans une poêle bien chaude. ' +
      "2. Ajouter l'ail haché et les crevettes, saisir 2-3 min en remuant. " +
      '3. Déglacer au vin blanc, parsemer de persil et jus de citron. Servir immédiatement.',
    ingredients: [
      { ingredient: ingMap['Crevettes décortiquées'], quantity: 500 },
      { ingredient: ingMap['Ail'], quantity: 4 },
      { ingredient: ingMap['Beurre'], quantity: 60 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.05 },
      { ingredient: ingMap['Persil plat'], quantity: 15 },
      { ingredient: ingMap['Jus de citron'], quantity: 2 },
      { ingredient: ingMap["Piment d'Espelette"], quantity: 1 },
    ],
  },
  {
    name: 'Moules marinières',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=1200',
    category: 'poissons',
    isLiked: true,
    steps:
      '1. Faire revenir échalotes et ail dans le beurre. ' +
      '2. Ajouter les moules lavées et le vin blanc, couvrir à feu vif 5 min. ' +
      '3. Incorporer la crème en fin de cuisson, parsemer de persil. Servir avec des frites.',
    ingredients: [
      { ingredient: ingMap['Moules'], quantity: 2000 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 2 },
      { ingredient: ingMap['Vin blanc sec'], quantity: 0.2 },
      { ingredient: ingMap['Beurre'], quantity: 50 },
      { ingredient: ingMap['Crème fraîche épaisse'], quantity: 100 },
      { ingredient: ingMap['Persil plat'], quantity: 20 },
    ],
  },
  {
    name: 'Thon grillé au sésame et sauce soja',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=1200',
    category: 'poissons',
    isLiked: false,
    steps:
      '1. Rouler les pavés de thon dans le sésame blanc, assaisonner. ' +
      '2. Griller 2 min par face dans une poêle bien chaude avec huile de sésame. ' +
      '3. Préparer la sauce : soja, gingembre râpé, citron vert, miel. Servir rosé.',
    ingredients: [
      { ingredient: ingMap['Thon frais'], quantity: 600 },
      { ingredient: ingMap['Sésame blanc'], quantity: 60 },
      { ingredient: ingMap['Huile de sésame'], quantity: 2 },
      { ingredient: ingMap['Sauce soja'], quantity: 3 },
      { ingredient: ingMap['Gingembre frais'], quantity: 15 },
      { ingredient: ingMap['Citron vert'], quantity: 1 },
      { ingredient: ingMap['Miel'], quantity: 1 },
    ],
  },

  // ── PLATS COMPLETS ────────────────────────────────────────────────────────────
  {
    name: 'Lasagnes bolognaise',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=1200',
    category: 'plats complets',
    isLiked: true,
    steps:
      '1. Préparer la bolognaise : bœuf haché, oignon, ail, tomates, vin rouge — mijoter 30 min. ' +
      '2. Préparer la béchamel avec beurre, farine, lait et muscade. ' +
      '3. Alterner couches de pâtes, bolognaise et béchamel. Terminer avec parmesan. Cuire 40 min à 180°C.',
    ingredients: [
      { ingredient: ingMap['Feuilles de lasagne'], quantity: 12 },
      { ingredient: ingMap['Bœuf haché'], quantity: 500 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Tomates pelées en boîte'], quantity: 400 },
      { ingredient: ingMap['Vin rouge'], quantity: 0.1 },
      { ingredient: ingMap['Beurre'], quantity: 60 },
      { ingredient: ingMap['Farine de blé'], quantity: 60 },
      { ingredient: ingMap['Lait entier'], quantity: 0.6 },
      { ingredient: ingMap['Parmesan râpé'], quantity: 80 },
      { ingredient: ingMap['Muscade râpée'], quantity: 1 },
    ],
  },
  {
    name: 'Paëlla valenciana',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=1200',
    category: 'plats complets',
    isLiked: true,
    steps:
      "1. Faire revenir les morceaux de poulet dans l'huile d'olive. Ajouter chorizo et légumes. " +
      '2. Incorporer le riz, le safran et le bouillon. Cuire à feu moyen sans remuer. ' +
      '3. Déposer crevettes et moules, couvrir et cuire 10 min. Laisser reposer 5 min.',
    ingredients: [
      { ingredient: ingMap['Cuisse de poulet'], quantity: 4 },
      { ingredient: ingMap['Chorizo'], quantity: 150 },
      { ingredient: ingMap['Crevettes décortiquées'], quantity: 300 },
      { ingredient: ingMap['Moules'], quantity: 500 },
      { ingredient: ingMap['Riz basmati'], quantity: 400 },
      { ingredient: ingMap['Poivron rouge'], quantity: 1 },
      { ingredient: ingMap['Tomate'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Safran'], quantity: 1 },
      { ingredient: ingMap['Bouillon de poulet'], quantity: 0.9 },
      { ingredient: ingMap["Huile d'olive"], quantity: 4 },
      { ingredient: ingMap['Paprika fumé'], quantity: 2 },
    ],
  },
  {
    name: 'Chili con carne',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200',
    category: 'plats complets',
    isLiked: false,
    steps:
      "1. Faire revenir oignon, ail et bœuf haché. Égoutter l'excès de gras. " +
      '2. Ajouter tomates, haricots rouges, cumin, piment de Cayenne et laisser mijoter 30 min. ' +
      "3. Rectifier l'assaisonnement. Servir avec riz, crème fraîche et cheddar râpé.",
    ingredients: [
      { ingredient: ingMap['Bœuf haché'], quantity: 600 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Tomates pelées en boîte'], quantity: 400 },
      { ingredient: ingMap['Haricots blancs'], quantity: 400 },
      { ingredient: ingMap['Concentré de tomate'], quantity: 2 },
      { ingredient: ingMap['Cumin moulu'], quantity: 2 },
      { ingredient: ingMap['Piment de Cayenne'], quantity: 1 },
      { ingredient: ingMap['Paprika doux'], quantity: 2 },
      { ingredient: ingMap['Riz basmati'], quantity: 300 },
    ],
  },
  {
    name: 'Pad thaï aux crevettes',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=1200',
    category: 'plats complets',
    isLiked: true,
    steps:
      "1. Tremper les vermicelles de riz 10 min dans l'eau tiède. " +
      '2. Faire sauter les crevettes à feu vif, ajouter ail, sauce nuoc-mam, jus de citron vert et piment. ' +
      '3. Incorporer les vermicelles égouttés et les œufs battus. Servir avec cacahuètes et coriandre.',
    ingredients: [
      { ingredient: ingMap['Vermicelles de riz'], quantity: 250 },
      { ingredient: ingMap['Crevettes décortiquées'], quantity: 400 },
      { ingredient: ingMap['Œuf'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 3 },
      { ingredient: ingMap['Sauce nuoc-mam'], quantity: 3 },
      { ingredient: ingMap['Sauce soja'], quantity: 2 },
      { ingredient: ingMap['Citron vert'], quantity: 1 },
      { ingredient: ingMap['Piment rouge'], quantity: 1 },
      { ingredient: ingMap['Beurre de cacahuète'], quantity: 2 },
      { ingredient: ingMap['Coriandre fraîche'], quantity: 20 },
      { ingredient: ingMap['Huile de tournesol'], quantity: 2 },
    ],
  },
  {
    name: 'Hachis parmentier',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200',
    category: 'plats complets',
    isLiked: false,
    steps:
      '1. Préparer une purée avec pommes de terre, beurre, lait et muscade. ' +
      '2. Faire revenir bœuf haché avec oignon, ail, concentré de tomate et herbes. ' +
      '3. Disposer la viande dans un plat, recouvrir de purée, parsemer de gruyère. Gratiner 20 min.',
    ingredients: [
      { ingredient: ingMap['Bœuf haché'], quantity: 500 },
      { ingredient: ingMap['Pomme de terre'], quantity: 800 },
      { ingredient: ingMap['Oignon'], quantity: 2 },
      { ingredient: ingMap['Ail'], quantity: 2 },
      { ingredient: ingMap['Concentré de tomate'], quantity: 2 },
      { ingredient: ingMap['Beurre'], quantity: 60 },
      { ingredient: ingMap['Lait entier'], quantity: 0.15 },
      { ingredient: ingMap['Gruyère râpé'], quantity: 100 },
      { ingredient: ingMap['Muscade râpée'], quantity: 1 },
    ],
  },

  // ── DESSERTS ──────────────────────────────────────────────────────────────────
  {
    name: 'Tarte tatin aux pommes',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200',
    category: 'desserts',
    isLiked: true,
    steps:
      '1. Caraméliser beurre et sucre dans un moule allant au four. Disposer les pommes pelées et coupées. ' +
      '2. Recouvrir de pâte feuilletée en rentrant les bords. ' +
      '3. Cuire 25 min à 200°C, retourner aussitôt sur le plat. Servir tiède avec crème fraîche.',
    ingredients: [
      { ingredient: ingMap['Pomme'], quantity: 8 },
      { ingredient: ingMap['Pâte feuilletée'], quantity: 1 },
      { ingredient: ingMap['Sucre blanc'], quantity: 150 },
      { ingredient: ingMap['Beurre demi-sel'], quantity: 80 },
      { ingredient: ingMap['Cannelle moulue'], quantity: 1 },
      { ingredient: ingMap['Crème fraîche épaisse'], quantity: 100 },
    ],
  },
  {
    name: 'Crème brûlée à la vanille',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=1200',
    category: 'desserts',
    isLiked: true,
    steps:
      '1. Fendre la gousse de vanille, mélanger avec crème chaude. Laisser infuser 10 min. ' +
      "2. Fouetter les jaunes d'œufs avec le sucre, incorporer la crème. " +
      '3. Cuire au bain-marie 50 min à 150°C. Réfrigérer 2h puis brûler le sucre à la flamme.',
    ingredients: [
      { ingredient: ingMap['Crème liquide entière'], quantity: 0.5 },
      { ingredient: ingMap["Jaune d'œuf"], quantity: 5 },
      { ingredient: ingMap['Sucre blanc'], quantity: 100 },
      { ingredient: ingMap['Sucre roux'], quantity: 60 },
      { ingredient: ingMap['Gousse de vanille'], quantity: 2 },
    ],
  },
  {
    name: 'Mousse au chocolat noir',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?w=1200',
    category: 'desserts',
    isLiked: true,
    steps:
      '1. Faire fondre le chocolat noir au bain-marie avec le beurre. ' +
      "2. Incorporer les jaunes d'œufs, puis les blancs montés en neige délicatement. " +
      '3. Verser en ramequins et réfrigérer au moins 3h.',
    ingredients: [
      { ingredient: ingMap['Chocolat noir 70%'], quantity: 200 },
      { ingredient: ingMap['Œuf'], quantity: 5 },
      { ingredient: ingMap['Beurre'], quantity: 30 },
      { ingredient: ingMap['Sucre blanc'], quantity: 40 },
    ],
  },
  {
    name: 'Tiramisu classique',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1200',
    category: 'desserts',
    isLiked: true,
    steps:
      '1. Fouetter les jaunes avec le sucre, incorporer le mascarpone. ' +
      '2. Monter les blancs en neige et les incorporer délicatement à la crème. ' +
      '3. Tremper les biscuits dans le café, alterner biscuits et crème. Réfrigérer 6h. Saupoudrer de cacao.',
    ingredients: [
      { ingredient: ingMap['Mascarpone'], quantity: 500 },
      { ingredient: ingMap['Biscuits à la cuillère'], quantity: 24 },
      { ingredient: ingMap['Œuf'], quantity: 4 },
      { ingredient: ingMap['Sucre blanc'], quantity: 100 },
      { ingredient: ingMap['Café expresso'], quantity: 4 },
      { ingredient: ingMap['Cacao en poudre non sucré'], quantity: 30 },
      { ingredient: ingMap['Amaretto'], quantity: 2 },
    ],
  },
  {
    name: 'Crêpes sucrées',
    idCreator: SEED_USER,
    imageKey: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1200',
    category: 'desserts',
    isLiked: false,
    steps:
      '1. Mélanger farine, sucre, œufs, puis incorporer lait et beurre fondu. Reposer 30 min. ' +
      '2. Cuire les crêpes dans une poêle légèrement beurrée. ' +
      "3. Servir avec confiture, miel, sirop d'érable ou jus de citron et sucre.",
    ingredients: [
      { ingredient: ingMap['Farine de blé'], quantity: 250 },
      { ingredient: ingMap['Œuf'], quantity: 3 },
      { ingredient: ingMap['Lait entier'], quantity: 0.5 },
      { ingredient: ingMap['Beurre'], quantity: 50 },
      { ingredient: ingMap['Sucre blanc'], quantity: 30 },
      { ingredient: ingMap['Sucre vanillé'], quantity: 10 },
      { ingredient: ingMap['Confiture de framboise'], quantity: 4 },
    ],
  },
]

cmdb.recipes.insertMany(recipes)
print(`✓ ${recipes.length} recettes insérées`)
print('✓ Seed terminé.')
