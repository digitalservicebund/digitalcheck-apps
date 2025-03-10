import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { twJoin } from "tailwind-merge";
import Background from "~/components/Background";
import Box from "~/components/Box";
import { type ButtonProps } from "~/components/Button";
import Container from "~/components/Container";
import Header from "~/components/Header";
import Heading from "~/components/Heading";
import Image from "~/components/Image";
import RichText from "~/components/RichText";
import { support } from "~/resources/content";

const { supportOfferings } = support;
const { tabs } = supportOfferings;

type Offering = {
  title: string;
  text: string;
  sellingPoints: string;
  button?: ButtonProps;
  details: {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
    text: string;
  }[];
  examples?: {
    image?: {
      src: string;
      alt: string;
    };
    text: string;
  }[];
};

export default function SupportTabs() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const tabRef = useRef<Map<number, HTMLButtonElement> | null>(null);

  function getMap() {
    if (!tabRef.current) {
      // Initialize the Map on first usage
      tabRef.current = new Map();
    }
    return tabRef.current;
  }

  // The hash is not send to the server, so we need to useEffect to avoid hydration mismatch
  useEffect(() => {
    setActiveTab(location.hash === "#angebote" ? 2 : 0);
  }, [location.hash]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const map = getMap();
      map.get(index)?.setAttribute("tabindex", "-1");
      const direction = e.key === "ArrowRight" ? 1 : -1;
      const newIndex = (index + direction + tabs.length) % tabs.length;
      map.get(newIndex)?.focus();
      map.get(newIndex)?.setAttribute("tabindex", "0");
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Support Tabs"
        className="my-32 flex items-start max-sm:flex-col"
      >
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
            className={twJoin(
              "my-8 mr-48 p-8 text-blue-800",
              activeTab === index && "border-b-2 border-blue-800 font-bold",
            )}
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
          {tab.offerings.map((offering: Offering) => (
            <Container
              key={offering.title}
              className="mb-32 flex gap-32 rounded-xl px-40 max-md:flex-col"
              backgroundColor="blue"
            >
              <Box
                heading={{
                  tagName: "h2",
                  text: offering.title,
                }}
                content={{
                  markdown: offering.text,
                }}
                buttons={offering.button ? [offering.button] : []}
              />
              <div className="flex-none space-y-20 md:w-[310px]">
                <Background backgroundColor="white">
                  <div className="p-28">
                    <Header
                      heading={{
                        tagName: "h4",
                        text: offering.sellingPoints,
                      }}
                    />
                    <div className="divide-y divide-gray-700">
                      {offering.details.map((detail) => (
                        <div key={detail.title} className="py-16">
                          <div className="flex items-center gap-8 pb-8">
                            {detail.icon && (
                              <detail.icon className="size-24 fill-gray-800" />
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
                  </div>
                </Background>
                {offering.examples && (
                  <Background backgroundColor="white">
                    <div className="divide-y divide-gray-700">
                      {offering.examples.map((example) => (
                        <div key={example.text}>
                          {example.image && (
                            <Image
                              url={example.image.src}
                              alternativeText={example.image.alt}
                            />
                          )}
                          <RichText
                            markdown={example.text}
                            className="p-20 text-base"
                          />
                        </div>
                      ))}
                    </div>
                  </Background>
                )}
              </div>
            </Container>
          ))}
        </div>
      ))}
    </div>
  );
}
