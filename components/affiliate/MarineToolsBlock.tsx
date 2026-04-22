export default function MarineToolsBlock() {
  return (
    <div className="mt-8 p-4 border rounded-xl bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
      <h3 className="font-semibold mb-2">
        Recommended Marine Tools
      </h3>

      <ul className="text-sm space-y-2">
        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Marine Navigation Parallel Ruler
          </a>
        </li>

        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Handheld GPS for Marine Navigation
          </a>
        </li>

        <li>
          <a href="#" className="text-blue-600 hover:underline">
            Nautical Chart Plotter Kit
          </a>
        </li>
      </ul>
    </div>
  );
}
