// "use client";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { format } from "date-fns";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "../ui/button";

// const ROULETTE_SEQUENCE = [
//   0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
//   16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
// ];

// function getNeighbors(number: number, distance: number = 2): number[] {
//   const index = ROULETTE_SEQUENCE.indexOf(number);
//   const len = ROULETTE_SEQUENCE.length;
//   const neighbors: number[] = [];
//   for (let i = 1; i <= distance; i++) {
//     neighbors.push(ROULETTE_SEQUENCE[(index - i + len) % len]);
//     neighbors.push(ROULETTE_SEQUENCE[(index + i) % len]);
//   }
//   return neighbors;
// }

// function getAllEndingWith(digit: number): number[] {
//   return ROULETTE_SEQUENCE.filter((n) => n % 10 === digit);
// }

// export type Bet = {
//   id: number;
//   result_number: number;
//   date: Date;
// };

// export type Props = {
//   bets: Bet[];
// };

// type AnalysisResult = {
//   bet: Bet;
//   pulledBy: number;
//   triggerDigit: number;
//   neighbors: number[];
//   triggerDetected: boolean;
//   betDigit: number;
//   betOptions: number[];
//   nextNumber: number | null;
//   hit: boolean;
// };

// export function BetAccordion({ bets }: Props) {
//   const grouped = groupBetsByDateTime(bets);

//   return (
//     <Accordion type="multiple" className="w-full">
//       {Object.entries(grouped).map(([datetime, groupBets]) => {
//         const analyzed = analyzeBets(groupBets);

//         return (
//           <AccordionItem
//             className="bg-card px-4 rounded-sm"
//             key={datetime}
//             value={datetime}
//           >
//             <AccordionTrigger className="text-xl">{datetime}</AccordionTrigger>
//             <AccordionContent>
//               <div className="grid grid-cols-5 gap-2 p-2">
//                 {analyzed.map((result, i) => (
//                   <Dialog key={result.bet.id}>
//                     <DialogTrigger asChild>
//                       <Button
//                         className={`rounded p-2 text-sm text-white w-full h-10 flex items-center justify-center
//                           ${result.triggerDetected
//                             ? result.hit
//                               ? "bg-green-600 hover:bg-green-700"
//                               : "bg-red-600 hover:bg-red-700"
//                             : "bg-gray-500"}`}
//                       >
//                         {result.bet.result_number}
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent>
//                       <DialogTitle className="font-bold text-lg">
//                         Detalhes da análise do número {result.bet.result_number}
//                       </DialogTitle>
//                       <div className="space-y-2">
//                         <p>Número puxado por: {result.pulledBy}</p>
//                         <p>Dígito do gatilho (final de {result.pulledBy}): {result.triggerDigit}</p>
//                         <p>Vizinhos de {result.bet.result_number}: {result.neighbors.join(", ")}</p>
//                         <p>Gatilho detectado: {result.triggerDetected ? "Sim ✅" : "Não ❌"}</p>
//                         <p>Dígito da aposta: {result.betDigit} → Apostas: {result.betOptions.join(", ")}</p>
//                         <p>Próximo número: {result.nextNumber ?? "Último"}</p>
//                         <p>
//                           Acerto:{" "}
//                           {result.triggerDetected
//                             ? result.hit
//                               ? "Sim ✅"
//                               : "Não ❌"
//                             : "Não houve entrada"}
//                         </p>
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                 ))}
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         );
//       })}
//     </Accordion>
//   );
// }

// function groupBetsByDateTime(bets: Bet[]): Record<string, Bet[]> {
//   return bets.reduce((acc, bet) => {
//     const key = format(new Date(bet.date), "dd/MM/yyyy - HH:mm");
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(bet);
//     return acc;
//   }, {} as Record<string, Bet[]>);
// }

// function analyzeBets(bets: Bet[]): AnalysisResult[] {
//   const results: AnalysisResult[] = [];
//   for (let i = bets.length - 1; i > 1; i--) {
//     const pulledBy = bets[i].result_number;
//     const current = bets[i - 1];
//     const next = bets[i - 2];

//     const triggerDigit = pulledBy % 10;
//     const neighbors = getNeighbors(current.result_number, 2);
//     const triggerDetected = neighbors.some((n) => n % 10 === triggerDigit);

//     const betDigit = current.result_number % 10;
//     const betOptions = getAllEndingWith(betDigit);
//     const nextNumber = next.result_number;
//     const hit =
//       triggerDetected &&
//       getNeighbors(nextNumber, 3).some((n) => betOptions.includes(n));

//     results.unshift({
//       bet: current,
//       pulledBy,
//       triggerDigit,
//       neighbors,
//       triggerDetected,
//       betDigit,
//       betOptions,
//       nextNumber,
//       hit,
//     });
//   }

//   // Preenche o primeiro e o último número com botões cinzas
//   results.unshift({
//     bet: bets[0],
//     pulledBy: -1,
//     triggerDigit: -1,
//     neighbors: [],
//     triggerDetected: false,
//     betDigit: bets[0].result_number % 10,
//     betOptions: [],
//     nextNumber: null,
//     hit: false,
//   });

//   results.push({
//     bet: bets[bets.length - 1],
//     pulledBy: -1,
//     triggerDigit: -1,
//     neighbors: [],
//     triggerDetected: false,
//     betDigit: bets[bets.length - 1].result_number % 10,
//     betOptions: [],
//     nextNumber: null,
//     hit: false,
//   });

//   return results;
// }


'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

const ROULETTE_SEQUENCE = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

function getNeighbors(number: number, distance: number = 3): number[] {
  const index = ROULETTE_SEQUENCE.indexOf(number);
  const len = ROULETTE_SEQUENCE.length;
  const neighbors: number[] = [];

  for (let i = 1; i <= distance; i++) {
    neighbors.push(ROULETTE_SEQUENCE[(index - i + len) % len]);
    neighbors.push(ROULETTE_SEQUENCE[(index + i) % len]);
  }

  return neighbors;
}

function getAllEndingWith(digit: number): number[] {
  return ROULETTE_SEQUENCE.filter((n) => n % 10 === digit);
}

export type Bet = {
  id: number;
  result_number: number;
  date: Date;
};

export type Props = {
  bets: Bet[];
};

type AnalysisResult = {
  bet: Bet;
  pulledBy: number;
  triggerDigit: number;
  neighbors: number[];
  triggerDetected: boolean;
  betDigit: number;
  betOptions: number[];
  nextNumber: number | null;
  hit: boolean;
  exactHit: boolean;
  neighborHit: number | null;
};

export function BetAccordion({ bets }: Props) {
  const grouped = groupBetsByDateTime(bets);

  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(grouped).map(([datetime, bets]) => {
        const analyzed = analyzeBets(bets);
        analyzed.shift();

        const stats = {
          gatilhos: 0,
          greens: 0,
          reds: 0,
          exact: 0,
          viz1: 0,
          viz2: 0,
          viz3: 0,
        };

        analyzed.forEach((r, i) => {
          if (i === 0 || i === analyzed.length - 1) return;
          if (r.triggerDetected) {
            stats.gatilhos++;
            if (r.hit) {
              stats.greens++;
              if (r.exactHit) stats.exact++;
              else if (r.neighborHit) stats[`viz${r.neighborHit}`]++;
            } else {
              stats.reds++;
            }
          }
        });

        return (
          <AccordionItem
            className="bg-card px-4 rounded-sm mb-2"
            key={datetime}
            value={datetime}
          >
            <AccordionTrigger className="text-xl">{datetime}</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-5 gap-2 p-2">
                {analyzed.map((result, i) => (
                  <Dialog key={result.bet.id}>
                    <DialogTrigger asChild>
                      <Button
                        className={`rounded p-2 text-sm text-white w-full h-10 flex items-center justify-center
                          ${
                            i === 0 || i === analyzed.length - 1
                              ? 'bg-gray-500 cursor-not-allowed'
                              : result.triggerDetected && result.hit
                              ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                              : result.triggerDetected
                              ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                              : 'bg-muted text-muted-foreground hover:bg-muted cursor-pointer'
                          }`}
                        disabled={i === 0 || i === analyzed.length - 1}
                      >
                        {result.bet.result_number}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle className="font-bold text-lg">
                        Detalhes da análise do número {result.bet.result_number}
                      </DialogTitle>
                      <div className="space-y-2">
                        <p>Puxado por: {result.pulledBy}</p>
                        <p>Dígito do gatilho (final de {result.pulledBy}): {result.triggerDigit}</p>
                        <p>Vizinhos de {result.bet.result_number}: {result.neighbors.join(', ')}</p>
                        <p>Gatilho detectado: {result.triggerDetected ? 'Sim ✅' : 'Não ❌'}</p>
                        <p>Dígito da aposta: {result.betDigit} → Apostas: {result.betOptions.join(', ')}</p>
                        <p>Próximo número: {result.nextNumber ?? 'Último'}</p>
                        <p>
                          Acerto:{' '}
                          {!result.triggerDetected
                            ? 'Não houve entrada'
                            : result.hit
                            ? result.exactHit
                              ? 'Sim (exato 🎯)'
                              : `Sim (em ${result.neighborHit} casa${result.neighborHit! > 1 ? 's' : ''} 🎯)`
                            : 'Não ❌'}
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Total de gatilhos: {stats.gatilhos}</p>
                <p>Acertos (GREEN): {stats.greens}</p>
                <p>Erros (RED): {stats.reds}</p>
                <p>Acertos exatos: {stats.exact}</p>
                <p>Acertos em 1 casa: {stats.viz1}</p>
                <p>Acertos em 2 casas: {stats.viz2}</p>
                <p>Acertos em 3 casas: {stats.viz3}</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function groupBetsByDateTime(bets: Bet[]): Record<string, Bet[]> {
  return bets.reduce((acc, bet) => {
    const key = format(new Date(bet.date), 'dd/MM/yyyy - HH:mm');
    if (!acc[key]) acc[key] = [];
    acc[key].push(bet);
    return acc;
  }, {} as Record<string, Bet[]>);
}

function analyzeBets(bets: Bet[]): AnalysisResult[] {
  const results: AnalysisResult[] = [];

  for (let i = bets.length - 1; i > 0; i--) {
    const pulled = bets[i];
    const current = bets[i - 1];
    const next = i - 2 >= 0 ? bets[i - 2].result_number : null;

    const triggerDigit = pulled.result_number % 10;
    const neighbors = getNeighbors(current.result_number, 2);
    const triggerDetected = neighbors.some((n) => n % 10 === triggerDigit);

    const betDigit = current.result_number % 10;
    const betOptions = getAllEndingWith(betDigit);

    let hit = false;
    let exactHit = false;
    let neighborHit: number | null = null;

    if (triggerDetected && next !== null) {
      if (betOptions.includes(next)) {
        hit = true;
        exactHit = true;
      } else {
        for (let d = 1; d <= 3; d++) {
          if (getNeighbors(next, d).some((n) => betOptions.includes(n))) {
            hit = true;
            neighborHit = d;
            break;
          }
        }
      }
    }

    results.unshift({
      bet: current,
      pulledBy: pulled.result_number,
      triggerDigit,
      neighbors,
      triggerDetected,
      betDigit,
      betOptions,
      nextNumber: next,
      hit,
      exactHit,
      neighborHit,
    });
  }

  // Adiciona os extremos para manter a grade
  results.unshift({
    bet: bets[0],
    pulledBy: -1,
    triggerDigit: -1,
    neighbors: [],
    triggerDetected: false,
    betDigit: bets[0].result_number % 10,
    betOptions: [],
    nextNumber: bets.length > 1 ? bets[1].result_number : null,
    hit: false,
    exactHit: false,
    neighborHit: null,
  });
  results.push({
    bet: bets[bets.length - 1],
    pulledBy: -1,
    triggerDigit: -1,
    neighbors: [],
    triggerDetected: false,
    betDigit: bets[bets.length - 1].result_number % 10,
    betOptions: [],
    nextNumber: null,
    hit: false,
    exactHit: false,
    neighborHit: null,
  });

  return results;
}
