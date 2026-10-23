// Behavior of MultiSelectField.astro, see there
const multiselects = () =>
  document.querySelectorAll<HTMLDetailsElement>("details[data-multiselect]");

const showSelection = (details: HTMLDetailsElement) => {
  const selection = details.querySelector<HTMLElement>(
    "[data-multiselect-selection]",
  )!;
  const labels = Array.from(
    details.querySelectorAll<HTMLInputElement>("input:checked"),
    (input) => input.closest("label")!.textContent.trim(),
  );
  selection.textContent =
    labels.join(", ") || (selection.dataset.placeholder ?? "");
};

const close = (details: HTMLDetailsElement, focus = false) => {
  details.open = false;
  if (focus) details.querySelector("summary")?.focus();
};

/**
 * Opens and closes the MultiSelectFields like a select and shows their
 * selection. One listener per event for all fields, also those rendered later
 * (e.g. in a list item). Call once per page.
 */
export const bindMultiSelects = () => {
  document.addEventListener("change", (event) => {
    const details = (event.target as Element).closest<HTMLDetailsElement>(
      "details[data-multiselect]",
    );
    if (details) showSelection(details);
  });
  // Values written by bindStepForm, e.g. from the store
  document.addEventListener("wizard:update", () =>
    multiselects().forEach(showSelection),
  );

  // Close like a select: on Escape, a click outside or when the focus leaves
  document.addEventListener("keydown", (event) => {
    const details = (event.target as Element).closest<HTMLDetailsElement>(
      "details[data-multiselect][open]",
    );
    if (event.key === "Escape" && details) close(details, true);
  });
  document.addEventListener("click", (event) =>
    multiselects().forEach((details) => {
      if (details.open && !details.contains(event.target as Node))
        close(details);
    }),
  );
  // Only when the focus moves to another element (Tab), clicking an option
  // may move it to the body. Clicks outside are handled above.
  document.addEventListener("focusout", (event) => {
    const details = (event.target as Element).closest<HTMLDetailsElement>(
      "details[data-multiselect][open]",
    );
    const next = event.relatedTarget as Node | null;
    if (details && next && !details.contains(next)) close(details);
  });
};
