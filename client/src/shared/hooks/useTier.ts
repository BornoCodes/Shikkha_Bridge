import { useLocalStore } from './useLocalStore';

export type Tier = 'kids' | 'university';

/**
 * Kids / university mode. A saved choice wins; otherwise it follows the
 * account's own tier. The choice is made on the Profile page.
 */
export function useTier(accountTier?: string): [Tier, (t: Tier) => void] {
  const [pref, setPref] = useLocalStore<Tier | null>('shikkha_tier_pref', null);
  const tier: Tier = pref ?? (accountTier === 'kids' ? 'kids' : 'university');
  return [tier, setPref];
}
