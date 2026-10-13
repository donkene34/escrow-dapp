# escrow-dapp

Interface web pour le smart contract **FreelanceEscrow** (Solidity, réseau **Sepolia**) : un escrow entre un client, un freelancer et un arbitre.

**Démo :** https://escrow-dapp-olive.vercel.app (réseau Sepolia)

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · wagmi v2 + viem · RainbowKit

## Fonctionnalités

- **Connexion wallet** (RainbowKit) : connexion/déconnexion, adresse tronquée, solde ETH, détection du mauvais réseau avec bouton « Passer sur Sepolia ».
- **Détection du rôle** : l'app lit `client()`, `freelancer()`, `arbiter()` et compare avec le wallet connecté → badge Client / Freelancer / Arbiter / Visiteur.
- **Vue d'état** : stepper `Created → Funded → Delivered → Released`, branches hors parcours `Disputed` (rouge) et `Refunded`, montant en escrow, deadline lisible (avec temps restant), les 3 adresses avec badges et liens Etherscan.
- **Actions contextuelles** : seuls les boutons permis par le rôle **et** l'état sont affichés.

| Rôle | État | Action | Fonction |
|---|---|---|---|
| Client | Created | Financer l'escrow (montant ETH) | `fund()` |
| Freelancer | Funded | Marquer comme livré | `markDelivered()` |
| Client | Delivered | Valider et libérer les fonds (modale) | `release()` |
| Client / Freelancer | Funded, Delivered | Ouvrir un litige (modale) | `raiseDispute()` |
| Arbiter | Disputed | Payer le freelancer / Rembourser le client (modale) | `resolveDispute(true/false)` |
| Client | Funded + deadline dépassée | Demander le remboursement (modale) | `refund()` |

Les données se rafraîchissent toutes les 10 s et après chaque transaction confirmée.

## Démarrage

Prérequis : Node.js 18+ et un wallet (MetaMask, Rainbow…) avec un peu de Sepolia ETH.

```bash
npm install
cp .env.example .env.local     # Windows PowerShell : copy .env.example .env.local
npm run dev
```

Ouvre http://localhost:3000. La première compilation peut prendre 30 à 60 s (nombreuses dépendances wallet).

### Variables d'environnement (`.env.local`)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_WC_PROJECT_ID` | Project ID WalletConnect/Reown (gratuit : https://cloud.reown.com). Sans lui, la connexion mobile par QR code ne fonctionne pas. |
| `NEXT_PUBLIC_SEPOLIA_RPC` | Optionnel : RPC Sepolia perso (Alchemy, Infura). Sinon RPC public. |

## Utiliser ton propre contrat

Tout se passe dans [`src/config/contract.ts`](src/config/contract.ts) :

1. Remplace `CONTRACT_ADDRESS` par l'adresse de ton contrat déployé sur Sepolia.
2. Si tu changes de contrat, remplace `CONTRACT_ABI` (l'ABI actuel couvre `client`, `freelancer`, `arbiter`, `state`, `deadline`, `amount`, `fund`, `markDelivered`, `release`, `refund`, `raiseDispute`, `resolveDispute`). Si tu colles un ABI JSON complet, ajoute `as const` pour garder le typage.
3. Vérifie `STATE_LABELS` : l'ordre doit être celui de l'enum Solidity (`Created, Funded, Delivered, Disputed, Released, Refunded` = 0..5).

Le constructeur du contrat est `(freelancer, arbiter, deadline)` : le déployeur devient le client, et les trois adresses doivent être différentes.

> Un contrat ne suit qu'un seul chemin : une fois `Released` ou `Refunded`, il est terminé. Pour rejouer un scénario, déploie un nouveau contrat et change `CONTRACT_ADDRESS`.

## Structure

```
src/
├── app/            layout, page, providers (wagmi + React Query + RainbowKit)
├── components/     Header, EscrowDashboard, StateStepper, EscrowActions, ConfirmModal, TxStatus, RoleBadge…
├── config/         contract.ts (adresse, ABI, états) · wagmi.ts (Sepolia)
├── hooks/          useEscrow (lectures) · useRole · useEscrowTx (écritures)
└── lib/            format.ts (adresses, dates)
```

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production (vérifie aussi les types) |
| `npm run start` | Sert le build de production |

## Déploiement (Vercel)

1. Pousse le projet sur GitHub (sans `.env.local`, déjà dans `.gitignore`).
2. Sur https://vercel.com : *Add New → Project*, importe le dépôt (framework détecté : Next.js).
3. Ajoute les variables `NEXT_PUBLIC_WC_PROJECT_ID` (et `NEXT_PUBLIC_SEPOLIA_RPC` si utilisée).
4. Deploy. Dans ton projet Reown, ajoute l'URL Vercel aux domaines autorisés.

## Notes techniques

- `next.config.mjs` neutralise des paquets optionnels `@x402/*` importés par le SDK Coinbase (tiré par RainbowKit) qui ne sont pas installés et dont l'app n'a pas besoin.
- Windows : si le mode dev est lent ou si tu vois une `ChunkLoadError`, exclus le dossier du projet de l'antivirus et attends la fin de la compilation avant de recharger.

## Statut des tests (Sepolia)

- Testé en conditions réelles : parcours nominal `Created → Funded → Delivered → Released`, et `refund()` après la deadline.
- Implémenté mais **pas encore testé on-chain** : parcours litige (`raiseDispute()` puis `resolveDispute(true/false)`).
