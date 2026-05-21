import { useEffect, useMemo, useState } from "react";
import type { StateRecord } from "./data/state.schema";
import { loadStates } from "./data/states";
import { useProfileStore } from "./profile/store";
import { profileToYaml, yamlToProfile } from "./profile/yaml";
import { computeWeighted } from "./scoring";
import { Matrix } from "./components/Matrix";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { StateDetail } from "./components/StateDetail";

export function App() {
  const [states, setStates] = useState<StateRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const profile = useProfileStore((s) => s.profile);
  const setProfile = useProfileStore((s) => s.setProfile);

  useEffect(() => {
    loadStates().then(setStates).catch((e) => setError(String(e)));
  }, []);

  const scoresByCode = useMemo(() => {
    if (!states) return null;
    return new Map(computeWeighted(states, profile).map((r) => [r.code, r]));
  }, [states, profile]);

  if (error) return <pre>error: {error}</pre>;
  if (!states || !scoresByCode) return <p>loading…</p>;

  const selectedState = selectedCode ? states.find((s) => s.code === selectedCode) ?? null : null;
  const selectedScores = selectedCode ? scoresByCode.get(selectedCode) ?? null : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "system-ui" }}>
      <ProfileSidebar />
      <main style={{ flex: 1, padding: 16 }}>
        <header style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <h1 style={{ flex: 1 }}>where</h1>
          <button onClick={() => exportYaml(profile)}>Export profile</button>
          <label style={{ cursor: "pointer", padding: "4px 8px", border: "1px solid #ccc" }}>
            Import profile
            <input
              type="file"
              accept=".yaml,.yml"
              style={{ display: "none" }}
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const text = await f.text();
                try {
                  setProfile(yamlToProfile(text));
                } catch (err) {
                  alert(`bad profile.yaml: ${err}`);
                }
              }}
            />
          </label>
        </header>
        <Matrix states={states} profile={profile} onRowClick={setSelectedCode} />
      </main>
      {selectedState && selectedScores && (
        <StateDetail
          state={selectedState}
          scores={selectedScores}
          onClose={() => setSelectedCode(null)}
        />
      )}
    </div>
  );
}

function exportYaml(profile: ReturnType<typeof useProfileStore.getState>["profile"]) {
  const blob = new Blob([profileToYaml(profile)], { type: "text/yaml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "profile.yaml";
  a.click();
  URL.revokeObjectURL(a.href);
}
