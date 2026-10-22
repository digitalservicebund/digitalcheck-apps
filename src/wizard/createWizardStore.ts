import { removeTrailingSlash } from "@/utils/path";
import { persistentAtom } from "@nanostores/persistent";
import type {
  compileFlowConfig,
  InferredUserData,
  PageConfigMap,
} from "form-graph-engine";
import { createFlowSession } from "form-graph-engine";
import { atom, computed } from "nanostores";
import type { z } from "zod";

type CompiledFlow<C extends PageConfigMap> = ReturnType<
  typeof compileFlowConfig<C>
>;

/**
 * Shared client state of a wizard, readable by islands (via useStore) and by
 * Astro <script>s (via subscribe), e.g. the button bar or the sidebar.
 *
 * - $data: user data, persisted in localStorage and synced across tabs
 * - $hasAnswers: whether $data contains any answer
 * - $path: current page, set from the URL in the browser
 * - $session: flow session for $data and $path, undefined outside the flow
 *   (e.g. on the server, where neither localStorage nor the URL is known)
 */
export const createWizardStore = <C extends PageConfigMap>(
  storageKey: string,
  flow: CompiledFlow<C>,
  fields: Readonly<Record<string, z.ZodType>>,
) => {
  type UserData = InferredUserData<C>;

  // Keeps only known fields with valid values, so outdated or edited
  // storage can't break the flow.
  const decode = (encoded: string): UserData => {
    try {
      const stored: unknown = JSON.parse(encoded);
      if (typeof stored !== "object" || stored === null) return {};
      return Object.fromEntries(
        Object.entries(stored).filter(
          ([name, value]) =>
            Object.hasOwn(fields, name) &&
            fields[name].safeParse(value).success,
        ),
      ) as UserData;
    } catch {
      return {};
    }
  };

  const $data = persistentAtom<UserData>(
    storageKey,
    {},
    {
      encode: JSON.stringify,
      decode,
    },
  );

  const $path = atom<string | undefined>(globalThis.location?.pathname);

  const $session = computed([$data, $path], (data, path) => {
    const flowPath = path && removeTrailingSlash(path);
    return flowPath && flow.getNodeKeyFromPath(flowPath)
      ? createFlowSession(flow, data, flowPath)
      : undefined;
  });

  const $hasAnswers = computed($data, (data) => Object.keys(data).length > 0);

  const save = (values: UserData) => {
    $data.set({ ...$data.get(), ...values });
  };

  const reset = () => {
    $data.set({});
  };

  return { $data, $path, $session, $hasAnswers, save, reset };
};
