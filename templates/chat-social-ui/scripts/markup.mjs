// Static markup + CSS for both scenes. Everything is positioned from schedule/theme numbers (no DOM measuring).
import { T, content } from "./theme.mjs";

const C = T.colors;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const heartPath =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
const replyPath =
  "M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z";
const repostPath = "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z";

export const css = `
@font-face{font-family:"Inter";src:url("fonts/inter-latin-400-normal.woff2") format("woff2");font-weight:400}
@font-face{font-family:"Inter";src:url("fonts/inter-latin-500-normal.woff2") format("woff2");font-weight:500}
@font-face{font-family:"Inter";src:url("fonts/inter-latin-600-normal.woff2") format("woff2");font-weight:600}
@font-face{font-family:"Inter";src:url("fonts/inter-latin-700-normal.woff2") format("woff2");font-weight:700}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${T.rootW}px;height:${T.H}px;overflow:hidden;background:${C.bg}}
#root{position:absolute;left:0;top:0;width:${T.rootW}px;height:${T.H}px;background:${C.bg};font-family:"Inter",sans-serif;color:${C.recvText}}
.scene{position:absolute;left:0;top:0;width:${T.artW}px;height:${T.H}px}
.abs{position:absolute}
/* header */
#header{left:0;top:${T.headerTop}px;width:${T.artW}px;height:${T.headerH}px;border-bottom:1px solid ${C.inputFill};background:${C.bg}}
#header .back{left:40px;top:50px;width:28px;height:50px}
.avatar{border-radius:50%;background:linear-gradient(135deg,#55555D,#2B2B31);display:flex;align-items:center;justify-content:center;font-weight:600;color:${C.recvText}}
#header .avatar{left:92px;top:27px;width:96px;height:96px;font-size:40px}
#header .name{left:212px;top:32px;font-size:36px;line-height:44px;font-weight:600;color:${C.recvText}}
#header .status{left:212px;top:78px;font-size:30px;line-height:38px;font-weight:500;color:${C.meta}}
/* thread */
#viewport{left:0;top:${T.threadTop}px;width:${T.artW}px;height:${T.threadH}px;overflow:hidden}
#thread{left:0;top:0;width:${T.artW}px;height:2400px}
.ts{left:0;width:${T.artW}px;text-align:center;font-size:30px;line-height:40px;font-weight:500;color:${C.meta};opacity:0}
.bubble{font-size:${T.bubbleFont}px;line-height:${T.lineH}px;font-weight:400;padding:${T.padY}px ${T.padX}px;border-radius:${T.radius}px;white-space:nowrap;opacity:0}
.bubble.me{right:${T.sideMargin}px;background:${C.sentFill};color:${C.sentText};border-bottom-right-radius:${T.tailRadius}px}
.bubble.them{left:${T.sideMargin}px;background:${C.recvFill};color:${C.recvText};border-bottom-left-radius:${T.tailRadius}px}
.typing{left:${T.sideMargin}px;width:${T.typingW}px;height:${T.typingH}px;border-radius:${T.typingH / 2}px;border-bottom-left-radius:${T.tailRadius}px;background:${C.recvFill};display:flex;align-items:center;justify-content:center;gap:16px;opacity:0}
.typing i{display:block;width:16px;height:16px;border-radius:50%;background:${C.recvText}}
.receipt{right:${T.sideMargin + 8}px;font-size:30px;line-height:36px;font-weight:500;color:${C.meta};text-align:right;opacity:0;width:300px}
.receipt span{position:absolute;right:0;top:0;opacity:0}
.chip{left:-26px;top:-30px;width:60px;height:60px;border-radius:50%;background:${C.recvFill};border:5px solid ${C.bg};display:flex;align-items:center;justify-content:center;opacity:0}
.chip svg{width:30px;height:30px;fill:${C.accent}}
/* input bar */
#input{left:${T.sideMargin}px;top:${T.inputTop}px;width:${T.artW - T.sideMargin * 2}px;height:${T.inputH}px;border-radius:${T.inputH / 2}px;background:${C.inputFill};border:2px solid ${C.inputBorder}}
#input .ph{left:36px;top:0;line-height:${T.inputH - 4}px;font-size:38px;color:${C.meta}}
#input .typed{left:36px;top:0;line-height:${T.inputH - 4}px;font-size:40px;color:${C.recvText};white-space:nowrap}
#input .caret{top:20px;width:3px;height:44px;background:${C.sentFill}}
#input .disc{right:10px;top:10px;width:64px;height:64px;border-radius:50%;background:${C.recvFill}}
#input .disc svg{position:absolute;left:16px;top:16px;width:32px;height:32px}
/* feed */
#cardscene{opacity:0}
.post{left:${(T.artW - T.cardW) / 2}px;width:${T.cardW}px;border-radius:40px;background:${C.cardFill};border:2px solid ${C.cardBorder};opacity:0}
#post{top:${T.cardTop}px;height:${T.postH}px}
.post .avatar{left:40px;top:40px;width:88px;height:88px;font-size:38px}
.post .pname{left:148px;top:44px;font-size:36px;line-height:44px;font-weight:600}
.post .phandle{left:148px;top:90px;font-size:30px;line-height:38px;font-weight:500;color:${C.meta}}
.post .headline{left:40px;top:156px;font-size:104px;line-height:112px;font-weight:700;letter-spacing:-2px;color:${C.recvText}}
.post .body{left:40px;top:284px;font-size:44px;line-height:55px;font-weight:400;color:${C.recvText};white-space:nowrap}
.post .rule{left:40px;top:${T.postH - 40 - 44 - 24 - 2}px;width:${T.cardW - 84}px;height:2px;background:${C.cardBorder}}
.post .stats{left:40px;top:${T.postH - 40 - 44}px;height:44px;display:flex;gap:56px;align-items:center;font-size:32px;font-weight:600}
.post .stat{display:flex;align-items:center;gap:14px;color:${C.recvText}}
.post .stat svg{width:40px;height:40px;fill:${C.meta}}
.post .stat.like svg{fill:${C.accent}}
#comment{top:${T.cardTop + T.postH + T.cardGap}px;height:204px}
#comment .avatar{left:32px;top:32px;width:72px;height:72px;font-size:32px}
#comment .cname{left:128px;top:30px;font-size:32px;line-height:40px;font-weight:600}
#comment .cbody{left:128px;top:76px;font-size:40px;line-height:50px;font-weight:400;white-space:nowrap}
`;

const sendArrow = `<svg viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`;

export function chatMarkup(S) {
  const p = content.parties;
  const bubbles = S.msgs
    .map((m) => {
      const lines = m.lines.map(esc).join("<br>");
      let h = "";
      if (m.from === "them") {
        h += `<div id="typ${m.id}" class="abs typing" style="top:${m.top}px"><i></i><i></i><i></i></div>`;
      }
      h += `<div id="b${m.id}" class="abs bubble ${m.from}" style="top:${m.top}px;height:${m.h}px">${lines}`;
      if (m.reaction) h += `<div id="chip${m.id}" class="abs chip" data-layout-allow-overflow><svg viewBox="0 0 24 24"><path d="${heartPath}"/></svg></div>`;
      h += `</div>`;
      if (m.hasReceipt) {
        h += `<div id="rc${m.id}" class="abs receipt" style="top:${m.top + m.h + 6}px"><span class="d">Delivered</span><span class="r">Read</span></div>`;
      }
      return h;
    })
    .join("\n        ");
  return `
    <section id="chat" class="scene clip" data-start="0" data-duration="${(S.fadeOutAt + T.fadeOut) / T.fps}" data-track-index="0">
      <div id="header" class="abs">
        <svg class="abs back" viewBox="0 0 28 50" fill="none" stroke="${C.sentFill}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 5L5 25l17 20"/></svg>
        <div class="abs avatar">${p.them.initial}</div>
        <div class="abs name">${esc(p.them.name)}</div>
        <div class="abs status">${esc(p.them.status)}</div>
      </div>
      <div id="viewport" class="abs">
        <div id="thread" class="abs" data-layout-allow-overflow style="top:0">
        <div id="ts" class="abs ts" style="top:${S.ts.top + 12}px">${esc(content.timestamp)}</div>
        ${bubbles}
        </div>
      </div>
      <div id="input" class="abs">
        <div id="ph" class="abs ph">${esc(content.inputPlaceholder)}</div>
        <div id="typed" class="abs typed"></div>
        <div id="caret" class="abs caret" style="left:36px"></div>
        <div id="disc" class="abs disc">${sendArrow}</div>
      </div>
    </section>`;
}

export function postMarkup(S) {
  const po = content.post;
  const me = content.parties.me;
  const body = po.body.map(esc).join("<br>");
  const cm = po.comment.lines.map(esc).join("<br>");
  const stat = (cls, path, id) =>
    `<div class="stat ${cls}"><svg viewBox="0 0 24 24"><path d="${path}"/></svg><span id="${id}">0</span></div>`;
  return `
    <section id="cardscene" class="scene clip" data-start="${S.cardAt / T.fps}" data-duration="${(T.totalFrames - S.cardAt) / T.fps}" data-track-index="1">
      <div id="post" class="abs post">
        <div class="abs avatar">${me.initial}</div>
        <div class="abs pname">${esc(me.name)}</div>
        <div class="abs phandle">${esc(me.handle)} &middot; ${esc(po.time)}</div>
        <div class="abs headline">${esc(po.headline)}</div>
        <div class="abs body">${body}</div>
        <div class="abs rule"></div>
        <div class="abs stats">
          ${stat("like", heartPath, "nLikes")}
          ${stat("reply", replyPath, "nReplies")}
          ${stat("repost", repostPath, "nReposts")}
        </div>
      </div>
      <div id="comment" class="abs post">
        <div class="abs avatar">${content.parties.them.initial}</div>
        <div class="abs cname">${esc(po.comment.name)}</div>
        <div class="abs cbody">${cm}</div>
      </div>
    </section>`;
}
