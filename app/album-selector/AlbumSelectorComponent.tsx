"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function AlbumSelectorComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const content = root.querySelector(".content") as HTMLDivElement | null;
    const modal = root.querySelector(".modal") as HTMLDivElement | null;
    const nav = root.querySelector("nav") as HTMLDivElement | null;
    const sliderWrapper = root.querySelector(
      ".slider-wrapper",
    ) as HTMLDivElement | null;
    const slider = root.querySelector(".slider") as HTMLInputElement | null;

    if (!content || !modal || !nav || !sliderWrapper || !slider) {
      return;
    }

    const info = [
      {
        album: "Dangerously In Love",
        image:
          "https://cdn.prod.website-files.com/65cceef869e5a56037c32801/6730628cac02ab42b831132a_Frame%20482564.png",
        colorVar: "#0A0C16",
        mode: "dark",
        number: "16",
        year: "2003",
        songs: [
          ["Crazy In Love", "3:55"],
          ["Naughty Girl", "3:28"],
          ["Baby Boy", "4:04"],
        ],
      },
      {
        album: "B'day",
        image:
          "https://cdn.prod.website-files.com/65cceef869e5a56037c32801/6730705da9e91179ff040777_800.jpg",
        colorVar: "#494542",
        mode: "dark",
        number: "11",
        year: "2006",
        songs: [
          ["Deja Vu", "3:59"],
          ["Get Me Bodied", "3:25"],
          ["Suga Mama", "3:24"],
        ],
      },
      {
        album: "I Am... Sasha Fierce",
        image:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh-hEyphLyrHGz37d-r-YZvfwL1KciKOfkSThQ_53rtDsXfOpYuoPeeQWktvMa1v6AG8Z-TbA5eIkoC8bZKVPaElkyG-e59xZu4psJiJdBMGHJ1p5WR6YevQTTUK4acEXxedZRPN9ug1yP7/s1600/20190418+Random+J+Pop+%2528REVIEW%2529+Beyonce+-+I+am...Sasha+Fierce+%25231.png",
        colorVar: "#000",
        mode: "dark",
        number: "16",
        year: "2008",
        songs: [
          ["If I Were A Boy", "4:09"],
          ["Halo", "4:21"],
          ["Disappear", "4:27"],
        ],
      },
      {
        album: "4",
        image:
          "https://i.pinimg.com/564x/26/c1/7c/26c17cf20e33446e5f1e09b69c26e806.jpg",
        colorVar: "#EBEDD8",
        mode: "light",
        number: "14",
        year: "2011",
        songs: [
          ["Love On Top", "4:27"],
          ["Party", "4:05"],
          ["Schoolin' Life", "4:53"],
        ],
      },
      {
        album: "Beyoncé",
        image:
          "https://cdn.prod.website-files.com/65cceef869e5a56037c32801/67307606ab1bd3c65ab5dc5e_nb.jpg",
        colorVar: "#191919",
        mode: "dark",
        number: "20",
        year: "2014",
        songs: [
          ["Pretty Hurts", "4:17"],
          ["Haunted", "6:09"],
          ["Drunk In Love", "5:23"],
        ],
      },
      {
        album: "Lemonade",
        image:
          "https://i.pinimg.com/originals/c0/29/ea/c029ea992f727e5565c926f2f2e9f74e.jpg",
        colorVar: "#2C2C2E",
        mode: "dark",
        number: "13",
        year: "2016",
        songs: [
          ["Pray You Catch Me", "3:15"],
          ["Hold Up", "3:41"],
          ["Don't Hurt Yourself", "3:53"],
        ],
      },
      {
        album: "Renaissance",
        image:
          "https://pyxis.nymag.com/v1/imgs/c2d/cd4/890f68f946c1a2cfcee329d64387750f6c-beyonce-1.2x.rhorizontal.w700.jpg",
        colorVar: "#000",
        mode: "dark",
        number: "16",
        year: "2022",
        songs: [
          ["I'm That Girl", "3:28"],
          ["Cozy", "3:30"],
          ["Alien Superstar", "3:35"],
        ],
      },
      {
        album: "Cowboy Carter",
        image:
          "https://ca-times.brightspotcdn.com/dims4/default/d5f6173/2147483647/strip/true/crop/4436x4403+0+0/resize/1200x1191!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F5b%2F8d%2F9918bf924c09ae2ff707b58a9484%2Fcowboy-carter-press-03.jpg",
        colorVar: "#161616",
        mode: "dark",
        number: "27",
        year: "2024",
        songs: [
          ["American Requiem", "5:25"],
          ["Blackbiird", "2:11"],
          ["16 Carriages", "3:47"],
        ],
      },
    ];

    const clonedModals: HTMLDivElement[] = [];
    const photoShadows: HTMLDivElement[] = [];
    const clickHandlers: Array<{ el: Element; handler: () => void }> = [];

    for (let i = 1; i < info.length; i++) {
      const newModal = modal.cloneNode(true) as HTMLDivElement;
      content.appendChild(newModal);
      clonedModals.push(newModal);
    }

    const modals = root.querySelectorAll(".modal");

    const sliderWrapperDivs: HTMLDivElement[] = [];

    modals.forEach((item, i) => {
      const h1Element = item.querySelector("h1") as HTMLHeadingElement;
      h1Element.innerHTML = info[i].album;
      const imgElement = item.querySelector("img") as HTMLImageElement;
      imgElement.src = info[i].image;
      const titleInfoElements = item.querySelectorAll(
        ".title-info p",
      ) as NodeListOf<HTMLParagraphElement>;
      titleInfoElements[0].innerHTML = info[i].year;
      titleInfoElements[1].innerHTML = `${info[i].number} songs`;
      item.classList.add(info[i].mode == "dark" ? "dark" : "light");

      const songs = item.querySelectorAll(
        ".song",
      ) as NodeListOf<HTMLDivElement>;
      for (let n = 0; n < songs.length; n++) {
        const boldElement = songs[n].querySelector(".bold") as HTMLDivElement;
        const lightElement = songs[n].querySelector(".light") as HTMLDivElement;
        boldElement.innerHTML = info[i].songs[n][0];
        lightElement.innerHTML = info[i].songs[n][1];
      }

      const photoWrapper = item.querySelector(
        ".photo-wrapper",
      ) as HTMLDivElement;
      const photo = item.querySelector(".photo") as HTMLDivElement;

      const photoShadow = photo.cloneNode(true) as HTMLDivElement;
      photoShadow.style.filter = "brightness(1.5) saturate(1) blur(48px)";
      photoShadow.style.zIndex = "auto";
      photoShadow.style.transform = "translate3d(0, 0, 0)";
      photoWrapper.appendChild(photoShadow);
      photoShadows.push(photoShadow);

      (item.querySelectorAll(".photo")[0] as HTMLDivElement).style.background =
        info[i].colorVar;

      const handler = () => animate(i);
      item.addEventListener("click", handler);
      clickHandlers.push({ el: item, handler });
    });

    for (let i = 0; i < info.length; i++) {
      const wrapperLine = document.createElement("div");
      sliderWrapper.appendChild(wrapperLine);
      sliderWrapperDivs.push(wrapperLine);
    }
    slider.max = (info.length - 1).toString();
    slider.value = "0";

    const contentEl = content;
    const navEl = nav;
    const sliderEl = slider;
    const rootEl = root;

    function animate(i: number) {
      const offset = -(i * 112) + (info.length / 2 - 0.5) * 112;

      navEl.classList.value = "";
      navEl.classList.add(info[i].mode == "dark" ? "dark" : "light");
      contentEl.style.transform = `scale(0.65) translateX(${offset}px)`;
      rootEl.style.background = info[i].colorVar;
      for (let n = 0; n < modals.length; n++) {
        modals[n].classList.remove("active");
      }
      modals[i].classList.add("active");
      sliderEl.value = i.toString();
    }

    const handleSliderInput = () => {
      animate(Number(sliderEl.value));
    };
    sliderEl.addEventListener("input", handleSliderInput);

    animate(0);

    return () => {
      sliderEl.removeEventListener("input", handleSliderInput);
      clickHandlers.forEach(({ el, handler }) =>
        el.removeEventListener("click", handler),
      );
      photoShadows.forEach((shadow) => shadow.remove());
      clonedModals.forEach((m) => m.remove());
      sliderWrapperDivs.forEach((div) => div.remove());
      rootEl.style.background = "";
      contentEl.style.transform = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="albumselector-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <nav>
        <p className="bold">Beyoncé</p>
        <div className="type">
          <p className="light">Albums</p>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.71054 11.71L11.3005 14.3C11.6905 14.69 12.3205 14.69 12.7105 14.3L15.3005 11.71C15.9305 11.08 15.4805 10 14.5905 10H9.41054C8.52054 10 8.08054 11.08 8.71054 11.71Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </nav>
      <main className="content">
        <div className="modal">
          <div className="photo-wrapper absolute">
            <img className="photo" />
          </div>
          <div className="main-content">
            <div className="photo-wrapper"></div>
            <div className="main-info">
              <div className="info-top">
                <div className="title-container">
                  <h1>Cowboy Carter</h1>
                  <div className="title-info">
                    <p className="light">2024</p>
                    <div className="divider"></div>
                    <p className="light">27 songs</p>
                  </div>
                </div>
                <div className="play">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L16 10L6 16V4Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="songs">
                <div className="song">
                  <p className="bold">American Requiem</p>
                  <p className="light">5:25</p>
                  <svg
                    className="song-play"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L16 10L6 16V4Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="song">
                  <p className="bold">Blackbiird</p>
                  <p className="light">2:11</p>
                  <svg
                    className="song-play"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L16 10L6 16V4Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="song">
                  <p className="bold">16 Carriages</p>
                  <p className="light">3:47</p>
                  <svg
                    className="song-play"
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L16 10L6 16V4Z"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
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
      </main>
      <div className="slider-wrapper">
        <input type="range" min="0" className="slider" />
      </div>
    </div>
  );
}
