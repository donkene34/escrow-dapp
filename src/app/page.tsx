import { EscrowDashboard } from "@/components/EscrowDashboard";
import { Header } from "@/components/Header";
import { NetworkGuard } from "@/components/NetworkGuard";
import { PlaceholderBanner } from "@/components/PlaceholderBanner";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <PlaceholderBanner />
        <NetworkGuard />
        <EscrowDashboard />
      </main>
    </>
  );
}
