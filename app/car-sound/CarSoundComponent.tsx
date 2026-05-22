"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function CarSoundComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const updateWindowWidth = () => {
      root.style.setProperty(
        "--window-width",
        `${root.getBoundingClientRect().width}px`,
      );
    };

    const resizeObserver = new ResizeObserver(updateWindowWidth);
    resizeObserver.observe(root);
    window.addEventListener("resize", updateWindowWidth);
    updateWindowWidth();

    type SongData = {
      title: string;
      artist: string;
      cover: string;
      color: string;
    };

    type WaveComponent = {
      freq: number;
      amp: number;
      phase: number;
    };

    const data: SongData[] = [
      {
        title: "XXX.",
        artist: "Kendrick Lamar ft. U2",
        cover:
          "https://preview.redd.it/nd05tk0tpwc01.jpg?width=640&crop=smart&auto=webp&s=6b969f0cdc548c0a802dd3b1cd2b1556515d5c14",
        color: "#CC5E5E",
      },
      {
        title: "Window",
        artist: "Fiona Apple",
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrn13ijg5yJSpqCY0r_76VJU8g3HE6_B4xuQ&s",
        color: "#8DCA4B",
      },
      {
        title: "Dead To Me.",
        artist: "Kali Uchis",
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMBixHQSmSZ45CNZg-fmuhF6ak9aJhBaJkIA&s",
        color: "#3859EC",
      },
      {
        title: "November",
        artist: "Tyler, The Creator",
        cover:
          "https://upload.wikimedia.org/wikipedia/en/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png",
        color: "#F48028",
      },
      {
        title: "15 Step",
        artist: "Radiohead",
        cover:
          "https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png",
        color: "#D99149",
      },
      {
        title: "Red Wine Supernova",
        artist: "Chappell Roan",
        cover:
          "https://upload.wikimedia.org/wikipedia/en/3/34/Chappell_Roan_-_The_Rise_and_Fall_of_a_Midwest_Princess.png",
        color: "#12CBC2",
      },
    ];

    const rootEl = root;
    const songsContainer = rootEl.querySelector(".songs") as HTMLElement | null;
    const songInfo = rootEl.querySelector(".song-info") as HTMLElement | null;
    const songTitle = rootEl.querySelector(
      ".song-title",
    ) as HTMLHeadingElement | null;
    const songArtist = rootEl.querySelector(
      ".song-artist",
    ) as HTMLHeadingElement | null;
    const prevButton = rootEl.querySelector(".prev") as SVGSVGElement | null;
    const nextButton = rootEl.querySelector(".next") as SVGSVGElement | null;
    const contentEl = rootEl.querySelector(".content") as HTMLElement | null;
    const path1 = rootEl.querySelector("#wavePath1") as SVGPathElement | null;
    const path2 = rootEl.querySelector("#wavePath2") as SVGPathElement | null;
    const toggleBtn = rootEl.querySelector(
      "#toggleBtn",
    ) as HTMLButtonElement | null;

    if (
      !songsContainer ||
      !songInfo ||
      !songTitle ||
      !songArtist ||
      !prevButton ||
      !nextButton ||
      !contentEl ||
      !path1 ||
      !path2 ||
      !toggleBtn
    ) {
      return;
    }

    const timeouts: number[] = [];
    const createdSongs: HTMLElement[] = [];
    const totalSongs = data.length;
    let currentIndex = 0;
    let angle = 0;
    let infoTimeout: number | null = null;

    const removeScheduled = (timeoutId: number | null) => {
      if (timeoutId === null) {
        return;
      }

      window.clearTimeout(timeoutId);
      const index = timeouts.indexOf(timeoutId);
      if (index !== -1) {
        timeouts.splice(index, 1);
      }
    };

    const schedule = (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        removeScheduled(timeoutId);
        callback();
      }, delay);
      timeouts.push(timeoutId);
      return timeoutId;
    };

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
      infoTimeout = null;
    };

    const buildSongs = () => {
      data.forEach((song, index) => {
        const songElement = document.createElement("div");
        songElement.className = "song";
        songElement.style.transform = `rotateY(${index * -60}deg) translateZ(-40vw)`;

        const coverImage = document.createElement("img");
        coverImage.src = song.cover;
        coverImage.className = "song-cover";
        songElement.appendChild(coverImage);

        const shadowImage = document.createElement("img");
        shadowImage.src = song.cover;
        shadowImage.className = "song-shadow";
        songElement.appendChild(shadowImage);

        const glowSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        glowSvg.setAttribute("class", "song-glow");
        glowSvg.setAttribute("height", "100%");
        glowSvg.setAttribute("viewBox", "0 0 222 160");
        glowSvg.setAttribute("fill", "none");

        const glowPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        glowPath.setAttribute(
          "d",
          "M180.5 0L185.894 37.7539C188.712 57.4839 202.532 73.8813 221.5 80C202.532 86.1187 188.712 102.516 185.894 122.246L180.5 160H41L35.6064 122.246C32.7879 102.516 18.9679 86.1187 0 80C18.9679 73.8813 32.7879 57.4839 35.6064 37.7539L41 0H180.5Z",
        );
        glowPath.setAttribute("fill", song.color);
        glowSvg.appendChild(glowPath);

        songElement.appendChild(glowSvg);
        songsContainer.appendChild(songElement);
        createdSongs.push(songElement);
      });
    };

    const resetSongs = () => {
      createdSongs.forEach((songElement) => songElement.remove());
      createdSongs.length = 0;
      songsContainer.style.transform = "";
      songInfo.style.opacity = "";
      rootEl.style.removeProperty("--active-color");
    };

    const updateSongDisplay = () => {
      const songImgs = songsContainer.querySelectorAll(
        ".song-cover",
      ) as NodeListOf<HTMLImageElement>;

      songsContainer.style.transform = `translateZ(45vw) rotateY(${angle}deg)`;
      songImgs.forEach((img, index) => {
        if (index === currentIndex) {
          img.style.transform = "rotate(0deg) translateZ(0)";
          img.style.zIndex = "2";
        } else if (
          (index > currentIndex && index - currentIndex <= totalSongs / 2) ||
          (index < currentIndex && currentIndex - index > totalSongs / 2)
        ) {
          img.style.transform = "rotateY(-50deg) translateZ(7vw)";
          img.style.zIndex = "1";
        } else {
          img.style.transform = "rotateY(50deg) translateZ(7vw)";
          img.style.zIndex = "1";
        }
      });

      songInfo.style.opacity = "0";
      removeScheduled(infoTimeout);
      infoTimeout = schedule(() => {
        songTitle.textContent = data[currentIndex].title;
        songArtist.textContent = data[currentIndex].artist;
        songInfo.style.opacity = "1";
      }, 400);

      rootEl.style.setProperty("--active-color", data[currentIndex].color);
    };

    const handlePrevClick = () => {
      currentIndex = (currentIndex - 1 + totalSongs) % totalSongs;
      angle -= 60;
      updateSongDisplay();
    };

    const handleNextClick = () => {
      currentIndex = (currentIndex + 1) % totalSongs;
      angle += 60;
      updateSongDisplay();
    };

    class SoundwaveAnimator {
      private content: HTMLElement;
      private path1: SVGPathElement;
      private path2: SVGPathElement;
      private toggleBtn: HTMLButtonElement;
      private prevBtn: SVGSVGElement;
      private nextBtn: SVGSVGElement;
      private width = 800;
      private height = 200;
      private centerY = this.height / 2;
      private points = 200;
      private time = 0;
      private isPlaying = true;
      private isStarting = true;
      private isResetting = false;
      private startupDuration = 0;
      private startupTime = 0;
      private isTransitioning = false;
      private amplitudeMultiplier = 0;
      private transitionSpeed = 0;
      private targetAmplitude = 1;
      private frequency = 0.02;
      private amplitude = 40;
      private speed = 0.06;
      private mode = "midrange";
      private frequencies1: WaveComponent[] = [];
      private frequencies2: WaveComponent[] = [];
      private evolutionOffset = 0;
      private evolutionSpeed = 1;
      private animationFrameId: number | null = null;

      constructor(options: {
        content: HTMLElement;
        path1: SVGPathElement;
        path2: SVGPathElement;
        toggleBtn: HTMLButtonElement;
        prevBtn: SVGSVGElement;
        nextBtn: SVGSVGElement;
      }) {
        this.content = options.content;
        this.path1 = options.path1;
        this.path2 = options.path2;
        this.toggleBtn = options.toggleBtn;
        this.prevBtn = options.prevBtn;
        this.nextBtn = options.nextBtn;

        this.initializeParameters();
        this.setupEventListeners();
        this.animate();
      }

      destroy() {
        this.toggleBtn.removeEventListener("click", this.handleToggleClick);
        this.prevBtn.removeEventListener("click", this.handleResetClick);
        this.nextBtn.removeEventListener("click", this.handleResetClick);
        if (this.animationFrameId !== null) {
          window.cancelAnimationFrame(this.animationFrameId);
        }
        this.content.classList.remove("paused", "resetting", "starting");
        this.toggleBtn.classList.remove("playing", "paused", "resetting");
        this.toggleBtn.classList.add("starting");
        this.path1.classList.remove("paused", "resetting");
        this.path1.classList.add("starting");
        this.path2.classList.remove("paused", "resetting");
        this.path2.classList.add("starting");
        this.prevBtn.classList.remove("disabled");
        this.nextBtn.classList.remove("disabled");
      }

      private initializeParameters() {
        this.width = 800;
        this.height = 200;
        this.centerY = this.height / 2;
        this.points = 200;
        this.time = 0;
        this.isPlaying = true;
        this.isStarting = true;
        this.isResetting = false;
        this.startupDuration = 280 + Math.random() * 40;
        this.startupTime = 0;
        this.isTransitioning = false;
        this.amplitudeMultiplier = 0;
        this.transitionSpeed = 0.04 + Math.random() * 0.02;
        this.targetAmplitude = 1;
        this.frequency = 0.02;
        this.amplitude = 40;
        this.speed = 0.06 + Math.random() * 0.02;
        this.mode = "midrange";

        this.frequencies1 = [
          {
            freq: 0.025 + (Math.random() - 0.5) * 0.018,
            amp: 35 + (Math.random() - 0.5) * 15,
            phase: Math.random() * Math.PI * 2,
          },
          {
            freq: 0.035 + (Math.random() - 0.5) * 0.022,
            amp: 20 + (Math.random() - 0.5) * 12,
            phase: Math.random() * Math.PI * 2,
          },
          {
            freq: 0.045 + (Math.random() - 0.5) * 0.025,
            amp: 12 + (Math.random() - 0.5) * 8,
            phase: Math.random() * Math.PI * 2,
          },
        ];

        this.frequencies2 = [
          {
            freq: 0.03 + (Math.random() - 0.5) * 0.015,
            amp: 25 + (Math.random() - 0.5) * 10,
            phase: Math.random() * Math.PI * 2,
          },
          {
            freq: 0.05 + (Math.random() - 0.5) * 0.02,
            amp: 15 + (Math.random() - 0.5) * 8,
            phase: Math.random() * Math.PI * 2,
          },
        ];

        this.evolutionOffset = Math.random() * 1000;
        this.evolutionSpeed = 0.8 + Math.random() * 0.4;
      }

      private readonly handleToggleClick = () => {
        this.togglePlayPause();
      };

      private readonly handleResetClick = () => {
        if (!this.isResetting) {
          this.resetAnimation();
        }
      };

      private setupEventListeners() {
        this.toggleBtn.addEventListener("click", this.handleToggleClick);
        this.prevBtn.addEventListener("click", this.handleResetClick);
        this.nextBtn.addEventListener("click", this.handleResetClick);
      }

      private resetAnimation() {
        this.isResetting = true;
        this.isStarting = false;
        this.isTransitioning = true;
        this.targetAmplitude = 0;
        this.isPlaying = false;

        this.content.classList.remove("paused", "starting");
        this.content.classList.add("resetting");
        this.toggleBtn.classList.remove("playing", "paused", "starting");
        this.toggleBtn.classList.add("resetting");
        this.path1.classList.remove("paused", "starting");
        this.path1.classList.add("resetting");
        this.path2.classList.remove("paused", "starting");
        this.path2.classList.add("resetting");
        this.prevBtn.classList.add("disabled");
        this.nextBtn.classList.add("disabled");
      }

      private completeReset() {
        const oldAmplitude = this.amplitudeMultiplier;
        this.initializeParameters();
        this.amplitudeMultiplier = oldAmplitude;
        this.isResetting = false;
        this.isStarting = true;
        this.startupTime = 0;

        this.content.classList.remove("resetting");
        this.content.classList.add("starting");
        this.toggleBtn.classList.remove("resetting");
        this.toggleBtn.classList.add("starting");
        this.path1.classList.remove("resetting");
        this.path1.classList.add("starting");
        this.path2.classList.remove("resetting");
        this.path2.classList.add("starting");
        this.prevBtn.classList.remove("disabled");
        this.nextBtn.classList.remove("disabled");
      }

      private updateStartup() {
        if (!this.isStarting) {
          return;
        }

        this.startupTime++;
        const progress = this.startupTime / this.startupDuration;

        if (progress >= 1) {
          this.isStarting = false;
          this.amplitudeMultiplier = 1;
          this.content.classList.remove("starting");
          this.toggleBtn.classList.remove("starting");
          this.toggleBtn.classList.add("playing");
          this.path1.classList.remove("starting");
          this.path2.classList.remove("starting");
          return;
        }

        const easeInOut =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        this.amplitudeMultiplier = easeInOut;
      }

      private togglePlayPause() {
        if (this.isPlaying) {
          this.isPlaying = false;
          this.isStarting = false;
          this.isTransitioning = true;
          this.targetAmplitude = 0;

          this.content.classList.remove("starting");
          this.content.classList.add("paused");
          this.toggleBtn.classList.remove("playing", "starting");
          this.toggleBtn.classList.add("paused");
          this.path1.classList.remove("starting");
          this.path1.classList.add("paused");
          this.path2.classList.remove("starting");
          this.path2.classList.add("paused");
          return;
        }

        this.isPlaying = true;
        this.isStarting = false;
        this.isTransitioning = true;
        this.targetAmplitude = 1;
        this.content.classList.remove("paused");
        this.toggleBtn.classList.remove("paused", "starting");
        this.toggleBtn.classList.add("playing");
        this.path1.classList.remove("paused", "starting");
        this.path2.classList.remove("paused", "starting");
      }

      private updateTransition() {
        if (!this.isTransitioning) {
          return;
        }

        const diff = this.targetAmplitude - this.amplitudeMultiplier;
        this.amplitudeMultiplier += diff * this.transitionSpeed;

        if (Math.abs(diff) < 0.01) {
          this.amplitudeMultiplier = this.targetAmplitude;
          this.isTransitioning = false;

          if (this.isResetting && this.targetAmplitude === 0) {
            this.completeReset();
          }
        }
      }

      private generateWavePoints(
        frequencies: WaveComponent[],
        timeDirection = 1,
        verticalFlip = 1,
      ) {
        const points: { x: number; y: number }[] = [];
        const step = this.width / this.points;

        for (let i = 0; i <= this.points; i++) {
          const x = i * step;
          let y = this.centerY;

          frequencies.forEach((component) => {
            const waveValue = Math.sin(
              x * component.freq +
                this.time * this.speed * timeDirection +
                component.phase,
            );
            y +=
              waveValue *
              component.amp *
              this.amplitudeMultiplier *
              verticalFlip;
          });

          points.push({ x, y });
        }

        return points;
      }

      private createPathData(points: { x: number; y: number }[]) {
        if (points.length === 0) {
          return "";
        }

        let pathData = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length - 1; i++) {
          const current = points[i];
          const next = points[i + 1];
          const controlX = (current.x + next.x) / 2;
          const controlY = (current.y + next.y) / 2;
          pathData += ` Q ${current.x} ${current.y} ${controlX} ${controlY}`;
        }

        const lastPoint = points[points.length - 1];
        pathData += ` T ${lastPoint.x} ${lastPoint.y}`;
        return pathData;
      }

      private readonly animate = () => {
        if (this.isStarting) {
          this.updateStartup();
        } else {
          this.updateTransition();
        }

        const points1 = this.generateWavePoints(this.frequencies1, 1, 1);
        this.path1.setAttribute("d", this.createPathData(points1));

        const points2 = this.generateWavePoints(this.frequencies2, -1, -1);
        this.path2.setAttribute("d", this.createPathData(points2));

        if (
          this.isPlaying ||
          this.isTransitioning ||
          this.isStarting ||
          this.isResetting
        ) {
          this.time += 1;

          this.frequencies1.forEach((component, index) => {
            const timeScale =
              (this.time + this.evolutionOffset) * 0.001 * this.evolutionSpeed;

            const baseFreqs = [0.025, 0.035, 0.045];
            const freqVariation = [0.008, 0.012, 0.015];
            component.freq =
              baseFreqs[index] +
              Math.sin(timeScale + index + this.evolutionOffset * 0.001) *
                freqVariation[index];

            const baseAmps = [35, 20, 12];
            const ampVariation = [15, 10, 6];
            component.amp =
              baseAmps[index] +
              Math.sin(
                timeScale * 1.3 + index * 2 + this.evolutionOffset * 0.002,
              ) *
                ampVariation[index];

            component.phase +=
              0.002 +
              Math.sin(timeScale * 0.5 + this.evolutionOffset * 0.001) * 0.001;
          });

          this.frequencies2.forEach((component, index) => {
            const timeScale =
              (this.time + this.evolutionOffset) * 0.0015 * this.evolutionSpeed;

            const baseFreqs = [0.03, 0.05];
            const freqVariation = [0.01, 0.018];
            component.freq =
              baseFreqs[index] +
              Math.sin(
                timeScale + index * 1.5 + this.evolutionOffset * 0.0015,
              ) *
                freqVariation[index];

            const baseAmps = [25, 15];
            const ampVariation = [10, 8];
            component.amp =
              baseAmps[index] +
              Math.sin(
                timeScale * 1.1 + index * 2.5 + this.evolutionOffset * 0.0025,
              ) *
                ampVariation[index];

            component.phase +=
              0.0025 +
              Math.sin(timeScale * 0.7 + this.evolutionOffset * 0.0012) *
                0.0015;
          });

          if (this.time > 10000) {
            this.time = 0;
          }
        }

        this.animationFrameId = window.requestAnimationFrame(this.animate);
      };
    }

    buildSongs();
    prevButton.addEventListener("click", handlePrevClick);
    nextButton.addEventListener("click", handleNextClick);
    updateSongDisplay();

    const animator = new SoundwaveAnimator({
      content: contentEl,
      path1,
      path2,
      toggleBtn,
      prevBtn: prevButton,
      nextBtn: nextButton,
    });

    return () => {
      clearScheduled();
      window.removeEventListener("resize", updateWindowWidth);
      prevButton.removeEventListener("click", handlePrevClick);
      nextButton.removeEventListener("click", handleNextClick);
      animator.destroy();
      resetSongs();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="carsound-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container">
        <div className="content">
          <img
            className="mask"
            src="https://cdn.prod.website-files.com/65cceef869e5a56037c32801/67d4c3ba81f0a6597ed995d9_Frame%201597881860.png"
            alt=""
          />
          <div className="interface">
            <div className="border">
              <svg
                viewBox="0 0 1142 413"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M302.95 1.04395C343.954 -0.743126 380.177 2.16423 414.743 5.55078C449.302 8.93654 482.226 12.8037 516.583 12.9229C585.208 13.1607 549.752 12.924 570.925 12.9248C592.096 12.9256 556.641 13.1646 625.266 12.9268C659.623 12.8077 692.547 8.94045 727.105 5.55469C761.672 2.16814 797.894 -0.739203 838.898 1.04785C861.58 2.03639 880.856 2.74701 897.407 3.45801C948.152 5.63786 973.54 7.83273 995.122 18.0283C1016.52 28.1347 1034.2 46.1113 1069.07 79.9238L1069.95 80.7744C1109.16 118.792 1128.93 137.979 1136.93 163.931C1140.92 176.902 1141.98 191.593 1141.01 211.217C1140.04 230.844 1137.04 255.369 1132.92 288.003C1125.9 343.754 1115.54 375.141 1098.06 392.346C1080.6 409.523 1055.94 412.667 1019.94 411.562C980.188 410.341 941.098 409.302 897.438 408.468C879.548 408.126 856.765 401.934 832.304 395.451C807.877 388.978 781.812 382.226 757.458 380.834C691.442 377.061 631.609 377.06 570.92 377.062H570.719C490.198 377.064 469.346 377.064 384.407 380.842C360.053 381.925 333.443 388.643 308.745 395.135C284.007 401.637 261.228 407.899 244.422 408.143C189.489 408.939 152.287 409.83 138.901 410.562C93.1348 413.062 64.2264 410.158 44.9658 392.874C35.3356 384.232 28.078 371.959 22.3506 354.861C16.622 337.76 12.4341 315.861 8.9248 287.999C4.8145 255.365 1.81085 230.84 0.837891 211.213C-0.134857 191.589 0.924723 176.899 4.9209 163.927C12.9159 137.975 32.6856 118.788 71.8994 80.7705L72.7764 79.9199C107.652 46.1074 125.333 28.1309 146.727 18.0244C159.697 11.8969 174.054 8.65644 194.479 6.57422C208.025 5.1934 224.226 4.32282 244.45 3.4541C261 2.74323 280.272 2.03231 302.95 1.04395Z"
                  stroke="white"
                />
              </svg>
            </div>
            <div className="songs-wrapper">
              <div className="song-waves">
                <svg className="soundwave" viewBox="0 0 800 200">
                  <line
                    x1="0"
                    y1="100"
                    x2="800"
                    y2="100"
                    className="center-line"
                  />
                  <path
                    id="wavePath1"
                    className="wave-path primary starting"
                    d=""
                  />
                </svg>
                <svg className="soundwave" viewBox="0 0 800 200">
                  <line
                    x1="0"
                    y1="100"
                    x2="800"
                    y2="100"
                    className="center-line"
                  />
                  <path
                    id="wavePath2"
                    className="wave-path secondary starting"
                    d=""
                  />
                </svg>
              </div>
              <div className="songs"></div>
              <div className="songs-ui">
                <div className="song-info">
                  <h1 className="song-title">Song Title</h1>
                  <h3 className="song-artist">Artist Name</h3>
                </div>
                <div className="songs-controls">
                  <svg
                    className="prev"
                    height="100%"
                    viewBox="0 0 27 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.32661 7.15252L16.3364 17.3038C16.5828 17.5537 16.4058 17.9767 16.0549 17.9767H12.553C12.3414 17.9767 12.1386 17.8919 11.99 17.7412L1.54883 7.15252C1.2447 6.8441 1.24533 6.34839 1.55024 6.04075L6.31408 1.2341C6.46256 1.08428 6.66475 1 6.87568 1H10.3754C10.7268 1 10.9036 1.42409 10.6562 1.67365L6.32802 6.04075C6.02311 6.34839 6.02248 6.8441 6.32661 7.15252Z"
                      fill="white"
                    />
                    <path
                      d="M16.3266 7.15252L26.3364 17.3038C26.5828 17.5537 26.4058 17.9767 26.0549 17.9767H22.553C22.3414 17.9767 22.1386 17.8919 21.99 17.7412L11.5488 7.15252C11.2447 6.8441 11.2453 6.34839 11.5502 6.04075L16.3141 1.2341C16.4626 1.08428 16.6648 1 16.8757 1H20.3754C20.7268 1 20.9036 1.42409 20.6562 1.67365L16.328 6.04075C16.0231 6.34839 16.0225 6.8441 16.3266 7.15252Z"
                      fill="white"
                    />
                  </svg>
                  <button
                    id="toggleBtn"
                    className="button toggle-button starting"
                  >
                    <svg
                      className="play-icon"
                      width="100%"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 6.26786C14.333 7.03786 14.333 8.96186 13 9.73186L4 14.9279C2.667 15.6979 1 14.7359 1 13.1959V2.80386C1 1.26386 2.667 0.301858 4 1.07186L13 6.26786Z"
                        fill="white"
                      />
                    </svg>
                    <svg
                      className="pause-icon"
                      width="100%"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4C1 2.586 1 1.879 1.44 1.44C1.878 1 2.585 1 4 1C5.415 1 6.121 1 6.56 1.44C7 1.878 7 2.585 7 4V14C7 15.414 7 16.121 6.56 16.56C6.122 17 5.415 17 4 17C2.585 17 1.879 17 1.44 16.56C1 16.122 1 15.415 1 14V4ZM11 4C11 2.586 11 1.879 11.44 1.44C11.878 1 12.585 1 14 1C15.415 1 16.121 1 16.56 1.44C17 1.878 17 2.585 17 4V14C17 15.414 17 16.121 16.56 16.56C16.121 17 15.414 17 14 17C12.586 17 11.879 17 11.44 16.56C11 16.122 11 15.415 11 14V4Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                  <svg
                    className="next"
                    height="100%"
                    viewBox="0 0 27 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.6734 7.15252L10.6636 17.3038C10.4172 17.5537 10.5942 17.9767 10.9451 17.9767H14.447C14.6586 17.9767 14.8614 17.8919 15.01 17.7412L25.4512 7.15252C25.7553 6.8441 25.7547 6.34839 25.4498 6.04075L20.6859 1.2341C20.5374 1.08428 20.3352 1 20.1243 1H16.6246C16.2732 1 16.0964 1.42409 16.3438 1.67365L20.672 6.04075C20.9769 6.34839 20.9775 6.8441 20.6734 7.15252Z"
                      fill="white"
                    />
                    <path
                      d="M10.6734 7.15252L0.663557 17.3038C0.417193 17.5537 0.594185 17.9767 0.945067 17.9767H4.44701C4.65864 17.9767 4.86143 17.8919 5.01002 17.7412L15.4512 7.15252C15.7553 6.8441 15.7547 6.34839 15.4498 6.04075L10.6859 1.2341C10.5374 1.08428 10.3352 1 10.1243 1H6.62458C6.27321 1 6.09644 1.42409 6.34378 1.67365L10.672 6.04075C10.9769 6.34839 10.9775 6.8441 10.6734 7.15252Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="nav">
              <a>Climate</a>
              <a>Overview</a>
              <a style={{ color: "#fff" }}>Audio</a>
            </div>

            <div className="gradient-blurs">
              <div className="gradient-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="gradient-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

            <div className="overlay-ambience"></div>
            <div className="bg-ambience"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
