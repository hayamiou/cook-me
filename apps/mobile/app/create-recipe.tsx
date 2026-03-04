import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  FlatList,
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
import { DARK, LIGHT } from '@/constants/theme'
import type { Ingredient } from '@/hooks/useCreateRecipeScreen'
import { useCreateRecipeScreen } from '@/hooks/useCreateRecipeScreen'

// ─── Données statiques ────────────────────────────────────────────────────────

// Unités culinaires disponibles dans le sélecteur
const UNITS = [
  'g',
  'kg',
  'ml',
  'cl',
  'l',
  'c. à café',
  'c. à soupe',
  'pincée',
  'pièce(s)',
  'tranche(s)',
  'gousse(s)',
  'feuille(s)',
  'brin(s)',
  'sachet(s)',
  'verre(s)',
  'tasse(s)',
]

// Catégories de recettes disponibles
const CATEGORIES = ['Potages', 'Végés', 'Viandes', 'Poissons', 'Pâtes', 'Desserts', 'Petit-déj']

// ─── Composant UI : sélecteur d'unité inline ─────────────────────────────────
const UnitPicker = ({
  value,
  onChange,
  C,
}: {
  value: string
  onChange: (u: string) => void
  C: typeof LIGHT | typeof DARK
}) => {
  // État local d'ouverture du dropdown — reste dans le composant (pur UI)
  const [open, setOpen] = useState(false)

  return (
    <View>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        style={[styles.unitBtn, { backgroundColor: C.surface, borderColor: C.border }]}
      >
        <Text style={[styles.unitBtnText, { color: value ? C.text : C.textMuted }]}>
          {value || 'Unité'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={C.textMuted} />
      </TouchableOpacity>

      {/* Dropdown des unités */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.dropdownOverlay} onPress={() => setOpen(false)}>
          <View style={[styles.dropdownBox, { backgroundColor: C.surface, borderColor: C.border }]}>
            <Text style={[styles.dropdownTitle, { color: C.textMuted }]}>Choisir une unité</Text>
            <FlatList
              data={UNITS}
              keyExtractor={u => u}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                  style={[
                    styles.dropdownItem,
                    { borderBottomColor: C.border },
                    value === item && { backgroundColor: C.primaryLight },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      { color: C.text },
                      value === item && { color: C.primary, fontWeight: '700' },
                    ]}
                  >
                    {item}
                  </Text>
                  {value === item && <Ionicons name="checkmark" size={16} color={C.primary} />}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

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
  // États locaux du formulaire — restent dans le composant (pur UI de la modale)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd({ name: name.trim(), quantity, unit })
    // Réinitialise le formulaire après ajout
    setName('')
    setQuantity('1')
    setUnit('')
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Pressable style={[styles.modalOverlay, { backgroundColor: C.overlay }]} onPress={onClose}>
          {/* stopPropagation : évite que le tap dans la carte ferme le modal */}
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            {/* Poignée de la bottom sheet */}
            <View style={[styles.modalHandle, { backgroundColor: C.border }]} />

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter un ingrédient</Text>

            <Text style={[styles.modalLabel, { color: C.textMuted }]}>Ingrédient</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ex : farine, tomates…"
              placeholderTextColor={C.textMuted}
              style={[
                styles.modalInput,
                { backgroundColor: C.background, borderColor: C.border, color: C.text },
              ]}
              autoFocus
              returnKeyType="next"
            />

            <Text style={[styles.modalLabel, { color: C.textMuted }]}>Quantité</Text>
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

            <Text style={[styles.modalLabel, { color: C.textMuted }]}>Unité</Text>
            <UnitPicker value={unit} onChange={setUnit} C={C} />

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.modalCancelBtn, { borderColor: C.border }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalCancelText, { color: C.textMuted }]}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdd}
                style={[
                  styles.modalAddBtn,
                  { backgroundColor: name.trim() ? C.primary : C.primaryLight },
                ]}
                activeOpacity={name.trim() ? 0.85 : 1}
                disabled={!name.trim()}
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
    category,
    setCategory,
    ingredients,
    modalVisible,
    setModalVisible,
    addIngredient,
    removeIngredient,
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
          {/* Zone d'ajout de photo */}
          <TouchableOpacity
            style={[
              styles.imagePicker,
              { backgroundColor: C.primaryLight, borderColor: C.primary },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-outline" size={32} color={C.primary} />
            <Text style={[styles.imagePickerText, { color: C.primary }]}>Ajouter une photo</Text>
          </TouchableOpacity>

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

          <Text style={[styles.label, { color: C.text }]}>Temps de préparation</Text>
          <TextInput
            value={time}
            onChangeText={setTime}
            placeholder="Ex : 30 min"
            placeholderTextColor={C.textMuted}
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
  imagePicker: {
    height: 160,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imagePickerText: { fontSize: 14, fontWeight: '600' },
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
    marginBottom: 16,
  },
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
  unitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 9,
    marginBottom: 24,
  },
  unitBtnText: { fontSize: 15 },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
  },
  dropdownBox: {
    width: '100%',
    maxHeight: 340,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: { elevation: 8 },
    }),
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    padding: 14,
    paddingBottom: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  dropdownItemText: { fontSize: 15 },
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
