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

    // Image validation cases
    case "image/png":
      if (!file) {
        return "Image file is required";
      }
      if (!(await isPNG(file))) {
        return "Invalid PNG format";
      }
      console.log("PNG file validated successfully");
      break;

    case "image/jpeg":
      if (!file) {
        return "Image file is required";
      }
      if (!(await isJPEG(file))) {
        return "Invalid JPEG format";
      }
      break;

    case "image/webp":
      if (!file) {
        return "Image file is required";
      }
      if (!(await isWEBP(file))) {
        return "Invalid WEBP format";
      }
      break;

    case "image/gif":
      if (!file) {
        return "Image file is required";
      }
      if (!(await isGIF(file))) {
        return "Invalid GIF format";
      }
      break;

    case "image/avif":
      if (!file) {
        return "Image file is required";
      }
      if (!(await isAVIF(file))) {
        return "Invalid AVIF format";
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

// Modified to work with FileWithPreview in a browser environment
const isPNG = async (file: FileWithPreview): Promise<boolean> => {
  // Check MIME type first
  if (file.type !== "image/png") {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "png") {
      return false;
    }
  }

  // Read the first few bytes to check PNG signature
  try {
    const buffer = await readFileAsArrayBuffer(file, 8);
    const array = new Uint8Array(buffer);

    // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
    return (
      array[0] === 0x89 &&
      array[1] === 0x50 &&
      array[2] === 0x4e &&
      array[3] === 0x47 &&
      array[4] === 0x0d &&
      array[5] === 0x0a &&
      array[6] === 0x1a &&
      array[7] === 0x0a
    );
  } catch (error) {
    console.error("Error validating PNG:", error);
    return false;
  }
};

const isJPEG = async (file: FileWithPreview): Promise<boolean> => {
  // Check MIME type first
  if (file.type !== "image/jpeg") {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "jpe"].includes(fileExt || "")) {
      return false;
    }
  }

  // Read the first few bytes to check JPEG signature
  try {
    const buffer = await readFileAsArrayBuffer(file, 3);
    const array = new Uint8Array(buffer);

    // JPEG starts with FF D8 FF
    return array[0] === 0xff && array[1] === 0xd8 && array[2] === 0xff;
  } catch (error) {
    console.error("Error validating JPEG:", error);
    return false;
  }
};

const isWEBP = async (file: FileWithPreview): Promise<boolean> => {
  // Check MIME type first
  if (file.type !== "image/webp") {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "webp") {
      return false;
    }
  }

  // Read the first bytes to check WebP signature
  try {
    const buffer = await readFileAsArrayBuffer(file, 12);
    const array = new Uint8Array(buffer);

    // Check WebP signature: RIFF....WEBP
    return (
      array[0] === 0x52 && // R
      array[1] === 0x49 && // I
      array[2] === 0x46 && // F
      array[3] === 0x46 && // F
      array[8] === 0x57 && // W
      array[9] === 0x45 && // E
      array[10] === 0x42 && // B
      array[11] === 0x50 // P
    );
  } catch (error) {
    console.error("Error validating WebP:", error);
    return false;
  }
};

const isGIF = async (file: FileWithPreview): Promise<boolean> => {
  // Check MIME type first
  if (file.type !== "image/gif") {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "gif") {
      return false;
    }
  }

  // Read the first bytes to check GIF signature
  try {
    const buffer = await readFileAsArrayBuffer(file, 6);
    const array = new Uint8Array(buffer);

    // Check for GIF87a or GIF89a signature
    return (
      array[0] === 0x47 && // G
      array[1] === 0x49 && // I
      array[2] === 0x46 && // F
      array[3] === 0x38 && // 8
      (array[4] === 0x37 || array[4] === 0x39) && // 7 or 9
      array[5] === 0x61 // a
    );
  } catch (error) {
    console.error("Error validating GIF:", error);
    return false;
  }
};

const isAVIF = async (file: FileWithPreview): Promise<boolean> => {
  // Check MIME type first
  if (file.type !== "image/avif") {
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "avif") {
      return false;
    }
  }

  // Read the first bytes to check AVIF signature
  try {
    const buffer = await readFileAsArrayBuffer(file, 24);
    const array = new Uint8Array(buffer);

    // Check for FTYPBOX signature
    const hasFtypSignature =
      array[4] === 0x66 && // f
      array[5] === 0x74 && // t
      array[6] === 0x79 && // y
      array[7] === 0x70; // p

    if (!hasFtypSignature) {
      return false;
    }

    // Look for 'avif' or 'avis' brand
    for (let i = 8; i < Math.min(array.length - 4, 24); i++) {
      if (
        (array[i] === 0x61 &&
          array[i + 1] === 0x76 &&
          array[i + 2] === 0x69 &&
          array[i + 3] === 0x66) || // 'avif'
        (array[i] === 0x61 &&
          array[i + 1] === 0x76 &&
          array[i + 2] === 0x69 &&
          array[i + 3] === 0x73) // 'avis'
      ) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error validating AVIF:", error);
    return false;
  }
};

// Helper function to read a file as ArrayBuffer
const readFileAsArrayBuffer = (file: FileWithPreview, length: number): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };

    reader.onerror = () => {
      reject(reader.error || new Error("Unknown error reading file"));
    };

    // Read just the specified number of bytes from the beginning
    const blob = file.slice(0, length);
    reader.readAsArrayBuffer(blob);
  });
};
