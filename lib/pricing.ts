import { BookingState } from '../types.ts';
import kitsData from '../data/kits.ts';
import classesData from '../data/classes.ts';

/**
 * PRODUCTION PRICING LOGIC
 * Tiers for transit:
 * 0-10 miles: Free (Local NJ)
 * 10-25 miles: $25 (NYC/Mid NJ)
 * 25-40 miles: $50 (Long Island/Upstate/Deep Jersey)
 */
export const calculatePrice = (state: BookingState) => {
  let addons = 0;
  
  // Find the selected class to get its base price
  const selectedClass = classesData.find(c => c.id === state.selection.classId);
  let base = selectedClass?.price || 89;

  // Handle Kids Lab specific In-Home pricing ($129)
  if (state.selection.classId === 'c7' && state.selection.format === 'in-home') {
    base = 129;
  }

  // Format Base Adjustments (Travel Fees)
  if (state.selection.format === 'in-home') {
    // Distance-based Travel Fee
    const zip = parseInt(state.details.zipCode);
    if (zip > 8500) {
      addons += 50; // Farther tier
    } else if (zip > 7500 || (zip >= 10000 && zip <= 11200)) {
      addons += 25; // NYC / Mid tier
    }
  }

  // Weekend Premium ($20) - Friday evening to Sunday
  if (state.selection.date) {
    const day = new Date(state.selection.date).getDay();
    // 0 = Sunday, 5 = Friday, 6 = Saturday
    if (day === 0 || day === 6 || (day === 5 && state.selection.timeSlot === 'evening')) {
      addons += 20;
    }
  }

  // Headcount Scaling (In-Home sessions only for groups > 4)
  const count = state.details.headcount;
  if (state.selection.format === 'in-home') {
    if (count > 4 && count <= 8) addons += 40;
    else if (count > 8) addons += 80;
  }

  // Kit Add-ons
  state.selection.selectedKits.forEach(kitId => {
    const kit = kitsData.find(k => k.id === kitId);
    if (kit) {
      addons += kit.price;
    }
  });

  return {
    base,
    addons,
    total: base + addons
  };
};