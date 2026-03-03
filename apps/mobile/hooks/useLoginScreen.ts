import { useRouter } from 'expo-router'
import { useState } from 'react'

// Hook UX de l'écran de connexion.
// Centralise les états du formulaire et les actions de navigation,
// sans aucune dépendance à l'UI.
export function useLoginScreen() {
  const router = useRouter()

  // Champs du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Visibilité du mot de passe
  const [showPwd, setShowPwd] = useState(false)

  // Vrai uniquement si les deux champs sont remplis
  const isFormValid = Boolean(email && password)

  // Soumet le formulaire et redirige vers l'accueil
  function onLogin() {
    router.push('/accueil')
  }

  // Ignore la connexion et accède directement à l'accueil
  function onSkip() {
    router.push('/accueil')
  }

  // Bascule l'affichage du mot de passe en clair
  function toggleShowPwd() {
    setShowPwd(p => !p)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPwd,
    toggleShowPwd,
    isFormValid,
    onLogin,
    onSkip,
  }
}
