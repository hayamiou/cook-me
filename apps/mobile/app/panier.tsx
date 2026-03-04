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
import { usePanierScreen } from '@/hooks/usePanierScreen'

// ─── Données statiques ────────────────────────────────────────────────────────

// Unités culinaires disponibles dans le sélecteur (identique à create-recipe)
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

// ─── Composant UI : modale d'ajout d'article manuel ──────────────────────────
const AddItemModal = ({
  visible,
  onClose,
  onAdd,
  C,
}: {
  visible: boolean
  onClose: () => void
  onAdd: (name: string, quantity: string, unit: string) => void
  C: typeof LIGHT | typeof DARK
}) => {
  // États locaux du formulaire — restent dans le composant (pur UI de la modale)
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')

  const handleAdd = () => {
    if (!name.trim()) return
    onAdd(name.trim(), quantity, unit)
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
          <Pressable style={[styles.modalCard, { backgroundColor: C.surface }]}>
            {/* Poignée de la bottom sheet */}
            <View style={[styles.modalHandle, { backgroundColor: C.border }]} />

            <Text style={[styles.modalTitle, { color: C.text }]}>Ajouter un article</Text>

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

// ─── Écran panier — responsabilité UI uniquement ──────────────────────────────
// Toute la logique (état des articles, actions, navigation) est déléguée à usePanierScreen.
export default function PanierScreen() {
  const scheme = useColorScheme()
  // Palette de couleurs selon le thème système
  const C = scheme === 'dark' ? DARK : LIGHT

  const {
    toggleCheck,
    checkAll,
    clearDone,
    pending,
    done,
    modalVisible,
    setModalVisible,
    handleAdd,
    goBack,
  } = usePanierScreen()

  // Composant UI d'une ligne d'article (inline car dépend de C)
  const renderItem = (item: (typeof pending)[0]) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => toggleCheck(item.id)}
      activeOpacity={0.75}
      style={[
        styles.row,
        {
          backgroundColor: item.checked ? C.checked : C.surface,
          borderColor: item.checked ? C.primary : C.border,
        },
      ]}
    >
      <Text
        style={[
          styles.rowText,
          { color: item.checked ? C.textMuted : C.text },
          item.checked && styles.rowTextChecked,
        ]}
      >
        {item.quantity}
        {item.unit ? ` ${item.unit}` : ''}
        {'  '}
        {item.name}
      </Text>

      <View
        style={[
          styles.checkbox,
          {
            borderColor: item.checked ? C.primary : C.border,
            backgroundColor: item.checked ? C.primary : 'transparent',
          },
        ]}
      >
        {item.checked && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: C.background }]}>
      <StatusBar barStyle={C.statusBar} backgroundColor={C.background} />

      <View style={[styles.header, { backgroundColor: C.background }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: C.text }]}>Mes courses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section : articles à acheter */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Courses</Text>
            {pending.length > 0 && (
              <View style={[styles.countBadge, { backgroundColor: C.primaryLight }]}>
                <Text style={[styles.countBadgeText, { color: C.primary }]}>{pending.length}</Text>
              </View>
            )}
          </View>
          {pending.length > 0 && (
            <TouchableOpacity
              onPress={checkAll}
              activeOpacity={0.7}
              style={[styles.checkAllBtn, { borderColor: C.primary }]}
            >
              <Ionicons
                name="checkmark-done-outline"
                size={14}
                color={C.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.checkAllBtnText, { color: C.primary }]}>Tout cocher</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* État vide */}
        {pending.length === 0 && (
          <View style={[styles.emptyBox, { borderColor: C.border }]}>
            <Ionicons name="checkmark-done-outline" size={28} color={C.primary} />
            <Text style={[styles.emptyBoxText, { color: C.textMuted }]}>Tout est coché !</Text>
          </View>
        )}

        {pending.map(renderItem)}

        {/* Bouton ajouter un article */}
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
          <Text style={[styles.addIngredientText, { color: C.primary }]}>Ajouter un article</Text>
        </TouchableOpacity>

        {/* Section : articles cochés */}
        {done.length > 0 && (
          <>
            <View style={styles.doneSectionHeader}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: C.text }]}>Articles cochés</Text>
                <View style={[styles.countBadge, { backgroundColor: C.primaryLight }]}>
                  <Text style={[styles.countBadgeText, { color: C.primary }]}>{done.length}</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={clearDone}
                activeOpacity={0.7}
                style={[styles.clearBtn, { borderColor: C.danger }]}
              >
                <Ionicons
                  name="trash-outline"
                  size={14}
                  color={C.danger}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.clearBtnText, { color: C.danger }]}>Tout effacer</Text>
              </TouchableOpacity>
            </View>

            {done.map(renderItem)}
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Modale d'ajout d'article manuel */}
      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAdd}
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
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  checkAllBtnText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  countBadge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  countBadgeText: { fontSize: 12, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: { elevation: 1 },
    }),
  },
  rowText: { flex: 1, fontSize: 15, fontWeight: '500' },
  rowTextChecked: { textDecorationLine: 'line-through' },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  addIngredientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 13,
    marginBottom: 28,
  },
  addIngredientText: { fontSize: 14, fontWeight: '600' },
  doneSectionHeader: { marginTop: 4 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginTop: -4,
  },
  clearBtnText: { fontSize: 12, fontWeight: '600' },
  emptyBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emptyBoxText: { fontSize: 14, fontWeight: '500' },
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
})
