"use client";

import { useEffect, useRef } from "react";
import "./style.css";

export default function CarTemperatureComponent() {
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

    const mask = root.querySelector(".mask") as HTMLImageElement | null;
    const car = root.querySelector(".car") as HTMLDivElement | null;
    const carSvg = root.querySelector(".car > svg") as SVGSVGElement | null;
    const container = root.querySelector(".container") as HTMLDivElement | null;
    const tempMarker = root.querySelector(
      ".temp-marker",
    ) as HTMLDivElement | null;
    const tempSlider = root.querySelector(".temp") as HTMLInputElement | null;
    const maskWrapper = root.querySelector(
      ".slider-mask-wrapper",
    ) as HTMLDivElement | null;
    const sliderMask = root.querySelector(
      ".slider-mask",
    ) as HTMLDivElement | null;
    const carGradient = root.querySelector(
      ".car-gradient",
    ) as HTMLDivElement | null;
    const fanMarker = root.querySelector(
      ".fan-marker",
    ) as HTMLDivElement | null;
    const fanSlider = root.querySelector(".fan") as HTMLInputElement | null;
    const carOutline = root.querySelectorAll(".car > svg")[0] as
      | SVGSVGElement
      | undefined;
    const tempNumber = root.querySelectorAll(
      ".temp-wrapper > *",
    ) as NodeListOf<HTMLDivElement>;
    const fanSetting = root.querySelector(
      ".fan-setting h1",
    ) as HTMLHeadingElement | null;

    if (
      !mask ||
      !car ||
      !carSvg ||
      !container ||
      !tempMarker ||
      !tempSlider ||
      !maskWrapper ||
      !sliderMask ||
      !carGradient ||
      !fanMarker ||
      !fanSlider ||
      !carOutline ||
      !fanSetting
    ) {
      return;
    }

    const rootEl = root;
    const maskEl = mask;
    const carEl = car;
    const containerEl = container;
    const tempSliderEl = tempSlider;
    const maskWrapperEl = maskWrapper;
    const fanSliderEl = fanSlider;
    const fanSettingEl = fanSetting;
    const tempNumberEl = tempNumber;

    const svgBlur = carSvg.cloneNode(true) as SVGSVGElement;
    svgBlur.classList.replace("_1", "blur");
    carEl.appendChild(svgBlur);

    const blurPaths = svgBlur.querySelectorAll(
      "path",
    ) as NodeListOf<SVGPathElement>;

    const timeouts: number[] = [];
    const color1 = [129, 238, 255];
    const color2 = [220, 220, 220];
    const color3 = [255, 154, 131];
    const temp1 = 14;
    const temp2 = 28;
    let temp = 500;
    let fan = 500;

    const clearScheduled = () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.length = 0;
    };

    const resetState = () => {
      containerEl.classList.remove("temp-active", "fan-active");
      document.documentElement.style.setProperty(
        "--test",
        "calc(var(--window-width) * 0.002)",
      );
      if (maskEl) {
        maskEl.style.filter = "";
      }
      if (maskWrapperEl) {
        maskWrapperEl.style.marginLeft = "-100%";
      }
      if (fanSettingEl) {
        fanSettingEl.innerHTML = "lo";
      }
    };

    function updateTemp(val: number) {
      const temp = temp1 + (val / 1000) * (temp2 - temp1);
      const degrees = 0 + (1 + (val / 1000) * 178);
      const tempBorder = rootEl.querySelector(
        ".temp-border",
      ) as HTMLDivElement | null;
      const tempBorderSvg = rootEl.querySelector(
        ".temp-border svg",
      ) as SVGSVGElement | null;
      const tempBg = rootEl.querySelector(".temp-bg") as HTMLDivElement | null;

      if (!tempBorder || !tempBorderSvg || !tempBg) {
        return;
      }

      tempBorder.style.transform = `rotateZ(${degrees}deg) scaleX(-1)`;
      tempBorderSvg.style.transform = `rotateZ(${degrees}deg) scaleX(-1)`;
      tempBg.style.transform = `rotateZ(${degrees}deg) scaleX(-1)`;

      const tempCircles = rootEl.querySelectorAll(".temp-bg g");
      tempCircles.forEach((item, i) => {
        const progress = (temp - temp1) / (temp2 - temp1);
        const activeIndex = Math.round(
          (1 - progress) * (tempCircles.length - 1),
        );
        const distance = Math.abs(i - activeIndex);
        const maxDistance = tempCircles.length / 4;
        const scale = 5 - (distance / maxDistance) * 4;
        const itemCircles = item.querySelectorAll("circle");
        itemCircles.forEach((circle, j) => {
          const scaled = scale * (0 + j * 0.3);
          circle.style.transform = `scale(${scaled > 1 ? scaled : 1})`;
        });
      });

      tempNumberEl[0].innerHTML = temp.toFixed(1).slice(0, 2);
      tempNumberEl[1].innerHTML = `.${temp.toFixed(1).slice(-1)}`;
      maskWrapperEl.style.marginLeft = `${val * 0.2 - 100}%`;
      if (val < 500) {
        const progress = Math.min((val - 0) / (500 - 0), 1);
        const rgba = `rgba(${color1[0] - (color1[0] - color2[0]) * progress},${color1[1] - (color1[1] - color2[1]) * progress},${color1[2] - (color1[2] - color2[2]) * progress},1)`;
        rootEl.style.setProperty("--temp-color", rgba);
        maskEl.style.filter = `saturate(${1 - progress}) hue-rotate(-40deg)`;
      } else {
        const progress = Math.min((val - 500) / (1000 - 500), 1);
        const rgba = `rgba(${color2[0] - (color2[0] - color3[0]) * progress},${color2[1] - (color2[1] - color3[1]) * progress},${color2[2] - (color2[2] - color3[2]) * progress},1)`;
        rootEl.style.setProperty("--temp-color", rgba);
        maskEl.style.filter = `saturate(${progress}) hue-rotate(140deg)`;
      }
    }

    function updateFan(val: number) {
      const degrees = 0 + (0 + (val / 1000) * 180);
      const fanBorder = rootEl.querySelector(
        ".fan-border",
      ) as HTMLDivElement | null;
      const fanBorderSvg = rootEl.querySelector(
        ".fan-border svg",
      ) as SVGSVGElement | null;
      const fanBg = rootEl.querySelector(".fan-bg") as HTMLDivElement | null;

      if (!fanBorder || !fanBorderSvg || !fanBg) {
        return;
      }

      fanBorder.style.transform = `rotateZ(${-degrees}deg) scaleX(-1)`;
      fanBorderSvg.style.transform = `rotateZ(${-degrees}deg) scaleX(-1)`;
      fanBg.style.transform = `rotateZ(${-degrees}deg) scaleX(1) translateX(-100%)`;

      const fanCircles = rootEl.querySelectorAll(".fan-bg g");
      fanCircles.forEach((item, i) => {
        const progress = 1 - val / 1000;
        const activeIndex = Math.round(progress * (fanCircles.length - 1));
        const distance = Math.abs(i - activeIndex);
        const maxDistance = fanCircles.length / 4;
        const scale = 5 - (distance / maxDistance) * 4;
        const itemCircles = item.querySelectorAll("circle");
        itemCircles.forEach((circle, j) => {
          const scaled = scale * (0 + j * 0.3);
          circle.style.transform = `scale(${scaled > 1 ? scaled : 1})`;
        });
      });

      const opacity = val / 1000;
      rootEl.style.setProperty("--fan-value", opacity.toString());

      if (val < 50) {
        fanSettingEl.innerHTML = "off";
      } else if (val < 500) {
        fanSettingEl.innerHTML = "lo";
      } else {
        fanSettingEl.innerHTML = "hi";
      }
    }

    const handleTempMouseDown = () => {
      containerEl.classList.add("temp-active");
      timeouts.push(
        window.setTimeout(() => {
          temp = tempSliderEl.value as unknown as number;
          updateTemp(temp);
        }, 100),
      );
    };

    const handleTempInput = () => {
      temp = tempSliderEl.value as unknown as number;
      updateTemp(temp);
    };

    const handleFanMouseDown = () => {
      containerEl.classList.add("fan-active");
      document.documentElement.style.setProperty(
        "--test",
        "calc(var(--window-width) * 0.006)",
      );
    };

    const handleFanInput = () => {
      fan = fanSliderEl.value as unknown as number;
      updateFan(fan);
    };

    const handleMouseUp = () => {
      containerEl.classList.remove("temp-active", "fan-active");
      document.documentElement.style.setProperty(
        "--test",
        "calc(var(--window-width) * 0.002)",
      );
    };

    tempSliderEl.addEventListener("mousedown", handleTempMouseDown);
    tempSliderEl.addEventListener("input", handleTempInput);
    fanSliderEl.addEventListener("mousedown", handleFanMouseDown);
    fanSliderEl.addEventListener("input", handleFanInput);
    window.addEventListener("mouseup", handleMouseUp);

    updateTemp(temp);
    updateFan(fan);

    resetState();

    return () => {
      clearScheduled();
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWindowWidth);
      tempSliderEl.removeEventListener("mousedown", handleTempMouseDown);
      tempSliderEl.removeEventListener("input", handleTempInput);
      fanSliderEl.removeEventListener("mousedown", handleFanMouseDown);
      fanSliderEl.removeEventListener("input", handleFanInput);
      window.removeEventListener("mouseup", handleMouseUp);
      if (svgBlur.parentElement === carEl) {
        carEl.removeChild(svgBlur);
      }
      resetState();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="cartemperature-root"
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
              <div className="temp-border">
                <svg
                  viewBox="0 0 266 459"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M264.98 429.403C236.806 429.956 217.36 430.514 208.445 431.001C162.662 433.503 133.96 430.571 114.871 413.441C105.326 404.875 98.1063 392.689 92.3955 375.64C86.6826 358.586 82.4995 336.726 78.9917 308.874C74.8806 276.234 71.8798 251.73 70.908 232.126C69.9365 212.528 70.9983 197.904 74.9701 185.012C82.9187 159.211 102.567 140.122 141.819 102.067L142.696 101.217C145.11 98.8762 147.442 96.6114 149.698 94.4202L149.736 94.3838L149.738 94.3817C180.072 64.9206 196.694 48.7763 216.511 39.4146C229.619 33.2225 244.167 29.9849 265.099 27.9092L265 26.9141C244.015 28.995 229.339 32.2487 216.084 38.5105C196.11 47.9463 179.363 64.2127 149.118 93.5894C146.825 95.8165 144.455 98.1189 141.999 100.499L141.123 101.35C62.7698 177.313 61.5611 178.484 77.9995 308.999C92.0423 420.494 117 436.999 208.499 431.999C217.394 431.513 236.823 430.956 265 430.403L264.98 429.403Z"
                    stroke="var(--temp-color)"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    className="outside-blur"
                    d="M77.9995 308.999C61.5611 178.484 62.7698 177.313 141.123 101.35L142 100.499C176.842 66.7182 194.596 48.6616 216.084 38.5105C229.339 32.2487 245.5 23 245.5 0H0V459H245C245 430.005 217.403 431.513 208.504 431.999L208.5 431.999C117 436.999 92.0423 420.494 77.9995 308.999Z"
                    fill="var(--temp-color)"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="temp-marker"></div>
                <div className="temp-marker blur"></div>
                <svg
                  className="temp-bg"
                  viewBox="0 0 266 394"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <circle cx="260.301" cy="111.916" r="1" />
                    <circle cx="260.078" cy="90.5254" r="1" />
                    <circle cx="259.862" cy="69.791" r="1" />
                    <circle cx="259.643" cy="48.8672" r="1" />
                    <circle cx="259.42" cy="27.4473" r="1" />
                    <circle cx="259.2" cy="6.38477" r="1" />
                  </g>
                  <g>
                    <circle cx="252.341" cy="113.516" r="1" />
                    <circle cx="250.141" cy="92.5234" r="1" />
                    <circle cx="248.009" cy="72.1738" r="1" />
                    <circle cx="245.857" cy="51.6387" r="1" />
                    <circle cx="243.654" cy="30.6152" r="1" />
                    <circle cx="241.488" cy="9.94336" r="1" />
                  </g>
                  <g>
                    <circle cx="244.668" cy="116.436" r="1" />
                    <circle cx="240.562" cy="96.166" r="1" />
                    <circle cx="236.583" cy="76.5195" r="1" />
                    <circle cx="232.567" cy="56.6934" r="1" />
                    <circle cx="228.456" cy="36.3965" r="1" />
                    <circle cx="224.414" cy="16.4395" r="1" />
                  </g>
                  <g>
                    <circle cx="237.484" cy="120.873" r="1" />
                    <circle cx="231.594" cy="101.707" r="1" />
                    <circle cx="225.886" cy="83.1289" r="1" />
                    <circle cx="220.125" cy="64.3789" r="1" />
                    <circle cx="214.227" cy="45.1855" r="1" />
                    <circle cx="208.428" cy="26.3125" r="1" />
                  </g>
                  <g>
                    <circle cx="230.863" cy="126.154" r="1" />
                    <circle cx="223.33" cy="108.299" r="1" />
                    <circle cx="216.028" cy="90.9922" r="1" />
                    <circle cx="208.659" cy="73.5254" r="1" />
                    <circle cx="201.115" cy="55.6445" r="1" />
                    <circle cx="193.697" cy="38.0605" r="1" />
                  </g>
                  <g>
                    <circle cx="224.49" cy="131.906" r="1" />
                    <circle cx="215.375" cy="115.48" r="1" />
                    <circle cx="206.539" cy="99.5586" r="1" />
                    <circle cx="197.622" cy="83.4922" r="1" />
                    <circle cx="188.493" cy="67.043" r="1" />
                    <circle cx="179.517" cy="50.8691" r="1" />
                  </g>
                  <g>
                    <circle cx="218.443" cy="137.707" r="1" />
                    <circle cx="207.826" cy="122.721" r="1" />
                    <circle cx="197.534" cy="108.195" r="1" />
                    <circle cx="187.148" cy="93.5352" r="1" />
                    <circle cx="176.516" cy="78.5273" r="1" />
                    <circle cx="166.061" cy="63.7715" r="1" />
                  </g>
                  <g>
                    <circle cx="212.33" cy="143.451" r="1" />
                    <circle cx="200.194" cy="129.891" r="1" />
                    <circle cx="188.431" cy="116.748" r="1" />
                    <circle cx="176.56" cy="103.484" r="1" />
                    <circle cx="164.408" cy="89.9062" r="1" />
                    <circle cx="152.458" cy="76.5566" r="1" />
                  </g>
                  <g>
                    <circle cx="206.395" cy="149.25" r="1" />
                    <circle cx="192.786" cy="137.131" r="1" />
                    <circle cx="179.595" cy="125.383" r="1" />
                    <circle cx="166.282" cy="113.527" r="1" />
                    <circle cx="152.654" cy="101.391" r="1" />
                    <circle cx="139.253" cy="89.457" r="1" />
                  </g>
                  <g>
                    <circle cx="200.272" cy="155.275" r="1" />
                    <circle cx="185.142" cy="144.65" r="1" />
                    <circle cx="170.477" cy="134.354" r="1" />
                    <circle cx="155.677" cy="123.961" r="1" />
                    <circle cx="140.526" cy="113.32" r="1" />
                    <circle cx="125.628" cy="102.859" r="1" />
                  </g>
                  <g>
                    <circle cx="194.429" cy="161.611" r="1" />
                    <circle cx="177.849" cy="152.561" r="1" />
                    <circle cx="161.777" cy="143.787" r="1" />
                    <circle cx="145.558" cy="134.934" r="1" />
                    <circle cx="128.955" cy="125.869" r="1" />
                    <circle cx="112.628" cy="116.957" r="1" />
                  </g>
                  <g>
                    <circle cx="189.143" cy="168.377" r="1" />
                    <circle cx="171.25" cy="161.006" r="1" />
                    <circle cx="153.906" cy="153.861" r="1" />
                    <circle cx="136.403" cy="146.652" r="1" />
                    <circle cx="118.485" cy="139.271" r="1" />
                    <circle cx="100.866" cy="132.016" r="1" />
                  </g>
                  <g>
                    <circle cx="184.675" cy="175.732" r="1" />
                    <circle cx="165.672" cy="170.189" r="1" />
                    <circle cx="147.253" cy="164.816" r="1" />
                    <circle cx="128.665" cy="159.395" r="1" />
                    <circle cx="109.635" cy="153.842" r="1" />
                    <circle cx="90.9232" cy="148.383" r="1" />
                  </g>
                  <g>
                    <circle cx="182.275" cy="184.148" r="1" />
                    <circle cx="162.677" cy="180.695" r="1" />
                    <circle cx="143.68" cy="177.348" r="1" />
                    <circle cx="124.509" cy="173.971" r="1" />
                    <circle cx="104.882" cy="170.512" r="1" />
                    <circle cx="85.5839" cy="167.111" r="1" />
                  </g>
                  <g>
                    <circle cx="181.485" cy="192.85" r="1" />
                    <circle cx="161.69" cy="191.559" r="1" />
                    <circle cx="142.502" cy="190.305" r="1" />
                    <circle cx="123.139" cy="189.039" r="1" />
                    <circle cx="103.317" cy="187.744" r="1" />
                    <circle cx="83.8246" cy="186.471" r="1" />
                  </g>
                  <g>
                    <circle cx="181.777" cy="201.52" r="1" />
                    <circle cx="162.055" cy="202.379" r="1" />
                    <circle cx="142.938" cy="203.213" r="1" />
                    <circle cx="123.646" cy="204.055" r="1" />
                    <circle cx="103.896" cy="204.916" r="1" />
                    <circle cx="84.4753" cy="205.764" r="1" />
                  </g>
                  <g>
                    <circle cx="182.605" cy="210.143" r="1" />
                    <circle cx="163.088" cy="213.145" r="1" />
                    <circle cx="144.17" cy="216.053" r="1" />
                    <circle cx="125.079" cy="218.988" r="1" />
                    <circle cx="105.535" cy="221.994" r="1" />
                    <circle cx="86.317" cy="224.947" r="1" />
                  </g>
                  <g>
                    <circle cx="183.583" cy="218.828" r="1" />
                    <circle cx="164.309" cy="223.986" r="1" />
                    <circle cx="145.627" cy="228.986" r="1" />
                    <circle cx="126.774" cy="234.031" r="1" />
                    <circle cx="107.473" cy="239.197" r="1" />
                    <circle cx="88.4939" cy="244.275" r="1" />
                  </g>
                  <g>
                    <circle cx="184.712" cy="227.336" r="1" />
                    <circle cx="165.718" cy="234.607" r="1" />
                    <circle cx="147.307" cy="241.654" r="1" />
                    <circle cx="128.728" cy="248.766" r="1" />
                    <circle cx="109.708" cy="256.045" r="1" />
                    <circle cx="91.0051" cy="263.203" r="1" />
                  </g>
                  <g>
                    <circle cx="185.727" cy="235.734" r="1" />
                    <circle cx="166.986" cy="245.09" r="1" />
                    <circle cx="148.82" cy="254.158" r="1" />
                    <circle cx="130.487" cy="263.311" r="1" />
                    <circle cx="111.719" cy="272.68" r="1" />
                    <circle cx="93.2649" cy="281.893" r="1" />
                  </g>
                  <g>
                    <circle cx="186.984" cy="244.215" r="1" />
                    <circle cx="168.554" cy="255.678" r="1" />
                    <circle cx="150.691" cy="266.787" r="1" />
                    <circle cx="132.663" cy="277.998" r="1" />
                    <circle cx="114.208" cy="289.477" r="1" />
                    <circle cx="96.0608" cy="300.762" r="1" />
                  </g>
                  <g>
                    <circle cx="188.699" cy="252.531" r="1" />
                    <circle cx="170.696" cy="266.057" r="1" />
                    <circle cx="153.245" cy="279.168" r="1" />
                    <circle cx="135.634" cy="292.398" r="1" />
                    <circle cx="117.605" cy="305.945" r="1" />
                    <circle cx="99.8777" cy="319.264" r="1" />
                  </g>
                  <g>
                    <circle cx="190.978" cy="260.479" r="1" />
                    <circle cx="173.54" cy="275.98" r="1" />
                    <circle cx="156.638" cy="291.006" r="1" />
                    <circle cx="139.581" cy="306.17" r="1" />
                    <circle cx="122.119" cy="321.693" r="1" />
                    <circle cx="104.948" cy="336.957" r="1" />
                  </g>
                  <g>
                    <circle cx="194.165" cy="268.049" r="1" />
                    <circle cx="177.518" cy="285.43" r="1" />
                    <circle cx="161.383" cy="302.277" r="1" />
                    <circle cx="145.1" cy="319.279" r="1" />
                    <circle cx="128.43" cy="336.684" r="1" />
                    <circle cx="112.039" cy="353.799" r="1" />
                  </g>
                  <g>
                    <circle cx="198.945" cy="274.662" r="1" />
                    <circle cx="183.486" cy="293.686" r="1" />
                    <circle cx="168.501" cy="312.125" r="1" />
                    <circle cx="153.379" cy="330.734" r="1" />
                    <circle cx="137.898" cy="349.783" r="1" />
                    <circle cx="122.676" cy="368.514" r="1" />
                  </g>
                  <g>
                    <circle cx="205.514" cy="279.463" r="1" />
                    <circle cx="191.686" cy="299.676" r="1" />
                    <circle cx="178.282" cy="319.27" r="1" />
                    <circle cx="164.756" cy="339.043" r="1" />
                    <circle cx="150.908" cy="359.285" r="1" />
                    <circle cx="137.292" cy="379.189" r="1" />
                  </g>
                  <g>
                    <circle cx="213.19" cy="281.971" r="1" />
                    <circle cx="201.268" cy="302.809" r="1" />
                    <circle cx="189.712" cy="323.006" r="1" />
                    <circle cx="178.05" cy="343.389" r="1" />
                    <circle cx="166.111" cy="364.256" r="1" />
                    <circle cx="154.372" cy="384.773" r="1" />
                  </g>
                  <g>
                    <circle cx="221.087" cy="283.002" r="1" />
                    <circle cx="211.126" cy="304.098" r="1" />
                    <circle cx="201.471" cy="324.545" r="1" />
                    <circle cx="191.727" cy="345.178" r="1" />
                    <circle cx="181.752" cy="366.303" r="1" />
                    <circle cx="171.944" cy="387.072" r="1" />
                  </g>
                  <g>
                    <circle cx="229.117" cy="283.299" r="1" />
                    <circle cx="221.15" cy="304.467" r="1" />
                    <circle cx="213.428" cy="324.984" r="1" />
                    <circle cx="205.635" cy="345.691" r="1" />
                    <circle cx="197.657" cy="366.889" r="1" />
                    <circle cx="189.812" cy="387.732" r="1" />
                  </g>
                  <g>
                    <circle cx="237.153" cy="283.088" r="1" />
                    <circle cx="231.182" cy="304.203" r="1" />
                    <circle cx="225.394" cy="324.67" r="1" />
                    <circle cx="219.553" cy="345.322" r="1" />
                    <circle cx="213.573" cy="366.467" r="1" />
                    <circle cx="207.693" cy="387.256" r="1" />
                  </g>
                  <g>
                    <circle cx="244.922" cy="282.848" r="1" />
                    <circle cx="240.88" cy="303.904" r="1" />
                    <circle cx="236.962" cy="324.314" r="1" />
                    <circle cx="233.008" cy="344.91" r="1" />
                    <circle cx="228.96" cy="365.996" r="1" />
                    <circle cx="224.979" cy="386.73" r="1" />
                  </g>
                  <g>
                    <circle cx="252.691" cy="282.719" r="1" />
                    <circle cx="250.578" cy="303.742" r="1" />
                    <circle cx="248.53" cy="324.121" r="1" />
                    <circle cx="246.463" cy="344.686" r="1" />
                    <circle cx="244.347" cy="365.738" r="1" />
                    <circle cx="242.266" cy="386.438" r="1" />
                  </g>
                  <g>
                    <circle cx="260.301" cy="282.623" r="1" />
                    <circle cx="260.078" cy="303.623" r="1" />
                    <circle cx="259.862" cy="323.979" r="1" />
                    <circle cx="259.643" cy="344.52" r="1" />
                    <circle cx="259.42" cy="365.549" r="1" />
                    <circle cx="259.196" cy="386.227" r="1" />
                  </g>
                </svg>
              </div>
              <div className="fan-border">
                <svg
                  viewBox="0 0 265 459"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_803_700)">
                    <path
                      d="M-0.0290527 26.8984C20.9558 28.9793 35.6318 32.233 48.8869 38.4948C70.375 48.646 88.1285 66.7026 122.971 100.484L123.848 101.334C202.201 177.297 203.41 178.469 186.971 308.984C172.929 420.478 147.971 436.984 56.4715 431.984C47.5772 431.498 28.1482 430.94 -0.0290527 430.387"
                      stroke="var(--temp-color)"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      className="outside-blur"
                      d="M187.001 308.999C203.439 178.484 202.23 177.313 123.877 101.35L123 100.499C88.1576 66.7182 68.9881 45.1512 47.5 35C34.245 28.7382 23 23 23 0H265V459H23C23 430 44.5 434.579 55.5 435C147 438.5 172.958 420.494 187.001 308.999Z"
                      fill="var(--temp-color)"
                      vectorEffect="non-scaling-stroke"
                    />
                  </g>
                </svg>
                <div className="fan-marker"></div>
                <div className="fan-marker blur"></div>
                <svg
                  className="fan-bg"
                  viewBox="0 0 266 394"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <circle cx="260.301" cy="111.916" r="1" />
                    <circle cx="260.078" cy="90.5254" r="1" />
                    <circle cx="259.862" cy="69.791" r="1" />
                    <circle cx="259.643" cy="48.8672" r="1" />
                    <circle cx="259.42" cy="27.4473" r="1" />
                    <circle cx="259.2" cy="6.38477" r="1" />
                  </g>
                  <g>
                    <circle cx="252.341" cy="113.516" r="1" />
                    <circle cx="250.141" cy="92.5234" r="1" />
                    <circle cx="248.009" cy="72.1738" r="1" />
                    <circle cx="245.857" cy="51.6387" r="1" />
                    <circle cx="243.654" cy="30.6152" r="1" />
                    <circle cx="241.488" cy="9.94336" r="1" />
                  </g>
                  <g>
                    <circle cx="244.668" cy="116.436" r="1" />
                    <circle cx="240.562" cy="96.166" r="1" />
                    <circle cx="236.583" cy="76.5195" r="1" />
                    <circle cx="232.567" cy="56.6934" r="1" />
                    <circle cx="228.456" cy="36.3965" r="1" />
                    <circle cx="224.414" cy="16.4395" r="1" />
                  </g>
                  <g>
                    <circle cx="237.484" cy="120.873" r="1" />
                    <circle cx="231.594" cy="101.707" r="1" />
                    <circle cx="225.886" cy="83.1289" r="1" />
                    <circle cx="220.125" cy="64.3789" r="1" />
                    <circle cx="214.227" cy="45.1855" r="1" />
                    <circle cx="208.428" cy="26.3125" r="1" />
                  </g>
                  <g>
                    <circle cx="230.863" cy="126.154" r="1" />
                    <circle cx="223.33" cy="108.299" r="1" />
                    <circle cx="216.028" cy="90.9922" r="1" />
                    <circle cx="208.659" cy="73.5254" r="1" />
                    <circle cx="201.115" cy="55.6445" r="1" />
                    <circle cx="193.697" cy="38.0605" r="1" />
                  </g>
                  <g>
                    <circle cx="224.49" cy="131.906" r="1" />
                    <circle cx="215.375" cy="115.48" r="1" />
                    <circle cx="206.539" cy="99.5586" r="1" />
                    <circle cx="197.622" cy="83.4922" r="1" />
                    <circle cx="188.493" cy="67.043" r="1" />
                    <circle cx="179.517" cy="50.8691" r="1" />
                  </g>
                  <g>
                    <circle cx="218.443" cy="137.707" r="1" />
                    <circle cx="207.826" cy="122.721" r="1" />
                    <circle cx="197.534" cy="108.195" r="1" />
                    <circle cx="187.148" cy="93.5352" r="1" />
                    <circle cx="176.516" cy="78.5273" r="1" />
                    <circle cx="166.061" cy="63.7715" r="1" />
                  </g>
                  <g>
                    <circle cx="212.33" cy="143.451" r="1" />
                    <circle cx="200.194" cy="129.891" r="1" />
                    <circle cx="188.431" cy="116.748" r="1" />
                    <circle cx="176.56" cy="103.484" r="1" />
                    <circle cx="164.408" cy="89.9062" r="1" />
                    <circle cx="152.458" cy="76.5566" r="1" />
                  </g>
                  <g>
                    <circle cx="206.395" cy="149.25" r="1" />
                    <circle cx="192.786" cy="137.131" r="1" />
                    <circle cx="179.595" cy="125.383" r="1" />
                    <circle cx="166.282" cy="113.527" r="1" />
                    <circle cx="152.654" cy="101.391" r="1" />
                    <circle cx="139.253" cy="89.457" r="1" />
                  </g>
                  <g>
                    <circle cx="200.272" cy="155.275" r="1" />
                    <circle cx="185.142" cy="144.65" r="1" />
                    <circle cx="170.477" cy="134.354" r="1" />
                    <circle cx="155.677" cy="123.961" r="1" />
                    <circle cx="140.526" cy="113.32" r="1" />
                    <circle cx="125.628" cy="102.859" r="1" />
                  </g>
                  <g>
                    <circle cx="194.429" cy="161.611" r="1" />
                    <circle cx="177.849" cy="152.561" r="1" />
                    <circle cx="161.777" cy="143.787" r="1" />
                    <circle cx="145.558" cy="134.934" r="1" />
                    <circle cx="128.955" cy="125.869" r="1" />
                    <circle cx="112.628" cy="116.957" r="1" />
                  </g>
                  <g>
                    <circle cx="189.143" cy="168.377" r="1" />
                    <circle cx="171.25" cy="161.006" r="1" />
                    <circle cx="153.906" cy="153.861" r="1" />
                    <circle cx="136.403" cy="146.652" r="1" />
                    <circle cx="118.485" cy="139.271" r="1" />
                    <circle cx="100.866" cy="132.016" r="1" />
                  </g>
                  <g>
                    <circle cx="184.675" cy="175.732" r="1" />
                    <circle cx="165.672" cy="170.189" r="1" />
                    <circle cx="147.253" cy="164.816" r="1" />
                    <circle cx="128.665" cy="159.395" r="1" />
                    <circle cx="109.635" cy="153.842" r="1" />
                    <circle cx="90.9232" cy="148.383" r="1" />
                  </g>
                  <g>
                    <circle cx="182.275" cy="184.148" r="1" />
                    <circle cx="162.677" cy="180.695" r="1" />
                    <circle cx="143.68" cy="177.348" r="1" />
                    <circle cx="124.509" cy="173.971" r="1" />
                    <circle cx="104.882" cy="170.512" r="1" />
                    <circle cx="85.5839" cy="167.111" r="1" />
                  </g>
                  <g>
                    <circle cx="181.485" cy="192.85" r="1" />
                    <circle cx="161.69" cy="191.559" r="1" />
                    <circle cx="142.502" cy="190.305" r="1" />
                    <circle cx="123.139" cy="189.039" r="1" />
                    <circle cx="103.317" cy="187.744" r="1" />
                    <circle cx="83.8246" cy="186.471" r="1" />
                  </g>
                  <g>
                    <circle cx="181.777" cy="201.52" r="1" />
                    <circle cx="162.055" cy="202.379" r="1" />
                    <circle cx="142.938" cy="203.213" r="1" />
                    <circle cx="123.646" cy="204.055" r="1" />
                    <circle cx="103.896" cy="204.916" r="1" />
                    <circle cx="84.4753" cy="205.764" r="1" />
                  </g>
                  <g>
                    <circle cx="182.605" cy="210.143" r="1" />
                    <circle cx="163.088" cy="213.145" r="1" />
                    <circle cx="144.17" cy="216.053" r="1" />
                    <circle cx="125.079" cy="218.988" r="1" />
                    <circle cx="105.535" cy="221.994" r="1" />
                    <circle cx="86.317" cy="224.947" r="1" />
                  </g>
                  <g>
                    <circle cx="183.583" cy="218.828" r="1" />
                    <circle cx="164.309" cy="223.986" r="1" />
                    <circle cx="145.627" cy="228.986" r="1" />
                    <circle cx="126.774" cy="234.031" r="1" />
                    <circle cx="107.473" cy="239.197" r="1" />
                    <circle cx="88.4939" cy="244.275" r="1" />
                  </g>
                  <g>
                    <circle cx="184.712" cy="227.336" r="1" />
                    <circle cx="165.718" cy="234.607" r="1" />
                    <circle cx="147.307" cy="241.654" r="1" />
                    <circle cx="128.728" cy="248.766" r="1" />
                    <circle cx="109.708" cy="256.045" r="1" />
                    <circle cx="91.0051" cy="263.203" r="1" />
                  </g>
                  <g>
                    <circle cx="185.727" cy="235.734" r="1" />
                    <circle cx="166.986" cy="245.09" r="1" />
                    <circle cx="148.82" cy="254.158" r="1" />
                    <circle cx="130.487" cy="263.311" r="1" />
                    <circle cx="111.719" cy="272.68" r="1" />
                    <circle cx="93.2649" cy="281.893" r="1" />
                  </g>
                  <g>
                    <circle cx="186.984" cy="244.215" r="1" />
                    <circle cx="168.554" cy="255.678" r="1" />
                    <circle cx="150.691" cy="266.787" r="1" />
                    <circle cx="132.663" cy="277.998" r="1" />
                    <circle cx="114.208" cy="289.477" r="1" />
                    <circle cx="96.0608" cy="300.762" r="1" />
                  </g>
                  <g>
                    <circle cx="188.699" cy="252.531" r="1" />
                    <circle cx="170.696" cy="266.057" r="1" />
                    <circle cx="153.245" cy="279.168" r="1" />
                    <circle cx="135.634" cy="292.398" r="1" />
                    <circle cx="117.605" cy="305.945" r="1" />
                    <circle cx="99.8777" cy="319.264" r="1" />
                  </g>
                  <g>
                    <circle cx="190.978" cy="260.479" r="1" />
                    <circle cx="173.54" cy="275.98" r="1" />
                    <circle cx="156.638" cy="291.006" r="1" />
                    <circle cx="139.581" cy="306.17" r="1" />
                    <circle cx="122.119" cy="321.693" r="1" />
                    <circle cx="104.948" cy="336.957" r="1" />
                  </g>
                  <g>
                    <circle cx="194.165" cy="268.049" r="1" />
                    <circle cx="177.518" cy="285.43" r="1" />
                    <circle cx="161.383" cy="302.277" r="1" />
                    <circle cx="145.1" cy="319.279" r="1" />
                    <circle cx="128.43" cy="336.684" r="1" />
                    <circle cx="112.039" cy="353.799" r="1" />
                  </g>
                  <g>
                    <circle cx="198.945" cy="274.662" r="1" />
                    <circle cx="183.486" cy="293.686" r="1" />
                    <circle cx="168.501" cy="312.125" r="1" />
                    <circle cx="153.379" cy="330.734" r="1" />
                    <circle cx="137.898" cy="349.783" r="1" />
                    <circle cx="122.676" cy="368.514" r="1" />
                  </g>
                  <g>
                    <circle cx="205.514" cy="279.463" r="1" />
                    <circle cx="191.686" cy="299.676" r="1" />
                    <circle cx="178.282" cy="319.27" r="1" />
                    <circle cx="164.756" cy="339.043" r="1" />
                    <circle cx="150.908" cy="359.285" r="1" />
                    <circle cx="137.292" cy="379.189" r="1" />
                  </g>
                  <g>
                    <circle cx="213.19" cy="281.971" r="1" />
                    <circle cx="201.268" cy="302.809" r="1" />
                    <circle cx="189.712" cy="323.006" r="1" />
                    <circle cx="178.05" cy="343.389" r="1" />
                    <circle cx="166.111" cy="364.256" r="1" />
                    <circle cx="154.372" cy="384.773" r="1" />
                  </g>
                  <g>
                    <circle cx="221.087" cy="283.002" r="1" />
                    <circle cx="211.126" cy="304.098" r="1" />
                    <circle cx="201.471" cy="324.545" r="1" />
                    <circle cx="191.727" cy="345.178" r="1" />
                    <circle cx="181.752" cy="366.303" r="1" />
                    <circle cx="171.944" cy="387.072" r="1" />
                  </g>
                  <g>
                    <circle cx="229.117" cy="283.299" r="1" />
                    <circle cx="221.15" cy="304.467" r="1" />
                    <circle cx="213.428" cy="324.984" r="1" />
                    <circle cx="205.635" cy="345.691" r="1" />
                    <circle cx="197.657" cy="366.889" r="1" />
                    <circle cx="189.812" cy="387.732" r="1" />
                  </g>
                  <g>
                    <circle cx="237.153" cy="283.088" r="1" />
                    <circle cx="231.182" cy="304.203" r="1" />
                    <circle cx="225.394" cy="324.67" r="1" />
                    <circle cx="219.553" cy="345.322" r="1" />
                    <circle cx="213.573" cy="366.467" r="1" />
                    <circle cx="207.693" cy="387.256" r="1" />
                  </g>
                  <g>
                    <circle cx="244.922" cy="282.848" r="1" />
                    <circle cx="240.88" cy="303.904" r="1" />
                    <circle cx="236.962" cy="324.314" r="1" />
                    <circle cx="233.008" cy="344.91" r="1" />
                    <circle cx="228.96" cy="365.996" r="1" />
                    <circle cx="224.979" cy="386.73" r="1" />
                  </g>
                  <g>
                    <circle cx="252.691" cy="282.719" r="1" />
                    <circle cx="250.578" cy="303.742" r="1" />
                    <circle cx="248.53" cy="324.121" r="1" />
                    <circle cx="246.463" cy="344.686" r="1" />
                    <circle cx="244.347" cy="365.738" r="1" />
                    <circle cx="242.266" cy="386.438" r="1" />
                  </g>
                  <g>
                    <circle cx="260.301" cy="282.623" r="1" />
                    <circle cx="260.078" cy="303.623" r="1" />
                    <circle cx="259.862" cy="323.979" r="1" />
                    <circle cx="259.643" cy="344.52" r="1" />
                    <circle cx="259.42" cy="365.549" r="1" />
                    <circle cx="259.196" cy="386.227" r="1" />
                  </g>
                </svg>
              </div>
              <svg
                className="main-border"
                viewBox="0 0 1143 414"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M303.543 2.48275C385.599 -1.09344 448.498 11.1245 517.153 11.3624L625.835 11.3663L625.838 11.3663C694.492 11.1284 757.392 -1.08954 839.448 2.48665C852.253 3.04474 863.96 3.51395 874.703 3.94457L874.704 3.94462C905.702 5.18703 928.682 6.1081 946.901 7.9152L947 6.92008C928.749 5.10984 905.726 4.18708 874.714 2.94413C863.976 2.51373 852.279 2.04493 839.491 1.4876C757.41 -2.08971 694.489 10.1284 625.835 10.3663L517.156 10.3624C448.502 10.1245 385.581 -2.09362 303.5 1.4837C290.713 2.04099 279.016 2.50979 268.278 2.94017L268.277 2.94023C237.27 4.18297 214.249 5.10563 196 6.91528L196.099 7.9104C214.316 6.10389 237.294 5.18292 268.286 3.94071L268.286 3.94071C279.03 3.51009 290.737 3.04086 303.543 2.48275Z"
                  stroke="url(#paint0_linear_769_831)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  d="M947.024 409.968C911.982 409.121 875.075 408.417 833.013 407.87C818.358 407.679 803.691 400.763 787.672 393.21L787.646 393.197C786.979 392.883 786.31 392.567 785.638 392.251C768.905 384.373 750.763 376.151 730.059 374.92C672.527 371.5 633.393 371.494 571.491 371.501L570.868 371.501C509.327 371.507 469.283 371.512 412.939 374.956C392.244 376.221 374.12 384.431 357.395 392.279C356.77 392.573 356.146 392.865 355.525 393.157C339.45 400.71 324.729 407.627 309.99 407.781C263.896 408.261 225.227 408.831 195.98 409.404L196 410.404C225.243 409.83 263.909 409.261 310 408.781C324.963 408.625 339.867 401.621 355.856 394.107C373.151 385.979 391.716 377.255 413 375.954C469.313 372.512 509.331 372.507 570.877 372.501L571.491 372.501C633.393 372.494 672.5 372.501 730 375.919C751.357 377.188 769.99 385.976 787.337 394.157C803.271 401.672 818.121 408.676 833 408.869C875.058 409.417 911.961 410.121 947 410.968L947.024 409.968Z"
                  stroke="url(#paint0_linear_769_831)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_769_831"
                    x1="947.024"
                    y1="204.607"
                    x2="195.98"
                    y2="204.607"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="var(--temp-color)" />
                    <stop
                      offset="0.107191"
                      stopColor="var(--temp-color)"
                      stopOpacity="0.2"
                    />
                    <stop
                      offset="0.888416"
                      stopColor="var(--temp-color)"
                      stopOpacity="0.2"
                    />
                    <stop offset="1" stopColor="var(--temp-color)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="settings left">
              <div className="temp-number">
                <div className="temp-wrapper">
                  <h1>21</h1>
                  <h3>6</h3>
                  <h3>°C</h3>
                </div>
              </div>
              <div className="slider-wrapper">
                <p>Temperature</p>
                <div className="temp-slider">
                  <div className="slider-mask-wrapper">
                    <div className="slider-mask"></div>
                  </div>
                  <input className="temp" type="range" min="0" max="1000" />
                </div>
              </div>
            </div>
            <div className="car">
              <div className="car-bg">
                <div className="car-gradient"></div>
                <svg
                  width="100%"
                  viewBox="0 0 125 251"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <clipPath id="clip">
                    <path
                      d="M9.04648 108.046C2.60908 109.997 1.8288 109.997 0.950966 107.656C-0.317009 104.632 -0.317009 105.023 0.950966 102.779C1.53619 101.706 3.87705 99.9507 6.31546 98.9754L10.6071 97.1222V84.1498C10.6071 75.3716 10.1194 69.9095 9.14402 67.276C7.29083 62.0091 7.29083 43.7697 9.14402 35.6742C13.2405 18.3127 24.8474 6.99852 43.7694 1.82909C52.5477 -0.609329 73.0304 -0.609329 81.7111 1.82909C95.2687 5.53548 106.193 13.3384 111.362 22.7994C117.409 33.821 119.848 55.1815 116.434 66.3982C115.459 69.6169 114.971 75.4691 114.971 84.0523V97.0246L119.653 99.1704C123.944 101.316 124.237 101.609 124.237 105.315C124.237 109.509 123.457 109.899 117.604 108.436L114.971 107.754L114.971 126.968C114.971 137.6 115.459 154.376 116.141 164.325C118.287 198.365 117.702 209.191 112.338 230.649C108.339 246.743 108.729 246.45 93.0253 249.376C82.3939 251.327 41.8187 251.035 30.2119 248.791C25.14 247.913 20.2632 246.743 19.2878 246.158C17.0445 244.987 14.9962 239.33 12.0701 226.26C7.87605 207.826 7.19329 197.78 8.5588 178.76C9.14402 169.494 10.0219 149.694 10.3145 134.674C10.8997 108.241 10.8997 107.559 9.04648 108.046Z"
                      fill="#FF0000"
                    />
                  </clipPath>
                  <rect
                    y="54"
                    width="124"
                    height="71"
                    fill="#D9D9D9"
                    className="car-gradient"
                  />
                </svg>
              </div>
              <svg
                className="_1"
                viewBox="0 0 126 252"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.0464 109.046C3.60905 110.997 2.82877 110.997 1.95094 108.656C0.682961 105.632 0.682961 106.023 1.95094 103.779C2.53616 102.706 4.87702 100.951 7.31543 99.9754L11.607 98.1222V85.1498C11.607 76.3716 11.1194 70.9095 10.144 68.276C8.2908 63.0091 8.2908 44.7697 10.144 36.6742C14.2405 19.3127 25.8473 7.99852 44.7694 2.82909C53.5477 0.390671 74.0303 0.390671 82.7111 2.82909C96.2686 6.53548 107.193 14.3384 112.362 23.7994C118.409 34.821 120.848 56.1815 117.434 67.3982C116.459 70.6169 115.971 76.4691 115.971 85.0523V98.0246L120.653 100.17C124.944 102.316 125.237 102.609 125.237 106.315C125.237 110.509 124.457 110.899 118.604 109.436L115.971 108.754L115.971 127.968C115.971 138.6 116.459 155.376 117.141 165.325C119.287 199.365 118.702 210.191 113.337 231.649C109.339 247.743 109.729 247.45 94.0253 250.376C83.3938 252.327 42.8187 252.035 31.2119 249.791C26.14 248.913 21.2631 247.743 20.2878 247.158C18.0444 245.987 15.9962 240.33 13.0701 227.26C8.87601 208.826 8.19326 198.78 9.55877 179.76C10.144 170.494 11.0218 150.694 11.3144 135.674C11.8997 109.241 11.8996 108.559 10.0464 109.046Z" />
                <path d="M12.0947 37.2578C14.4356 28.0894 18.9222 20.0914 22.1409 19.4086C31.4069 17.3604 35.3083 14.8244 36.9665 9.85008C37.9418 6.72892 38.527 6.43632 44.5743 4.97327C54.4255 2.72993 63.789 2.1447 73.3475 3.41267C85.8322 4.97325 88.6607 6.14371 91.0016 10.7279C93.44 15.2146 98.5119 19.0185 102.413 19.0185C103.876 19.0185 105.827 19.3111 106.705 19.6037C108.88 20.5239 113.207 29.694 115.256 37.2087" />
                <path d="M19.4099 146.303C19.7025 167.371 20.2878 178.1 21.068 179.465C22.8237 182.587 28.0907 187.171 28.871 186.391C29.3586 186 29.6512 175.076 29.6512 162.104C29.5537 144.255 29.1636 136.159 27.8956 128.747C25.3596 114.311 21.068 99.9733 19.3124 99.9733C18.8247 99.9733 18.5321 103.387 18.6296 107.484C18.7272 111.678 19.1173 129.137 19.4099 146.303Z" />
                <path d="M22.1953 83.6621C20.3987 83.6621 22.1953 77.9761 25.3894 73.1155C28.5835 68.3772 33.1749 65.0146 38.2654 63.7001C41.0602 62.9664 52.0398 61.499 52.9381 61.7436" />
                <path d="M24.8721 93.6347C26.9203 103.778 29.0661 109.533 31.407 111.191C33.1626 112.459 38.4296 112.654 63.3989 112.654C79.8826 112.654 94.1229 112.362 95.0007 112.069C97.6342 110.996 100.365 104.266 102.316 94.1224C104.559 82.2229 103.877 78.7116 97.9268 73.0545C90.4165 65.7393 76.6639 62.228 59.3999 63.2034C43.2089 64.0812 33.2602 67.8851 27.1154 75.5905C23.7016 79.8821 23.0189 84.8564 24.8721 93.6347Z" />
                <path d="M38.8197 195.561C39.9901 194.975 49.7438 194.585 63.789 194.585C77.8342 194.585 87.5879 194.975 88.7583 195.561C91.0992 196.829 91.0992 199.657 89.0509 209.801C87.1002 219.652 85.8322 221.505 79.1022 224.626C71.2993 228.138 60.8629 228.723 51.8896 225.992C42.8187 223.163 40.4778 220.53 38.6246 211.166C36.5763 200.437 36.5763 196.829 38.8197 195.561Z" />
                <path d="M105.123 83.6621C106.312 83.4171 105.222 78.792 102.846 74.4733C99.5772 68.4393 92.8425 63.9368 85.3155 62.7423C80.9385 62.0531 76.4336 61.6409 74.8838 61.728" />
                <path d="M96.1711 204.632C96.4637 205.022 98.0243 205.314 99.5849 205.314C101.828 205.314 102.316 204.924 102.316 202.974C102.316 200.633 99.4874 199.267 96.6588 200.243C95.3908 200.633 95.0982 203.559 96.1711 204.632Z" />
                <path d="M99.3898 198.486C102.023 198.486 102.413 198.194 102.121 196.243C101.926 194.682 101.145 194.097 99.3898 194.097C97.6341 194.097 96.8538 194.682 96.6588 196.243C96.3662 198.194 96.7563 198.486 99.3898 198.486Z" />
                <path d="M31.2851 204.632C30.9924 205.022 29.4319 205.314 27.8713 205.314C25.6279 205.314 25.1403 204.924 25.1403 202.974C25.1403 200.633 27.9688 199.267 30.7974 200.243C32.0653 200.633 32.358 203.559 31.2851 204.632Z" />
                <path d="M28.0664 198.486C25.4329 198.486 25.0428 198.194 25.3354 196.243C25.5304 194.682 26.3107 194.097 28.0664 194.097C29.822 194.097 30.6023 194.682 30.7974 196.243C31.09 198.194 30.6999 198.486 28.0664 198.486Z" />
                <path d="M98.1218 182.101C98.3169 184.735 98.9021 186.783 99.2923 186.783C100.268 186.783 104.754 181.906 106.315 178.98C107.388 177.03 107.778 168.446 107.875 138.015C108.168 103.292 107.973 99.7807 106.705 102.122C104.267 106.511 100.56 122.117 98.9021 134.406C97.5366 144.94 97.1465 169.519 98.1218 182.101Z" />
              </svg>
            </div>
            <div className="settings right">
              <div className="slider-wrapper">
                <p>Fan</p>
                <div className="fan-slider">
                  <div className="slider-mask-wrapper">
                    <div className="slider-mask"></div>
                  </div>
                  <input className="fan" type="range" min="0" max="1000" />
                </div>
              </div>
              <div className="fan-setting">
                <div className="fan-wrapper">
                  <svg
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 11.4991C8.83305 9.99907 5.00005 5.99907 9.00005 2.99907C10.024 2.23107 13 1.49907 15.5 3.99907C16.453 4.95207 16.135 5.89807 14 7.49907C13.038 8.22007 11.7 9.39907 12.5 10.9991C14 8.83307 18 4.99907 21 8.99907C21.768 10.0241 22.5 12.9991 20 15.4991C19.047 16.4521 18.101 16.1341 16.5 13.9991C15.779 13.0381 14.6 11.6991 13 12.4991C15.167 13.9991 19 17.9991 15 20.9991C13.975 21.7681 11 22.4991 8.50005 19.9991C7.54705 19.0461 7.86505 18.1011 10 16.4991C10.961 15.7791 12.3 14.5991 11.5 12.9991C10 15.1661 6.00005 18.9991 3.00005 14.9991C2.23205 13.9751 1.50005 10.9991 4.00005 8.49907C4.95305 7.54607 5.89905 7.86407 7.50005 9.99907C8.22105 10.9611 9.40005 12.2991 11 11.4991Z"
                      fill="white"
                    />
                  </svg>
                  <h1>lo</h1>
                </div>
              </div>
            </div>
            <div className="nav">
              <a style={{ color: "#fff" }}>Climate</a>
              <a>Overview</a>
              <a>Audio</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
