export type Theme = 'resilience' | 'love' | 'adventure' | 'wisdom' | 'family' | 'courage';

export const themeGradients: Record<Theme, string> = {
  resilience: 'from-blue-50 via-indigo-50 to-purple-50',
  love: 'from-pink-50 via-rose-50 to-red-50',
  adventure: 'from-emerald-50 via-teal-50 to-green-50',
  wisdom: 'from-amber-50 via-yellow-50 to-orange-50',
  family: 'from-cyan-50 via-blue-50 to-indigo-50',
  courage: 'from-red-50 via-orange-50 to-amber-50',
};

export const themeLabels: Record<Theme, string> = {
  resilience: 'Explore Tales of Resilience',
  love: 'Discover Stories of Love',
  adventure: 'Journey Through Adventures',
  wisdom: 'Uncover Words of Wisdom',
  family: 'Share Family Tales',
  courage: 'Experience Stories of Courage',
};

export function getThemeFromContent(content: string): Theme {
  const contentLower = content.toLowerCase();
  
  if (contentLower.includes('love') || contentLower.includes('heart') || contentLower.includes('romance')) {
    return 'love';
  }
  if (contentLower.includes('adventure') || contentLower.includes('journey') || contentLower.includes('travel')) {
    return 'adventure';
  }
  if (contentLower.includes('wisdom') || contentLower.includes('learn') || contentLower.includes('teach')) {
    return 'wisdom';
  }
  if (contentLower.includes('family') || contentLower.includes('parent') || contentLower.includes('child')) {
    return 'family';
  }
  if (contentLower.includes('courage') || contentLower.includes('brave') || contentLower.includes('fear')) {
    return 'courage';
  }
  
  return 'resilience'; // default theme
} 