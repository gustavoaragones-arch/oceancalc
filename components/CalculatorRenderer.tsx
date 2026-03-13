"use client";

import type { CalculatorEntry } from "@/lib/types";
import { CalculatorEngine } from "./calculator-engine/CalculatorEngine";
import { UnitConverter } from "./calculators/UnitConverter";
import { DistanceToHorizonCalculator } from "./calculators/DistanceToHorizon";
import { SailingTimeCalculator } from "./calculators/SailingTime";
import { GreatCircleDistanceCalculator } from "./calculators/GreatCircleDistance";
import { AnchorScopeCalculator } from "./calculators/AnchorScope";
import { BeaufortScaleCalculator } from "./calculators/BeaufortScale";
import { ApparentWindCalculator } from "./calculators/ApparentWind";

interface CalculatorRendererProps {
  calculator: CalculatorEntry;
}

export function CalculatorRenderer({ calculator }: CalculatorRendererProps) {
  if (calculator.engine) {
    return (
      <CalculatorEngine
        config={calculator.engine}
        title={calculator.title}
      />
    );
  }

  if (
    calculator.type === "unit-converter" &&
    calculator.unitPairs &&
    calculator.defaultFrom &&
    calculator.defaultTo
  ) {
    return (
      <UnitConverter
        title={calculator.title}
        pairs={calculator.unitPairs}
        defaultFrom={calculator.defaultFrom}
        defaultTo={calculator.defaultTo}
      />
    );
  }

  switch (calculator.type) {
    case "distance-horizon":
      return <DistanceToHorizonCalculator />;
    case "sailing-time":
      return <SailingTimeCalculator />;
    case "great-circle":
      return <GreatCircleDistanceCalculator />;
    case "anchor-scope":
      return <AnchorScopeCalculator />;
    case "beaufort":
      return <BeaufortScaleCalculator />;
    case "apparent-wind":
      return <ApparentWindCalculator />;
    default:
      return (
        <div className="card">
          <p className="text-slate-600 dark:text-slate-400">
            Calculator type &quot;{calculator.type}&quot; is not configured.
          </p>
        </div>
      );
  }
}
