"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function CardsHoverComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const info = [
      {
        text: "A calming and tranquil color, linked to serenity, trust, and stability. It often represents the sky, water, and feelings of peace or coolness.",
      },
      {
        text: "A rich, luxurious color that blends the calm of blue and the energy of red. It symbolizes royalty, mystery, spirituality, and creativity.",
      },
      {
        text: "A bold and intense color, often associated with passion, energy, love, and danger. It evokes strong emotions and symbolizes power and excitement.",
      },
      {
        text: "A refreshing, natural color that symbolizes growth, health, and harmony. It’s often associated with nature, renewal, and balance.",
      },
      {
        text: "A bright and cheerful color that represents happiness, optimism, and warmth. It often symbolizes sunshine, creativity, and positivity.",
      },
      {
        text: "A vibrant, energetic color that combines the warmth of red and the cheerfulness of yellow. It often signifies enthusiasm, fun, and vitality.",
      },
    ];

    const grid = root.querySelector(".cards") as HTMLElement | null;
    const templateCard = root.querySelector(".card") as HTMLElement | null;
    const cursorCont = root.querySelector(
      ".cursor-container",
    ) as HTMLElement | null;
    const cursor = root.querySelector(".cursor") as HTMLElement | null;

    if (!grid || !templateCard || !cursorCont || !cursor) {
      return;
    }

    const clonedCards: HTMLElement[] = [];

    // duplicate cards
    for (let i = 1; i < info.length; i++) {
      const newCard = templateCard.cloneNode(true) as HTMLElement;
      grid.appendChild(newCard);
      clonedCards.push(newCard);
    }

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".card"));

    cards.forEach((item, i) => {
      const h1 = item.querySelector("h1") as HTMLElement;
      const p = item.querySelector("p") as HTMLElement;
      h1.innerHTML = String(i + 1);
      p.innerHTML = info[i].text;
    });

    const cardInner = cards.map(
      (item) => item.querySelector<HTMLElement>(".inner-shadow")!,
    );
    const cardCursorWrapper = cards.map(
      (item) => item.querySelector<HTMLElement>(".cursor-blur-wrapper")!,
    );
    const cardCursor = cards.map(
      (item) => item.querySelector<HTMLElement>(".cursor-blur")!,
    );

    const resetState = () => {
      cursor.style.backgroundColor = "";
      cards.forEach((_, i) => {
        cardCursor[i].style.backgroundColor = "";
        cardInner[i].style.color = "";
        cardCursorWrapper[i].style.transform = "";
      });
      cursorCont.style.transform = "";
    };

    const handleCursorMove = (event: MouseEvent) => {
      const rootRect = root.getBoundingClientRect();
      const cx = event.clientX - rootRect.left;
      const cy = event.clientY - rootRect.top;
      cursorCont.style.transform = `translate(${cx}px,${cy}px) scale(1)`;
    };

    const handleCardMove = (event: MouseEvent) => {
      cards.forEach((item, i) => {
        const rect = item.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        cardCursorWrapper[i].style.transform = `translate(${x}px,${y}px)`;
      });
    };

    const cardCleanups: (() => void)[] = [];

    cards.forEach((item, i) => {
      const onMouseOver = () => {
        cursor.style.backgroundColor = `var(--animate${i + 1})`;
        cardCursor[i].style.backgroundColor = `var(--animate${i + 1})`;
        cardInner[i].style.color = `var(--animate${i + 1})`;
      };
      const onMouseOut = () => {
        cursor.style.backgroundColor = "var(--initial)";
        cardCursor[i].style.backgroundColor = "var(--initial)";
        cardInner[i].style.color = "var(--initial)";
      };

      item.addEventListener("mouseover", onMouseOver);
      item.addEventListener("mouseout", onMouseOut);

      cardCleanups.push(() => {
        item.removeEventListener("mouseover", onMouseOver);
        item.removeEventListener("mouseout", onMouseOut);
      });
    });

    root.addEventListener("mousemove", handleCursorMove);
    root.addEventListener("mousemove", handleCardMove);

    resetState();

    return () => {
      root.removeEventListener("mousemove", handleCursorMove);
      root.removeEventListener("mousemove", handleCardMove);
      cardCleanups.forEach((cleanup) => cleanup());
      clonedCards.forEach((card) => card.remove());
      resetState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="cardshover-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="content">
        <div className="cards">
          <div className="card">
            <div className="inner-shadow">
              <div className="cursor-blur-wrapper">
                <div className="cursor-blur"></div>
              </div>
            </div>
            <h1></h1>
            <div style={{ zIndex: 99 }}>
              <p className="text"></p>
            </div>
          </div>
        </div>
      </div>
      <div className="cursor-container">
        <div className="cursor"></div>
      </div>
    </div>
  );
}
