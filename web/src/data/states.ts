import { StateRecord } from "./state.schema";

const StateArray = StateRecord.array();

export function parseStates(raw: unknown): StateRecord[] {
  return StateArray.parse(raw);
}

export async function loadStates(url = "/states.json"): Promise<StateRecord[]> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`failed to load states: ${res.status}`);
  return parseStates(await res.json());
}
