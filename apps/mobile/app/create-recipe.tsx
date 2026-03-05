import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import type { PredefinedIngredient } from '@/constants/ingredients'
import { PREDEFINED_INGREDIENTS } from '@/constants/ingredients'
import { DARK, LIGHT } from '@/constants/theme'
import type { Ingredient } from '@/hooks/useCreateRecipeScreen'
import { useCreateRecipeScreen } from '@/hooks/useCreateRecipeScreen'

//DEMO : url ngrok
const API_URL = 'https://upstanding-obviously-librada.ngrok-free.dev'

// Catégories de recettes disponibles
const CATEGORIES = ['Potages', 'Végés', 'Viandes', 'Poissons', 'Pâtes', 'Desserts', 'Petit-déj']

// ─── Composant UI : modale d'ajout d'ingrédient ──────────────────────────────
const IngredientModal = ({
  visible,
  onClose,
  onAdd,
  C,
}: {
  visible: boolean
  onClose: () => void
  onAdd: (ing: Omit<Ingredient, 'id'>) => void
  C: typeof LIGHT | typeof DARK
}) => {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PredefinedIngredient | null>(null)
  const [quantity, setQuantity] = useState('1')

  const suggestions =
    search.length > 0
      ? PREDEFINED_INGREDIENTS.filter(i =>
          i.name.toLowerCase().includes(search.toLowerCase()),
        ).slice(0, 8)
      : []

  const handleSelect = (ing: PredefinedIngredient) => {
    setSelected(ing)
    setSearch('')
  }

  const handleAdd = () => {
    if (!selected) return
    onAdd({ name: selected.name, quantity, unit: selected.unit })
    setSearch('')
    setSelected(null)
    setQuantity('1')
    onClose()
  }

  const handleClose = () => {
    setSearch('')
    setSelected(null)
    setQuantity('1')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: C.overlay }]}
          onPress={handleClose}
        >
          {/* stopPropagation : évite que le tap dans la carte ferme le modal */}
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            {/* Poignée de la bottom sheet */}
            <View style={[styles.modalHandle, { backgroundColor: C.border }]} />

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter un ingrédient</Text>

            <Text style={[styles.modalLabel, { color: C.textMuted }]}>Ingrédient</Text>

            {selected ? (
              // Ingrédient sélectionné — affiche le nom avec bouton pour effacer
              <View
                style={[
                  styles.selectedChip,
                  { backgroundColor: C.primaryLight, borderColor: C.primary },
                ]}
              >
                <Text style={[styles.selectedChipText, { color: C.primary }]}>{selected.name}</Text>
                <TouchableOpacity
                  onPress={() => setSelected(null)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color={C.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Champ de recherche dans les ingrédients prédéfinis */}
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Rechercher un ingrédient…"
                  placeholderTextColor={C.textMuted}
                  style={[
                    styles.modalInput,
                    { backgroundColor: C.background, borderColor: C.border, color: C.text },
                  ]}
                  autoFocus
                  returnKeyType="search"
                />

                {suggestions.length > 0 && (
                  <ScrollView
                    style={[styles.suggestionList, { borderColor: C.border }]}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                  >
                    {suggestions.map(ing => (
                      <TouchableOpacity
                        key={ing.name}
                        onPress={() => handleSelect(ing)}
                        style={[styles.suggestionItem, { borderBottomColor: C.border }]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.suggestionName, { color: C.text }]}>{ing.name}</Text>
                        <Text style={[styles.suggestionUnit, { color: C.textMuted }]}>
                          {ing.unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}

                {search.length > 0 && suggestions.length === 0 && (
                  <Text style={[styles.noResult, { color: C.textMuted }]}>
                    Aucun ingrédient trouvé
                  </Text>
                )}
              </>
            )}

            <Text style={[styles.modalLabel, { color: C.textMuted, marginTop: 16 }]}>Quantité</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => setQuantity(p => String(Math.max(0, parseFloat(p || '0') - 1)))}
                style={[styles.qtyBtn, { backgroundColor: C.background, borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color={C.primary} />
              </TouchableOpacity>

              <TextInput
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                style={[
                  styles.qtyInput,
                  { backgroundColor: C.background, borderColor: C.border, color: C.text },
                ]}
                textAlign="center"
              />

              <TouchableOpacity
                onPress={() => setQuantity(p => String(parseFloat(p || '0') + 1))}
                style={[styles.qtyBtn, { backgroundColor: C.background, borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color={C.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleClose}
                style={[styles.modalCancelBtn, { borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalCancelText, { color: C.textMuted }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdd}
                style={[
                  styles.modalAddBtn,
                  { backgroundColor: selected ? C.primary : C.primaryLight },
                ]}
                activeOpacity={selected ? 0.85 : 1}
                disabled={!selected}
              >
                <Text style={styles.modalAddText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  )
}

//APPEL API POUR LA DEMO
const createRecipe = async (title: string) => {
  try {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Bypass l'écran d'accueil ngrok
      },
      body: JSON.stringify({
        name: title,
        idCreator: 'test-demo',
        category: 'potages',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('Erreur API détaillée :', data)
      return
    }

    console.log("Succès ! Retour de l'API ok")
    return data
  } catch (error) {
    console.error('Erreur réseau ou serveur :', error)
  }
}

// ─── Écran principal — responsabilité UI uniquement ───────────────────────────
// Toute la logique du formulaire est déléguée à useCreateRecipeScreen.
export default function CreateRecipeScreen() {
  const scheme = useColorScheme()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT

  const {
    title,
    setTitle,
    description,
    setDescription,
    time,
    setTime,
    setImage,
    category,
    setCategory,
    ingredients,
    modalVisible,
    setModalVisible,
    addIngredient,
    removeIngredient,
    publish,
    goBack,
  } = useCreateRecipeScreen()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { backgroundColor: C.background }]}>
          <TouchableOpacity onPress={goBack} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color={C.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: C.text }]}>Nouvelle recette</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={[styles.label, { color: C.text }]}>Nom de la recette *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex : Velouté de courge…"
            placeholderTextColor={C.textMuted}
            style={[
              styles.input,
              { backgroundColor: C.surface, borderColor: C.border, color: C.text },
            ]}
            onBlur={() => {
              if (title) {
                createRecipe(title).then(res =>
                  setImage(`${API_URL}/recipes/storage/cookme/${res._id}.png`),
                )
              }
            }}
          />

          <Text style={[styles.label, { color: C.text }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre recette…"
            placeholderTextColor={C.textMuted}
            style={[
              styles.input,
              styles.textArea,
              { backgroundColor: C.surface, borderColor: C.border, color: C.text },
            ]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={[styles.label, { color: C.text }]}>Temps de préparation (min)</Text>
          <TextInput
            value={time}
            onChangeText={v => setTime(v.replace(/[^0-9]/g, ''))}
            placeholder="Ex : 90"
            placeholderTextColor={C.textMuted}
            keyboardType="number-pad"
            style={[
              styles.input,
              { backgroundColor: C.surface, borderColor: C.border, color: C.text },
            ]}
          />

          {/* Section ingrédients */}
          <View style={styles.sectionRow}>
            <Text style={[styles.label, { color: C.text, marginBottom: 0 }]}>Ingrédients</Text>
            {ingredients.length > 0 && (
              <Text style={[styles.ingredientCount, { color: C.textMuted }]}>
                {ingredients.length}
              </Text>
            )}
          </View>

          {/* Liste des ingrédients ajoutés */}
          {ingredients.length > 0 && (
            <View style={[styles.ingredientList, { borderColor: C.border }]}>
              {ingredients.map((ing, index) => (
                <View
                  key={ing.id}
                  style={[
                    styles.ingredientRow,
                    { borderBottomColor: C.border },
                    index === ingredients.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={[styles.ingredientDot, { backgroundColor: C.primary }]} />
                  <Text style={[styles.ingredientText, { color: C.text }]}>
                    {ing.quantity} {ing.unit} {ing.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeIngredient(ing.id)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={18} color={C.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Bouton ajouter un ingrédient */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
            style={[
              styles.addIngredientBtn,
              { borderColor: C.primary, backgroundColor: C.primaryLight },
            ]}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={C.primary}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.addIngredientText, { color: C.primary }]}>
              Ajouter un ingrédient
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: C.text }]}>Catégorie</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.chip,
                  { backgroundColor: C.surface, borderColor: C.border },
                  category === cat && { backgroundColor: C.primaryLight, borderColor: C.primary },
                ]}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: C.textMuted },
                    category === cat && { color: C.primary, fontWeight: '700' },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ height: 40 }} />

          {/* Bouton publier — désactivé tant que le titre est vide */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: title ? C.primary : C.primaryLight }]}
            activeOpacity={title ? 0.85 : 1}
            disabled={!title}
            onPress={publish}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#FFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submitText}>Publier la recette</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modale d'ajout d'ingrédient */}
      <IngredientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addIngredient}
        C={C}
      />
    </SafeAreaView>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 12 : 4,
    paddingBottom: 10,
  },
  backButton: { padding: 6 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 13 : 10,
    fontSize: 15,
    marginBottom: 18,
  },
  textArea: { height: 100, paddingTop: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },

  // Section ingrédients
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  ingredientCount: {
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#F4A62322',
    color: '#F4A623',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ingredientList: { borderWidth: 1, borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    gap: 10,
  },
  ingredientDot: { width: 7, height: 7, borderRadius: 4 },
  ingredientText: { flex: 1, fontSize: 14, fontWeight: '500' },
  addIngredientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 20,
  },
  addIngredientText: { fontSize: 14, fontWeight: '600' },

  // Modal ingrédient
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: { elevation: 12 },
    }),
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: 20 },
  modalLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalInput: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    fontSize: 15,
    marginBottom: 4,
  },
  suggestionList: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 4,
    overflow: 'hidden',
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  suggestionName: { fontSize: 15 },
  suggestionUnit: { fontSize: 12 },
  noResult: { fontSize: 13, textAlign: 'center', paddingVertical: 8, marginBottom: 4 },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginBottom: 4,
  },
  selectedChipText: { fontSize: 15, fontWeight: '600' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 7,
    fontSize: 16,
    fontWeight: '600',
    height: 40,
  },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: 15, fontWeight: '600' },
  modalAddBtn: { flex: 2, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  modalAddText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  // Bouton publier
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#F4A623',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  submitText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
})
