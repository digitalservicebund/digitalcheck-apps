import { interoperabel_nationaleKontaktstelle } from "@/config/routes.ts";
import { QuestionMarkOutlined } from "@digitalservicebund/icons";

export function IEAContactBanner() {
  return (
    <div className="bg-kern-darkblue-100 mt-8 flex gap-16 p-16">
      <QuestionMarkOutlined className="fill-kern-action-default size-80" />
      <p>
        <span className="block">Bei Fragen und Rückmeldungen</span>
        wenden Sie sich an die{" "}
        <a href={interoperabel_nationaleKontaktstelle.path}>
          nationale Kontaktstelle für ein interoperables Europa
        </a>
        {"."}
      </p>
    </div>
  );
}
