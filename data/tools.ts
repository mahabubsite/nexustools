import { ToolMetadata, ToolCategory } from '../types';

export const TOOLS: ToolMetadata[] = [
  // -------------------------
  // CODE PREVIEW TOOLS
  // -------------------------
  {
    id: 'code-playground',
    slug: 'code-playground',
    name: 'Code Playground',
    description: 'Real-time editor to preview HTML, CSS, and JavaScript code individually or together.',
    category: ToolCategory.PREVIEW,
    popular: true,
  },

  // -------------------------
  // DOWNLOAD TOOLS
  // -------------------------
  {
    id: 'youtube-thumbnail-downloader',
    slug: 'youtube-thumbnail-downloader',
    name: 'YouTube Thumbnail Downloader',
    description: 'Download high-quality thumbnails from any YouTube video.',
    category: ToolCategory.DOWNLOAD,
    popular: true,
  },
  {
    id: 'youtube-video-downloader',
    slug: 'youtube-video-downloader',
    name: 'YouTube Video Downloader',
    description: 'Download videos from YouTube in various qualities.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'facebook-video-downloader',
    slug: 'facebook-video-downloader',
    name: 'Facebook Video Downloader',
    description: 'Save public videos from Facebook.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'tiktok-video-downloader',
    slug: 'tiktok-video-downloader',
    name: 'TikTok Video Downloader',
    description: 'Download TikTok videos without watermark.',
    category: ToolCategory.DOWNLOAD,
    popular: true,
  },
  {
    id: 'instagram-video-downloader',
    slug: 'instagram-video-downloader',
    name: 'Instagram Video Downloader',
    description: 'Download Reels and Videos from Instagram.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'instagram-image-downloader',
    slug: 'instagram-image-downloader',
    name: 'Instagram Image Downloader',
    description: 'Download photos from Instagram posts.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'dailymotion-video-downloader',
    slug: 'dailymotion-video-downloader',
    name: 'Dailymotion Video Downloader',
    description: 'Download content from Dailymotion.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'threads-video-downloader',
    slug: 'threads-video-downloader',
    name: 'Threads Video Downloader',
    description: 'Save videos from Instagram Threads.',
    category: ToolCategory.DOWNLOAD,
  },
  {
    id: 'vimeo-video-downloader',
    slug: 'vimeo-video-downloader',
    name: 'Vimeo Video Downloader',
    description: 'Download Vimeo videos.',
    category: ToolCategory.DOWNLOAD,
  },

  // -------------------------
  // TEXT TOOLS
  // -------------------------
  {
    id: 'text-to-speech',
    slug: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert written text into spoken words using browser-native synthesis.',
    category: ToolCategory.TEXT,
    popular: true,
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, camelCase, snake_case, and more.',
    category: ToolCategory.TEXT,
    popular: true,
  },
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in real-time.',
    category: ToolCategory.TEXT,
    popular: true,
  },
  {
    id: 'duplicate-line-remover',
    slug: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    description: 'Remove duplicate lines from a text list automatically.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'email-extractor',
    slug: 'email-extractor',
    name: 'Email Extractor',
    description: 'Extract email addresses from a large block of text.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'text-separator',
    slug: 'text-separator',
    name: 'Text Separator',
    description: 'Split text by new line, comma, dot, or custom character.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'url-extractor',
    slug: 'url-extractor',
    name: 'URL Extractor',
    description: 'Extract URLs from a block of text.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'text-size-calculator',
    slug: 'text-size-calculator',
    name: 'Text Size Calculator',
    description: 'Calculate the byte size of your text string.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'list-randomizer',
    slug: 'list-randomizer',
    name: 'List Randomizer',
    description: 'Shuffle a list of items randomly.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'reverse-text',
    slug: 'reverse-text',
    name: 'Reverse Text',
    description: 'Reverse words, letters, or lines in your text.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'emoji-remover',
    slug: 'emoji-remover',
    name: 'Emoji Remover',
    description: 'Remove all emojis from a text string.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'alphabetizer',
    slug: 'alphabetizer',
    name: 'Alphabetizer',
    description: 'Sort text lines alphabetically (A-Z or Z-A).',
    category: ToolCategory.TEXT,
  },
  {
    id: 'upside-down-text',
    slug: 'upside-down-text',
    name: 'Upside Down Text',
    description: 'Flip your text upside down.',
    category: ToolCategory.TEXT,
  },
  {
    id: 'palindrome-checker',
    slug: 'palindrome-checker',
    name: 'Palindrome Checker',
    description: 'Check if a word or phrase reads the same backward as forward.',
    category: ToolCategory.TEXT,
  },

  // -------------------------
  // GENERATOR TOOLS
  // -------------------------
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: 'Strong Password Generator',
    description: 'Create secure, random passwords with customizable length.',
    category: ToolCategory.GENERATOR,
    popular: true,
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID v4 Generator',
    description: 'Generate random UUIDs version 4.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'lorem-ipsum',
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'signature-generator',
    slug: 'signature-generator',
    name: 'Signature Generator',
    description: 'Draw and download your digital signature.',
    category: ToolCategory.GENERATOR,
    popular: true,
  },
  {
    id: 'mailto-generator',
    slug: 'mailto-generator',
    name: 'Mailto Link Generator',
    description: 'Create HTML mailto links with subject and body.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'utm-builder',
    slug: 'utm-builder',
    name: 'UTM Builder',
    description: 'Build Google Analytics tracking URLs.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'whatsapp-link-generator',
    slug: 'whatsapp-link-generator',
    name: 'WhatsApp Link Generator',
    description: 'Create direct WhatsApp chat links.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'slug-generator',
    slug: 'slug-generator',
    name: 'Slug Generator',
    description: 'Convert strings into URL-friendly slugs.',
    category: ToolCategory.GENERATOR,
  },
  {
    id: 'random-number',
    slug: 'random-number',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specific range.',
    category: ToolCategory.GENERATOR,
  },

  // -------------------------
  // DEVELOPER TOOLS
  // -------------------------
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Beautify, validate, and minify JSON data.',
    category: ToolCategory.DEVELOPER,
    popular: true,
  },
  {
    id: 'url-parser',
    slug: 'url-parser',
    name: 'URL Parser',
    description: 'Parse URLs to get host, path, query parameters, etc.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'html-minifier',
    slug: 'html-minifier',
    name: 'HTML Minifier',
    description: 'Minify HTML code by removing whitespace and comments.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'css-minifier',
    slug: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'js-minifier',
    slug: 'js-minifier',
    name: 'JS Minifier',
    description: 'Minify JavaScript code.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'html-entity-converter',
    slug: 'html-entity-converter',
    name: 'HTML Entity Converter',
    description: 'Convert characters to HTML entities and vice versa.',
    category: ToolCategory.DEVELOPER,
  },
  {
    id: 'user-agent-parser',
    slug: 'user-agent-parser',
    name: 'User Agent Parser',
    description: 'Analyze user agent strings to identify browser and OS.',
    category: ToolCategory.DEVELOPER,
  },

  // -------------------------
  // CONVERTER TOOLS
  // -------------------------
  {
    id: 'base64-converter',
    slug: 'base64-encode-decode',
    name: 'Base64 Encode/Decode',
    description: 'Convert text to Base64 and vice versa.',
    category: ToolCategory.CONVERTER,
  },
  {
    id: 'url-encode-decode',
    slug: 'url-encode-decode',
    name: 'URL Encode/Decode',
    description: 'Encode text to URL-safe format or decode it.',
    category: ToolCategory.CONVERTER,
  },
  {
    id: 'color-converter',
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert between HEX, RGB, HSL, and HSV.',
    category: ToolCategory.CONVERTER,
  },
  {
    id: 'binary-converter',
    slug: 'binary-converter',
    name: 'Binary Converter',
    description: 'Convert text to binary and vice versa.',
    category: ToolCategory.CONVERTER,
  },
  {
    id: 'number-to-words',
    slug: 'number-to-words',
    name: 'Number to Words',
    description: 'Convert numbers into English words.',
    category: ToolCategory.CONVERTER,
  },

  // -------------------------
  // IMAGE TOOLS
  // -------------------------
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Converter',
    description: 'Convert images to PNG, JPG, or WEBP formats.',
    category: ToolCategory.IMAGE,
    popular: true,
  },
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions.',
    category: ToolCategory.IMAGE,
  },
  
  // -------------------------
  // CHECKER TOOLS
  // -------------------------
  {
    id: 'password-strength',
    slug: 'password-strength-checker',
    name: 'Password Strength',
    description: 'Check how secure your password is.',
    category: ToolCategory.CHECKER,
  },
  {
    id: 'dns-lookup',
    slug: 'dns-lookup',
    name: 'DNS Lookup',
    description: 'Find DNS records for a domain.',
    category: ToolCategory.CHECKER,
  },
  {
    id: 'ip-lookup',
    slug: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Find location and details of an IP address.',
    category: ToolCategory.CHECKER,
  },
  {
    id: 'whois-lookup',
    slug: 'whois-lookup',
    name: 'Whois Lookup',
    description: 'Lookup domain registration details.',
    category: ToolCategory.CHECKER,
  },
  {
    id: 'http-headers',
    slug: 'http-headers-lookup',
    name: 'HTTP Headers',
    description: 'View HTTP headers of a website.',
    category: ToolCategory.CHECKER,
  },

  // -------------------------
  // TIME & UNIT TOOLS
  // -------------------------
  {
    id: 'unix-timestamp',
    slug: 'unix-timestamp',
    name: 'Unix Timestamp',
    description: 'Convert between Unix timestamps and human dates.',
    category: ToolCategory.MISC,
  },
  
  // -------------------------
  // MISC TOOLS
  // -------------------------
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for links and text.',
    category: ToolCategory.MISC,
    popular: true,
  },
  {
    id: 'qr-code-reader',
    slug: 'qr-code-reader',
    name: 'QR Code Reader',
    description: 'Read QR codes from images or camera.',
    category: ToolCategory.MISC,
  },
  {
    id: 'facebook-comment-picker',
    slug: 'facebook-comment-picker',
    name: 'Facebook Comment Picker',
    description: 'Pick a random winner from Facebook comments.',
    category: ToolCategory.MISC,
  },
  {
    id: 'youtube-comment-picker',
    slug: 'youtube-comment-picker',
    name: 'YouTube Comment Picker',
    description: 'Pick a random winner from YouTube comments.',
    category: ToolCategory.MISC,
  },
  {
    id: 'facebook-like-picker',
    slug: 'facebook-like-picker',
    name: 'Facebook Like Picker',
    description: 'Pick a random winner from Facebook likes.',
    category: ToolCategory.MISC,
  }
];

export const getToolBySlug = (slug: string): ToolMetadata | undefined => {
  return TOOLS.find(t => t.slug === slug);
};

export const getToolsByCategory = (category: ToolCategory): ToolMetadata[] => {
  return TOOLS.filter(t => t.category === category);
};

export const getPopularTools = (): ToolMetadata[] => {
  return TOOLS.filter(t => t.popular);
};