import type { StateRecord } from "../data/state.schema";
import type { ScoredRow } from "../scoring";

interface Props {
  state: StateRecord;
  scores: ScoredRow;
  onClose: () => void;
}

export function StateDetail({ state, scores, onClose }: Props) {
  return (
    <aside style={{ padding: 16, borderLeft: "1px solid #ddd", minWidth: 280 }}>
      <button onClick={onClose}>close</button>
      <h2>{state.name}</h2>
      <h3>Scores</h3>
      <ul>
        <li>Money: {scores.moneyScore.toFixed(1)}</li>
        <li>Climate: {scores.climateScore.toFixed(1)}</li>
        <li>Lifestyle: {scores.lifestyleScore.toFixed(1)}</li>
        <li>Weighted: {scores.weightedScore.toFixed(1)}</li>
      </ul>
      <h3>Tax breakdown</h3>
      <ul>
        <li>Income: ${scores.effectiveIncomeTax.toFixed(0)}</li>
        <li>Property: ${scores.propertyTaxOwed.toFixed(0)}</li>
        <li>Sales: ${scores.salesTaxOwed.toFixed(0)}</li>
        <li>Total: ${scores.totalTaxBurden.toFixed(0)}</li>
        <li>COL-adj income: ${scores.colAdjustedIncome.toFixed(0)}</li>
      </ul>
      <h3>Raw data</h3>
      <pre style={{ fontSize: 12 }}>{JSON.stringify(state, null, 2)}</pre>
    </aside>
  );
}
