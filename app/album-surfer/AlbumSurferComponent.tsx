"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function AlbumSurferComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const data = [
      {
        name: "C4",
        cover:
          "https://upload.wikimedia.org/wikipedia/en/e/e5/C4_Mixtape_Kendrick_Lamar_Cover.jpg",
        songs: [
          ["Intro", "Lil Wayne", "0:22"],
          ["Best Rapper Under 25", "", "3:15"],
          ["Mr. Carter 2", "Lil Wayne", "4:12"],
          ["A Milli", "", "3:13"],
          ["Bitch I'm In The Club", "", "2:38"],
          ["West Coast Wu-Tang", "", "4:22"],
          ["Phone Home", "", "2:51"],
          ["Compton Chemistry", "", "2:22"],
          ["Take Off Your Pants", "", "3:40"],
          ["Shot Down", "", "4:23"],
          ["Play With Fire", "", "4:27"],
          ["Friend Of Mine", "", "5:05"],
          ["Still Hustlin", "", "4:25"],
          ["Welcome to C4", "", "6:41"],
          ["G Code", "", "4:01"],
          ["Famous Pipe Game", "", "3:10"],
          ["Kendrick Lamar - Misunderstood", "Jay Rock", "4:44"],
          ["Young & Black", "", "3:22"],
        ],
      },
      {
        name: "Kendrick Lamar EP",
        cover:
          "https://cdn.prod.website-files.com/644984ab394fe3e02d5f40d2/67a9913909cce8ccc8d3e558_image%208.png",
        songs: [
          ["Intro", "", "3:11"],
          ["Is It Love", "", "2:58"],
          ["Celebration", "", "3:50"],
          ["I Am (Interlude)", "", "1:19"],
          ["Wanna Be Heard", "", "4:37"],
          ["I Do This", "Jay Rock", "4:08"],
          ["Faith", "Punch", "4:51"],
          ["Trip", "", "3:50"],
          ["Vanity Slaves", "", "4:14"],
          ["Far From Here", "Schoolboy Q", "3:53"],
          ["Thanksgiving", "Big Pooh", "3:39"],
          ["Let Me Be Me", "", "7:19"],
          ["Determined", "", "4:30"],
        ],
      },
      {
        name: "Overly Dedicated",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/b9/e6/e9/b9e6e9e7-6802-cf32-1be7-f668df1ee20d/888915295939_cover.jpg/632x632bb.webp",
        songs: [
          ["Growing Apart (To Get Closer)", "Jhené Aiko", "3:40"],
          ["Ignorance Is Bliss", "", "3:30"],
          ["P&P 1.5", "Ab-Soul", "6:01"],
          ["Alien Girl (Today W/ Her)", "", "3:59"],
          ["Opposites Attract (Tomorrow W/O Her)", "Javonte", "4:31"],
          ["Michael Jordan", "Schoolboy Q", "5:50"],
          ["R.O.T.C (Interlude)", "BJ the Chicago Kid", "2:43"],
          ["Barbed Wire", "Ash Riser", "4:25"],
          ["Average Joe", "", "4:16"],
          ["H.O.C", "", "5:16"],
          ["Cut You Off (To Grow Closer)", "", "6:04"],
          ["She Needs Me (Remix)", "DOM KENNEDY & Murs", "3:15"],
        ],
      },
      {
        name: "Section.80",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/d7/d3/37/d7d33750-6d28-6e73-4913-7139ebd80906/888915968772_cover.jpg/632x632bb.webp",
        songs: [
          ["Fuck Your Ethnicity", "", "3:44"],
          ["Hol' Up", "", "2:53"],
          ["A.D.H.D", "", "3:35"],
          ["No Make-Up (Her Vice)", "Colin Munroe", "3:55"],
          ["Tammy's Song (Her Evils)", "", "2:41"],
          ["Chapter Six", "", "2:41"],
          ["Ronald Reagan Era", "", "3:36"],
          ["Poe Mans Dreams (His Vice)", "GLC", "4:21"],
          ["Chapter Ten", "", "1:15"],
          ["Keisha's Song (Her Pain)", "Ashtro Bot", "3:47"],
          ["Rigamortus", "", "2:48"],
          ["Kush & Corinthians", "BJ the Chicago Kid", "5:04"],
          ["Blow My High (Members Only)", "", "3:35"],
          ["Ab-Souls Outro", "Ab-Soul", "5:50"],
          ["HiiiPower", "", "4:35"],
        ],
      },
      {
        name: "good kid, m.A.A.d city",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ca/5b/c0/ca5bc0b3-d81d-cc6c-0d19-54b9eedb6dbd/12UMGIM52990.rgb.jpg/632x632bb.webp",
        songs: [
          ["Sherane a.k.a Master Splinter's Daughter", "", "4:33"],
          ["Bitch, Don't Kill My Vibe", "", "5:10"],
          ["Backseat Freestyle", "", "3:32"],
          ["The Art of Peer Pressure", "", "5:24"],
          ["Money Trees", "Jay Rock", "6:26"],
          ["Poetic Justice", "Drake", "5:00"],
          ["Good Kid", "", "3:34"],
          ["m.A.A.d city", "MC Eiht", "5:50"],
          ["Swimming Pools (Drank)", "", "5:13"],
          ["Sing About Me, I'm Dying of Thirst", "", "12:03"],
          ["Real", "Anna Wise", "7:23"],
          ["Compton", "Dr. Dre", "4:08"],
        ],
      },
      {
        name: "To Pimp A Butterfly",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0d/ae/61/0dae6140-d4af-d0df-eae0-3c92eb392a33/15UMGIM11922.rgb.jpg/632x632bb.webp",
        songs: [
          ["Wesley's Theory", "George Clinton & Thundercat", "4:47"],
          ["For Free? (Interlude)", "", "2:10"],
          ["King Kunta", "", "3:54"],
          ["Institutionalized", "Bilal, Anna Wise & Snoop Dogg", "4:31"],
          ["These Walls", "Bilal, Anna wise & Thundercat", "5:00"],
          ["u", "", "4:28"],
          ["Alright", "", "3:39"],
          ["For Sale? (Interlude)", "", "4:51"],
          ["Momma", "", "4:43"],
          ["Hood Politics", "", "4:52"],
          ["How Much a Dollar Cost", "James Fauntleroy & Ronald Isley", "4:21"],
          ["Complexion (A Zulu Love)", "Rapsody", "4:23"],
          ["The Blacker the Berry", "", "5:28"],
          ["You Ain't Gotta Lie (Momma Said)", "", "4:01"],
          ["i", "", "5:36"],
          ["Mortal Man", "", "12:07"],
        ],
      },
      {
        name: "untitled unmastered.",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/93/89/2e/93892e3d-6471-64eb-ee80-c42b95b53d29/16UMGIM10770.rgb.jpg/632x632bb.webp",
        songs: [
          ["untitled 01 | 08.19.2014", "", "4:07"],
          ["untitled 02 | 06.23.2014", "", "4:18"],
          ["untitled 03 | 05.28.2013", "", "2:34"],
          ["untitled 04 | 08.14.2014", "", "1:50"],
          ["untitled 05 | 09.21.2014", "", "5:38"],
          ["untitled 06 | 06.30.2014", "", "3:28"],
          ["untitled 07 | 2014 - 2016", "", "8:16"],
          ["untitled 08 | 09.06.2014", "", "3:55"],
        ],
      },
      {
        name: "DAMN.",
        cover:
          "https://preview.redd.it/nd05tk0tpwc01.jpg?width=640&crop=smart&auto=webp&s=6b969f0cdc548c0a802dd3b1cd2b1556515d5c14",
        songs: [
          ["BLOOD.", "", "1:58"],
          ["DNA.", "", "3:05"],
          ["YAH.", "", "2:40"],
          ["ELEMENT.", "", "3:28"],
          ["FEEL.", "", "3:34"],
          ["LOYALTY.", "Rihanna", "3:47"],
          ["PRIDE.", "", "4:35"],
          ["HUMBLE.", "", "2:57"],
          ["LUST.", "", "5:07"],
          ["LOVE.", "Zacari", "3:33"],
          ["XXX.", "U2", "4:14"],
          ["FEAR.", "", "7:40"],
          ["GOD.", "", "4:08"],
          ["DUCKWORTH.", "", "4:08"],
        ],
      },
      {
        name: "Black Panther: The Album",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0f/7c/f9/0f7cf9a6-651f-53ae-e374-6be14630bfae/18UMGIM00001.rgb.jpg/632x632bb.webp",
        songs: [
          ["Black Panther", "", "2:10"],
          ["All The Stars", "Kendrick Lamar & SZA", "3:52"],
          ["X", "Schoolboy Q, 2 Chainz & Saudi", "4:27"],
          ["The Ways", "Khalid & Swae Lee", "3:58"],
          ["Opps", "Vince Staples & Yugen Blakrok", "3:00"],
          ["I Am", "Jorja Smith", "3:28"],
          ["Paramedic!", "SOX X RBE", "3:29"],
          ["Bloody Waters", "Ab-Soul, James Blake & Anderson Paak", "4:32"],
          [
            "King's Dead",
            "Jay Rock, Kendrick Lamar, Future & James Blake",
            "3:45",
          ],
          ["Redemption Interlude", "Zacari", "1:25"],
          ["Redemption", "Zacari & Babes Wodumo", "3:42"],
          ["Seasons", "Mozzy, Sjava & REASON", "4:02"],
          ["Big Shot", "Kendrick Lamar & Travis Scott", "3:41"],
          ["Pray For Me", "Kendrick Lamar & The Weeknd", "3:31"],
        ],
      },
      {
        name: "Mr. Morale & The Big Steppers",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/72/a1/a9/72a1a9a0-6c42-a37f-aad4-7e8772365c6d/22UMGIM52376.rgb.jpg/632x632bb.webp",
        songs: [
          ["United In Grief", "", "4:15"],
          ["N95", "", "3:15"],
          ["Worldwide Steppers", "", "3:23"],
          ["Die Hard", "Blxst & Amanda Reifer", "3:59"],
          ["Father Time", "Sampha", "3:42"],
          ["Rich (Interlude)", "", "1:43"],
          ["Rich Spirit", "", "3:22"],
          ["We Cry Together", "Taylour Paige", "5:41"],
          ["Purple Hearts", "Summer Walker & Ghostface Killah", "5:29"],
          ["Count Me Out", "", "4:43"],
          ["Crown", "", "4:24"],
          ["Silent Hill", "Kodak Black", "3:40"],
          ["Savior (interlude)", "", "2:32"],
          ["Savior", "Baby Keem & Sam Dew", "3:44"],
          ["Auntie Diaries", "", "4:41"],
          ["Mr. Morale", "Tanna Leone", "3:30"],
          ["Mother I Sober", "Beth Gibbons", "6:46"],
          ["Mirror", "", "4:16"],
        ],
      },
      {
        name: "GNX",
        cover:
          "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/50/c2/cc/50c2cc95-3658-9417-0d4b-831abde44ba1/24UM1IM28978.rgb.jpg/632x632bb.webp",
        songs: [
          ["wacced out murals", "", "5:17"],
          ["squabble up", "", "2:37"],
          ["luther", "SZA", "2:57"],
          ["man at the garden", "", "3:53"],
          ["hey now", "Dody6", "3:37"],
          ["reincarnated", "", "4:35"],
          ["tv off", "Lefty Gunplay", "3:40"],
          ["dodger blue", "Wallie the Sensei, Siete7x & Roddy Ricch", "2:11"],
          ["peekaboo", "AzChike", "2:35"],
          ["heart pt. 6", "", "4:52"],
          ["gnx", "Hitta J3, YoungThreat & Peysoh", "3:13"],
          ["gloria", "SZA", "4:47"],
        ],
      },
    ];

    const imageContainer = root.querySelector(
      ".image-container",
    ) as HTMLDivElement | null;
    const albumsContainer = root.querySelector(
      ".albums-container",
    ) as HTMLDivElement | null;
    const albumsWrapper = root.querySelector(
      ".albums-wrapper",
    ) as HTMLDivElement | null;

    if (!imageContainer || !albumsContainer || !albumsWrapper) {
      return;
    }

    const imageContainerEl = imageContainer;
    const albumsContainerEl = albumsContainer;
    const albumsWrapperEl = albumsWrapper;

    const timeouts: number[] = [];
    const albumTops: number[] = [];
    const images: HTMLDivElement[] = [];
    const albums: HTMLDivElement[] = [];

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const scheduleTimeout = (fn: () => void, delayMs: number) => {
      const timeoutId = window.setTimeout(() => {
        fn();
        const index = timeouts.indexOf(timeoutId);
        if (index !== -1) {
          timeouts.splice(index, 1);
        }
      }, delayMs);
      timeouts.push(timeoutId);
      return timeoutId;
    };

    data.forEach((item) => {
      const div = document.createElement("div");
      const cover = document.createElement("img");
      cover.classList.add("cover");
      cover.src = item.cover;
      cover.alt = item.name;
      div.appendChild(cover);
      imageContainerEl.appendChild(div);
      images.push(div);

      const album = document.createElement("div");
      album.classList.add("album");
      const albumTitle = document.createElement("h2");
      albumTitle.innerHTML = item.name;
      album.appendChild(albumTitle);
      item.songs.forEach((track, n) => {
        const song = document.createElement("div");
        song.classList.add("song");
        const songName = document.createElement("p");
        songName.innerHTML = `<span>${n + 1}</span>${track[0]}&ensp;<span>${
          track[1]
        }</span>`;
        song.appendChild(songName);
        const songTime = document.createElement("p");
        songTime.innerHTML = track[2];
        song.appendChild(songTime);
        album.appendChild(song);
      });
      albumsWrapperEl.appendChild(album);
      albums.push(album);
      albumTops.push(album.offsetTop);
    });

    const imageContainerHeight =
      imageContainerEl.getBoundingClientRect().height;
    const maxWidth = 25;
    let activeIndex = 0;
    let isHovering = false;
    let mouseMoveTimeout: number | undefined;
    let rafId: number | undefined;
    let isDisposed = false;

    function animateImages(input: number) {
      const { finalWeights: widths, maxWeightIndex } = generateNumbers(input);
      activeIndex = maxWeightIndex;

      albumsContainerEl.scrollTo({
        top: albumTops[activeIndex],
        left: 0,
        behavior: "smooth",
      });
      for (let i = 0; i < data.length; i++) {
        const image = images[i];
        const height = widths[i];

        image.style.opacity = "1";
        image.style.height = `${
          ((imageContainerHeight / (data.length - 1)) * height) / 10
        }px`;
        image.style.filter = "saturate(1)";
      }
    }

    const handleMouseEnter = () => {
      isHovering = true;
      albumsContainerEl.style.width = "80%";
      for (let i = 0; i < data.length; i++) {
        const image = images[i];
        image.style.transition = "height 0.1s ease";
        scheduleTimeout(() => {
          image.style.transition = "0s";
        }, 100);
      }
    };

    let lastMouseY = 0;
    let speed = 0;
    let lastMouseMoveTime = Date.now();

    const handleMouseMove = (event: MouseEvent) => {
      if (!isHovering) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastMouseMoveTime;
      speed = (event.clientY - lastMouseY) / timeDiff;

      lastMouseY = event.clientY;
      lastMouseMoveTime = currentTime;

      if (mouseMoveTimeout !== undefined) {
        window.clearTimeout(mouseMoveTimeout);
      }
      mouseMoveTimeout = window.setTimeout(() => {
        speed = 0;
        mouseMoveTimeout = undefined;
      }, 100);

      const cursorPercentage =
        (event.clientY - imageContainerEl.getBoundingClientRect().top) /
        imageContainerHeight;

      animateImages(easeTiles(cursorPercentage));
    };

    let previousActiveIndex = 0;
    let isTimerRunning = false;

    function animateBlurGap() {
      if (isDisposed) {
        return;
      }
      const transform = `scaleY(${(Math.abs(speed) + 1) * 1}) rotateX(${
        (speed > 0.5 ? 0.5 : speed < -0.5 ? -0.5 : speed) * 180
      }deg)`;
      if (activeIndex !== previousActiveIndex) {
        isTimerRunning = false;
        albumsContainerEl.style.transform = transform;
        albumsContainerEl.style.filter = `blur(${Math.abs(speed) * 10}px)`;
        previousActiveIndex = activeIndex;
      } else if (!isTimerRunning) {
        albumsContainerEl.style.transform = transform;
        albumsContainerEl.style.filter = `blur(${Math.abs(speed) * 10}px)`;
        scheduleTimeout(() => {
          if (isDisposed) {
            return;
          }
          imageContainerEl.style.filter = "";
          albumsContainerEl.style.filter = "";
          albumsContainerEl.style.transform = `scaleY(1) rotateX(0deg)`;
          isTimerRunning = true;
        }, 600);
      }
      //imageContainer.style.filter = `saturate(1) blur(${Math.abs(speed) * 4}px)`;

      rafId = window.requestAnimationFrame(animateBlurGap);
    }

    rafId = window.requestAnimationFrame(animateBlurGap);

    const handleMouseLeave = () => {
      isHovering = false;
      albumsContainerEl.style.width = "90%";
      for (let i = 0; i < data.length; i++) {
        const image = images[i];
        image.style.transition = "height 0.1s ease";
        scheduleTimeout(() => {
          image.style.transition = "0s";
        }, 100);
      }

      equalizeSizes();
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        image.style.opacity = "0.3";
        image.style.filter = "saturate(0)";
        const album = albums[i];
        album.style.gap = `0px`;
      }
      images[activeIndex].style.opacity = "1";
      images[activeIndex].style.filter = "saturate(1)";
    };

    function equalizeSizes() {
      for (let i = 0; i < data.length; i++) {
        const image = images[i];

        image.style.height = `${imageContainerHeight / data.length}px`;
      }
    }

    function generateNumbers(percentage: number, maxWeight = maxWidth) {
      const totalSum = 100; // The target total sum
      const numberOfElements = data.length; // Total elements in the array
      const midPoint = percentage * (numberOfElements - 1); // The "center" based on the percentage

      // Calculate preliminary weights based on proximity to the midpoint
      const rawWeights = Array.from({ length: numberOfElements }, (_, i) => {
        const distance = Math.abs(i - midPoint);
        return 1 / (distance + 1); // Closer indices have higher weights
      });

      // Normalize preliminary weights to get their relative contributions
      const rawWeightSum = rawWeights.reduce((sum, weight) => sum + weight, 0);
      const normalizedWeights = rawWeights.map(
        (weight) => weight / rawWeightSum,
      );

      // Apply the max weight constraint
      const scaledWeights = normalizedWeights.map((weight) =>
        Math.min(weight * totalSum, maxWeight),
      );
      const scaledWeightSum = scaledWeights.reduce(
        (sum, weight) => sum + weight,
        0,
      );

      // Redistribute excess/remaining weight proportionally
      const redistributionFactor =
        (totalSum - scaledWeightSum) / scaledWeightSum;
      const finalWeights = scaledWeights.map(
        (weight) => weight + weight * redistributionFactor,
      );

      const maxWeightIndex = scaledWeights.indexOf(Math.max(...scaledWeights));

      return { finalWeights, maxWeightIndex };
    }

    //easing

    function easeTiles(t: number) {
      t /= 0.5;
      if (t < 1) return 0.5 * Math.pow(t, 3);
      t -= 2;
      return 0.5 * (Math.pow(t, 3) + 2);
    }

    equalizeSizes();

    //change active album on scroll

    const handleScroll = () => {
      if (isHovering) return;
      const scrollPosition = albumsContainerEl.scrollTop;
      const activeIndex = albumTops.findIndex(
        (top) => top > scrollPosition - 500,
      );
      if (activeIndex === -1) return;
      for (let i = 0; i < images.length; i++) {
        images[i].style.opacity = "0.3";
        images[i].style.filter = "saturate(0)";
        albums[i].style.gap = `0px`;
      }
      images[activeIndex].style.opacity = "1";
      images[activeIndex].style.filter = "saturate(1)";
    };

    imageContainerEl.addEventListener("mouseenter", handleMouseEnter);
    imageContainerEl.addEventListener("mousemove", handleMouseMove);
    imageContainerEl.addEventListener("mouseleave", handleMouseLeave);
    albumsContainerEl.addEventListener("scroll", handleScroll);

    return () => {
      isDisposed = true;

      imageContainerEl.removeEventListener("mouseenter", handleMouseEnter);
      imageContainerEl.removeEventListener("mousemove", handleMouseMove);
      imageContainerEl.removeEventListener("mouseleave", handleMouseLeave);
      albumsContainerEl.removeEventListener("scroll", handleScroll);

      if (rafId !== undefined) {
        window.cancelAnimationFrame(rafId);
      }
      if (mouseMoveTimeout !== undefined) {
        window.clearTimeout(mouseMoveTimeout);
      }
      clearScheduled();

      imageContainerEl.style.filter = "";
      albumsContainerEl.style.filter = "";
      albumsContainerEl.style.transform = "";
      albumsContainerEl.style.width = "";

      imageContainerEl.replaceChildren();
      albumsWrapperEl.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="albumsurfer-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* <h1 className="artist-name">Kendrick Lamar</h1> */}
      <div className="modal">
        <div className="image-container"></div>
        <div className="albums-container">
          <div className="albums-wrapper"></div>
        </div>
      </div>
    </div>
  );
}
