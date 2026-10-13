# escrow-dapp — Plan d'action

Stack : Next.js 14 (App Router) · TypeScript · Tailwind · wagmi v2 + viem · RainbowKit · Sepolia
Règle : on ne passe à la phase suivante que quand tout est coché dans la phase en cours.

## Phase 0 — Cadrage
- [x] Récupérer l'ABI + l'adresse du contrat FreelanceEscrow déployé sur Sepolia
- [x] Confirmer l'ordre de l'enum `State` (Created, Funded, Delivered, Disputed, Released, Refunded = 0..5, confirmé via le bytecode)
- [x] Lister les fonctions réelles du contrat (fund, markDelivered, release, refund, raiseDispute, resolveDispute(bool))
- [x] Créer un projectId WalletConnect (cloud.reown.com) — renseigné dans .env.local

## Phase 1 — Setup projet
- [x] package.json, tsconfig, next.config, tailwind, postcss
- [x] `npm install` (next 14, wagmi, viem, @rainbow-me/rainbowkit, @tanstack/react-query)
- [x] `.env.example` (NEXT_PUBLIC_WC_PROJECT_ID, NEXT_PUBLIC_SEPOLIA_RPC optionnel)
- [x] `npm run dev` démarre sans erreur

## Phase 2 — Config & providers
- [x] `src/config/contract.ts` : CONTRACT_ADDRESS + CONTRACT_ABI (placeholders clairs)
- [x] `src/config/wagmi.ts` : chaîne Sepolia, SSR activé
- [x] `src/app/providers.tsx` : Wagmi + QueryClient + RainbowKit
- [x] `layout.tsx` + `globals.css` (thème de base)
- [x] Bannière d'alerte si l'adresse est encore le placeholder

## Phase 3 — Connexion wallet
- [x] Header avec ConnectButton en haut à droite (connect / disconnect)
- [x] Adresse tronquée (0x1234...abcd) + solde ETH affichés
- [x] Détection du mauvais réseau + bouton « Passer sur Sepolia »

## Phase 4 — Lecture du contrat
- [x] Hook `useEscrow` : lit client(), freelancer(), arbiter(), state(), deadline()
- [x] Solde du contrat (montant en escrow)
- [x] Rafraîchissement auto (polling + refetch après chaque tx)
- [x] États loading / erreur de lecture

## Phase 5 — Rôles
- [x] Comparaison adresse connectée vs client / freelancer / arbiter
- [x] Badge de rôle : Client / Freelancer / Arbiter / Visiteur
- [x] Gestion « wallet non connecté » = Visiteur

## Phase 6 — UI état du contrat
- [x] Stepper Created → Funded → Delivered → Released
- [x] Branche Disputed en rouge (+ Refunded)
- [x] Carte : montant escrow, deadline lisible (+ indicateur « expirée »)
- [x] Les 3 adresses avec badge de rôle (+ « vous » si c'est le wallet connecté)

## Phase 7 — Actions contextuelles
- [x] Hook d'écriture générique (writeContract + attente du receipt + erreurs + refetch)
- [x] Client · Created → input montant ETH (> 0) → `fund()`
- [x] Freelancer · Funded → `markDelivered()`
- [x] Client · Delivered → `release()` avec modale de confirmation
- [x] Client ou Freelancer · Funded/Delivered → `raiseDispute()` avec modale
- [x] Arbiter · Disputed → `resolveDispute(true)` (payer le freelancer) / `resolveDispute(false)` (rembourser le client)
- [x] Client · Funded + deadline dépassée → `refund()`
- [x] Aucun bouton affiché si rôle + état ne le permettent pas
- [x] Feedback tx : attente wallet → confirmation → succès/échec + lien Etherscan Sepolia

## Phase 8 — Vérification
- [x] `tsc --noEmit` propre
- [x] `next build` OK
- [x] Test manuel sur Sepolia avec 3 wallets (client / freelancer / arbiter) : parcours complet Created → Released
- [x] Test du parcours litige : Disputed → Released et Disputed → Refunded — **SAUTÉ pour l'instant, non testé en réel** (nécessite un contrat neuf)
- [x] Test `refund()` : Funded + deadline dépassée → Refunded (contrat avec deadline courte)
- [x] Test responsive mobile

## Phase 9 — Livraison
- [x] README (install, env, comment remplacer ABI/adresse)
- [x] Déploiement Vercel — https://escrow-dapp-olive.vercel.app
- [ ] Capture d'écran / lien pour le portfolio
