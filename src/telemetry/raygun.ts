import rg4js from "raygun4js";
import axios, { AxiosError } from "axios";

/**
 * Initialize Raygun4JS for crash reporting.
 * Should be called once at app startup.
 */
export function initRaygun(): void {
  const apiKey = process.env.REACT_APP_RAYGUN_API_KEY;

  if (!apiKey) {
    console.warn(
      "Raygun API key not found. Set REACT_APP_RAYGUN_API_KEY to enable error reporting."
    );
    return;
  }

  // Initialize Raygun
  rg4js("apiKey", apiKey);
  rg4js("enableCrashReporting", true);

  // Add environment tag if available
  const env =
    process.env.REACT_APP_ENV || process.env.NODE_ENV || "development";
  rg4js("setUser", {
    identifier: env,
  });

  // Set up axios interceptor for HTTP error reporting
  setupAxiosInterceptor();
}

/**
 * Helper to create safe, short tags for Raygun.
 * Tags should be short strings suitable for filtering.
 */
function createSafeTag(value: string, prefix?: string): string {
  // Convert to lowercase, replace spaces/special chars with underscores
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .substring(0, 50); // Limit length

  return prefix ? `${prefix}:${slug}` : slug;
}

/**
 * Extract endpoint path from a URL, normalizing it for tagging.
 */
function normalizeEndpoint(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove query params and hash for cleaner endpoint tags
    return urlObj.pathname || "/";
  } catch {
    // If URL parsing fails, try to extract path manually
    const match = url.match(/\/[^?#]*/);
    return match ? match[0] : "/";
  }
}

/**
 * Extract hostname from URL for backend tagging.
 */
function extractHost(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Safely preview response data (limit size, prevent PII exposure).
 */
function previewResponseData(data: any): string | null {
  if (!data) return null;

  try {
    const str = typeof data === "string" ? data : JSON.stringify(data);
    // Limit to first 200 chars
    const preview = str.substring(0, 200);
    return str.length > 200 ? `${preview}...` : preview;
  } catch {
    return "[Unable to serialize response data]";
  }
}

/**
 * Build a human-friendly error summary message.
 */
function buildErrorMessage(error: AxiosError<any>): string {
  const method = error.config?.method?.toUpperCase() || "UNKNOWN";
  const url = error.config?.url || "unknown endpoint";
  const status = error.response?.status;
  const statusText = error.response?.statusText || "Unknown Error";

  if (status) {
    return `HTTP ${status} ${method} ${url}: ${statusText}`;
  }

  if (error.request) {
    return `Network Error ${method} ${url}: Request failed (no response)`;
  }

  return `Axios Error ${method} ${url}: ${error.message || "Unknown error"}`;
}

/**
 * Report an Axios error to Raygun with detailed tagging and context.
 */
export function reportAxiosError(error: AxiosError): void {
  // Skip if it's a request cancellation
  if (axios.isCancel(error)) {
    return;
  }

  // Only report errors that have a response (HTTP errors) or a request (network errors)
  // Use type assertion to help TypeScript understand the error structure
  const axiosError = error as AxiosError<any>;
  const hasResponse = axiosError.response !== undefined;
  const hasRequest = axiosError.request !== undefined;

  if (!hasResponse && !hasRequest) {
    // This is likely a configuration error, still report but with different tags
    const tags = ["axios", "error:config"];
    rg4js("withTags", tags);
    rg4js("withCustomData", {
      errorType: "configuration",
      message: axiosError.message,
      config: axiosError.config
        ? { url: axiosError.config.url, method: axiosError.config.method }
        : null,
    });
    rg4js("send", { error: axiosError });
    return;
  }

  // Build tags array
  const tags: string[] = ["axios"];

  // Add HTTP status tag
  if (axiosError.response?.status) {
    tags.push(`http:${axiosError.response.status}`);
  }

  // Add method tag
  if (axiosError.config?.method) {
    tags.push(`method:${axiosError.config.method.toUpperCase()}`);
  }

  // Add endpoint tag
  if (axiosError.config?.url) {
    const endpoint = normalizeEndpoint(axiosError.config.url);
    tags.push(`endpoint:${endpoint}`);
  }

  // Add status text tag (slugified)
  if (axiosError.response?.statusText) {
    tags.push(`statusText:${createSafeTag(axiosError.response.statusText)}`);
  }

  // Add backend host tag if parseable
  if (axiosError.config?.url) {
    const host = extractHost(axiosError.config.url);
    if (host) {
      tags.push(`backend:${createSafeTag(host)}`);
    }
  }

  // Build custom data with full context
  const customData: Record<string, any> = {
    request: {
      url: axiosError.config?.url || "unknown",
      method: axiosError.config?.method?.toUpperCase() || "UNKNOWN",
      baseURL: axiosError.config?.baseURL || null,
      timeout: axiosError.config?.timeout || null,
    },
    summary: buildErrorMessage(axiosError),
  };

  // Add response details if available
  if (axiosError.response) {
    customData.response = {
      status: axiosError.response.status,
      statusText: axiosError.response.statusText,
      headers: axiosError.response.headers
        ? Object.keys(axiosError.response.headers)
        : null,
      dataPreview: previewResponseData(axiosError.response.data),
    };
  } else if (axiosError.request) {
    customData.networkError = {
      message: "Request was made but no response received",
      timeout: axiosError.config?.timeout || null,
    };
  }

  // Send to Raygun
  rg4js("withTags", tags);
  rg4js("withCustomData", customData);
  rg4js("send", { error: axiosError });
}

/**
 * Set up axios response interceptor to automatically report HTTP errors.
 */
function setupAxiosInterceptor(): void {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Report the error to Raygun
      reportAxiosError(error);
      // Re-throw to maintain existing error handling behavior
      return Promise.reject(error);
    }
  );
}
