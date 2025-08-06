import { getBets } from '@/actions/GET/get-bets';
import { BetAccordion } from '@/components/bet- accordion';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { bets, success } = await getBets();

  if (!success) {
    return (
      <main>
        <h1>ERROR AO CARREGAR RESULTADOS, RECARREGUE A PÁGINA!</h1>
      </main>
    );
  }

  return (
    <main>
      <header className="flex justify-center bg-card sm:py-6 py-3 border-b border-b-gray-600">
        <h1 className="sm:text-2xl text-lg">Análise Roleta</h1>
      </header>
      <div className="my-6 sm:mx-6 mx-2 py-2">
        <p className="mb-6 font-medium text-lg">Últimas análises:</p>
        <BetAccordion bets={bets} />
      </div>
    </main>
  );
}
