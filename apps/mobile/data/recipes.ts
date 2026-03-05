export type Ingredient = { name: string; quantity: string; unit: string }

export type Recipe = {
  id: string
  title: string
  category: string
  time: string
  image?: string
  liked: boolean
  ingredients: Ingredient[]
  description: string
}

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Saumon aux haricots verts',
    category: 'Poissons',
    time: '25 min',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200',
    liked: false,
    ingredients: [
      { name: 'Paves de saumon', quantity: '2', unit: 'piece(s)' },
      { name: 'Haricots verts', quantity: '300', unit: 'g' },
      { name: 'Ail', quantity: '1', unit: 'gousse(s)' },
      { name: 'Huile olive', quantity: '1', unit: 'c. a soupe' },
      { name: 'Jus de citron', quantity: '1', unit: 'c. a soupe' },
      { name: 'Sel & poivre', quantity: '1', unit: 'pincee' },
    ],
    description:
      '1. Cuire les haricots verts dans une casserole d eau salee puis egoutter. 2. Dans une poele chaude avec l huile d olive, saisir les paves de saumon 3 a 4 minutes sur la premiere face, puis 2 a 3 minutes sur l autre face. 3. Assaisonner avec sel, poivre et jus de citron. Servir chaud avec les haricots verts.',
  },
  {
    id: '2',
    title: 'Veloute de carottes',
    category: 'Potages',
    time: '30 min',
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1200',
    liked: false,
    ingredients: [
      { name: 'Carottes', quantity: '500', unit: 'g' },
      { name: 'Oignon', quantity: '1', unit: 'piece(s)' },
      { name: 'Bouillon de legumes', quantity: '750', unit: 'ml' },
      { name: 'Creme fraiche', quantity: '100', unit: 'ml' },
      { name: 'Gingembre frais', quantity: '1', unit: 'c. a cafe' },
      { name: 'Huile olive', quantity: '1', unit: 'c. a soupe' },
    ],
    description:
      '1. Emincer l oignon puis faire revenir dans l huile d olive. 2. Ajouter les carottes en rondelles, couvrir de bouillon et cuire 20 minutes. 3. Mixer avec la creme et le gingembre jusqu a obtenir une texture lisse. Rectifier l assaisonnement et servir bien chaud.',
  },
  {
    id: '3',
    title: 'Risotto aux champignons',
    category: 'Végés',
    time: '40 min',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1200',
    liked: true,
    ingredients: [
      { name: 'Riz arborio', quantity: '300', unit: 'g' },
      { name: 'Champignons', quantity: '250', unit: 'g' },
      { name: 'Oignon', quantity: '1', unit: 'piece(s)' },
      { name: 'Vin blanc sec', quantity: '150', unit: 'ml' },
      { name: 'Bouillon de legumes', quantity: '1', unit: 'l' },
      { name: 'Parmesan rape', quantity: '60', unit: 'g' },
      { name: 'Beurre', quantity: '40', unit: 'g' },
    ],
    description:
      '1. Faire revenir l oignon et les champignons au beurre. 2. Ajouter le riz et nacrer une minute. 3. Mouiller avec le vin blanc puis ajouter le bouillon progressivement en remuant jusqu a cuisson complete. 4. Terminer avec le parmesan pour un risotto bien cremeux.',
  },
  {
    id: '4',
    title: 'Poulet roti aux herbes',
    category: 'Viandes',
    time: '1h10',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=1200',
    liked: false,
    ingredients: [
      { name: 'Poulet entier', quantity: '1', unit: 'piece(s)' },
      { name: 'Ail', quantity: '4', unit: 'gousse(s)' },
      { name: 'Romarin', quantity: '3', unit: 'brin(s)' },
      { name: 'Thym', quantity: '3', unit: 'brin(s)' },
      { name: 'Beurre', quantity: '50', unit: 'g' },
      { name: 'Huile olive', quantity: '2', unit: 'c. a soupe' },
      { name: 'Citron', quantity: '1', unit: 'piece(s)' },
    ],
    description:
      '1. Prechauffer le four a 200 degres. 2. Frotter le poulet avec beurre, ail, thym, romarin, sel et poivre. 3. Enfourner environ 1 heure en arrosant regulierement. 4. Ajouter un trait de citron avant de servir.',
  },
]
