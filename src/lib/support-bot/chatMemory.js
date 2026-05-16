// Vista Chat Memory — Conversation storage + AI response cache
// Stores in localStorage AND prepares data for DB sync

const STORAGE_KEY = 'vista_chat_history';
const AI_CACHE_KEY = 'vista_ai_cache';
const MAX_MESSAGES = 100;
const MAX_CACHE_ENTRIES = 50;

// ═══════════════════════════════════════════════════════
//  CONVERSATION STORAGE
// ═══════════════════════════════════════════════════════

/**
 * Save messages to localStorage
 */
export function saveMessages(messages) {
  try {
    // Keep only last MAX_MESSAGES
    const trimmed = messages.slice(-MAX_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Vista: Failed to save messages to localStorage', e);
  }
}

/**
 * Load messages from localStorage
 */
export function loadMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Vista: Failed to load messages from localStorage', e);
  }
  return [];
}

/**
 * Clear saved messages
 */
export function clearMessages() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Vista: Failed to clear messages', e);
  }
}

// ═══════════════════════════════════════════════════════
//  AI RESPONSE CACHE
//  Caches AI responses to avoid repeat API calls
// ═══════════════════════════════════════════════════════

/**
 * Simple hash for cache keys
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'ai_' + Math.abs(hash).toString(36);
}

/**
 * Get cached AI response
 */
export function getCachedAIResponse(question) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}');
    const key = hashString(question.toLowerCase().trim());
    const entry = cache[key];
    if (entry) {
      // Check if cache is less than 24 hours old
      if (Date.now() - entry.timestamp < 24 * 60 * 60 * 1000) {
        return entry.response;
      }
    }
  } catch (e) {
    console.warn('Vista: Cache read error', e);
  }
  return null;
}

/**
 * Save AI response to cache
 */
export function cacheAIResponse(question, response) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_KEY) || '{}');
    const key = hashString(question.toLowerCase().trim());
    
    // Prune if too many entries
    const keys = Object.keys(cache);
    if (keys.length >= MAX_CACHE_ENTRIES) {
      // Remove oldest entries
      const sorted = keys.sort((a, b) => (cache[a].timestamp || 0) - (cache[b].timestamp || 0));
      sorted.slice(0, 10).forEach(k => delete cache[k]);
    }

    cache[key] = { response, timestamp: Date.now() };
    localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('Vista: Cache write error', e);
  }
}

// ═══════════════════════════════════════════════════════
//  CONVERSATION CONTEXT TRACKING
//  Tracks what topics the user has asked about for suggestions
// ═══════════════════════════════════════════════════════

const CONTEXT_KEY = 'vista_chat_context';

/**
 * Track a topic that was discussed
 */
export function trackTopic(category) {
  try {
    const context = JSON.parse(localStorage.getItem(CONTEXT_KEY) || '{"topics":[]}');
    // Add to front, keep unique, max 10
    context.topics = [category, ...context.topics.filter(t => t !== category)].slice(0, 10);
    context.lastActive = Date.now();
    localStorage.setItem(CONTEXT_KEY, JSON.stringify(context));
  } catch (e) {
    console.warn('Vista: Context track error', e);
  }
}

/**
 * Get conversation context (recent topics)
 */
export function getConversationContext() {
  try {
    const context = JSON.parse(localStorage.getItem(CONTEXT_KEY) || '{"topics":[]}');
    return context;
  } catch (e) {
    return { topics: [] };
  }
}

/**
 * Clear conversation context
 */
export function clearContext() {
  try {
    localStorage.removeItem(CONTEXT_KEY);
  } catch (e) {
    console.warn('Vista: Context clear error', e);
  }
}

// ═══════════════════════════════════════════════════════
//  PREPARE DATA FOR DB SYNC
//  Formats conversation data to send to server for storage
// ═══════════════════════════════════════════════════════

/**
 * Prepare a conversation summary for DB storage
 */
export function prepareConversationForDB(messages) {
  return {
    messageCount: messages.length,
    topics: getConversationContext().topics,
    lastActive: Date.now(),
    messages: messages.slice(-30).map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content.substring(0, 500) : '',
      timestamp: m.timestamp || Date.now(),
    })),
  };
}
