"use client";

import type { CalculatorEntry } from "@/lib/types";
import { CalculatorShell } from "./calculator/CalculatorShell";
import { CalculatorEngine } from "./calculator-engine/CalculatorEngine";
import { UnitConverter } from "./calculators/UnitConverter";
import { DistanceToHorizonCalculator } from "./calculators/DistanceToHorizon";
import { GreatCircleDistanceCalculator } from "./calculators/GreatCircleDistance";
import { AnchorScopeCalculator } from "./calculators/AnchorScope";
import { ApparentWindCalculator } from "./calculators/ApparentWind";

interface CalculatorRendererProps {
  calculator: CalculatorEntry;
}

export function CalculatorRenderer({ calculator }: CalculatorRendererProps) {
  if (calculator.simpleRegistry) {
    return <CalculatorShell calculator={calculator} />;
  }

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
    case "great-circle":
      return <GreatCircleDistanceCalculator />;
    case "anchor-scope":
      return <AnchorScopeCalculator />;
    case "apparent-wind":
      return <ApparentWindCalculator />;
    default:
      return (
        <div className="card">
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
            Calculator type &quot;{calculator.type}&quot; is not configured.
          </p>
        </div>
      );
  }
}
