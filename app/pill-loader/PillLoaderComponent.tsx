"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function PillLoaderComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const info = [
      {
        title: "Google Meet",
        image:
          "https://static0.xdaimages.com/wordpress/wp-content/uploads/2020/10/google-meet-android-updated-ui-1.jpg?w=1200&h=675&fit=crop",
        tags: ["2025", "Product Lead"],
      },
      {
        title: "Instagram",
        image:
          "https://cdn.dribbble.com/userupload/29778635/file/original-11454e4587bd811ac5b1ec226da7a357.png?resize=2048x1536&vertical=center",
        tags: ["2024", "Product", "Mentor"],
      },
      {
        title: "Facebook",
        image:
          "https://cdn.dribbble.com/userupload/12039001/file/original-37b2a799da1efb167daf0a0caa2056ee.png?resize=2048x1536&vertical=center",
        tags: ["2023", "Intern"],
      },
      {
        title: "Uber",
        image:
          "https://media.wired.com/photos/5926a53acefba457b079ab04/master/pass/UberHP.jpg",
        tags: ["2022", "Intern"],
      },
    ];

    const grid = root.querySelector(".cards") as HTMLDivElement | null;
    const card = root.querySelector(".card") as HTMLDivElement | null;

    if (!grid || !card) {
      return;
    }

    const gridEl = grid;
    const cardTemplate = card;
    const clonedCards: HTMLDivElement[] = [];
    const createdTags: HTMLDivElement[] = [];
    const mouseMoveCleanups: Array<() => void> = [];

    for (let i = 1; i < info.length; i++) {
      const newCard = cardTemplate.cloneNode(true) as HTMLDivElement;
      gridEl.appendChild(newCard);
      clonedCards.push(newCard);
    }

    const cards = root.querySelectorAll(".card") as NodeListOf<HTMLDivElement>;

    cards.forEach((item, i) => {
      const h1Elm = item.querySelector("h1") as HTMLHeadingElement;
      h1Elm.innerHTML = info[i].title;
      const imgElm = item.querySelector("img") as HTMLImageElement;
      imgElm.src = info[i].image;
      imgElm.alt = info[i].title;

      const tags = item.querySelector(".tags") as HTMLDivElement;
      info[i].tags.forEach((tag) => {
        const div = document.createElement("div");
        div.classList.add("tag");
        div.innerHTML = tag;
        tags.appendChild(div);
        createdTags.push(div);
      });

      const gradientWrapper = item.querySelector(
        ".gradient-wrapper",
      ) as HTMLDivElement;

      const handleMouseMove = (event: MouseEvent) => {
        const itemRect = item.getBoundingClientRect();
        const x = event.clientX - itemRect.left;

        if (x > itemRect.width) {
          gradientWrapper.style.transform = "translateY(-50%) scaleX(-1)";
        } else if (x < 0) {
          gradientWrapper.style.transform = "translateY(-50%) scaleX(1)";
        }
      };

      root.addEventListener("mousemove", handleMouseMove);
      mouseMoveCleanups.push(() => {
        root.removeEventListener("mousemove", handleMouseMove);
        gradientWrapper.style.transform = "";
      });
    });

    return () => {
      mouseMoveCleanups.forEach((cleanup) => cleanup());
      createdTags.forEach((tag) => tag.remove());
      clonedCards.forEach((item) => item.remove());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pillloader-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "scroll",
      }}
    >
      <div className="content">
        <div className="cards">
          <div className="card">
            <div className="cover-wrapper">
              <img className="cover" alt="" />
            </div>
            <h1></h1>
            <div className="tag-wrapper">
              <div className="tags"></div>
              <div className="gradient-wrapper right">
                <div className="gradient-blur">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
