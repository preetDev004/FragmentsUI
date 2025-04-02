import { FragmentType, FileWithPreview } from "@/utils/types";
import Papa from "papaparse";

export const validateFragmentContent = async (
  type: FragmentType,
  content: string,
  file: FileWithPreview | null
): Promise<string> => {
  if (!file && !content.trim()) return "Content cannot be empty";

  // Validate based on fragment type
  switch (type) {
    case "text/plain":
      break;

    case "application/json":
      if (!file) {
        try {
          JSON.parse(content);
        } catch {
          return "Invalid JSON format";
        }
      }
      break;

    case "text/html":
      if (!file && !isHTML(content)) {
        return "Invalid HTML format";
      }
      break;

    case "text/markdown":
      if (!file && !isMarkdown(content)) {
        return "Invalid Markdown format";
      }
      break;

    case "text/csv":
      if (file) {
        const result = await isCSV(file);
        if (!result.isValid) {
          return "Invalid CSV format";
        }
      }
      break;

    default:
      return "Some Invalid Format";
  }

  return "";
};

const isHTML = (text: string) => {
  if (!text || typeof text !== "string") return false;

  // Trim the input
  const trimmedText = text.trim();

  // Extract all tags for analysis
  const tagPattern = /<\/?([a-z][a-z0-9]*)(?:\s+[^>]*)?\/?>/gi;
  const tagMatches = [...trimmedText.matchAll(tagPattern)];

  if (tagMatches.length === 0) {
    return false; // No HTML tags found
  }

  // Track opening/closing tags
  const stack = [];

  // Self-closing tags don't need matching closing tags
  const selfClosingTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ]);

  for (const match of tagMatches) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    // Skip comments and doctype declarations
    if (fullTag.startsWith("<!--") || fullTag.startsWith("<!DOCTYPE")) {
      continue;
    }

    // Check if it's a self-closing tag (either by tag name or /> syntax)
    if (selfClosingTags.has(tagName) || fullTag.endsWith("/>")) {
      continue;
    }

    // Check if it's a closing tag
    if (fullTag.startsWith("</")) {
      if (stack.length === 0) {
        return false; // Closing tag without matching opening tag
      }

      const lastOpenTag = stack.pop();
      if (lastOpenTag !== tagName) {
        return false; // Tags not properly nested
      }

      continue;
    }

    // It's an opening tag
    stack.push(tagName);
  }

  // If we have unclosed tags, it's not valid HTML
  return stack.length === 0;
};

const isMarkdown = (text: string) => {
  if (!text || typeof text !== "string") return false;

  // Trim the input
  const trimmedText = text.trim();

  // If it's very likely HTML and not ambiguous, return false early
  if (
    /<\/?html>|<\/?body>|<\/?head>|<!DOCTYPE/i.test(trimmedText) ||
    (trimmedText.startsWith("<") && trimmedText.endsWith(">") && trimmedText.length > 10)
  ) {
    return false;
  }

  // Check for common Markdown syntax
  const headingRegex = /^#{1,6}\s+.+$/m;
  const linkRegex = /\[.+?\]\(.+?\)/;
  const imageRegex = /!\[.+?\]\(.+?\)/;
  const boldRegex = /\*\*[^*\n]+?\*\*|__[^_\n]+?__/;
  const italicRegex = /\*[^*\n]+?\*|_[^_\n]+?_/;
  const blockquoteRegex = /^>\s+.+$/m;
  const codeBlockRegex = /```[\s\S]*?```|`[^`\n]+?`/;
  const listRegex = /^[\s]*([-*+]|\d+\.)\s+.+$/m;
  const horizontalRuleRegex = /^[-*_]{3,}$/m;
  const tableRegex = /\|.+\|.*\n\|[-:]+\|/;

  // For very short inputs, check for specific Markdown starters
  if (trimmedText.length < 20) {
    if (
      trimmedText.startsWith("#") ||
      trimmedText.startsWith(">") ||
      trimmedText.startsWith("- ") ||
      trimmedText.startsWith("* ") ||
      trimmedText.startsWith("1. ") ||
      trimmedText.startsWith("```") ||
      (trimmedText.startsWith("[") && trimmedText.includes("](")) ||
      (trimmedText.startsWith("![") && trimmedText.includes("]("))
    ) {
      return true;
    }
  }

  // Check for multiple Markdown features
  const markdownFeatures = [
    headingRegex.test(trimmedText),
    linkRegex.test(trimmedText),
    imageRegex.test(trimmedText),
    boldRegex.test(trimmedText),
    italicRegex.test(trimmedText),
    blockquoteRegex.test(trimmedText),
    codeBlockRegex.test(trimmedText),
    listRegex.test(trimmedText),
    horizontalRuleRegex.test(trimmedText),
    tableRegex.test(trimmedText),
  ];

  // Count Markdown features
  const featureCount = markdownFeatures.filter(Boolean).length;

  // If it contains some HTML but has clear Markdown features, treat as Markdown
  if (isHTML(trimmedText) && featureCount >= 1) {
    // Additional checks to resolve ambiguity
    const htmlDominance = (trimmedText.match(/<[^>]+>/g) || []).length;
    const markdownSpecificSyntax =
      headingRegex.test(trimmedText) ||
      listRegex.test(trimmedText) ||
      blockquoteRegex.test(trimmedText) ||
      tableRegex.test(trimmedText);

    return markdownSpecificSyntax || featureCount > htmlDominance;
  }

  // Return true if any Markdown feature is present
  return featureCount > 0;
};

// Modify the isCSV function to return parsed content and validation status
const isCSV = (file: FileWithPreview): Promise<{ isValid: boolean }> => {
  // More flexible MIME type checking
  const validMimeTypes = ["text/csv", "application/csv", "text/comma-separated-values"];
  if (!validMimeTypes.includes(file.type.toLowerCase())) {
    // If MIME type doesn't match but extension is CSV, still proceed with content validation
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv") {
      return Promise.resolve({ isValid: false });
    }
  }

  // Next, try to parse the content using PapaParse
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;

      // Check for empty file
      if (!content || content.trim() === "") {
        return resolve({ isValid: false });
      }

      // Try parsing with PapaParse
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,

        complete: (results) => {
          // Check if headers exist (at least one column)
          const hasHeaders = results.meta.fields && results.meta.fields.length > 0;

          if (results.errors.length > 0) {
            resolve({ isValid: false });
          } else if (!hasHeaders) {
            // No headers found
            resolve({ isValid: false });
          } else {
            // Successfully parsed as CSV with valid structure
            resolve({ isValid: true });
          }
        },

        error: () => {
          resolve({ isValid: false });
        },
      });
    };

    reader.onerror = () => {
      resolve({ isValid: false });
    };

    reader.readAsText(file);
  });
};
