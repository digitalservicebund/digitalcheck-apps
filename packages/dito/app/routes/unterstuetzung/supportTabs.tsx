import Background from "@digitalcheck/shared/components/Background";
import Container from "@digitalcheck/shared/components/Container";
import Header from "@digitalcheck/shared/components/Header";
import Heading from "@digitalcheck/shared/components/Heading";
import RichText from "@digitalcheck/shared/components/RichText";
import React, { useRef, useState } from "react";
import { support } from "resources/content";

const { supportOfferings } = support;
const { tabs } = supportOfferings;

export default function SupportTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const tabRef = useRef<Map<number, HTMLButtonElement> | null>(null);

  function getMap() {
    if (!tabRef.current) {
      // Initialize the Map on first usage
      tabRef.current = new Map();
    }
    return tabRef.current;
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const map = getMap();
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const newIndex = (index + direction + tabs.length) % tabs.length;
      map.get(newIndex)?.focus();
    }
  };

  return (
    <div>
      <div role="tablist" aria-label="Support Tabs" className="flex my-40">
        {tabs.map((tab, index) => (
          <button
            key={tab.title}
            role="tab"
            ref={(node) => {
              const map = getMap();
              if (node) map.set(index, node);
              else map.delete(index);
            }}
            aria-selected={activeTab === index}
            aria-controls={`panel-${index + 1}`}
            id={`tab-${index + 1}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`text-blue-800 pb-8 mr-48 ${
              activeTab === index ? "font-bold border-b-2 border-blue-800" : ""
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={`panel-${index + 1}`}
          id={`panel-${index + 1}`}
          role="tabpanel"
          tabIndex={0}
          aria-labelledby={`tab-${index + 1}`}
          hidden={activeTab !== index}
        >
          {tab.offerings.map((offering) => (
            <Container
              key={offering.title}
              backgroundColor="blue"
              additionalClassNames="flex gap-16 rounded-xl mb-32"
            >
              <Header
                heading={{
                  tagName: "h3",
                  text: offering.title,
                }}
                content={{
                  markdown: offering.text,
                }}
              />
              <div className="w-[360px]">
                <Background backgroundColor="white">
                  <div className="p-28">
                    <Header
                      heading={{
                        tagName: "h4",
                        text: offering.sellingPoints,
                      }}
                    />
                    {offering.details.length > 0 && (
                      <div className="divide-y divide-gray-700">
                        {offering.details.map((detail) => (
                          <div key={detail.title} className="py-16">
                            <div className="flex items-center gap-8 pb-8">
                              {detail.icon && (
                                <detail.icon className="w-24 h-24 fill-gray-800" />
                              )}
                              <Heading
                                tagName="p"
                                look="ds-label-01-bold"
                                text={detail.title}
                              />
                            </div>
                            <RichText
                              markdown={detail.text}
                              className="text-base"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Background>
              </div>
            </Container>
          ))}
        </div>
      ))}
    </div>
  );
}
