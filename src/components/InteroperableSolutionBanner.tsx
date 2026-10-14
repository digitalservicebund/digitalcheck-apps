import Button from "@/components/Button.tsx";
import { Close as CloseIcon } from "@digitalservicebund/icons";
import { useState } from "react";

export function InteroperableSolutionBanner() {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <>
      {showBanner && (
        <aside className="breakout-grid-toc bg-kern-feedback-warning-background relative py-24">
          <div className="row-1 space-y-8">
            <p>
              <b>
                „Lösung für ein interoperables Europa“ nach Art. 7 der
                Verordnung (EU) 2024/903
              </b>
            </p>
            <p>
              Eine Prüfung, ob diese Lösung genutzt werden kann, ist bei
              Interoperabilitätsbezug verpflichtend.
            </p>
          </div>
          <Button
            look="ghost"
            onClick={() => setShowBanner(false)}
            className="breakout absolute top-0 right-0 row-1 w-auto p-24"
            aria-label="Schließen"
            type="button"
          >
            <CloseIcon className="fill-blue-800" />
          </Button>
        </aside>
      )}
    </>
  );
}
