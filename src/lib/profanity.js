import { z } from "zod";
import {
  RegExpMatcher,
  englishDataset,
  englishRecommendedTransformers,
} from "obscenity";

const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

const usernameSchema = z
  .string()
  .trim()
  .min(1, "Enter a name.")
  .max(12, "Max 12 characters.")
  .regex(/^[A-Za-z0-9 _.-]+$/, "Letters, numbers and spaces only.");

export function validateUsername(raw) {
  const result = usernameSchema.safeParse(raw ?? "");
  if (!result.success) {
    return { ok: false, error: result.error.issues[0].message };
  }

  const name = result.data;
  if (matcher.hasMatch(name)) {
    return { ok: false, error: "Please choose another name" };
  }

  return { ok: true, name };
}
