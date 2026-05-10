import { parse, stringify } from "yaml";
import { Profile } from "../data/profile.schema";

export function profileToYaml(p: Profile): string {
  return stringify(p);
}

export function yamlToProfile(text: string): Profile {
  return Profile.parse(parse(text));
}
