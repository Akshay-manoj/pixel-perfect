/** Pixel values for each side of a CSS edge property */
export interface EdgeValues {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/** Full CSS box model for an element */
export interface BoxModel {
  margin: EdgeValues;
  padding: EdgeValues;
  border: EdgeValues;
  content: { width: number; height: number };
}

/** All inspection data about a hovered/selected element */
export interface ElementInfo {
  element: Element;
  boxModel: BoxModel;
  rect: DOMRect;
  computedStyles: CSSStyleDeclaration;
  selector: string;
  tagName: string;
  classList: string[];
}

/** Distance measurement between two elements */
export interface DistanceMeasurement {
  top: number;
  right: number;
  bottom: number;
  left: number;
  horizontal: number;
  vertical: number;
  isOverlapping: boolean;
}

/** Alignment detection result */
export interface AlignmentResult {
  alignedTop: boolean;
  alignedBottom: boolean;
  alignedLeft: boolean;
  alignedRight: boolean;
  alignedCenterX: boolean;
  alignedCenterY: boolean;
  tolerance: number;
}

/** Flexbox container and children data */
export interface FlexboxData {
  direction: string;
  wrap: string;
  justifyContent: string;
  alignItems: string;
  gap: number;
  children: FlexChildData[];
}

/** Data for a single flex child */
export interface FlexChildData {
  element: Element;
  flexGrow: number;
  flexShrink: number;
  flexBasis: string;
  order: number;
}

/** Typography data for an element */
export interface TypographyData {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  color: string;
  contrastRatio?: number;
  wcagAA?: boolean;
  wcagAAA?: boolean;
}

/** CSS Grid container data */
export interface GridData {
  templateColumns: string;
  templateRows: string;
  templateAreas: string;
  columnGap: number;
  rowGap: number;
  children: GridChildData[];
}

/** Data for a single grid child */
export interface GridChildData {
  element: Element;
  gridColumn: string;
  gridRow: string;
  gridArea: string;
}

/** Z-index stacking layer entry */
export interface ZIndexLayer {
  element: Element;
  selector: string;
  zIndex: number;
  position: string;
  rect: DOMRect;
}
