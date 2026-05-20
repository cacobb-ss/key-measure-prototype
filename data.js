/**
 * Key Measure data mirroring the real PLBM structure.
 * Hierarchy: Category → Subfolder → Key Measure
 *
 * Each Category is a top-level grouping (non-draggable across categories).
 * Subfolders can be reordered within their parent Category.
 * Key Measures can be reordered within their parent Subfolder OR
 * dragged between Subfolders *within the same Category*.
 */
const KEY_MEASURE_DATA = [
  {
    id: "cat-doors",
    name: "DOORS",
    type: "category",
    colorCode: "#4A90D9",
    expanded: true,
    subfolders: [
      {
        id: "sf-doors-ext",
        name: "DOORS EXTERIOR",
        type: "subfolder",
        categoryId: "cat-doors",
        expanded: false,
        keyMeasures: [
          { id: "km-1", name: "Front Entry Door 36\"", toolType: "Count", unit: "EA", colorCode: "#4A90D9", active: false },
          { id: "km-2", name: "Garage Entry Door 32\"", toolType: "Count", unit: "EA", colorCode: "#4A90D9", active: false },
          { id: "km-3", name: "Sliding Patio Door 72\"", toolType: "Count", unit: "EA", colorCode: "#5BA0E9", active: false },
          { id: "km-4", name: "French Door 60\"", toolType: "Count", unit: "EA", colorCode: "#5BA0E9", active: false }
        ]
      },
      {
        id: "sf-doors-int",
        name: "DOORS INTERIOR",
        type: "subfolder",
        categoryId: "cat-doors",
        expanded: false,
        keyMeasures: [
          { id: "km-5", name: "Interior Door 30\"", toolType: "Count", unit: "EA", colorCode: "#6BAED6", active: false },
          { id: "km-6", name: "Interior Door 32\"", toolType: "Count", unit: "EA", colorCode: "#6BAED6", active: false },
          { id: "km-7", name: "Closet Bi-fold 36\"", toolType: "Count", unit: "EA", colorCode: "#6BAED6", active: false },
          { id: "km-8", name: "Pocket Door 30\"", toolType: "Count", unit: "EA", colorCode: "#6BAED6", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-sill",
    name: "SILL PLATE",
    type: "category",
    colorCode: "#3366CC",
    expanded: false,
    subfolders: [
      {
        id: "sf-sill-main",
        name: "SILL PLATE",
        type: "subfolder",
        categoryId: "cat-sill",
        expanded: false,
        keyMeasures: [
          { id: "km-9", name: "Sill Plate 2×6 PT", toolType: "Linear", unit: "LF", colorCode: "#3366CC", active: false },
          { id: "km-10", name: "Sill Seal", toolType: "Linear", unit: "LF", colorCode: "#3366CC", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-drywall",
    name: "DRYWALL",
    type: "category",
    colorCode: "#8E8E8E",
    expanded: false,
    subfolders: [
      {
        id: "sf-drywall-main",
        name: "DRYWALL",
        type: "subfolder",
        categoryId: "cat-drywall",
        expanded: false,
        keyMeasures: [
          { id: "km-11", name: "1/2\" Drywall 4×8", toolType: "Area", unit: "SF", colorCode: "#8E8E8E", active: false },
          { id: "km-12", name: "1/2\" Drywall 4×12", toolType: "Area", unit: "SF", colorCode: "#8E8E8E", active: false },
          { id: "km-13", name: "5/8\" Type X 4×8", toolType: "Area", unit: "SF", colorCode: "#999999", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-insulation",
    name: "INSULATION",
    type: "category",
    colorCode: "#E8A838",
    expanded: false,
    subfolders: [
      {
        id: "sf-insulation-main",
        name: "INSULATION",
        type: "subfolder",
        categoryId: "cat-insulation",
        expanded: false,
        keyMeasures: [
          { id: "km-14", name: "R-13 Batt 3.5\"", toolType: "Area", unit: "SF", colorCode: "#E8A838", active: false },
          { id: "km-15", name: "R-19 Batt 6.25\"", toolType: "Area", unit: "SF", colorCode: "#E8A838", active: false },
          { id: "km-16", name: "R-38 Blown Attic", toolType: "Area", unit: "SF", colorCode: "#DAA520", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-rimboard",
    name: "RIM BOARD",
    type: "category",
    colorCode: "#C17817",
    expanded: false,
    subfolders: [
      {
        id: "sf-rimboard-main",
        name: "RIM BOARD",
        type: "subfolder",
        categoryId: "cat-rimboard",
        expanded: false,
        keyMeasures: [
          { id: "km-17", name: "Rim Board 1-1/8×9-1/4", toolType: "Linear", unit: "LF", colorCode: "#C17817", active: false },
          { id: "km-18", name: "Rim Board 1-1/8×11-7/8", toolType: "Linear", unit: "LF", colorCode: "#C17817", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-roofing",
    name: "ROOFING",
    type: "category",
    colorCode: "#CC3333",
    expanded: true,
    subfolders: [
      {
        id: "sf-roofing-shingles",
        name: "Shingles",
        type: "subfolder",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-19", name: "Architectural Shingles", toolType: "Area", unit: "SQ", colorCode: "#CC3333", active: false },
          { id: "km-20", name: "Ridge Cap Shingles", toolType: "Linear", unit: "LF", colorCode: "#CC3333", active: false }
        ]
      },
      {
        id: "sf-roofing-underlay",
        name: "Underlayment",
        type: "subfolder",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-21", name: "Synthetic Underlayment", toolType: "Area", unit: "SQ", colorCode: "#DD4444", active: false },
          { id: "km-22", name: "Ice & Water Shield", toolType: "Area", unit: "SQ", colorCode: "#DD4444", active: false }
        ]
      },
      {
        id: "sf-roofing-flashing",
        name: "Flashing & Trim",
        type: "subfolder",
        categoryId: "cat-roofing",
        expanded: false,
        keyMeasures: [
          { id: "km-23", name: "Drip Edge", toolType: "Linear", unit: "LF", colorCode: "#EE5555", active: false },
          { id: "km-24", name: "Step Flashing", toolType: "Count", unit: "EA", colorCode: "#EE5555", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-sheathing",
    name: "SHEATHING",
    type: "category",
    colorCode: "#8B6914",
    expanded: false,
    subfolders: [
      {
        id: "sf-sheathing-main",
        name: "SHEATHING",
        type: "subfolder",
        categoryId: "cat-sheathing",
        expanded: false,
        keyMeasures: [
          { id: "km-25", name: "7/16\" OSB Wall Sheathing", toolType: "Area", unit: "SF", colorCode: "#8B6914", active: false },
          { id: "km-26", name: "1/2\" Plywood Roof Sheathing", toolType: "Area", unit: "SF", colorCode: "#8B6914", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-siding",
    name: "SIDING",
    type: "category",
    colorCode: "#6B8E23",
    expanded: false,
    subfolders: [
      {
        id: "sf-siding-main",
        name: "SIDING",
        type: "subfolder",
        categoryId: "cat-siding",
        expanded: false,
        keyMeasures: [
          { id: "km-27", name: "Vinyl Siding D4", toolType: "Area", unit: "SF", colorCode: "#6B8E23", active: false },
          { id: "km-28", name: "Fiber Cement Lap 8\"", toolType: "Area", unit: "SF", colorCode: "#6B8E23", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-stairs",
    name: "STAIRS INTERIOR",
    type: "category",
    colorCode: "#9B59B6",
    expanded: false,
    subfolders: [
      {
        id: "sf-stairs-main",
        name: "STAIRS INTERIOR",
        type: "subfolder",
        categoryId: "cat-stairs",
        expanded: false,
        keyMeasures: [
          { id: "km-29", name: "Stair Stringer 2×12", toolType: "Count", unit: "EA", colorCode: "#9B59B6", active: false },
          { id: "km-30", name: "Stair Tread 1×12", toolType: "Count", unit: "EA", colorCode: "#9B59B6", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-steelposts",
    name: "STEEL POSTS",
    type: "category",
    colorCode: "#708090",
    expanded: false,
    subfolders: [
      {
        id: "sf-steelposts-main",
        name: "STEEL POSTS",
        type: "subfolder",
        categoryId: "cat-steelposts",
        expanded: false,
        keyMeasures: [
          { id: "km-31", name: "Steel Column 4×4×8'", toolType: "Count", unit: "EA", colorCode: "#708090", active: false },
          { id: "km-32", name: "Steel Column 6×6×10'", toolType: "Count", unit: "EA", colorCode: "#708090", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-trimext",
    name: "TRIM EXTERIOR",
    type: "category",
    colorCode: "#2E8B57",
    expanded: false,
    subfolders: [
      {
        id: "sf-trimext-main",
        name: "TRIM EXTERIOR",
        type: "subfolder",
        categoryId: "cat-trimext",
        expanded: false,
        keyMeasures: [
          { id: "km-33", name: "Fascia 1×6", toolType: "Linear", unit: "LF", colorCode: "#2E8B57", active: false },
          { id: "km-34", name: "Soffit Panel", toolType: "Area", unit: "SF", colorCode: "#2E8B57", active: false },
          { id: "km-35", name: "Corner Board 1×4", toolType: "Linear", unit: "LF", colorCode: "#2E8B57", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsint",
    name: "WALLS INTERIOR",
    type: "category",
    colorCode: "#4682B4",
    expanded: false,
    subfolders: [
      {
        id: "sf-wallsint-main",
        name: "WALLS INTERIOR",
        type: "subfolder",
        categoryId: "cat-wallsint",
        expanded: false,
        keyMeasures: [
          { id: "km-36", name: "Int Wall 2×4 8'", toolType: "Linear", unit: "LF", colorCode: "#4682B4", active: false },
          { id: "km-37", name: "Int Wall 2×4 9'", toolType: "Linear", unit: "LF", colorCode: "#4682B4", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsext",
    name: "WALLS EXTERIOR",
    type: "category",
    colorCode: "#B8860B",
    expanded: true,
    subfolders: [
      {
        id: "sf-wallsext-framing",
        name: "Framing",
        type: "subfolder",
        categoryId: "cat-wallsext",
        expanded: true,
        keyMeasures: [
          { id: "km-38", name: "Ext Wall 2×6 8'", toolType: "Linear", unit: "LF", colorCode: "#B8860B", active: true },
          { id: "km-39", name: "Ext Wall 2×6 9'", toolType: "Linear", unit: "LF", colorCode: "#B8860B", active: false },
          { id: "km-40", name: "Ext Wall 2×6 10'", toolType: "Linear", unit: "LF", colorCode: "#DAA520", active: false }
        ]
      },
      {
        id: "sf-wallsext-wrap",
        name: "House Wrap",
        type: "subfolder",
        categoryId: "cat-wallsext",
        expanded: false,
        keyMeasures: [
          { id: "km-41", name: "House Wrap 9'×150'", toolType: "Area", unit: "SF", colorCode: "#CD853F", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsgarage",
    name: "WALLS GARAGE",
    type: "category",
    colorCode: "#A0522D",
    expanded: false,
    subfolders: [
      {
        id: "sf-wallsgarage-main",
        name: "WALLS GARAGE",
        type: "subfolder",
        categoryId: "cat-wallsgarage",
        expanded: false,
        keyMeasures: [
          { id: "km-42", name: "Garage Wall 2×4 8'", toolType: "Linear", unit: "LF", colorCode: "#A0522D", active: false },
          { id: "km-43", name: "Garage Wall 2×4 10'", toolType: "Linear", unit: "LF", colorCode: "#A0522D", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-wallsgaragecommon",
    name: "WALLS GARAGE COMMON",
    type: "category",
    colorCode: "#8B4513",
    expanded: false,
    subfolders: [
      {
        id: "sf-wallsgaragecommon-main",
        name: "WALLS GARAGE COMMON",
        type: "subfolder",
        categoryId: "cat-wallsgaragecommon",
        expanded: false,
        keyMeasures: [
          { id: "km-44", name: "Common Wall 2×6 8'", toolType: "Linear", unit: "LF", colorCode: "#8B4513", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-windows",
    name: "WINDOWS",
    type: "category",
    colorCode: "#00CED1",
    expanded: false,
    subfolders: [
      {
        id: "sf-windows-main",
        name: "WINDOWS",
        type: "subfolder",
        categoryId: "cat-windows",
        expanded: false,
        keyMeasures: [
          { id: "km-45", name: "DH Window 30×48", toolType: "Count", unit: "EA", colorCode: "#00CED1", active: false },
          { id: "km-46", name: "DH Window 36×60", toolType: "Count", unit: "EA", colorCode: "#00CED1", active: false },
          { id: "km-47", name: "Casement 24×48", toolType: "Count", unit: "EA", colorCode: "#20B2AA", active: false }
        ]
      }
    ]
  },
  {
    id: "cat-ewp",
    name: "EWP (SKUs)",
    type: "category",
    colorCode: "#FF6347",
    expanded: false,
    subfolders: [
      {
        id: "sf-ewp-main",
        name: "EWP (SKUs)",
        type: "subfolder",
        categoryId: "cat-ewp",
        expanded: false,
        keyMeasures: [
          { id: "km-48", name: "LVL 1-3/4×9-1/2", toolType: "Linear", unit: "LF", colorCode: "#FF6347", active: false },
          { id: "km-49", name: "I-Joist 9-1/2\" 16\"OC", toolType: "Linear", unit: "LF", colorCode: "#FF6347", active: false },
          { id: "km-50", name: "Glulam 3-1/8×9", toolType: "Linear", unit: "LF", colorCode: "#FF4500", active: false }
        ]
      }
    ]
  }
];
