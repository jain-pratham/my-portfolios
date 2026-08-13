export interface Point {
  x: number;
  y: number;
}

/**
 * Validates a polygon defined by normalized coordinates (x, y in [0, 1]).
 * @param points Array of Point objects
 * @returns { isValid: boolean; reason?: string }
 */
export const validatePolygon = (points: Point[]): { isValid: boolean; reason?: string } => {
  if (!Array.isArray(points)) {
    return { isValid: false, reason: "Points must be an array" };
  }
  
  if (points.length === 0) {
    return { isValid: false, reason: "Polygon points array is empty" };
  }

  if (points.length < 3) {
    return { isValid: false, reason: "Polygon must contain at least 3 points" };
  }

  // Validate coordinate formats and boundaries
  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    if (pt === null || typeof pt !== "object") {
      return { isValid: false, reason: `Point at index ${i} is not a valid object` };
    }
    
    const { x, y } = pt;
    if (typeof x !== "number" || typeof y !== "number") {
      return { isValid: false, reason: `Coordinates at index ${i} must be numbers` };
    }
    
    if (Number.isNaN(x) || Number.isNaN(y)) {
      return { isValid: false, reason: `Coordinates at index ${i} cannot be NaN` };
    }
    
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      return { isValid: false, reason: `Coordinates at index ${i} must be finite values` };
    }
    
    if (x < 0 || x > 1 || y < 0 || y > 1) {
      return { isValid: false, reason: `Coordinates at index ${i} must be normalized between 0 and 1` };
    }
  }

  const n = points.length;

  // Check for duplicate consecutive points (including start and end)
  for (let i = 0; i < n; i++) {
    const pt1 = points[i];
    const pt2 = points[(i + 1) % n];
    if (pt1.x === pt2.x && pt1.y === pt2.y) {
      return { isValid: false, reason: `Duplicate consecutive points found at indices ${i} and ${(i + 1) % n}` };
    }
  }

  // Calculate area using Shoelace formula to reject collapsed / zero-area polygons
  let areaSum = 0;
  for (let i = 0; i < n; i++) {
    const pt1 = points[i];
    const pt2 = points[(i + 1) % n];
    areaSum += pt1.x * pt2.y - pt2.x * pt1.y;
  }
  const area = 0.5 * Math.abs(areaSum);
  if (area < 1e-6) {
    return { isValid: false, reason: "Polygon area is too small or collapsed (must have non-zero area)" };
  }

  // Check for self-intersection (intersecting non-adjacent edges)
  const ccw = (a: Point, b: Point, c: Point): number => {
    const val = (c.y - a.y) * (b.x - a.x) - (b.y - a.y) * (c.x - a.x);
    if (Math.abs(val) < 1e-9) return 0; // collinear
    return val > 0 ? 1 : -1;
  };

  const onSegment = (p: Point, q: Point, r: Point): boolean => {
    return (
      q.x <= Math.max(p.x, r.x) &&
      q.x >= Math.min(p.x, r.x) &&
      q.y <= Math.max(p.y, r.y) &&
      q.y >= Math.min(p.y, r.y)
    );
  };

  const segmentsIntersect = (p1: Point, p2: Point, p3: Point, p4: Point): boolean => {
    const o1 = ccw(p1, p2, p3);
    const o2 = ccw(p1, p2, p4);
    const o3 = ccw(p3, p4, p1);
    const o4 = ccw(p3, p4, p2);

    // General case
    if (o1 !== o2 && o3 !== o4) {
      return true;
    }

    // Collinear cases
    if (o1 === 0 && onSegment(p1, p3, p2)) return true;
    if (o2 === 0 && onSegment(p1, p4, p2)) return true;
    if (o3 === 0 && onSegment(p3, p1, p4)) return true;
    if (o4 === 0 && onSegment(p3, p2, p4)) return true;

    return false;
  };

  // Compare each edge with all non-adjacent edges
  for (let i = 0; i < n; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    
    for (let j = i + 2; j < n; j++) {
      // Do not compare adjacent edges (which share a vertex)
      if (i === 0 && j === n - 1) continue;
      
      const p3 = points[j];
      const p4 = points[(j + 1) % n];
      
      if (segmentsIntersect(p1, p2, p3, p4)) {
        return { 
          isValid: false, 
          reason: `Polygon is self-intersecting (edge from pt ${i} to ${((i+1)%n)} intersects with edge from pt ${j} to ${((j+1)%n)})` 
        };
      }
    }
  }

  return { isValid: true };
};
