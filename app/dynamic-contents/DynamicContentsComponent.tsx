"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import "./style.css";
import Image from "next/image";
import Navigation from "./Navigation";

type Title = {
  title: HTMLElement;
  subtitles: NodeListOf<HTMLElement>;
};

export default function FlightsComponent() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState<Title[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    if (contentRef.current) {
      const titleList: Title[] = [];

      const sections = contentRef.current.querySelectorAll(
        ":scope > div",
      ) as NodeListOf<HTMLElement>;

      sections.forEach((item, i) => {
        const primaryTitle = item.querySelector("h1") as HTMLElement;
        const secondaryTitles = item.querySelectorAll(
          "h3",
        ) as NodeListOf<HTMLElement>;

        titleList.push({
          title: primaryTitle,
          subtitles: secondaryTitles,
        });
      });

      setContent(titleList);
    }
  }, []);

  return (
    <div
      ref={rootRef}
      className="dynamic-contents-root"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "scroll",
      }}
    >
      <main ref={mainRef}>
        <div className="relative z-2 w-full mb-[25vh] flex flex-col items-center text-black">
          <Navigation content={content} scrollRootRef={rootRef} />
          {/* clean up */}
          <div
            className="content w-full max-w-[500px] pl-20 pt-8 flex flex-col items-center gap-40"
            ref={contentRef}
          >
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center" data-short="Background">
                Cory in the House
              </h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <p>
                  Cory in the House is an American television sitcom which aired
                  on the Disney Channel from January 12, 2007, to September 12,
                  2008, and was a spin-off from the Disney Channel series That's
                  So Raven. The show focuses on Cory Baxter, who moves from San
                  Francisco, California, to Washington, D.C. with his father,
                  Victor Baxter, who gets a new job as the White House executive
                  chef. The series was the first Disney Channel spin-off series,
                  as well as the final Disney Channel series overall to be both
                  shot and broadcast in standard definition for the entire run
                  of the show. Reruns of the series have aired on Disney Channel
                  and Disney XD, and on the Family Channel in Canada.
                  Raven-Symoné guest-starred in one episode, reprising her role
                  as Raven Baxter.
                </p>

                <img
                  className="asset"
                  src="https://upload.wikimedia.org/wikipedia/en/c/c3/Cory_in_the_House.png"
                  alt="Cory in the House cast"
                />
              </div>
            </div>
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center">Characters</h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <img
                  className="asset"
                  src="https://upload.wikimedia.org/wikipedia/en/8/87/CoryInTheHousecast.jpg"
                  alt="Cory in the House cast"
                />
                <h3 className="subtitle" data-short="Main characters">
                  Main cast
                </h3>
                <ul>
                  <li>
                    Cory Baxter (Kyle Massey) is the protagonist of the series.
                    He is the son of Victor and Tanya Baxter. A teenager, Cory
                    is friends with Newt Livingston and his crush Meena Paroom.
                    Cory often is irritated with the President's daughter Sophie
                    Martinez, because of her two-facedness, and also with Candy
                    Smiles, who keeps calling him "C-Bear". He usually looks to
                    his father for advice. Cory occasionally cooks up various
                    "get-rich-quick" schemes, all of which end badly. He plays
                    in the band DC3 founded by Newt, Cory, and Meena as the
                    Drummer. His catchphrases in this series are "Coming
                    Daddy!", "You Know How I Do", "Dang!" and "Daddy No!". Cory
                    is similar to his big sister Raven (from That's So Raven),
                    and they both are always getting into some crazy situation,
                    but in the end they find a way out of it. When he was much
                    younger he played the same role in That's So Raven, though
                    there is a notable difference in portrayal, as younger Cory
                    was introduced as a minor annoyance and villain, while on
                    his own show Cory is much more like his older sister. He
                    will do anything in order to get money. In some episodes, in
                    a humorous climax, Cory's trousers would fall down,
                    revealing his underwear, usually with dollar-signs on them.
                  </li>
                  <li>
                    Newton "Newt" Livingston III (Jason Dolley) is the son of a
                    senator and the Chief Justice. He is the best friend of
                    Meena Paroom and Cory Baxter. He is a bit clueless and he
                    loves rock and roll. He has some similar characteristics as
                    Raven's friend Chelsea Daniels (from That's So Raven). He
                    tends to say, "Awesome!" during situations that are not
                    particularly exciting. For example, when the school students
                    were getting flu shots. He has trouble understanding obvious
                    things, yet he has the knowledge to solve confusing things.
                    He plays the guitar (his favorite being a Squier
                    Stratocaster), and is part of DC3. He also knows about
                    Cory's crush on Meena. He wears jeans and chains whenever he
                    is not in any particular costume. Sophie once had a crush on
                    him. He also hates the idea of running for student body
                    president, as he does not think he will make a good leader,
                    and because it would throw off his care free life style,
                    despite his parents wanting him to. Newt has been forced
                    (though he enjoys it) to make up excuses for his parents as
                    to why he can not run for student body president, naming the
                    day of the year he makes them up "Excuse Day". His guitar is
                    a Cherry Flaming Red Fender that is tuned for rock 'n roll.
                  </li>
                  <li>
                    Meena Paroom (Maiara Walsh) is the daughter of the
                    ambassador of Bahavia, a fictional country very similar to
                    Bolivia, containing cultural elements of India,
                    Turkmenistan, Uzbekistan, Tajikistan, Kyrgyzstan, and
                    Pakistan. She likes to wear American clothing and to listen
                    to rock music, which her father frowns upon. Jason Stickler,
                    the son of the head of the CIA, is obsessed with her to the
                    point of spying on her constantly. Meena's father is very
                    disapproving of Cory and Newt. In "Ain't Miss Bahavian" he
                    once banned her from being near them because he believed
                    that they had hypnotized her to disrespect their country.
                    Her father later decided to let them still be friends after
                    Meena came clean about the secrets she had been keeping. It
                    is obvious that Cory has a crush on her, and believes that
                    she will like him back if he does nice things for her;
                    however Meena does not return Cory's feelings. She has two
                    different crushes during the series named Craig Berkowitz
                    and Nanoosh. Meena is similar to Eddie (from That's So
                    Raven). They both have a love for music, and are the only
                    one of their gender in their group of three. According to
                    Maiara Walsh, her Bahavian accent is a mix of Brazilian
                    Portuguese and Arabic.
                  </li>
                </ul>
              </div>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <h3 className="subtitle">Extended cast</h3>
                <ul>
                  <li>
                    Sophia "Sophie" Martinez (Madison Pettis) is the daughter of
                    President Richard Martinez. She is a mischievous girl who
                    loves to annoy people, especially Cory. She has two best
                    friends, Haley and Tanisha, who often compete with Sophie at
                    random things, like class president. She is also known as
                    "America's Angel" by all of America (though she is not one
                    to Cory), and when her nickname is mentioned she often
                    responds using her catch phrase: "That's what they call me!"
                  </li>
                  <li>
                    President Richard Martinez (John D'Aquino) is the President
                    of the United States and Sophie's father. He often gives
                    Cory advice and mentorship through fond and submissive ways.
                    He often speaks his catchphrase by looking in the camera
                    (thus breaking the fourth wall) and saying, "The President
                    of the United States". He also tries to be funny and tells
                    jokes that are often humorless like in the episode "A Rat By
                    Any Other Name" and in the episode "Nappers Delight". He
                    often counts on his assistant Samantha Samuels in some cases
                    like in the episode "Just Desserts" and the episode "I Ain't
                    Got Rhythm". His actions as president are very serious
                    although sometimes he may conduct in some childish behavior.
                    He usually enters the scene whistling "Hail to the Chief".
                    President Martinez also appears in Hannah Montana in the
                    episode "Take this Job and Love It". In the season 4 Hannah
                    Montana episode "Hannah Montana to the Principal's Office,"
                    a new president visits Hannah Montana, implying that
                    President had left office before July 18, 2010 (the date of
                    the episode).
                  </li>
                  <li>
                    Victor Baxter (Rondell Sheridan) is the personal chef of the
                    president in the White House. He is Cory and Raven Baxter's
                    father, and husband of Tanya Baxter. He often resolves
                    conflicts between other characters although he often
                    conflicts with Samantha Samuels. A running gag is that he
                    often embarrasses himself by misinterpreting what people say
                    to him. He also often says "I'll go pack..." when Cory gets
                    in trouble, and another of his catchphrases is "Here comes
                    the pain...". He is the rival of Leonard Stevenson.
                  </li>
                </ul>
              </div>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <h3 className="subtitle">Recurring cast</h3>
                <ul>
                  <li>
                    Jason Stickler (Jake Thomas), nicknamed "Stickman" by
                    himself, attends Washington Prep with the characters and is
                    the rival of Cory Baxter. He is also a classmate of Cory,
                    Newt and Meena's, and has proved to be their enemy. Stickler
                    has a crush on Meena and often disguises himself. He often
                    challenges Cory in humiliating ways to win her heart, even
                    though it is obvious that Meena has no feelings for him. The
                    son of the head of the CIA, he is equipped with all of the
                    latest CIA technology. Jason often uses the CIA devices to
                    his own benefit, although his plans usually go wrong. He is
                    also sometimes seen with a 1980s-style haircut and is very
                    proficient with the keyboard.
                  </li>
                  <li>
                    Samantha Samuels (Lisa Arch) is President Richard Martinez's
                    Personal Assistant. She is very strict and likes things fit
                    to the President's needs. She hates Cory's schemes in which
                    he tries to make money, which end up involving the
                    President. Chef Victor affectionately describes Samantha as
                    "overly stressed". She likes bird calls, and can do them
                    better than the President. Samantha does however have a soft
                    side which she showed to Sophie during her slumber party in
                    "I Ain't Got No Rhythm" as it was her first slumber party
                    and she was ecstatic. Sophie sometimes assigns her to do her
                    homework. It is revealed in "The Presidential Seal" that
                    Samantha has heterochromia, when she said that she only had
                    one gray eye.
                  </li>
                  <li>
                    Candy Smiles (Jordan Puryear) is a girl who attends
                    Washington Prep and has a 4.0 Grade Point Average. She hates
                    the lack of pep in the school in the "Smell of School
                    Spirit". She went out with Cory a couple of times and in "We
                    Don't Have Chemistry" they share a kiss. She is also best
                    friends with Meena and has a black belt in karate revealed
                    in We Have No Chemistry. She also tutored Cory in Chemistry
                    because he was about to go to summer school. She went out
                    with a guy named Juan Carlos making Cory jealous in "Macho
                    Libre". She has also been to Mexico and likes Mexican
                    things. She also knows where a certain pressure point is on
                    the body, and whenever she is angry at Cory, she'll use it
                    on him.
                  </li>
                  <li>
                    Ms. Flowers (Lori Alan) is Sophie's fourth-grade teacher.
                    She also teaches Tanisha and Haley, who sit at the front of
                    her classroom. Her lessons are often about random things,
                    such as penguins and tumbleweeds. She is a good friend of
                    President Martinez but tries not to let this affect how she
                    teaches Sophie. She is very friendly but is a hard grader
                    and always gives Sophie grades of B−, even when Samantha
                    does Sophie's homework for her. Ms. Flowers tends to tell
                    her students too much about her personal life, on one
                    occasion mentioning that her online dates never call her
                    back.
                  </li>
                  <li>
                    Tanisha (Zolee Griggs) is a bratty, spoiled 4th grader who
                    is one of Sophie's classmates. As claimed by Sophie, she is
                    the most popular girl in her class. She is one of the
                    Sunshine Girls with Sophie. Tanisha cheated her way to being
                    class president by fake crying.
                  </li>
                  <li>
                    Haley (Brianne Tju) is one of Sophie's best friends, and
                    somewhat high-strung. She is terrified of school or any kind
                    of work. Haley is a Sunshine Girl, like Tanisha and Sophie,
                    and was part of Sophie's singing group "The Pink Cupcakes"
                    along with Tanisha.
                  </li>
                </ul>
              </div>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <h3 className="subtitle">Guest stars</h3>
                <ul>
                  <li>Raven-Symoné as Raven Baxter</li>
                  <li>Dwayne "The Rock" Johnson as Himself</li>
                  <li>Don Stark as Prime Minister Schozoff</li>
                  <li>George Takei as Ronald</li>
                  <li>Josie Loren as Jessica</li>
                  <li>Lupe Ontiveros as Mama Martinez</li>
                  <li>Christa B. Allen as Cheyenne</li>
                  <li>Bobb'e J. Thompson as Stanley</li>
                  <li>Fred Stoller as Norman Trumbles</li>
                  <li>Michael Steger as Juan Carlos</li>
                  <li>Bailee Madison as Maya</li>
                  <li>Mary Chris Wall as Professor Bushwick</li>
                  <li>Kate Micucci as Becky</li>
                  <li>Lee Reherman as Slade</li>
                  <li>Tanya Chisholm as Nicole</li>
                </ul>
              </div>
            </div>
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center">Production</h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <p>
                  After the completion of That's So Raven, propositions were
                  made for a spin-off including That's So Raven Too! which was
                  accompanied by a soundtrack of the same name, and would have
                  been about Raven going off to college. Raven-Symoné was
                  offered the spin-off, but she declined it, therefore Disney
                  Channel decided to give it to Kyle Massey. Raven-Symoné would
                  later return for the Raven's Home spin-off in 2017.
                </p>
                <p>
                  The first episode aired on Disney Channel on January 12, 2007,
                  as a sneak peek. The show was created and produced by Dennis
                  Rinsler and Marc Warren, who previously produced That's So
                  Raven and Even Stevens, another Disney Channel show. Filming
                  for Cory in the House began on July 18, 2006, and concluded on
                  November 7, 2007, at Hollywood Center Studios (where The Suite
                  Life of Zack & Cody and That's So Raven were filmed) and used
                  a studio audience in most scenes.
                </p>
                <p>
                  Similar to Hannah Montana, many of the episode titles are
                  parodies of popular songs. For example, "We Built This Kitty
                  on Rock and Roll" comes from "We Built This City", "Mall of
                  Confusion" from "Ball of Confusion", "Smells Like School
                  Spirit" from "Smells Like Teen Spirit", and "Ain't Miss
                  Bahavian" from "Ain't Misbehavin'".
                </p>
                <h3 className="subtitle">Theme song and opening sequence</h3>
                <p>
                  The theme song to Cory in the House was written and produced
                  by Matthew Gerrard and Robbie Nevil, and performed by Kyle
                  Massey, Maiara Walsh, and Jason Dolley (though the closing
                  credits of the show credit the performance of the theme song
                  only to Massey). An alternate theme song, "Rollin' to D.C.",
                  is also sung by Massey and Walsh and was used in the music
                  video to promote the series.
                </p>
              </div>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <h3 className="subtitle">Filming and cancellation</h3>
                <p>
                  The show was intended to have a three-season run.[1] But while
                  filming a season two episode, where Cory goes overboard on a
                  large boat, an incident occurred. Since the boat was rented,
                  the production wasn't able to alter the boat like they
                  normally would by cutting a hole in the side. According to
                  Marc Warren, "the plan was for Kyle to say his lines at the
                  edge of the boat, then a stunt person would step in to leap
                  off the side of the boat, and drop onto a stack of thick
                  padded mats below. Instead, Kyle jumped over the edge of the
                  boat himself. Kyle thought it would be really funny if he did
                  the fall."[1] He went on to say, "So we yell cut, [Massey]
                  says, "I'm doing it," and he falls off the boat."[1]
                  Production designer Jerry Dunn, and that episode's director
                  Eric Dean Seaton, both recalled that Kyle had permission to do
                  the jump himself.[1]
                </p>
                <p>
                  Massey, who at the time was 16-years old, hit the mat at an
                  angle, rolled off, and smacked his head on the concrete
                  soundstage floor.[1] He was rushed to the hospital, being
                  trailed by concerned members of the crew.[1] Once medically
                  cleared, Massey returned to film additional episodes for the
                  season. After the accident, the 2007–08 Writers Guild of
                  America strike started and the show went on hiatus, and never
                  returned.[1] In 2010, the Massey family sued the production
                  company and a number of people involved, and alleged Kyle
                  suffered ongoing physical and mental pain for years after the
                  fall.[1] The case was dismissed before any proceedings.[1]
                  "The show kind of just fizzled out on a bad note between the
                  accident, the threat of the lawsuit, the writers strike,"
                  Dennis Rinsler said. "When it came time to settle the strike,
                  and get back to work, the network said to us, "no more, we're
                  done," and Cory was canceled."[1]
                </p>
              </div>
            </div>
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center">Broadcast</h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <p>
                  The series originally aired from January 12, 2007, to
                  September 12, 2008, on Disney Channel. The show returned to
                  Disney Channel on September 24, 2014, as part of Disney
                  Replay. It premiered on the same date on Family Channel and on
                  June 1, 2011, on Disney XD (Canada). In the United Kingdom and
                  Ireland it premiered on January 28, 2007, on Disney Channel
                  and on September 5, 2009, on Disney XD. It premiered on
                  February 2, 2007, on Disney Channel (Australia and New
                  Zealand),[2] on April 27, 2007, on Disney Channel (Southeast
                  Asia), and on June 9, 2007, on Disney Channel (India). The
                  show was initially planned to be added to the ABC Kids lineup
                  in the fall of 2007, but it was scrapped later on.[3]
                </p>
              </div>
            </div>
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center">Video Game</h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <p>
                  A video game based on the television series was released for
                  the Nintendo DS in 2008. In January 2026, a surge of positive
                  ratings driven by renewed interest in memes related to the
                  game caused it to become the second-highest-rated video game
                  on Metacritic by user score.[4]
                </p>
              </div>
            </div>
            <div className="relative z-1 w-full flex-col flex justify-center items-center">
              <h1 className="title text-center" data-short="GTM">
                References
              </h1>
              <div className="w-full flex flex-col justify-stretch pointer-events-auto">
                <ol>
                  <li>
                    {" "}
                    Spencer, Ashley (September 24, 2024). Disney High: The
                    Untold Story of the Rise and Fall of Disney Channel's Tween
                    Empire. St. Martin's Press. ISBN 9781250283450. Retrieved
                    March 17, 2025.
                  </li>
                  <li>
                    {" "}
                    Newsome, Brad (February 1, 2007). "Pay TV - Friday". The
                    Age. p. 18. Retrieved October 28, 2010.
                  </li>
                  <li>
                    {" "}
                    "Legacy Content". LaughingPlace.com. Retrieved July 29,
                    2023.
                  </li>
                  <li>
                    {" "}
                    Parker, Lewis (January 13, 2026). "Cory In The House
                    Fanatics Have Nearly Dethroned Clair Obscur As Metacritic's
                    Highest User-Rated Game". Kotaku. Kotaku. Retrieved January
                    14, 2026.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
