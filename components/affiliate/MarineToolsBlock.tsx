export default function MarineToolsBlock() {
  return (
    <div className="mt-8 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
      <h3 className="font-semibold mb-2">
        Recommended Marine Navigation Tools
      </h3>

      <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
        These tools are commonly used alongside navigation calculations for real-world sailing and route planning.
      </p>

      <ul className="text-sm space-y-3">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Marine Navigation Parallel Ruler — used for plotting bearings on nautical charts
          </a>
        </li>

        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Handheld GPS Navigator — provides real-time position and course tracking at sea
          </a>
        </li>

        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Nautical Chart Plotter Kit — essential for route planning and distance measurement
          </a>
        </li>
      </ul>

      <p className="text-xs text-gray-500 mt-3">
        These are optional tools used by sailors and marine professionals. Choose based on your navigation setup.
      </p>
    </div>
  );
}
