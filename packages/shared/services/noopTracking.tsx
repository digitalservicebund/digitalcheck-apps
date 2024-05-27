import SharedTracking from "./sharedTracking.tsx";

class NoopTracking implements SharedTracking {
  trackButtonClick(id: string | undefined, href: string | undefined) {
    console.debug(
      `Button click not tracked for id="${id}" and href="${href}". Inject a tracking service into the context to enable tracking.`,
    );
  }
}

const noopTracking: SharedTracking = new NoopTracking();
export default noopTracking;
