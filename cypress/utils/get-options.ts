/**
 * Returns configuration options based on the specified name and version
 * @param version The version number to get options for
 * @param name The identifier for the specific configuration set
 * @returns The appropriate options object for the requested name and version
 */
export default function getOptions<T extends Record<string, any>>(version: number, name: string): T {
  // For version 25 or lower, return empty object
  if (version <= 25) {
    return {} as T
  }

  // Define options organized by name, then by version
  const optionsByNameAndVersion: Record<string, Record<number, unknown>> = {
    // Options for "grid"
    gridOptions: {
      26: {
        columnHoverHighlight: true,
      },
      28: {
        columnHoverHighlight: true,
        enableCellEditingOnBackspace: true,
      },
    },

    // Example
    // "example": {
    //     26: {
    //         option: true,
    //     },
    // },

    // Add more named configurations as needed
  }

  // Check if options exist for this name
  const namedOptions = optionsByNameAndVersion[name]

  // If no options exist for this name, return empty object
  if (!namedOptions) {
    return {} as T
  }

  // Get all defined versions for this name
  const definedVersions = Object.keys(namedOptions).map(Number)

  // If requested version is not defined, fall back to the highest version below it
  if (!namedOptions[version]) {
    // Find versions lower than the requested one
    const lowerVersions = definedVersions.filter((v) => v < version)

    if (lowerVersions.length > 0) {
      // Find the highest lower version
      const highestLowerVersion = Math.max(...lowerVersions)
      return namedOptions[highestLowerVersion] as T
    }
  }

  // Return the options for the requested version, or empty object if not found
  return (namedOptions[version] || {}) as T
}
