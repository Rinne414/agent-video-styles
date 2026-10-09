import React from "react";
import { useCurrentFrame } from "remotion";
import { Globe, Laptop, Server } from "lucide-react";
import { draw, pop, ramp } from "./anim";
import { ARC_D, LINKS, POS } from "./layout";
import { ArcPath, Defs, Link, Node } from "./Primitives";
import { Q, cameraAt, track } from "./story";
import { seg } from "./timeline";
import { C, L } from "./theme";
import { HookScene } from "./scenes/Hook";
import { ProblemScene } from "./scenes/Problem";
import { FixScene } from "./scenes/Fix";
import { CacheScene } from "./scenes/Cache";
import { ResultScene } from "./scenes/Result";
import { OutroScene } from "./scenes/Outro";

const SCENE_FADE = 14;

/** Persistent diagram nodes + links, wrapped in the moving camera. */
export const World: React.FC = () => {
  const f = useCurrentFrame();
  const cam = cameraAt(f);
  const tx = 960 - cam.cx * cam.s;
  const ty = 540 - cam.cy * cam.s;

  const outroStart = seg("s7").start;
  const diagVis = 1 - 0.97 * ramp(f, outroStart - 4, Infinity, SCENE_FADE);
  const row2Vis = track(f, [
    [seg("s4").start - 6, 1],
    [seg("s4").start + 6, 0],
    [seg("s6").start - 4, 0],
    [seg("s6").start + 10, 1],
  ]);

  const resultOn = ramp(f, seg("s6").start, Infinity, 10);
  const accentOf = (base: string) => (resultOn > 0.5 ? C.result : base);

  // focus windows: 1 = active, 0 = dimmed
  const userTFocus = Math.max(ramp(f, Q.tokyo, Q.fixEnd - 20), ramp(f, Q.first, Q.crowdEnd), resultOn);
  const userPFocus = Math.max(ramp(f, Q.paris, Q.hookEnd), ramp(f, Q.edge + 8, Q.fixEnd - 20), resultOn);
  const edgeTFocus = Math.max(ramp(f, Q.edge, Q.crowdEnd), resultOn);
  const edgePFocus = Math.max(ramp(f, Q.edge + 8, Q.fixEnd - 20), resultOn);
  const originFocus = Math.max(
    ramp(f, Q.originIn, Q.fixes),
    ramp(f, Q.asks, Q.copy),
    ramp(f, Q.far2, Q.everyone),
    ramp(f, Q.each, Q.fixEnd - 20),
  );

  const originAccent = f < Q.fixes ? C.problem : C.primary;
  const edgeTAccent = ramp(f, Q.hit, Q.million) > 0.5 || resultOn > 0.5 ? C.result : C.primary;

  const slotFull = f >= Q.keeps;
  const slotPop = pop(f, Q.keeps);
  const slotColor = C.result;

  // links
  const arcP = draw(f, Q.far, 40);
  const arcOpacity = (1 - ramp(f, Q.fixes, Infinity, 12)) * diagVis;
  const utEt = draw(f, Q.close, 14);
  const upEp = draw(f, Q.close + 10, 14);
  const etOr = draw(f, Q.each, 18);
  const epOr = draw(f, Q.each + 8, 18);
  const linkNeutral = "rgba(255,255,255,0.6)";
  const etOrColor = ramp(f, Q.asks, Q.copy + 6) > 0.5 ? C.problem : resultOn > 0.5 ? C.result : linkNeutral;
  const utEtColor = ramp(f, Q.first, Q.crowdEnd) > 0.5 || resultOn > 0.5 ? (resultOn > 0.5 || ramp(f, Q.hit, Q.million) > 0.5 ? C.result : C.primary) : linkNeutral;
  const upEpColor = resultOn > 0.5 ? C.result : linkNeutral;
  const epOrColor = resultOn > 0.5 ? C.result : linkNeutral;
  const row2Op = row2Vis * diagVis;
  // Paris user is parked while the problem is told (it would sit under the captions)
  const userPVis = row2Op * (1 - ramp(f, seg("s2").start - 4, Q.edge, 8));

  const dotX = -cam.cx * cam.s * 0.25;
  const dotY = -cam.cy * cam.s * 0.25;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 2px, transparent 2.5px)",
          backgroundSize: "40px 40px",
          backgroundPosition: `${dotX}px ${dotY}px`,
        }}
      />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <Defs />
        <g transform={`translate(${tx} ${ty}) scale(${cam.s})`}>
          <ArcPath d={ARC_D} progress={arcP} color={C.problem} opacity={arcOpacity * 0.85} />

          <Link from={LINKS.userTEdgeT[0]} to={LINKS.userTEdgeT[1]} progress={utEt} color={utEtColor} opacity={diagVis} />
          <Link from={LINKS.edgeTOrigin[0]} to={LINKS.edgeTOrigin[1]} progress={etOr} color={etOrColor} opacity={diagVis} dashed={resultOn < 0.5 && etOrColor === linkNeutral} />
          <Link from={LINKS.userPEdgeP[0]} to={LINKS.userPEdgeP[1]} progress={upEp} color={upEpColor} opacity={row2Op} />
          <Link from={LINKS.edgePOrigin[0]} to={LINKS.edgePOrigin[1]} progress={epOr} color={epOrColor} opacity={row2Op} dashed={resultOn < 0.5} />

          <Node center={POS.userT} Icon={Laptop} label={L.userTokyo} appear={pop(f, Q.tokyo)} focus={userTFocus} accent={accentOf(C.primary)} vis={diagVis} />
          <Node center={POS.userP} Icon={Laptop} label={L.userParis} appear={pop(f, Q.paris)} focus={userPFocus} accent={accentOf(C.primary)} vis={userPVis} />
          <Node center={POS.origin} Icon={Server} label={L.origin} appear={pop(f, Q.originIn)} focus={originFocus} accent={accentOf(originAccent)} vis={diagVis} cache={{ state: "full", pop: 1, color: C.muted }} />
          <Node
            center={POS.edgeT}
            Icon={Globe}
            label={L.edgeTokyo}
            appear={pop(f, Q.edge)}
            focus={edgeTFocus}
            accent={accentOf(edgeTAccent)}
            vis={diagVis}
            cache={{ state: slotFull ? "full" : "empty", pop: slotPop, color: slotColor }}
          />
          <Node
            center={POS.edgeP}
            Icon={Globe}
            label={L.edgeParis}
            appear={pop(f, Q.edge + 8)}
            focus={edgePFocus}
            accent={accentOf(C.primary)}
            vis={row2Op}
            cache={{ state: resultOn > 0.5 ? "full" : "empty", pop: 1, color: slotColor }}
          />

          <g opacity={diagVis}>
            <HookScene f={f} />
            <ProblemScene f={f} />
            <FixScene f={f} />
            <CacheScene f={f} />
            <ResultScene f={f} />
          </g>
        </g>
      </svg>
      <OutroScene f={f} />
    </>
  );
};
