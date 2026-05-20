"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./style.css";

export default function Flights() {
  const router = useRouter();

  useEffect(() => {
    router.push("/flights");
  }, [router]);

  useEffect(() => {
    const nav = document.querySelector("nav") as HTMLElement;
    const toggle = document.querySelector(".toggle") as HTMLElement;
    const content = document.querySelector(".content") as HTMLElement;
    const tray = document.querySelector(".tray") as HTMLElement;
    const trayHeight = tray.getBoundingClientRect().height;
    tray.style.transform = "scaleY(1.5)";
    let active = false;

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("active");
      document.body.classList.add("lighter");
      if (!active) {
        active = true;
        content.style.height = `${trayHeight}px`;
        animateTagsDown();
        setTimeout(() => {
          document.body.classList.remove("lighter");
        }, 200);
      } else {
        active = false;
        content.style.height = "0px";
        animateTagsUp();
        setTimeout(() => {
          document.body.classList.remove("lighter");
        }, 400);
      }
    });

    toggle.addEventListener("mouseenter", () => {
      nav.style.background = "#213B5C";
      if (!active) {
        toggle.classList.add("stay-open");
      }
      if (active) {
        toggle.classList.add("stay-closed");
      }
    });
    toggle.addEventListener("mouseleave", () => {
      nav.style.background = "#1C314C";
      if (active) {
        toggle.classList.remove("stay-open");
      }
      if (!active) {
        toggle.classList.remove("stay-closed");
      }
    });

    const trayItems = document.querySelectorAll(
      ".tray-item",
    ) as NodeListOf<HTMLElement>;
    trayItems.forEach((item, i) => {
      let isTagActive = false;
      item.onclick = () => {
        if (!isTagActive) {
          createInlineTag(i);
          // item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
          item.style.opacity = "0";
          isTagActive = true;
        } else {
          const activeTags = activeTagsContainer.querySelectorAll(
            ".tray-item",
          ) as NodeListOf<HTMLElement>;
          activeTags.forEach((tag) => {
            if (tag.dataset.index === i.toString()) {
              tag.remove();
            }
          });
          // item.style.transition = "opacity 0s, transform 0.6s ease"
          item.style.opacity = "1";
          isTagActive = false;
        }
      };
    });

    const activeTagsContainer = document.querySelector(
      ".active-tags",
    ) as HTMLElement;

    function createInlineTag(i: number) {
      const activeTrayItem = trayItems[i];
      const duplicateTrayItem = activeTrayItem.cloneNode(true) as HTMLElement;
      const navRect = nav.getBoundingClientRect();
      const activeRect = activeTrayItem.getBoundingClientRect();
      duplicateTrayItem.setAttribute("data-index", i.toString());
      duplicateTrayItem.style.position = "absolute";
      duplicateTrayItem.style.zIndex = "99";
      duplicateTrayItem.style.top = `${activeRect.top - navRect.top}px`;
      duplicateTrayItem.style.left = `${activeRect.left - navRect.left}px`;
      activeTagsContainer.appendChild(duplicateTrayItem);

      /* width calculation */
      duplicateTrayItem.setAttribute(
        "data-top",
        `${duplicateTrayItem.offsetTop}px`,
      );
      duplicateTrayItem.setAttribute(
        "data-left",
        `${duplicateTrayItem.offsetLeft}px`,
      );
      duplicateTrayItem.setAttribute(
        "data-centerpoint",
        `${duplicateTrayItem.offsetLeft + duplicateTrayItem.offsetWidth / 2}px`,
      );

      sortTags();
    }

    function sortTags() {
      const activeTags = activeTagsContainer.querySelectorAll(".tray-item");
      // Sort the activeTags NodeList into an array by data-centerpoint
      const sortedTags = Array.from(activeTags).sort((a, b) => {
        return (
          parseFloat(a.getAttribute("data-centerpoint")!) -
          parseFloat(b.getAttribute("data-centerpoint")!)
        );
      });

      // Remove all tags from the container and re-append in sorted order
      sortedTags.forEach((tag) => activeTagsContainer.appendChild(tag));
    }

    const title = document.querySelector(".filter-icon") as HTMLElement;
    const overflow = document.querySelector(".overflow") as HTMLElement;

    function animateTagsUp() {
      const activeTags = activeTagsContainer.querySelectorAll(
        ".tray-item",
      ) as NodeListOf<HTMLElement>;
      let leftOffset = title.offsetWidth + 30;
      const activeTagsLeft =
        activeTagsContainer.getBoundingClientRect().left -
        nav.getBoundingClientRect().left;
      let overflowCount = 0;
      activeTags.forEach((tag, i) => {
        tag.style.transitionDelay = `${i * 25}ms`;
        tag.classList.remove("active");
        tag.style.top = "3px";
        tag.style.left = `${leftOffset}px`;
        leftOffset += parseFloat(tag.offsetWidth.toString()) + 4;
        if (
          leftOffset - activeTagsLeft >
          activeTagsContainer.offsetWidth - 18
        ) {
          tag.style.opacity = "0";
          overflowCount++;
          if (i == activeTags.length - 1) {
            overflow.style.opacity = "1";
            overflow.innerHTML = `+${overflowCount}`;
          }
        } else {
          tag.style.opacity = "1";
          overflow.style.opacity = "0";
          overflow.style.left = `${leftOffset}px`;
        }
      });
      if (activeTags.length === 0) {
        overflow.style.opacity = "0";
      }
    }

    function animateTagsDown() {
      const activeTags = activeTagsContainer.querySelectorAll(
        ".tray-item",
      ) as NodeListOf<HTMLElement>;
      activeTags.forEach((tag, i) => {
        const originalTop = tag.dataset.top;
        const originalLeft = tag.dataset.left;

        tag.style.top = `${originalTop}`;
        tag.style.left = `${originalLeft}`;
      });
    }

    /* flights */

    const flights = [
      {
        departureTime: "1:00 pm",
        departureCode: "YYZ",
        arrivalTime: "2:05 pm",
        arrivalCode: "LGA",
        airline: "Air Canada",
        airlineLogo:
          "https://www.gstatic.com/flights/airline_logos/70px/dark/AC.png",
        duration: "1h 5m",
        price: 230,
        priceChange: "down",
        nonstop: true,
      },
      {
        departureTime: "3:30 pm",
        departureCode: "YYZ",
        arrivalTime: "4:45 pm",
        arrivalCode: "JFK",
        airline: "Delta",
        airlineLogo:
          "https://www.gstatic.com/flights/airline_logos/70px/dark/DL.png",
        duration: "1h 15m",
        price: 250,
        priceChange: "up",
        nonstop: false,
      },
      {
        departureTime: "5:00 pm",
        departureCode: "YYZ",
        arrivalTime: "6:10 pm",
        arrivalCode: "EWR",
        airline: "United",
        airlineLogo:
          "https://www.gstatic.com/flights/airline_logos/70px/dark/UA.png",
        duration: "1h 10m",
        price: 220,
        priceChange: "down",
        nonstop: true,
      },
      {
        departureTime: "7:15 pm",
        departureCode: "YYZ",
        arrivalTime: "8:30 pm",
        arrivalCode: "BOS",
        airline: "American",
        airlineLogo:
          "https://www.gstatic.com/flights/airline_logos/70px/dark/AA.png",
        duration: "1h 15m",
        price: 240,
        priceChange: "up",
        nonstop: false,
      },
    ];

    const flightsList = document.querySelector(".flights-list") as HTMLElement;
    function renderFlights() {
      const dsfkjl = document.querySelector(".flight") as HTMLElement;
      flightsList.innerHTML = "";
      flights.forEach((flight) => {
        const flightElement = dsfkjl.cloneNode(true) as HTMLElement;
        flightElement.querySelector(".departure h1")!.textContent =
          flight.departureTime;
        flightElement.querySelector(".departure small")!.textContent =
          flight.departureCode;
        flightElement.querySelector(".arrival h1")!.textContent =
          flight.arrivalTime;
        flightElement.querySelector(".arrival small")!.textContent =
          flight.arrivalCode;
        const airLineLogo = flightElement.querySelector(
          ".airline-logo",
        ) as HTMLImageElement;
        airLineLogo.src = flight.airlineLogo;
        flightElement.querySelector(".airline p")!.textContent = flight.airline;
        flightElement.querySelector(".flight-details small")!.textContent =
          flight.nonstop ? "Nonstop" : "1 Stop";
        flightElement.querySelector(".duration small")!.textContent =
          flight.duration;
        flightElement.querySelector(".price p")!.textContent =
          `CA$${flight.price}`;
        flightElement.querySelector(".price")!.className =
          `price ${flight.priceChange}`;
        flightsList.appendChild(flightElement);
      });
    }

    renderFlights();
  }, []);

  return (
    <main>
      <div className="background">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 447 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect
            width="100%"
            height="100%"
            fill="url(#paint0_linear_1389_824)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1389_824"
              x1="223.5"
              y1="0"
              x2="223.5"
              y2="360"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#030F1D" />
              <stop offset="0.356819" stopColor="#08213D" />
              <stop offset="0.509117" stopColor="#122F50" />
              <stop offset="0.645951" stopColor="#2E4166" />
              <stop offset="0.702694" stopColor="#424C6F" />
              <stop offset="0.754461" stopColor="#575B79" />
              <stop offset="0.794085" stopColor="#63647B" />
              <stop offset="0.825401" stopColor="#746F80" />
              <stop offset="0.855119" stopColor="#85797B" />
              <stop offset="0.882281" stopColor="#A27E6E" />
              <stop offset="0.906247" stopColor="#AF7851" />
              <stop offset="0.938858" stopColor="#A45F28" />
              <stop offset="0.96285" stopColor="#813D19" />
              <stop offset="0.985552" stopColor="#4E1C0D" />
              <stop offset="1" stopColor="#150508" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 447 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect
            width="100%"
            height="100%"
            fill="url(#paint0_linear_1389_820)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1389_820"
              x1="223.5"
              y1="0"
              x2="223.5"
              y2="360"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#011C3A" />
              <stop offset="0.356819" stopColor="#074B72" />
              <stop offset="0.509117" stopColor="#276186" />
              <stop offset="0.645951" stopColor="#5C768F" />
              <stop offset="0.702694" stopColor="#757F8D" />
              <stop offset="0.754461" stopColor="#958B89" />
              <stop offset="0.794085" stopColor="#B29583" />
              <stop offset="0.825401" stopColor="#C19475" />
              <stop offset="0.855119" stopColor="#D19163" />
              <stop offset="0.882281" stopColor="#D5864E" />
              <stop offset="0.906247" stopColor="#DE742A" />
              <stop offset="0.938858" stopColor="#CD500D" />
              <stop offset="0.96285" stopColor="#8D2114" />
              <stop offset="0.985552" stopColor="#4E0D13" />
              <stop offset="1" stopColor="#150508" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="window">
        <nav>
          <div className="toggle">
            <div className="toggle-content">
              <div className="filter-icon">
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 12C0.71667 12 0.479337 11.904 0.288004 11.712C0.0966702 11.52 0.000670115 11.2827 3.44827e-06 11C-0.000663218 10.7173 0.0953369 10.48 0.288004 10.288C0.48067 10.096 0.718003 10 1 10H5C5.28334 10 5.521 10.096 5.713 10.288C5.905 10.48 6.00067 10.7173 6 11C5.99934 11.2827 5.90334 11.5203 5.712 11.713C5.52067 11.9057 5.28334 12.0013 5 12H1ZM1 7C0.71667 7 0.479337 6.904 0.288004 6.712C0.0966702 6.52 0.000670115 6.28267 3.44827e-06 6C-0.000663218 5.71733 0.0953369 5.48 0.288004 5.288C0.48067 5.096 0.718003 5 1 5H9.5C9.78334 5 10.021 5.096 10.213 5.288C10.405 5.48 10.5007 5.71733 10.5 6C10.4993 6.28267 10.4033 6.52033 10.212 6.713C10.0207 6.90567 9.78334 7.00133 9.5 7H1ZM1 2C0.71667 2 0.479337 1.904 0.288004 1.712C0.0966702 1.52 0.000670115 1.28267 3.44827e-06 1C-0.000663218 0.717333 0.0953369 0.48 0.288004 0.288C0.48067 0.0960001 0.718003 0 1 0H13C13.2833 0 13.521 0.0960001 13.713 0.288C13.905 0.48 14.0007 0.717333 14 1C13.9993 1.28267 13.9033 1.52033 13.712 1.713C13.5207 1.90567 13.2833 2.00133 13 2H1Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="active-tags">
                <p className="overflow light"></p>
              </div>
              <div className="icon">
                <div className="icon-top"></div>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="tray">
              <small className="bold" style={{ margin: "14px 0 0 14px" }}>
                Sort
              </small>
              <div className="tray-wrap">
                <div className="tray-item">
                  <p>Price</p>
                </div>
                <div className="tray-item">
                  <p>Duration</p>
                </div>
                <div className="tray-item">
                  <p>Departure</p>
                </div>
                <div className="tray-item">
                  <p>Arrival</p>
                </div>
                <div className="tray-item">
                  <p>CO₂ emissions</p>
                </div>
                <div className="tray-item">
                  <p>Airport</p>
                </div>
              </div>
              <small className="bold" style={{ marginLeft: "14px" }}>
                Filter
              </small>
              <div className="tray-wrap">
                <div className="tray-item">
                  <p>Nonstop</p>
                </div>
                <div className="tray-item">
                  <p>Layover</p>
                </div>
                <div className="tray-item">
                  <p>Wifi available</p>
                </div>
                <div className="tray-item">
                  <p>Meals offered</p>
                </div>
                <div className="tray-item">
                  <p>Entertainment</p>
                </div>
                <div className="tray-item">
                  <p>Points</p>
                </div>
                <div className="tray-item">
                  <p>Aisle</p>
                </div>
                <div className="tray-item">
                  <p>Red eye</p>
                </div>
                <div className="tray-item">
                  <p>Refundable</p>
                </div>
                <div className="tray-item">
                  <p>Aircraft</p>
                </div>
                <div className="tray-item">
                  <p>Terminal</p>
                </div>
                <div className="tray-item">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1210_2861)">
                      <path
                        d="M8.26267 11.3048C8.26267 10.7788 8.488 10.7035 9.014 11.0042C9.60549 11.3468 10.2066 11.6725 10.8167 11.9808C10.8167 11.6808 11.1173 11.4548 11.6433 11.6048C12.1693 11.7548 12.6947 11.8302 12.6947 11.8302C12.6947 11.8302 12.3947 11.1542 12.244 10.8542C12.0187 10.3282 12.244 10.0275 12.4693 9.95283C12.4693 9.95283 12.1693 9.7275 11.9433 9.57683C11.4927 9.27683 11.568 8.90083 12.0187 8.75017C12.62 8.45017 13.446 8.15017 13.446 8.15017C13.2207 7.9995 12.92 7.6235 13.2207 7.09817C13.5207 6.6475 14.0473 5.9715 14.0473 5.9715H12.62C12.0933 5.9715 11.9433 5.52083 11.9433 5.22017C11.9433 5.22017 11.1173 5.82083 10.5167 6.19683C9.99 6.57217 9.54 6.19683 9.61533 5.5955C9.71638 4.94764 9.79155 4.29601 9.84067 3.64217C9.54 3.94283 9.014 3.86817 8.714 3.4175C8.338 2.66617 7.96267 1.76417 7.96267 1.76417C7.96267 1.76417 7.58667 2.66617 7.21133 3.41817C6.986 3.86883 6.46 3.9435 6.15933 3.71817C6.20845 4.37201 6.28362 5.02364 6.38467 5.6715C6.46 6.1975 6.00933 6.57283 5.48333 6.1975C4.88267 5.8215 3.98133 5.22083 3.98133 5.22083C3.98133 5.52083 3.83067 5.89683 3.30533 5.97217H1.878C1.878 5.97217 2.404 6.64817 2.70467 7.09883C3.00533 7.5495 2.70467 8.00017 2.47867 8.15017C2.47867 8.15017 3.23 8.52617 3.906 8.7515C4.35667 8.97683 4.50733 9.27683 3.98133 9.57817C3.83067 9.72817 3.45533 9.9535 3.45533 9.9535C3.75533 10.0282 3.98133 10.3288 3.75533 10.8548C3.60533 11.1548 3.30533 11.8308 3.30533 11.8308C3.30533 11.8308 3.83067 11.6808 4.35667 11.6055C4.88267 11.4555 5.108 11.7562 5.18333 11.9815C5.18333 11.9815 6.08467 11.4555 6.986 11.0048C7.43667 10.7048 7.73733 10.8548 7.73733 11.3048V12.5822C7.73733 13.3335 7.58667 14.0848 7.36133 14.5355C3.98133 14.1595 1.12667 11.4555 1.12667 7.85017C1.12667 4.1695 4.20667 1.16417 8.03733 1.16417C11.8687 1.16417 14.9487 4.1695 14.9487 7.85017C14.9487 11.3055 12.244 14.1595 8.78867 14.5355V15.4368C12.8453 15.0608 16 11.8302 16 7.8495C16 3.5675 12.3947 0.1875 7.96267 0.1875C3.60533 0.1875 0 3.5675 0 7.77417C0 11.4548 2.77933 14.5342 6.46 15.2108C7.06133 15.3608 7.43667 15.4362 7.812 15.8115C8.188 15.0608 8.26267 13.5582 8.26267 12.7315V11.3048Z"
                        fill="#EBEBEB"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1210_2861">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>Air Canada</p>
                </div>
                <div className="tray-item">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4108 12.8097L8 9.24127V1.39062L15.4108 12.8097ZM16 14.1707L8 10.7931V14.1707H16Z"
                      fill="#979797"
                    />
                    <path
                      d="M0.589844 12.8097L8.00065 1.39062V9.24127L0.589844 12.8097Z"
                      fill="#E6E6E6"
                    />
                    <path
                      d="M0 14.1706H8.00002V10.793L0 14.1706Z"
                      fill="#E6E6E6"
                    />
                  </svg>
                  <p>Delta</p>
                </div>
                <div className="tray-item">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1210_2881)">
                      <path
                        d="M0 6.51923C0 6.44508 0.0222428 6.25231 0.274328 6.25231C0.296571 6.25231 0.355885 6.25231 0.415199 6.28197C0.548656 6.3487 0.548656 6.45991 0.548656 6.63786C0.785913 6.3487 1.08248 6.22266 1.46803 6.22266C2.2317 6.22266 2.79518 6.80838 2.79518 7.82414C2.79518 8.56557 2.47637 9.43304 1.53475 9.43304C1.038 9.43304 0.808156 9.24027 0.548656 9.01042V10.256C0.548656 10.3376 0.526413 10.5303 0.266914 10.5303C0.222428 10.5303 0.170528 10.5155 0.133457 10.5007C0.0148285 10.4265 0 10.3376 0 10.2486V6.51923ZM1.40871 6.67493C0.845227 6.67493 0.548656 7.10495 0.548656 7.78707C0.548656 8.47659 0.837813 8.98077 1.40871 8.98077C1.72011 8.98077 1.92771 8.81765 2.03892 8.66195C2.20204 8.43211 2.23911 8.10588 2.23911 7.82414C2.2317 7.52015 2.20945 6.67493 1.40871 6.67493Z"
                        fill="white"
                      />
                      <path
                        d="M5.89426 8.99599C5.53096 9.39636 5.0861 9.43343 4.79695 9.43343C4.48555 9.43343 4.05552 9.38895 3.72188 9.01824C3.35116 8.61045 3.34375 8.06179 3.34375 7.84678C3.34375 7.55762 3.37341 7.06087 3.71446 6.67533C4.08518 6.26754 4.58193 6.23047 4.83402 6.23047C5.7089 6.23047 6.29463 6.78654 6.29463 7.80971C6.28722 8.06179 6.25756 8.58821 5.89426 8.99599ZM5.5013 8.66235C5.7089 8.39544 5.72373 8.01731 5.72373 7.83195C5.72373 7.25364 5.53096 6.67533 4.80436 6.67533C4.64125 6.67533 4.32985 6.69757 4.10001 7.01638C3.94431 7.24622 3.89982 7.55762 3.89982 7.83937C3.89982 8.14335 3.95172 8.46958 4.12225 8.68459C4.24088 8.83288 4.47072 8.98858 4.81178 8.98858C5.07869 8.98858 5.33819 8.87736 5.5013 8.66235Z"
                        fill="white"
                      />
                      <path
                        d="M7.49556 6.80763C7.60678 6.46657 7.94783 6.25155 8.30372 6.25155C8.37045 6.25155 8.62995 6.25155 8.62995 6.51847C8.62995 6.72607 8.46683 6.76314 8.37786 6.77797C8.22957 6.80021 8.07387 6.82245 7.91076 6.92625C7.5178 7.20058 7.5178 7.61578 7.5178 7.97167V9.15795C7.5178 9.25434 7.50298 9.41004 7.24348 9.41004C6.99881 9.41004 6.97656 9.24692 6.97656 9.15795V6.49623C6.97656 6.42208 6.99881 6.24414 7.23606 6.24414C7.4659 6.24414 7.48815 6.42208 7.48815 6.49623V6.80763"
                        fill="white"
                      />
                      <path
                        d="M9.33323 6.75011H9.01442C8.94769 6.75011 8.79199 6.72787 8.79199 6.52027C8.79199 6.30525 8.95511 6.29043 9.01442 6.29043H9.33323V5.58607C9.33323 5.51193 9.35548 5.33398 9.60015 5.33398C9.85965 5.33398 9.87448 5.50451 9.87448 5.58607V6.28301H10.2452C10.3193 6.28301 10.4676 6.29784 10.4676 6.51285C10.4676 6.72045 10.3045 6.7427 10.2452 6.7427H9.87448V8.25521C9.87448 8.61109 9.88189 8.65558 9.89672 8.72231C9.9412 8.89284 10.0524 8.92249 10.2155 8.93732C10.3564 8.94474 10.5047 8.95215 10.5047 9.15975C10.5047 9.36735 10.3119 9.38959 10.1562 9.38959C9.32582 9.38959 9.32582 8.94474 9.32582 8.47764L9.33323 6.75011Z"
                        fill="white"
                      />
                      <path
                        d="M11.4551 7.97282C11.4625 8.23974 11.5218 8.47699 11.6849 8.67718C11.8851 8.92926 12.1298 8.96634 12.367 8.96634C12.8341 8.96634 13.0047 8.72166 13.1085 8.55855C13.2049 8.39544 13.2345 8.33612 13.368 8.33612C13.5014 8.33612 13.6794 8.41026 13.6794 8.58821C13.6794 8.61045 13.6794 8.63269 13.672 8.64752C13.6497 8.75874 13.5459 8.89219 13.4792 8.96634C13.0714 9.43343 12.5302 9.43343 12.367 9.43343C11.9815 9.43343 11.5885 9.35929 11.2846 9.01824C11.0176 8.71425 10.8916 8.28422 10.8916 7.85419C10.8916 7.10535 11.2994 6.23047 12.3522 6.23047C12.4857 6.23047 12.6117 6.2453 12.7378 6.27495C13.0047 6.34168 13.2419 6.46773 13.4273 6.71981C13.6201 6.99414 13.7239 7.37968 13.7239 7.71332C13.7239 7.96541 13.5311 7.98024 13.4569 7.98024L11.4551 7.97282ZM13.1678 7.52797C13.1455 7.13501 12.9305 6.69757 12.367 6.69757C12.241 6.69757 11.9963 6.7124 11.7887 6.89034C11.5515 7.09794 11.4996 7.3871 11.4699 7.52055L13.1678 7.52797Z"
                        fill="white"
                      />
                      <path
                        d="M14.8647 6.80763C14.9759 6.46657 15.317 6.25155 15.6729 6.25155C15.7396 6.25155 15.9991 6.25155 15.9991 6.51847C15.9991 6.72607 15.836 6.76314 15.747 6.77797C15.5987 6.80021 15.443 6.82245 15.2799 6.92625C14.8869 7.20058 14.8869 7.61578 14.8869 7.97167V9.15795C14.8869 9.25434 14.8721 9.41004 14.6126 9.41004C14.3679 9.41004 14.3457 9.24692 14.3457 9.15795V6.49623C14.3457 6.42208 14.3679 6.24414 14.6052 6.24414C14.835 6.24414 14.8573 6.42208 14.8573 6.49623L14.8647 6.80763Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1210_2881">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>Porter</p>
                </div>
                <div className="tray-item">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1210_2874)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.5605 2.04883C2.35883 2.04883 1.15716 2.24911 0.0222531 2.67192V3.09473C0.0890125 3.07247 0.200278 3.02797 0.378303 2.98346C0.467316 2.96121 0.556328 2.93895 0.645341 2.93895C0.667594 2.93895 0.7121 2.93895 0.734353 2.9167C1.84701 2.76093 2.80389 2.98346 3.38248 3.65105C4.6509 5.09751 3.60501 8.05717 1.0459 10.2825C0.7121 10.5718 0.378303 10.8166 0.0445063 11.0613L0.0222531 11.0836V11.7957C0.133519 11.7289 0.222531 11.6622 0.333797 11.5732C0.467316 11.7957 1.37969 13.2644 1.40195 13.2867C1.46871 13.2422 1.66898 13.1086 1.91377 12.9529C2.18081 12.7526 2.5146 12.5301 2.82615 12.263C2.8484 12.2408 2.8484 12.2408 2.87065 12.2185L1.46871 10.594C1.60223 10.4605 2.09179 9.97094 2.4701 9.52588C2.55911 9.59264 3.73853 10.505 4.20584 10.9278C4.58414 10.5273 4.91794 10.1045 5.20723 9.68165C4.56189 9.25884 3.2267 8.47998 3.2267 8.47998C3.44923 8.12393 3.64951 7.76788 3.80528 7.41183C3.80528 7.41183 5.363 8.03492 6.00834 8.34646C6.18637 8.01267 6.31989 7.65662 6.43115 7.32282C6.45341 7.27831 6.45341 7.21155 6.47566 7.16705C5.67455 6.8555 4.2726 6.49945 4.13908 6.4772C4.22809 6.16566 4.2726 5.87637 4.29485 5.58708C5.45202 5.69834 6.49791 5.96538 6.69819 6.00988C6.72044 5.67609 6.72044 5.36454 6.67594 5.07525C5.40751 4.85272 4.38387 4.85272 4.25035 4.85272C4.22809 4.63019 4.16133 4.40766 4.09458 4.20738C4.09458 4.20738 5.22948 4.11837 6.4089 4.25189C6.34214 4.11837 6.27538 3.98485 6.18637 3.87358C6.11961 3.78457 5.98609 3.6288 5.98609 3.6288C5.98609 3.6288 4.9847 3.56204 3.82754 3.71781C3.71627 3.56204 3.58275 3.42852 3.47149 3.31726C3.49374 3.31726 4.38387 3.11698 5.42976 3.11698C5.14047 2.9167 4.82893 2.78318 4.82893 2.78318C4.00556 2.80543 3.13769 3.02797 3.07093 3.05022C2.82615 2.9167 2.64812 2.84994 2.62587 2.84994C2.69263 2.82769 3.31572 2.62741 3.78303 2.5829C3.15994 2.49389 2.29207 2.69417 2.18081 2.71642C2.04729 2.69417 1.84701 2.67192 1.71349 2.64966C1.71349 2.64966 2.18081 2.51614 2.80389 2.42713C3.36022 2.33812 5.25174 2.11559 6.47566 3.74007C7.61057 5.27553 7.21001 7.67887 5.65229 9.97094C5.25174 10.594 4.76217 11.1949 4.18359 11.7734C3.71627 12.263 3.2267 12.6858 2.75939 13.0641C2.04729 13.6427 1.26843 14.1323 0.489569 14.5328C0.333797 14.6218 0.155772 14.7109 0 14.7776V15.512C1.33519 14.8889 2.11405 14.288 2.11405 14.288L3.2267 15.868C3.2267 15.868 4.09458 15.3339 4.96245 14.5996L3.62726 13.0864C4.13908 12.6413 4.6064 12.1517 5.02921 11.6622C5.02921 11.6622 6.4089 12.8861 6.56467 13.0419C7.00974 12.5523 7.41029 12.0182 7.76634 11.4842C7.05424 10.9056 6.09736 10.2602 6.09736 10.2602C6.09736 10.2602 6.65369 9.34785 6.89847 8.79153C6.89847 8.79153 7.81085 9.28109 8.67872 9.85968C8.90125 9.39236 9.05702 8.90279 9.19054 8.39097C8.61196 8.05717 7.36578 7.47859 7.36578 7.47859C7.47705 7.05578 7.54381 6.63297 7.56606 6.23242C7.56606 6.23242 8.47844 6.52171 9.41307 6.98902C9.43533 6.58847 9.41307 6.21016 9.32406 5.83186C8.5452 5.45356 7.4993 5.20877 7.4993 5.20877C7.4548 4.89723 7.34353 4.58568 7.23227 4.31865C7.23227 4.31865 8.18915 4.49667 9.01252 4.83047C8.81224 4.36315 8.5452 4.09612 8.5452 4.09612C8.01113 3.80683 6.7872 3.58429 6.7872 3.58429C6.65369 3.40627 6.49791 3.2505 6.34214 3.11698C6.72044 3.16148 7.32128 3.31726 7.32128 3.31726C6.65369 2.98346 5.91933 2.80543 5.91933 2.80543C5.91933 2.80543 5.76356 2.71642 5.58554 2.60516C5.58554 2.60516 7.43254 2.98346 8.43394 3.74007C8.52295 3.80683 8.61196 3.89584 8.70097 3.9626C8.81224 4.05161 8.879 4.16288 8.96801 4.27414C10.9708 7.01128 9.23505 12.263 4.38387 15.957H6.18637C6.09736 15.8458 5.85257 15.5787 5.80807 15.5565C6.38665 15.0224 6.92072 14.4661 7.41029 13.8652L8.61196 15.0669C9.07928 14.5328 9.52434 13.9543 9.90264 13.3534C9.90264 13.3534 9.27955 12.7526 8.58971 12.1517C9.12378 11.2839 9.45758 10.416 9.45758 10.416C9.50209 10.4605 10.1697 10.9501 10.8373 11.5732C11.1711 10.8611 11.3713 9.94869 11.3713 9.94869C10.6815 9.30335 9.94715 8.85828 9.94715 8.85828C10.0584 8.36872 10.1252 7.87915 10.1474 7.38958C10.1474 7.38958 10.904 7.83464 11.5716 8.41322C11.5716 7.99041 11.5494 7.54535 11.4604 7.14479C10.815 6.58847 10.0807 6.21016 10.0807 6.21016C10.0807 6.21016 10.0139 5.74285 9.76912 5.16427C9.81363 5.18652 10.1697 5.36454 10.7705 5.80961C10.3032 5.18652 9.47983 4.58568 9.47983 4.58568C9.39082 4.45217 9.30181 4.31865 9.2128 4.18513C9.88039 4.65244 10.5035 5.18652 11.0376 5.78735C11.2378 6.03214 11.4159 6.36593 11.5716 6.72198C11.6161 6.83325 11.6384 6.92226 11.6829 7.03353C12.128 8.54674 11.8609 10.238 11.3491 11.6177C10.7705 13.2199 9.79138 14.7109 8.65647 15.9793H10.7928C10.993 15.69 11.1933 15.4007 11.3713 15.0892C11.2378 14.8666 10.5702 14.11 10.5702 14.11C10.9263 13.5314 11.2601 12.8861 11.5049 12.263C11.5049 12.263 11.9499 12.7526 12.2837 13.2422C12.6175 12.441 12.7733 11.5954 12.7733 11.5954C12.5508 11.2171 12.0389 10.6163 12.0389 10.6163C12.1502 10.1045 12.217 9.59264 12.217 9.05856C12.484 9.37011 12.8178 9.85968 12.8178 9.85968C12.751 8.90279 12.2615 8.03492 12.1502 7.85689C12.1502 7.83464 12.1502 7.81239 12.1502 7.79013C12.0834 7.45634 11.9722 7.10029 11.9054 6.90001C12.4618 7.72338 12.8178 8.63575 12.8178 8.63575C13.0403 9.23659 13.1739 9.97094 13.1739 10.7721C13.1739 11.1949 13.0848 13.4424 11.3713 15.9793H11.9054C12.217 15.3785 12.573 14.6441 12.8178 14.021C12.8178 14.0433 12.9513 14.3548 13.0403 14.6664C13.2184 14.021 13.3519 13.3534 13.4186 12.6636C13.3964 12.5746 13.3519 12.441 13.3296 12.352C13.3296 12.352 13.4409 11.7734 13.4854 11.1059C13.5522 11.5732 13.5744 12.0182 13.5744 12.5078C13.5744 13.3312 13.4854 14.11 13.2851 14.8889C13.1961 15.2672 13.0626 15.6455 12.9513 16.0015H13.4186C13.7969 14.8889 13.9972 13.7317 13.9972 12.5523C14.0417 6.76649 9.34631 2.04883 3.5605 2.04883ZM0.0222531 8.96955V10.3715C0.267038 10.2157 0.511822 10.0377 0.756606 9.83742L0.0222531 8.96955ZM0.35605 3.18374C0.244784 3.2505 0.133519 3.33951 0.0222531 3.42852V3.76232C0.311544 3.53979 0.689847 3.27275 1.00139 3.09473C0.801113 3.11698 0.578581 3.13923 0.35605 3.18374ZM1.29068 8.68026C0.912378 8.41322 0.0222531 7.79013 0.0222531 7.79013V7.03353C0.667594 6.0989 0.756606 5.053 0.200278 4.51893C0.155772 4.47442 0.0890125 4.42991 0.0222531 4.38541V4.0071C0.0222531 4.0071 0.845619 3.36176 1.49096 3.07247C1.64673 3.09473 1.8025 3.09473 1.93602 3.13923C0.956884 3.53979 0.244784 4.05161 0.200278 4.09612C0.289291 4.16288 0.400556 4.22963 0.400556 4.22963C0.422809 4.22963 1.35744 3.6288 2.38108 3.27275C2.5146 3.33951 2.64812 3.40627 2.78164 3.51753C1.64673 3.82908 0.578581 4.40766 0.578581 4.40766C0.645341 4.47442 0.689847 4.56343 0.734353 4.63019H0.756606C1.91377 4.16288 3.13769 3.89584 3.13769 3.89584C3.2267 4.02936 3.31572 4.16288 3.38248 4.3409C3.38248 4.3409 2.29207 4.47442 0.867872 4.91948C0.912378 5.11976 0.934631 5.25328 0.934631 5.25328C0.934631 5.25328 2.26982 4.96399 3.49374 4.91948C3.51599 5.11976 3.49374 5.34229 3.47149 5.56482C2.73713 5.52032 1.00139 5.60933 0.934631 5.63158C0.934631 5.63158 0.934631 5.87637 0.867872 6.12115C0.867872 6.12115 2.1363 6.16566 3.29346 6.36594C3.20445 6.63297 3.09318 6.92226 2.95967 7.1893C2.20306 6.96677 1.02364 6.67748 0.7121 6.61072C0.623088 6.811 0.534075 7.01128 0.400556 7.1893C0.400556 7.1893 1.82476 7.81239 2.35883 8.12393C2.11405 8.47998 1.64673 8.96955 1.64673 8.96955C1.55772 8.88054 1.4242 8.76927 1.29068 8.68026Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1210_2874">
                        <rect width="16" height="16" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <p>United</p>
                </div>
                <div className="tray-item">
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.59247 13.7759C9.43139 15.121 10.7187 15.121 11.0803 15.121H15.3328L10.3137 9.06055C7.98498 9.1618 6.78445 10.6227 7.0448 11.2446L8.59247 13.7759Z"
                      fill="url(#paint0_linear_1210_2865)"
                    />
                    <path
                      d="M7.08879 11.2302C7.08879 11.2302 6.92969 10.9119 6.92969 10.5503C6.92969 9.14731 8.17361 8.36625 9.57663 8.0625L10.3577 9.04606C8.02896 9.10392 6.8429 10.6082 7.08879 11.2302Z"
                      fill="url(#paint1_linear_1210_2865)"
                    />
                    <path
                      d="M9.01277 6.7168C6.88653 6.7168 5.33887 7.0784 5.33887 7.90286C5.33887 8.22107 5.44012 8.46696 5.70047 8.94428L7.1035 11.273C7.1035 11.273 6.94439 10.9548 6.94439 10.5932C6.94439 9.19017 8.18831 8.4091 9.59133 8.10536C10.0108 8.00411 10.4158 8.00411 10.8353 8.00411C11.1969 8.00411 11.5151 8.00411 11.7754 8.10536C11.5585 7.49786 11.1969 6.7168 9.01277 6.7168Z"
                      fill="url(#paint2_linear_1210_2865)"
                    />
                    <path
                      d="M3.47304 5.27227C4.03714 6.21244 4.25411 6.45833 5.65713 6.45833C6.69855 6.45833 8.30407 6.45833 8.30407 6.45833L4.6591 1.84426C3.83465 0.860701 3.41518 0.658203 2.63412 0.658203H0.666992L3.47304 5.27227Z"
                      fill="url(#paint3_linear_1210_2865)"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_1210_2865"
                        x1="11.1727"
                        y1="8.87245"
                        x2="11.1727"
                        y2="18.2501"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#EDEDED" />
                        <stop offset="0.1263" stopColor="#E7E7E7" />
                        <stop offset="0.2703" stopColor="#DCDCDC" />
                        <stop offset="0.4229" stopColor="#C4C4C4" />
                        <stop offset="0.5816" stopColor="#A2A2A2" />
                        <stop offset="0.7436" stopColor="#7B7B7B" />
                        <stop offset="0.7546" stopColor="#7A7A7A" />
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_1210_2865"
                        x1="6.93544"
                        y1="9.65159"
                        x2="10.3571"
                        y2="9.65159"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#666666" />
                        <stop offset="0.2647" stopColor="#898989" />
                        <stop offset="0.5812" stopColor="#B0B0B0" />
                        <stop offset="0.8377" stopColor="#CCCCCC" />
                        <stop offset="1" stopColor="#D6D6D6" />
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_1210_2865"
                        x1="6.57962"
                        y1="9.18525"
                        x2="10.3932"
                        y2="6.89379"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.1" stopColor="#E7EBEE" />
                        <stop offset="0.3511" stopColor="#D5DCE0" />
                        <stop offset="0.8549" stopColor="#A5B4BB" />
                        <stop offset="1" stopColor="#96A7B0" />
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_1210_2865"
                        x1="4.47745"
                        y1="7.22437"
                        x2="4.47745"
                        y2="0.745668"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#7B7B7B" />
                        <stop offset="0.1275" stopColor="#8C8C8C" />
                        <stop offset="0.4038" stopColor="#ABABAB" />
                        <stop offset="0.6512" stopColor="#CCCCCC" />
                        <stop offset="0.8584" stopColor="#E1E1E1" />
                        <stop offset="1" stopColor="#E4E4E4" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <p>American</p>
                </div>
              </div>
            </div>
            <div className="gradient-blur">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </nav>
        <div className="flights-list">
          <div className="flight">
            <div className="flight-main">
              <div className="departure">
                <h1>1:00 pm</h1>
                <small className="light">YYZ</small>
              </div>
              <div className="duration">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 10H18M18 10C16.5 9.5 14.5 7.5 14 6M18 10C16.5 10.5 14.5 12.5 14 14"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <small className="light">1h 5m</small>
              </div>
              <div className="arrival">
                <h1>2:05 pm</h1>
                <small className="light">LGA</small>
              </div>
            </div>
            <div className="flight-border"></div>
            <div className="flight-details">
              <div className="airline">
                <img
                  className="airline-logo"
                  src="https://www.gstatic.com/flights/airline_logos/70px/dark/AC.png"
                />
                <p className="bold">Air Canada</p>
              </div>
              <small className="light">Nonstop</small>
              <div className="price down">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.75 0.75H8.75M8.75 0.75V4.75M8.75 0.75L0.75 8.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="bold">CA$230</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
