'use server';

import { db } from '@/lib/prisma';

export async function getBets() {
  try {
    const bets = await db.results_bets.findMany({});
    return { success: true, bets };
  } catch (err) {
    console.log(err);
    return { success: false, bets: [] };
  }
}
