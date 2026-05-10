import { useProfileStore } from "../profile/store";

export function ProfileSidebar() {
  const profile = useProfileStore((s) => s.profile);
  const update = useProfileStore((s) => s.updateSection);

  return (
    <aside style={{ padding: 16, borderRight: "1px solid #ddd", minWidth: 280 }}>
      <h2>Profile</h2>

      <fieldset>
        <legend>Income</legend>
        <label>
          Gross income ($/yr)
          <input
            type="number"
            value={profile.income.grossUsd}
            onChange={(e) => update("income", { grossUsd: Number(e.target.value) })}
          />
        </label>
        <label>
          Filing status
          <select
            value={profile.income.filingStatus}
            onChange={(e) => update("income", { filingStatus: e.target.value as "single" | "married" | "hoh" })}
          >
            <option value="single">single</option>
            <option value="married">married</option>
            <option value="hoh">head of household</option>
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Housing</legend>
        <label>
          Mode
          <select
            value={profile.housing.mode}
            onChange={(e) => update("housing", { mode: e.target.value as "own" | "rent" })}
          >
            <option value="own">own</option>
            <option value="rent">rent</option>
          </select>
        </label>
        {profile.housing.mode === "own" && (
          <label>
            Home price ($)
            <input
              type="number"
              value={profile.housing.homePriceUsd ?? 0}
              onChange={(e) => update("housing", { homePriceUsd: Number(e.target.value) })}
            />
          </label>
        )}
      </fieldset>

      <fieldset>
        <legend>Spending</legend>
        <label>
          Taxable spending ($/yr)
          <input
            type="number"
            value={profile.spending.taxableAnnualUsd}
            onChange={(e) => update("spending", { taxableAnnualUsd: Number(e.target.value) })}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Climate</legend>
        <label>
          Ideal temp (°F)
          <input
            type="number"
            value={profile.climate.idealTempF}
            onChange={(e) => update("climate", { idealTempF: Number(e.target.value) })}
          />
        </label>
        <RangeRow label="Sun importance" value={profile.climate.sunDaysImportance}
          onChange={(v) => update("climate", { sunDaysImportance: v })} />
        <RangeRow label="Snow tolerance" value={profile.climate.snowTolerance}
          onChange={(v) => update("climate", { snowTolerance: v })} />
        <RangeRow label="Humidity tolerance" value={profile.climate.humidityTolerance}
          onChange={(v) => update("climate", { humidityTolerance: v })} />
      </fieldset>

      <fieldset>
        <legend>Weights</legend>
        <RangeRow label="Money" value={profile.weights.money}
          onChange={(v) => update("weights", { money: v })} />
        <RangeRow label="Climate" value={profile.weights.climate}
          onChange={(v) => update("weights", { climate: v })} />
        <RangeRow label="Lifestyle" value={profile.weights.lifestyle}
          onChange={(v) => update("weights", { lifestyle: v })} />
      </fieldset>
    </aside>
  );
}

function RangeRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "block" }}>
      {label}: {value.toFixed(2)}
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
