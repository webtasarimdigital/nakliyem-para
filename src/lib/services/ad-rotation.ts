import { AdSlotPlacement, CarrierProfile, AdCampaign } from '@/types';
import { db } from '../data/mock-db';

export function getFeaturedCarriersForSlot(slotKey: AdSlotPlacement, filter?: { city?: string; service?: string }): CarrierProfile[] {
  const carriers = db.getCarriers().filter(c => c.verificationStatus === 'APPROVED');
  const campaigns = db.getAdCampaigns().filter(camp => camp.slotKey === slotKey && camp.isActive);

  // 1. Collect carriers from active paid campaigns
  const campaignCarrierIds = new Set(campaigns.map(c => c.carrierId));

  // 2. Collect carriers who have GOLD membership
  const goldCarriers = carriers.filter(c => c.planId === 'plan_gold');

  // Combine unique eligible carriers
  const eligibleCarriers: CarrierProfile[] = [];
  const addedIds = new Set<string>();

  for (const c of carriers) {
    if (campaignCarrierIds.has(c.id) || (goldCarriers.some(g => g.id === c.id) && isEligibleForSlot(slotKey, c))) {
      // Apply optional city/service match
      if (filter?.city && !c.serviceAreas.includes('TÜM_TÜRKİYE') && !c.serviceAreas.includes(filter.city) && c.city !== filter.city) {
        continue;
      }
      if (filter?.service && !c.services.includes(filter.service)) {
        continue;
      }

      if (!addedIds.has(c.id)) {
        eligibleCarriers.push(c);
        addedIds.add(c.id);
      }
    }
  }

  // If no targeted sponsor, fallback to top rated verified carriers with sponsored badge
  if (eligibleCarriers.length === 0) {
    return carriers.slice(0, 3);
  }

  // Fair rotation algorithm (shuffle with rating bias)
  return eligibleCarriers.sort((a, b) => b.rating - a.rating).slice(0, 4);
}

function isEligibleForSlot(slotKey: AdSlotPlacement, carrier: CarrierProfile): boolean {
  if (carrier.planId !== 'plan_gold') return false;
  if (carrier.verificationStatus !== 'APPROVED') return false;
  return true;
}
