export type PredefinedIngredient = {
  name: string
  unit: string
}

export const PREDEFINED_INGREDIENTS: PredefinedIngredient[] = [
  // Pâtes & céréales
  { name: 'Pâtes', unit: 'g' },
  { name: 'Riz', unit: 'g' },
  { name: 'Semoule', unit: 'g' },
  { name: 'Farine', unit: 'g' },
  { name: 'Maïzena', unit: 'g' },
  { name: 'Quinoa', unit: 'g' },
  { name: 'Lentilles', unit: 'g' },
  { name: 'Pois chiches', unit: 'g' },
  { name: 'Haricots rouges', unit: 'g' },
  { name: 'Pain', unit: 'tranche(s)' },

  // Viandes
  { name: 'Poulet', unit: 'g' },
  { name: 'Bœuf haché', unit: 'g' },
  { name: 'Lardons', unit: 'g' },
  { name: 'Jambon', unit: 'tranche(s)' },
  { name: 'Dinde', unit: 'g' },
  { name: 'Porc', unit: 'g' },
  { name: 'Agneau', unit: 'g' },
  { name: 'Saucisse', unit: 'pièce(s)' },
  { name: 'Merguez', unit: 'pièce(s)' },
  { name: 'Steak', unit: 'pièce(s)' },
  { name: 'Escalope', unit: 'pièce(s)' },

  // Poissons & fruits de mer
  { name: 'Saumon', unit: 'g' },
  { name: 'Thon', unit: 'g' },
  { name: 'Cabillaud', unit: 'g' },
  { name: 'Crevettes', unit: 'g' },
  { name: 'Moules', unit: 'g' },
  { name: 'Sardines', unit: 'pièce(s)' },

  // Légumes
  { name: 'Tomates', unit: 'pièce(s)' },
  { name: 'Tomates en conserve', unit: 'g' },
  { name: 'Oignon', unit: 'pièce(s)' },
  { name: 'Ail', unit: 'gousse(s)' },
  { name: 'Courgette', unit: 'pièce(s)' },
  { name: 'Aubergine', unit: 'pièce(s)' },
  { name: 'Poivron', unit: 'pièce(s)' },
  { name: 'Carotte', unit: 'pièce(s)' },
  { name: 'Pomme de terre', unit: 'pièce(s)' },
  { name: 'Épinards', unit: 'g' },
  { name: 'Champignons', unit: 'g' },
  { name: 'Poireau', unit: 'pièce(s)' },
  { name: 'Brocoli', unit: 'g' },
  { name: 'Céleri', unit: 'pièce(s)' },
  { name: 'Salade', unit: 'pièce(s)' },
  { name: 'Concombre', unit: 'pièce(s)' },
  { name: 'Courge', unit: 'pièce(s)' },
  { name: 'Courgette', unit: 'pièce(s)' },
  { name: 'Artichaut', unit: 'pièce(s)' },
  { name: 'Asperges', unit: 'g' },
  { name: 'Petits pois', unit: 'g' },
  { name: 'Haricots verts', unit: 'g' },

  // Produits laitiers & œufs
  { name: 'Œuf', unit: 'pièce(s)' },
  { name: 'Beurre', unit: 'g' },
  { name: 'Crème fraîche', unit: 'cl' },
  { name: 'Lait', unit: 'ml' },
  { name: 'Gruyère', unit: 'g' },
  { name: 'Parmesan', unit: 'g' },
  { name: 'Mozzarella', unit: 'g' },
  { name: 'Fromage blanc', unit: 'g' },
  { name: 'Yaourt', unit: 'pièce(s)' },
  { name: 'Crème liquide', unit: 'cl' },
  { name: 'Lait de coco', unit: 'ml' },

  // Sauces & condiments
  { name: "Huile d'olive", unit: 'c. à soupe' },
  { name: 'Huile', unit: 'c. à soupe' },
  { name: 'Vinaigre', unit: 'c. à soupe' },
  { name: 'Moutarde', unit: 'c. à soupe' },
  { name: 'Sauce soja', unit: 'c. à soupe' },
  { name: 'Concentré de tomates', unit: 'c. à soupe' },
  { name: 'Mayonnaise', unit: 'c. à soupe' },
  { name: 'Ketchup', unit: 'c. à soupe' },
  { name: 'Sauce worcestershire', unit: 'c. à soupe' },

  // Épices & herbes
  { name: 'Sel', unit: 'pincée' },
  { name: 'Poivre', unit: 'pincée' },
  { name: 'Cumin', unit: 'c. à café' },
  { name: 'Paprika', unit: 'c. à café' },
  { name: 'Curry', unit: 'c. à café' },
  { name: 'Thym', unit: 'brin(s)' },
  { name: 'Basilic', unit: 'feuille(s)' },
  { name: 'Persil', unit: 'brin(s)' },
  { name: 'Coriandre', unit: 'brin(s)' },
  { name: 'Cannelle', unit: 'c. à café' },
  { name: 'Herbes de Provence', unit: 'c. à café' },
  { name: 'Laurier', unit: 'feuille(s)' },
  { name: 'Curcuma', unit: 'c. à café' },
  { name: 'Piment', unit: 'pincée' },

  // Bouillons
  { name: 'Bouillon de volaille', unit: 'ml' },
  { name: 'Bouillon de légumes', unit: 'ml' },
  { name: 'Bouillon de bœuf', unit: 'ml' },

  // Sucre & pâtisserie
  { name: 'Sucre', unit: 'g' },
  { name: 'Sucre glace', unit: 'g' },
  { name: 'Levure', unit: 'sachet(s)' },
  { name: 'Chocolat', unit: 'g' },
  { name: 'Cacao', unit: 'c. à soupe' },
  { name: 'Miel', unit: 'c. à soupe' },
  { name: 'Vanille', unit: 'sachet(s)' },
  { name: 'Confiture', unit: 'c. à soupe' },

  // Fruits
  { name: 'Citron', unit: 'pièce(s)' },
  { name: 'Orange', unit: 'pièce(s)' },
  { name: 'Pomme', unit: 'pièce(s)' },
  { name: 'Banane', unit: 'pièce(s)' },
  { name: 'Fraises', unit: 'g' },
  { name: 'Framboises', unit: 'g' },
  { name: 'Myrtilles', unit: 'g' },
  { name: 'Avocat', unit: 'pièce(s)' },
]
