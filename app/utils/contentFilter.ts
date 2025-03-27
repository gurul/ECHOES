// List of inappropriate words and patterns to filter
const inappropriateWords = [
  // Profanity and offensive language
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell', 'cunt', 'dick', 'pussy', 'whore',
  // Hate speech and discrimination
  'hate', 'racist', 'sexist', 'discriminate', 'nazi', 'fascist', 'supremacist',
  'bigot', 'homophobic', 'transphobic', 'xenophobic', 'antisemitic',
  // Violence and threats
  'kill', 'murder', 'threat', 'violence', 'terror', 'bomb', 'shoot', 'gun',
  'weapon', 'assault', 'attack', 'harm', 'hurt', 'injure', 'abuse',
  // Spam and malicious content
  'spam', 'scam', 'hack', 'virus', 'malware', 'phishing', 'ransomware',
  'crypto', 'bitcoin', 'wallet', 'password', 'account', 'verify',
  // Illegal activities
  'illegal', 'drugs', 'weapons', 'terrorism', 'fraud', 'theft', 'steal',
  'pirate', 'warez', 'crack', 'hack', 'exploit', 'breach',
  // Adult content
  'porn', 'xxx', 'adult', 'sex', 'nude', 'naked', 'explicit',
  // Misinformation
  'conspiracy', 'hoax', 'fake', 'false', 'misleading', 'disinformation',
  // Harassment
  'bully', 'harass', 'stalk', 'intimidate', 'abuse', 'harassment',
  // Personal attacks
  'stupid', 'idiot', 'moron', 'retard', 'dumb', 'ignorant',
];

// Patterns for detecting spam and malicious content
const maliciousPatterns = [
  // URL patterns
  /(?:https?:\/\/)?(?:www\.)?(?:bit\.ly|goo\.gl|tinyurl\.com|t\.co|ow\.ly)\/[a-zA-Z0-9]+/g, // URL shorteners
  /(?:https?:\/\/)?(?:www\.)?(?:discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9-]+/g, // Discord invites
  /(?:https?:\/\/)?(?:www\.)?(?:telegram\.me|t\.me)\/[a-zA-Z0-9_]+/g, // Telegram links
  /(?:https?:\/\/)?(?:www\.)?(?:whatsapp\.com|wa\.me)\/[a-zA-Z0-9]+/g, // WhatsApp links
  
  // Contact information
  /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // Email addresses
  /(?:\+?[0-9]{1,3}[-. ]?)?\(?[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}/g, // Phone numbers
  /(?:@|#)[a-zA-Z0-9_]+/g, // Social media handles
  
  // Cryptocurrency and financial
  /(?:BTC|ETH|USDT|XRP|DOGE|ADA|SOL|DOT|MATIC|LINK|UNI|AAVE|COMP|YFI|SNX|MKR|CRV|BAL|SUSHI|CAKE|BANANA|JOE|SPIRIT|TOMB|TSHARE|TOMB)\s*[:=]\s*[a-zA-Z0-9]+/g, // Crypto addresses
  /(?:wallet|address|private|key|seed|phrase|mnemonic|backup|recovery)/g, // Crypto-related terms
  
  // Malicious patterns
  /(?:password|login|verify|account|security|update|confirm|validate)/g, // Phishing terms
  /(?:hack|crack|warez|keygen|patch|serial|license|activation)/g, // Software piracy
  /(?:exploit|vulnerability|breach|leak|dump|hack|backdoor)/g, // Security exploits
];

// Patterns for detecting spam-like behavior
const spamPatterns = [
  /(?:[A-Z]{4,})/g, // Excessive capitalization
  /(?:[!]{3,})/g, // Multiple exclamation marks
  /(?:[?]{3,})/g, // Multiple question marks
  /(?:[.]{3,})/g, // Multiple periods
  /(?:[0-9]{5,})/g, // Long number sequences
  /(?:[a-zA-Z0-9]{20,})/g, // Long alphanumeric sequences
];

export function filterContent(content: string): { isValid: boolean; reason?: string } {
  // Convert content to lowercase for case-insensitive matching
  const lowerContent = content.toLowerCase();

  // Check for inappropriate words
  for (const word of inappropriateWords) {
    if (lowerContent.includes(word)) {
      return {
        isValid: false,
        reason: 'Content contains inappropriate language or prohibited topics'
      };
    }
  }

  // Check for malicious patterns
  for (const pattern of maliciousPatterns) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        reason: 'Content contains potentially harmful links, contact information, or suspicious patterns'
      };
    }
  }

  // Check for spam patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      return {
        isValid: false,
        reason: 'Content contains spam-like patterns or excessive formatting'
      };
    }
  }

  // Check content length
  if (content.length < 10) {
    return {
      isValid: false,
      reason: 'Content is too short (minimum 10 characters)'
    };
  }

  if (content.length > 5000) {
    return {
      isValid: false,
      reason: 'Content is too long (maximum 5000 characters)'
    };
  }

  // Check for excessive repetition
  const words = content.split(/\s+/);
  const wordFrequency: { [key: string]: number } = {};
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    if (wordFrequency[word] > 10) { // If a word appears more than 10 times
      return {
        isValid: false,
        reason: 'Content contains excessive word repetition'
      };
    }
  }

  // Check for minimum unique words
  const uniqueWords = new Set(words);
  if (uniqueWords.size < 5) {
    return {
      isValid: false,
      reason: 'Content contains too few unique words'
    };
  }

  // Check for maximum word length
  for (const word of words) {
    if (word.length > 50) {
      return {
        isValid: false,
        reason: 'Content contains unusually long words'
      };
    }
  }

  return { isValid: true };
} 