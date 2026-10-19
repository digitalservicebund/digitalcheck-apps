import type {
  BindingRequirementsData,
  DocumentationData,
} from "@/pages/dokumentation/_react/documentationDataSchema";
import {
  serviceAreaOptions,
  stakeholderOptions,
} from "@/pages/dokumentation/_react/interoperability/values.ts";
import { metadataTable } from "@/service/wordDocumentationExport/docxUtils.ts";
import { keyValueToMap } from "@/utils/keyValue.ts";
import type { FileChild } from "docx";
import { Paragraph } from "docx";

const emptyRequirementsSet: BindingRequirementsData["requirements"] = [
  {
    serviceAreas: [],
    stakeholderGroups: [],
  },
];

export function formatBindingRequirements(
  bindingRequirements: DocumentationData["bindingRequirements"],
): FileChild[] {
  const serviceAreaMap = keyValueToMap(serviceAreaOptions);
  const stakeholderMap = keyValueToMap(stakeholderOptions);

  const requirements: BindingRequirementsData["requirements"] =
    bindingRequirements?.requirements ?? emptyRequirementsSet;
  return requirements.flatMap((requirement, index) => {
    const tableData = [
      ["Beschreibung", requirement.description ?? ""],
      ["Rechtsgrundlage", requirement.legalReference ?? ""],
      [
        "Transeuropäische Dienste",
        requirement.services?.split("\n").join(", ") ?? "",
      ],
      [
        "Bereiche",
        requirement.serviceAreas
          .map((area) => serviceAreaMap.get(area) ?? area)
          .join(", "),
      ],
      [
        "Gruppen",
        (requirement.stakeholderGroups ?? [])
          .map((group) => stakeholderMap.get(group) ?? group)
          .join(", "),
      ],
    ];

    if (index === 0) {
      return [metadataTable(tableData)];
    } else {
      return [new Paragraph(""), metadataTable(tableData)];
    }
  });
}
