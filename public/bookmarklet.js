"use strict";(()=>{(function(){var B;let k="__webcade_host__",h=document.getElementById(k);if(h){(B=h.__cleanup)==null||B.call(h),h.remove();return}let f=document.createElement("div");f.id=k,f.style.cssText="all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: auto;",document.body.appendChild(f);let x=f.attachShadow({mode:"open"}),L=document.createElement("div");L.innerHTML=`
    <style>
      :host { color-scheme: dark; }
      .stage { position: fixed; inset: 0; background: rgba(8, 8, 12, 0.55); backdrop-filter: blur(2px); }
      canvas { position: fixed; inset: 0; display: block; cursor: none; }
      .hud {
        position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
        display: flex; gap: 10px; align-items: center;
        padding: 8px 10px 8px 14px; background: rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 999px;
        font: 600 13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px);
      }
      .pill { font-variant-numeric: tabular-nums; opacity: 0.85; }
      .pill b { color: #fff; opacity: 1; margin-left: 2px; }
      .pill + .pill::before { content: "\xB7"; margin-right: 10px; opacity: 0.4; }
      button.exit {
        all: unset; cursor: pointer; padding: 4px 12px; border-radius: 999px;
        background: rgba(255,255,255,0.14); color: #fff; font: 600 12px ui-sans-serif, system-ui, sans-serif;
      }
      button.exit:hover { background: rgba(255,255,255,0.22); }
      .toast {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        padding: 8px 14px; background: rgba(0,0,0,0.65); color: #fff;
        border-radius: 999px; font: 500 12px ui-sans-serif, system-ui, sans-serif;
        opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
      }
      .toast.show { opacity: 1; }
    </style>
    <div class="stage">
      <canvas></canvas>
      <div class="hud">
        <span class="pill">Score <b id="score">0</b></span>
        <span class="pill">Bricks <b id="bricks">0</b></span>
        <span class="pill">Lives <b id="lives">3</b></span>
        <button class="exit" type="button">Exit (Esc)</button>
      </div>
      <div class="toast" id="toast">Move mouse to control \xB7 Esc to exit</div>
    </div>
  `,x.appendChild(L);let m=x.querySelector("canvas"),i=m.getContext("2d"),P=x.querySelector("button.exit"),A=x.getElementById("score"),R=x.getElementById("bricks"),z=x.getElementById("lives"),C=x.getElementById("toast"),a=0,l=0;function S(){a=window.innerWidth,l=window.innerHeight;let n=Math.max(1,window.devicePixelRatio||1);m.width=Math.floor(a*n),m.height=Math.floor(l*n),m.style.width=a+"px",m.style.height=l+"px",i.setTransform(n,0,0,n,0,0)}S();let u=[];function g(){u.length=0;let n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(c){if(f.contains(c))return NodeFilter.FILTER_REJECT;let p=c.nodeValue;if(!p||!p.trim())return NodeFilter.FILTER_REJECT;let d=c.parentElement;if(!d)return NodeFilter.FILTER_REJECT;let r=d.tagName;if(r==="SCRIPT"||r==="STYLE"||r==="NOSCRIPT")return NodeFilter.FILTER_REJECT;let M=window.getComputedStyle(d);return M.display==="none"||M.visibility==="hidden"||M.opacity==="0"?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}}),o,s=200;for(;o=n.nextNode();){let c=document.createRange();c.selectNodeContents(o);let p=c.getClientRects();for(let d=0;d<p.length;d++){let r=p[d];r.width<14||r.height<8||r.bottom<0||r.top>l||r.right<0||r.left>a||(u.push({x:r.left,y:r.top,w:r.width,h:r.height,alive:!0,hue:s%360}),s+=13)}}R.textContent=String(u.length)}g();let t={w:140,h:14,x:a/2-70,y:l-60,color:"#fff"},e={x:a/2,y:l-100,vx:4.5,vy:-5.5,r:8},b=0,w=3,v=!0,y=!1,_=0;function E(){t.x=Math.max(0,Math.min(a-t.w,t.x)),e.x=t.x+t.w/2,e.y=t.y-20,e.vx=(Math.random()<.5?-1:1)*4.5,e.vy=-5.5}E(),C.classList.add("show");let J=window.setTimeout(()=>{C.classList.remove("show")},2400);function I(n){t.x=Math.max(0,Math.min(a-t.w,n.clientX-t.w/2))}function F(n){n.key==="Escape"?(n.preventDefault(),T()):n.key==="ArrowLeft"?t.x=Math.max(0,t.x-36):n.key==="ArrowRight"?t.x=Math.min(a-t.w,t.x+36):n.key===" "&&(!v||y)&&(b=0,w=3,v=!0,y=!1,g(),E())}function H(){S(),g()}window.addEventListener("mousemove",I,!0),window.addEventListener("keydown",F,!0),window.addEventListener("resize",H),P.addEventListener("click",()=>T());function T(){window.removeEventListener("mousemove",I,!0),window.removeEventListener("keydown",F,!0),window.removeEventListener("resize",H),cancelAnimationFrame(_),window.clearTimeout(J),f.remove()}f.__cleanup=T;function N(){if(v&&!y){if(e.x+=e.vx,e.y+=e.vy,e.x<e.r&&(e.x=e.r,e.vx=Math.abs(e.vx)),e.x>a-e.r&&(e.x=a-e.r,e.vx=-Math.abs(e.vx)),e.y<e.r&&(e.y=e.r,e.vy=Math.abs(e.vy)),e.y+e.r>=t.y&&e.y-e.r<=t.y+t.h&&e.x>=t.x-4&&e.x<=t.x+t.w+4&&e.vy>0){e.y=t.y-e.r-.1;let o=(e.x-(t.x+t.w/2))/(t.w/2),s=Math.min(11,Math.hypot(e.vx,e.vy)+.05),c=o*1.05;e.vx=s*Math.sin(c),e.vy=-Math.abs(s*Math.cos(c))}e.y>l+60&&(w-=1,z.textContent=String(w),w<=0?v=!1:E());let n=0;for(let o=0;o<u.length;o++){let s=u[o];if(s.alive&&(n++,e.x+e.r>s.x&&e.x-e.r<s.x+s.w&&e.y+e.r>s.y&&e.y-e.r<s.y+s.h)){s.alive=!1,b+=10;let c=s.x+s.w/2,p=s.y+s.h/2,d=(e.x-c)/(s.w/2),r=(e.y-p)/(s.h/2);Math.abs(d)>Math.abs(r)?e.vx=-e.vx:e.vy=-e.vy,n--}}R.textContent=String(n),A.textContent=String(b),n===0&&(y=!0)}i.clearRect(0,0,a,l);for(let n=0;n<u.length;n++){let o=u[n];o.alive&&(i.fillStyle=`hsla(${o.hue}, 80%, 56%, 0.82)`,i.fillRect(o.x,o.y,o.w,o.h),i.strokeStyle=`hsla(${o.hue}, 100%, 78%, 0.9)`,i.lineWidth=1,i.strokeRect(o.x+.5,o.y+.5,o.w-1,o.h-1))}i.fillStyle=t.color,i.fillRect(t.x,t.y,t.w,t.h),i.beginPath(),i.arc(e.x,e.y,e.r,0,Math.PI*2),i.fillStyle="#fff",i.fill(),(!v||y)&&(i.fillStyle="rgba(0,0,0,0.55)",i.fillRect(0,0,a,l),i.fillStyle="#fff",i.textAlign="center",i.font="600 48px ui-sans-serif, system-ui, sans-serif",i.fillText(y?"Page cleared.":"Game Over",a/2,l/2-8),i.font="16px ui-sans-serif, system-ui, sans-serif",i.fillText(`Score ${b}`,a/2,l/2+20),i.fillText("Press Space to play again \xB7 Esc to close",a/2,l/2+46)),_=requestAnimationFrame(N)}N()})();})();
