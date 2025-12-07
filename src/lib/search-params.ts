import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

/**
 * Shared nuqs parsers for consistent URL state management.
 * These can be used in both client components (useQueryState) and server components (searchParams).
 */

// Problems page search params
export const problemsSearchParams = {
  q: parseAsString.withDefault(""),
  sort: parseAsString.withDefault("serial_asc"),
  category: parseAsString.withDefault("all"),
  difficulty: parseAsString.withDefault("all"),
  status: parseAsString.withDefault("all"),
  page: parseAsInteger.withDefault(1),
};

// Exams page search params
export const examsSearchParams = {
  q: parseAsString.withDefault(""),
  view: parseAsString.withDefault("grid"),
  sort: parseAsString.withDefault("latest"),
  category: parseAsString.withDefault("all"),
  difficulty: parseAsString.withDefault("all"),
};

// Generic pagination
export const paginationParams = {
  page: parseAsInteger.withDefault(1),
};

// Server-side loaders for use in server components
export const loadProblemsSearchParams = createLoader(problemsSearchParams);
export const loadExamsSearchParams = createLoader(examsSearchParams);
