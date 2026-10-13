/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Évite les warnings des deps optionnelles de WalletConnect / MetaMask SDK
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // Le SDK Coinbase (tiré par le connecteur Base de RainbowKit) importe un module
    // de paiement x402 absent/incompatible. On ne l'utilise pas : on l'ignore.
    const x402 = ["@x402/evm", "@x402/svm", "@x402/core", "@x402/extensions"];
    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(x402.map((m) => [m, false])),
    };
    config.resolve.fallback = { ...config.resolve.fallback, "@react-native-async-storage/async-storage": false };
    return config;
  },
};

export default nextConfig;
