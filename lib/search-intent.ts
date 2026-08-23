export type SearchIntent = {
  query: string
  type?: string
  maxReadyTime?: number
  label?: string
}

export function parseSearchIntent(input: string): SearchIntent {
  const query = input.trim()
  const normalized = query.toLowerCase()

  if (/sweet tooth|something sweet|want dessert|chocolate craving/.test(normalized)) {
    return { query: "sweet", type: "dessert", label: "Dessert · Sweet" }
  }
  if (/healthy dinner|light dinner/.test(normalized)) {
    return { query: "healthy", type: "main course", label: "Main course · Healthy" }
  }
  if (/quick (chicken|vegetarian|vegan)?\s*dinner/.test(normalized)) {
    return { query: query.replace(/quick\s*/i, "").trim() || "dinner", type: "main course", maxReadyTime: 30, label: "Main course · Under 30 min" }
  }
  if (/spicy food|spicy craving/.test(normalized)) {
    return { query: "spicy", type: "main course", label: "Main course · Spicy" }
  }

  return { query }
}
