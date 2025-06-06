export type Theme = '' | 'resilience' | 'love' | 'adventure' | 'wisdom' | 'family' | 'courage';

export const themeGradients: Record<string, string> = {
  resilience: 'from-blue-500 via-indigo-500 to-violet-500',
  love: 'from-rose-500 via-pink-500 to-red-500',
  adventure: 'from-amber-500 via-orange-500 to-yellow-500',
  wisdom: 'from-emerald-500 via-teal-500 to-cyan-500',
  family: 'from-fuchsia-500 via-purple-500 to-pink-500',
  courage: 'from-red-500 via-orange-500 to-amber-500',
};

export const themeLabels: Record<Exclude<Theme, ''>, string> = {
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