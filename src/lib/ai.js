/**
 * BizVistar AI Framework
 * Centralized AI utilities for all OpenAI interactions.
 * 
 * Single source of truth for:
 * - Model selection
 * - JSON completions with validation
 * - Deep merge utilities
 * - Image/URL field preservation
 */

import OpenAI from 'openai';

// ─── MODEL CONFIGURATION ────────────────────────────────────────────
// Change the model here and it updates everywhere.
export const AI_MODELS = {
  /** Primary model for content generation (AI Writer, analytics insights) */
  PRIMARY: 'gpt-4o-mini',
  /** Lightweight model for chat/support (short responses) */
  CHAT: 'gpt-4o-mini',
};

// ─── OPENAI CLIENT (Singleton) ──────────────────────────────────────
let _client = null;

export function getOpenAIClient() {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

// ─── JSON COMPLETION ────────────────────────────────────────────────
/**
 * Call OpenAI and get a parsed JSON response with automatic validation & retry.
 *
 * @param {object} options
 * @param {string} options.prompt - The user prompt
 * @param {string} [options.systemPrompt] - Optional system prompt
 * @param {string} [options.model] - Override model (defaults to AI_MODELS.PRIMARY)
 * @param {number} [options.temperature=0.7] - Sampling temperature
 * @param {number} [options.maxTokens=1500] - Max output tokens
 * @param {function} [options.validate] - Optional validator fn(parsed) => true/false
 * @param {number} [options.retries=1] - Number of retries on failure
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function jsonCompletion({
  prompt,
  systemPrompt,
  model,
  temperature = 0.7,
  maxTokens = 1500,
  validate,
  retries = 1,
}) {
  const client = getOpenAIClient();
  const selectedModel = model || AI_MODELS.PRIMARY;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const messages = [];
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const completion = await client.chat.completions.create({
        model: selectedModel,
        messages,
        response_format: { type: 'json_object' },
        temperature,
        max_tokens: maxTokens,
      });

      const raw = completion.choices[0].message.content;
      const parsed = JSON.parse(raw);

      // Run custom validator if provided
      if (validate && !validate(parsed)) {
        if (attempt < retries) continue; // retry
        return { success: false, error: 'AI response failed validation' };
      }

      return { success: true, data: parsed };
    } catch (err) {
      if (attempt < retries) continue; // retry on error
      console.error(`[AI Framework] jsonCompletion failed after ${attempt + 1} attempts:`, err);
      return { success: false, error: err.message };
    }
  }

  return { success: false, error: 'Unexpected failure' };
}

// ─── DEEP MERGE ─────────────────────────────────────────────────────
/**
 * Deep merge two objects. `source` values override `target` values.
 * Arrays are replaced (not concatenated).
 * Handles nested objects recursively.
 *
 * @param {object} target - Base object (original data)
 * @param {object} source - New data to merge in
 * @returns {object} Merged result
 */
export function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  if (!target || typeof target !== 'object') return source;

  const result = { ...target };

  for (const key of Object.keys(source)) {
    const targetVal = target[key];
    const sourceVal = source[key];

    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal !== null &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      // Recursively merge nested objects
      result[key] = deepMerge(targetVal, sourceVal);
    } else {
      // Overwrite for primitives, arrays, and nulls
      result[key] = sourceVal;
    }
  }

  return result;
}

// ─── IMAGE / URL FIELD PRESERVATION ─────────────────────────────────

/** Keys that are always treated as image/media fields */
const IMAGE_FIELD_KEYS = new Set([
  'image', 'image1', 'image2',
  'imageArch1', 'imageArch1_b', 'imageSmallArch',
  'logo', 'logoUrl', 'logoText_img',
  'image_url', 'imageUrl',
  'backgroundImage', 'bannerImage', 'heroImage',
  'favicon',
]);

/**
 * Check if a value looks like a URL
 */
function isUrl(value) {
  if (typeof value !== 'string') return false;
  return /^https?:\/\//i.test(value.trim());
}

/**
 * Check if a field key is an image/media field
 */
function isImageField(key) {
  return IMAGE_FIELD_KEYS.has(key);
}

/**
 * Strip all image/URL fields from an object (recursively).
 * Returns a new object with those fields replaced by a placeholder marker.
 * Also collects the original values for later restoration.
 *
 * @param {object} obj - The data to strip
 * @param {string} [path=''] - Internal path tracker
 * @param {Map} [collected] - Internal collection of stripped values
 * @returns {{ stripped: object, imageMap: Map<string, any> }}
 */
export function stripImageFields(obj, path = '', collected = new Map()) {
  if (!obj || typeof obj !== 'object') {
    return { stripped: obj, imageMap: collected };
  }

  if (Array.isArray(obj)) {
    const stripped = obj.map((item, i) => {
      if (item && typeof item === 'object') {
        return stripImageFields(item, `${path}[${i}]`, collected).stripped;
      }
      return item;
    });
    return { stripped, imageMap: collected };
  }

  const stripped = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullPath = path ? `${path}.${key}` : key;

    // Skip entire allProducts array — AI should never touch it
    if (key === 'allProducts') {
      collected.set(fullPath, value);
      stripped[key] = '[PRESERVED - DO NOT MODIFY]';
      continue;
    }

    // Strip known image fields or values that look like URLs
    if (isImageField(key) && (isUrl(value) || value === '')) {
      collected.set(fullPath, value);
      stripped[key] = '[IMAGE - DO NOT MODIFY]';
      continue;
    }

    // For non-image-field keys, check if value is a URL (e.g. social links, navigation hrefs)
    if (typeof value === 'string' && isUrl(value) && !isImageField(key)) {
      collected.set(fullPath, value);
      stripped[key] = '[URL - DO NOT MODIFY]';
      continue;
    }

    // Recurse into nested objects
    if (value && typeof value === 'object') {
      stripped[key] = stripImageFields(value, fullPath, collected).stripped;
      continue;
    }

    stripped[key] = value;
  }

  return { stripped, imageMap: collected };
}

/**
 * Restore all preserved fields (images, URLs, arrays) back into the merged data.
 * This is the final safety net — even if AI touched a field, the original value wins.
 *
 * @param {object} data - The merged data to restore into
 * @param {Map<string, any>} imageMap - The map from stripImageFields
 * @returns {object} Data with all preserved fields restored
 */
export function restoreImageFields(data, imageMap) {
  const result = JSON.parse(JSON.stringify(data)); // deep clone

  for (const [path, originalValue] of imageMap) {
    setNestedValue(result, path, originalValue);
  }

  return result;
}

/**
 * Set a value at a dot-separated path, supporting array indices like `[0]`.
 * e.g. setNestedValue(obj, 'hero.imageArch1', 'https://...')
 */
function setNestedValue(obj, path, value) {
  // Split on dots and brackets: 'a.b[0].c' => ['a', 'b', '0', 'c']
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    }
    current = current[key];
  }

  const lastKey = parts[parts.length - 1];
  current[lastKey] = value;
}
