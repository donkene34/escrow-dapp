import { parseAbi, type Address } from "viem";

// Contrat FreelanceEscrow déployé sur Sepolia
export const CONTRACT_ADDRESS: Address = "0x86895F11Fba78567Fa09C17b21025F6D718D495f";

export const IS_PLACEHOLDER_ADDRESS: boolean =
  CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000";

// ABI réel (fonctions + erreur), issu de l'artifact Hardhat de FreelanceEscrow.
export const CONTRACT_ABI = parseAbi([
  // lectures
  "function client() view returns (address)",
  "function freelancer() view returns (address)",
  "function arbiter() view returns (address)",
  "function state() view returns (uint8)",
  "function deadline() view returns (uint256)",
  "function amount() view returns (uint256)",
  // écritures
  "function fund() payable",
  "function markDelivered()",
  "function release()",
  "function refund()",
  "function raiseDispute()",
  "function resolveDispute(bool payFreelancer)",
  // erreurs
  "error ReentrancyGuardReentrantCall()",
]);

// Ordre de l'enum Solidity State (index = valeur retournée par state()).
// Confirmé par le bytecode : fund → 1, markDelivered → 2, raiseDispute → 3,
// release → 4, refund → 5, resolveDispute(true) → 4 / (false) → 5.
export const STATE_LABELS = [
  "Created",
  "Funded",
  "Delivered",
  "Disputed",
  "Released",
  "Refunded",
] as const;

export type EscrowState = (typeof STATE_LABELS)[number];
