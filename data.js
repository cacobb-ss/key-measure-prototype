/**
 * Key Measure data mirroring the real PLBM structure.
 * Updated: color bars match reference (blue, pink, dark-blue, orange, purple).
 * Tool icons: Count → hashtag, Linear → ruler, Area → grid
 */
const KEY_MEASURE_DATA = [
  {
    id: "cat-framing",
    name: "FRAMING",
    type: "category",
    colorCode: "#6c757d",
    expanded: true,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-framing-lvl",
        name: "LVL",
        type: "subcategory",
        categoryId: "cat-framing",
        expanded: false,
        keyMeasures: [
          { id: "km-1", name: "2x14 LVL", toolType: "Linear", unit: "LF", colorCode: "#1a47ba", active: false },
          { id: "km-2", name: "2x18 LVL", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-3", name: "2x8 LVL", toolType: "Linear", unit: "LF", colorCode: "#e8a050", active: false }
        ]
      },
      {
        id: "sf-framing-syp",
        name: "SYP",
        type: "subcategory",
        categoryId: "cat-framing",
        expanded: false,
        keyMeasures: [
          { id: "km-4", name: "2x6 SYP_X", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-5", name: "2x8 #2 SYP", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-6", name: "2x8_SYP", toolType: "Linear", unit: "LF", colorCode: "#e8a050", active: false }
        ]
      },
      {
        id: "sf-framing-general",
        name: "General",
        type: "subcategory",
        categoryId: "cat-framing",
        expanded: true,
        keyMeasures: [
          { id: "km-7", name: "2x10", toolType: "Area", unit: "SF", colorCode: "#1a47ba", active: false },
          { id: "km-8", name: "2x14", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-9", name: "90x45", toolType: "Area", unit: "SF", colorCode: "#6c5ce7", active: false },
          { id: "km-10", name: "DF1_4x8", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-doors",
    name: "DOORS",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-doors-ext",
        name: "DOORS EXTERIOR",
        type: "subcategory",
        categoryId: "cat-doors",
        expanded: false,
        keyMeasures: [
          { id: "km-11", name: "Front Entry Door 36\"", toolType: "Count", unit: "EA", colorCode: "#1a47ba", active: false },
          { id: "km-12", name: "Garage Entry Door 32\"", toolType: "Count", unit: "EA", colorCode: "#1a47ba", active: false },
          { id: "km-13", name: "Sliding Patio Door 72\"", toolType: "Count", unit: "EA", colorCode: "#6c5ce7", active: false },
          { id: "km-14", name: "French Door 60\"", toolType: "Count", unit: "EA", colorCode: "#e84393", active: false }
        ]
      },
      {
        id: "sf-doors-int",
        name: "DOORS INTERIOR",
        type: "subcategory",
        categoryId: "cat-doors",
        expanded: false,
        keyMeasures: [
          { id: "km-15", name: "Interior Door 30\"", toolType: "Count", unit: "EA", colorCode: "#e84393", active: false },
          { id: "km-16", name: "Interior Door 32\"", toolType: "Count", unit: "EA", colorCode: "#e84393", active: false },
          { id: "km-17", name: "Closet Bi-fold 36\"", toolType: "Count", unit: "EA", colorCode: "#1a47ba", active: false },
          { id: "km-18", name: "Pocket Door 30\"", toolType: "Count", unit: "EA", colorCode: "#6c5ce7", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-sill",
    name: "SILL PLATE",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-sill-main",
        name: "SILL PLATE",
        type: "subcategory",
        categoryId: "cat-sill",
        expanded: false,
        keyMeasures: [
          { id: "km-19", name: "Sill Plate 2×6 PT", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-20", name: "Sill Seal", toolType: "Linear", unit: "LF", colorCode: "#1a47ba", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-drywall",
    name: "DRYWALL",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-drywall-main",
        name: "DRYWALL",
        type: "subcategory",
        categoryId: "cat-drywall",
        expanded: false,
        keyMeasures: [
          { id: "km-21", name: "1/2\" Drywall 4×8", toolType: "Area", unit: "SF", colorCode: "#1a47ba", active: false },
          { id: "km-22", name: "1/2\" Drywall 4×12", toolType: "Area", unit: "SF", colorCode: "#e84393", active: false },
          { id: "km-23", name: "5/8\" Type X 4×8", toolType: "Area", unit: "SF", colorCode: "#6c5ce7", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-insulation",
    name: "INSULATION",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-insulation-main",
        name: "INSULATION",
        type: "subcategory",
        categoryId: "cat-insulation",
        expanded: false,
        keyMeasures: [
          { id: "km-24", name: "R-13 Batt 3.5\"", toolType: "Area", unit: "SF", colorCode: "#e8a050", active: false },
          { id: "km-25", name: "R-19 Batt 6.25\"", toolType: "Area", unit: "SF", colorCode: "#e8a050", active: false },
          { id: "km-26", name: "R-38 Blown Attic", toolType: "Area", unit: "SF", colorCode: "#e84393", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-roofing",
    name: "ROOFING",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-roofing-shingles",
        name: "Shingles",
        type: "subcategory",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-27", name: "Architectural Shingles", toolType: "Area", unit: "SQ", colorCode: "#d63031", active: false },
          { id: "km-28", name: "Ridge Cap Shingles", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false }
        ]
      },
      {
        id: "sf-roofing-underlay",
        name: "Underlayment",
        type: "subcategory",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-29", name: "Synthetic Underlayment", toolType: "Area", unit: "SQ", colorCode: "#1a47ba", active: false },
          { id: "km-30", name: "Ice & Water Shield", toolType: "Area", unit: "SQ", colorCode: "#6c5ce7", active: false }
        ]
      },
      {
        id: "sf-roofing-flashing",
        name: "Flashing & Trim",
        type: "subcategory",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-31", name: "Drip Edge", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-32", name: "Step Flashing", toolType: "Count", unit: "EA", colorCode: "#e8a050", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-sheathing",
    name: "SHEATHING",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-sheathing-main",
        name: "SHEATHING",
        type: "subcategory",
        categoryId: "cat-sheathing",
        expanded: false,
        keyMeasures: [
          { id: "km-33", name: "7/16\" OSB Wall Sheathing", toolType: "Area", unit: "SF", colorCode: "#1a47ba", active: false },
          { id: "km-34", name: "1/2\" Plywood Roof Sheathing", toolType: "Area", unit: "SF", colorCode: "#e84393", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-siding",
    name: "SIDING",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-siding-main",
        name: "SIDING",
        type: "subcategory",
        categoryId: "cat-siding",
        expanded: false,
        keyMeasures: [
          { id: "km-35", name: "Vinyl Siding D4", toolType: "Area", unit: "SF", colorCode: "#e84393", active: false },
          { id: "km-36", name: "Fiber Cement Lap 8\"", toolType: "Area", unit: "SF", colorCode: "#1a47ba", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsext",
    name: "WALLS EXTERIOR",
    type: "category",
    colorCode: "#6c757d",
    expanded: true,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-wallsext-framing",
        name: "Framing",
        type: "subcategory",
        categoryId: "cat-wallsext",
        expanded: true,
        keyMeasures: [
          { id: "km-37", name: "Ext Wall 2×6 8'", toolType: "Linear", unit: "LF", colorCode: "#1a47ba", active: true },
          { id: "km-38", name: "Ext Wall 2×6 9'", toolType: "Linear", unit: "LF", colorCode: "#1a47ba", active: false },
          { id: "km-39", name: "Ext Wall 2×6 10'", toolType: "Linear", unit: "LF", colorCode: "#e8a050", active: false }
        ]
      },
      {
        id: "sf-wallsext-wrap",
        name: "House Wrap",
        type: "subcategory",
        categoryId: "cat-wallsext",
        expanded: false,
        keyMeasures: [
          { id: "km-40", name: "House Wrap 9'×150'", toolType: "Area", unit: "SF", colorCode: "#6c5ce7", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsint",
    name: "WALLS INTERIOR",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-wallsint-main",
        name: "WALLS INTERIOR",
        type: "subcategory",
        categoryId: "cat-wallsint",
        expanded: false,
        keyMeasures: [
          { id: "km-41", name: "Int Wall 2×4 8'", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-42", name: "Int Wall 2×4 9'", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-windows",
    name: "WINDOWS",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-windows-main",
        name: "WINDOWS",
        type: "subcategory",
        categoryId: "cat-windows",
        expanded: false,
        keyMeasures: [
          { id: "km-43", name: "DH Window 30×48", toolType: "Count", unit: "EA", colorCode: "#1a47ba", active: false },
          { id: "km-44", name: "DH Window 36×60", toolType: "Count", unit: "EA", colorCode: "#6c5ce7", active: false },
          { id: "km-45", name: "Casement 24×48", toolType: "Count", unit: "EA", colorCode: "#e84393", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-ewp",
    name: "EWP (SKUs)",
    type: "category",
    colorCode: "#6c757d",
    expanded: false,
    keyMeasures: [],
    subcategories: [
      {
        id: "sf-ewp-main",
        name: "EWP (SKUs)",
        type: "subcategory",
        categoryId: "cat-ewp",
        expanded: false,
        keyMeasures: [
          { id: "km-46", name: "LVL 1-3/4×9-1/2", toolType: "Linear", unit: "LF", colorCode: "#e84393", active: false },
          { id: "km-47", name: "I-Joist 9-1/2\" 16\"OC", toolType: "Linear", unit: "LF", colorCode: "#1a47ba", active: false },
          { id: "km-48", name: "Glulam 3-1/8×9", toolType: "Linear", unit: "LF", colorCode: "#e8a050", active: false }
        ]
      }
    ]
  }
];
