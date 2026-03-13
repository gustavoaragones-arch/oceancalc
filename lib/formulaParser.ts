/**
 * Safe formula parser: evaluates expressions with numbers, identifiers, +, -, *, /, (), and functions.
 * No eval() or arbitrary code—only whitelisted operations.
 */

export type CustomFunctions = Record<
  string,
  (...args: number[]) => number
>;

const MATH_FUNCTIONS: CustomFunctions = {
  sqrt: (x) => Math.sqrt(x),
  sin: (x) => Math.sin(x),
  cos: (x) => Math.cos(x),
  tan: (x) => Math.tan(x),
  asin: (x) => Math.asin(x),
  acos: (x) => Math.acos(x),
  atan: (x) => Math.atan(x),
  atan2: (y, x) => Math.atan2(y, x),
  abs: (x) => Math.abs(x),
  min: (a, b) => Math.min(a, b),
  max: (a, b) => Math.max(a, b),
  pow: (a, b) => Math.pow(a, b),
  round: (x) => Math.round(x),
  floor: (x) => Math.floor(x),
  exp: (x) => Math.exp(x),
  ln: (x) => Math.log(x),
  log: (x) => Math.log10(x),
  deg2rad: (d) => (d * Math.PI) / 180,
  rad2deg: (r) => (r * 180) / Math.PI,
};

/** Beaufort force (0–12) from wind speed in knots */
function beaufort(kn: number): number {
  if (kn <= 1) return 0;
  if (kn <= 3) return 1;
  if (kn <= 6) return 2;
  if (kn <= 10) return 3;
  if (kn <= 16) return 4;
  if (kn <= 21) return 5;
  if (kn <= 27) return 6;
  if (kn <= 33) return 7;
  if (kn <= 40) return 8;
  if (kn <= 47) return 9;
  if (kn <= 55) return 10;
  if (kn <= 63) return 11;
  return 12;
}

/** Great circle distance in nautical miles (haversine). Angles in degrees. */
function haversine_nm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Wind chill (simplified): temperature in °F, wind speed in mph → feels-like °F */
function windChillF(tempF: number, windMph: number): number {
  if (windMph < 3) return tempF;
  return 35.74 + 0.6215 * tempF - 35.75 * Math.pow(windMph, 0.16) + 0.4275 * tempF * Math.pow(windMph, 0.16);
}

/** Apparent wind speed (kn) from boat speed, true wind speed, true wind angle (degrees) */
function apparentWindSpeedKn(Vb: number, Vt: number, TWAdeg: number): number {
  const twaRad = (TWAdeg * Math.PI) / 180;
  return Math.sqrt(
    Vb * Vb + Vt * Vt + 2 * Vb * Vt * Math.cos(twaRad)
  );
}

/** Apparent wind angle from bow (degrees) */
function apparentWindAngleDeg(Vb: number, Vt: number, TWAdeg: number): number {
  const Va = apparentWindSpeedKn(Vb, Vt, TWAdeg);
  if (Va === 0) return 0;
  const twaRad = (TWAdeg * Math.PI) / 180;
  const cosAWA = (Vt * Math.cos(twaRad) + Vb) / Va;
  return (Math.acos(Math.max(-1, Math.min(1, cosAWA))) * 180) / Math.PI;
}

export const DEFAULT_CUSTOM_FUNCTIONS: CustomFunctions = {
  ...MATH_FUNCTIONS,
  beaufort,
  haversine_nm,
  windChillF,
  apparentWindSpeedKn,
  apparentWindAngleDeg,
};

type Token =
  | { type: "number"; value: number }
  | { type: "identifier"; value: string }
  | { type: "op"; value: "+" | "-" | "*" | "/" }
  | { type: "paren"; value: "(" | ")" }
  | { type: "comma" }
  | { type: "eof" };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, "");

  while (i < s.length) {
    if (s[i] === ",") {
      tokens.push({ type: "comma" });
      i++;
      continue;
    }
    if (s[i] === "(" || s[i] === ")") {
      tokens.push({ type: "paren", value: s[i] as "(" | ")" });
      i++;
      continue;
    }
    if ("+-*/".includes(s[i])) {
      const op = s[i] as "+" | "-" | "*" | "/";
      tokens.push({ type: "op", value: op });
      i++;
      continue;
    }
    if (/\d/.test(s[i]) || (s[i] === "." && /\d/.test(s[i + 1]))) {
      let num = "";
      while (i < s.length && /[\d.]/.test(s[i])) {
        num += s[i];
        i++;
      }
      tokens.push({ type: "number", value: parseFloat(num) });
      continue;
    }
    if (/[a-zA-Z_]/.test(s[i])) {
      let id = "";
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
        id += s[i];
        i++;
      }
      tokens.push({ type: "identifier", value: id });
      continue;
    }
    i++;
  }
  tokens.push({ type: "eof" });
  return tokens;
}

export function parseFormula(
  formula: string,
  variables: Record<string, number>,
  customFns: CustomFunctions = DEFAULT_CUSTOM_FUNCTIONS
): number {
  const tokens = tokenize(formula);
  let pos = 0;

  function current(): Token {
    return tokens[pos] ?? { type: "eof" };
  }
  function consume(): Token {
    const t = current();
    if (t.type !== "eof") pos++;
    return t;
  }

  function parseExpr(): number {
    let left = parseTerm();
    let c = current();
    while (c.type === "op" && (c.value === "+" || c.value === "-")) {
      consume();
      const right = parseTerm();
      left = c.value === "+" ? left + right : left - right;
      c = current();
    }
    return left;
  }

  function parseTerm(): number {
    let left = parseUnary();
    let c = current();
    while (c.type === "op" && (c.value === "*" || c.value === "/")) {
      consume();
      const right = parseUnary();
      left = c.value === "*" ? left * right : left / right;
      c = current();
    }
    return left;
  }

  function parseUnary(): number {
    const c = current();
    if (c.type === "op" && c.value === "-") {
      consume();
      return -parseUnary();
    }
    return parsePrimary();
  }

  function parsePrimary(): number {
    const t = consume();
    if (t.type === "number") return t.value;
    if (t.type === "identifier") {
      const c = current();
      if (c.type === "paren" && c.value === "(") {
        consume();
        const fn = customFns[t.value];
        if (!fn) throw new Error(`Unknown function: ${t.value}`);
        const args: number[] = [];
        while (true) {
          const next = current();
          if (next.type === "paren" && next.value === ")") break;
          args.push(parseExpr());
          const after = current();
          if (after.type === "comma") consume();
        }
        consume();
        return fn(...args);
      }
      const v = variables[t.value];
      if (v === undefined) return NaN;
      return v;
    }
    if (t.type === "paren" && t.value === "(") {
      const v = parseExpr();
      const c2 = current();
      if (c2.type !== "paren" || c2.value !== ")") throw new Error("Missing )");
      consume();
      return v;
    }
    throw new Error("Unexpected token");
  }

  const result = parseExpr();
  if (current().type !== "eof") throw new Error("Unexpected token");
  return result;
}
