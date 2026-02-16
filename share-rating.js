//Rate & Share button script
(function () {
  // ===================== CONFIG =====================
  const RATE_WEBHOOK_URL = "https://hook.eu2.make.com/7touay6xs4s7ixo9rxn8hr9tyn8dp4gi";
  const DREAMABLE_URL = "https://www.dreamable.kids";
  // ==================================================

  /* ---------- helpers ---------- */
  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function ce(tag, attrs, children) {
    const el = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k === "textContent") el.textContent = v;
      else if (k === "innerHTML") el.innerHTML = v;
      else if (k.startsWith("on")) el[k] = v;
      else el.setAttribute(k, v);
    });
    (children || []).forEach(c => { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }

  /* ---------- CSS injection (once) ---------- */
  const STYLE = `
    .dm-share-rating { margin-top: 28px; }

    /* ---- SHARE SECTION ---- */
    .dm-share { margin-bottom: 28px; }
    .dm-share-label {
      font-size: 14px; font-weight: 600; color: #444;
      margin-bottom: 10px; display: block;
    }
    .dm-share-buttons { display: flex; gap: 10px; flex-wrap: wrap; }
    .dm-share-btn {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 8px 16px; border-radius: 24px;
      font-size: 14px; font-weight: 500;
      text-decoration: none; cursor: pointer;
      border: 1.5px solid #e0e0e0; background: #fff; color: #333;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .dm-share-btn:hover { background: #f5f5f5; border-color: #ccc; transform: translateY(-1px); }
    .dm-share-btn svg { width: 18px; height: 18px; flex-shrink: 0; }

    .dm-share-btn--wa { border-color: #25D366; color: #128C7E; }
    .dm-share-btn--wa:hover { background: #e8faf0; }

    .dm-share-btn--email { border-color: #5856d6; color: #5856d6; }
    .dm-share-btn--email:hover { background: #f0f0ff; }

    .dm-share-btn--native { border-color: #FF9500; color: #FF9500; }
    .dm-share-btn--native:hover { background: #fff8f0; }

    .dm-share-btn--copy { border-color: #8E8E93; color: #555; }
    .dm-share-btn--copy:hover { background: #f5f5f5; }

    .dm-share-copied {
      font-size: 12px; color: #34C759; font-weight: 500;
      margin-left: 6px; opacity: 0; transition: opacity 0.3s;
    }
    .dm-share-copied.visible { opacity: 1; }

    /* ---- DIVIDER ---- */
    .dm-divider {
      border: none; border-top: 1px solid #eee; margin: 24px 0;
    }

    /* ---- RATING SECTION ---- */
    .dm-rating { }
    .dm-rating-label {
      font-size: 15px; font-weight: 600; color: #333;
      margin-bottom: 8px; display: block;
    }
    .dm-rating-sublabel {
      font-size: 13px; color: #888; margin-bottom: 14px; display: block;
    }
    .dm-stars { display: flex; gap: 4px; margin-bottom: 14px; }
    .dm-star {
      width: 36px; height: 36px; cursor: pointer;
      transition: transform 0.15s ease;
      fill: #D1D1D6; stroke: none;
    }
    .dm-star:hover { transform: scale(1.15); }
    .dm-star.active { fill: #FFB800; }
    .dm-star.hover-preview { fill: #FFD666; }

    .dm-comment-box {
      width: 100%; max-width: 460px;
      border: 1.5px solid #e0e0e0; border-radius: 12px;
      padding: 10px 14px; font-size: 14px;
      font-family: inherit; resize: vertical;
      min-height: 60px; max-height: 160px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    .dm-comment-box:focus { border-color: #5856d6; outline: none; }
    .dm-comment-box::placeholder { color: #bbb; }

    .dm-rating-submit {
      margin-top: 12px; padding: 10px 28px;
      border-radius: 24px; border: none;
      background: #5856d6; color: #fff;
      font-size: 14px; font-weight: 600;
      cursor: pointer; transition: all 0.2s;
      font-family: inherit;
    }
    .dm-rating-submit:hover { background: #4745b5; transform: translateY(-1px); }
    .dm-rating-submit:disabled {
      background: #ccc; cursor: not-allowed; transform: none;
    }

    .dm-rating-thanks {
      display: none; padding: 14px 18px;
      background: rgba(52, 199, 89, 0.08);
      border: 1px solid rgba(52, 199, 89, 0.25);
      border-radius: 12px; font-size: 14px; color: #1a7a3a;
    }
    .dm-rating-thanks.visible { display: block; }
  `;

  if (!document.getElementById("dm-share-rating-css")) {
    const styleEl = ce("style", { id: "dm-share-rating-css" });
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);
  }

  /* ---------- SVG Icons ---------- */
  const ICON_WA = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  const ICON_EMAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;

  const ICON_SHARE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>`;

  const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  const ICON_STAR = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

  /* ---------- share text builder ---------- */
  function buildShareText(childName) {
    const name = (childName || "").trim();
    if (name) {
      return `Schau mal! ${name} hat gerade ein magisches Abenteuer erlebt! ✨🌙 Erstelle auch eine personalisierte Geschichte für dein Kind: ${DREAMABLE_URL}?utm_source=share`;
    }
    return `Schau mal! Mein Kind hat gerade ein magisches Abenteuer erlebt! ✨🌙 Erstelle auch eine personalisierte Geschichte für dein Kind: ${DREAMABLE_URL}?utm_source=share`;
  }

  function buildEmailSubject(childName) {
    const name = (childName || "").trim();
    if (name) return `${name} hat ein magisches Abenteuer erlebt! ✨`;
    return `Mein Kind hat ein magisches Abenteuer erlebt! ✨`;
  }

  function buildEmailBody(childName) {
    const name = (childName || "").trim();
    const intro = name
      ? `Hallo!\n\n${name} hat gerade eine wunderschöne, personalisierte Geschichte erlebt – erstellt von Dreamable.`
      : `Hallo!\n\nMein Kind hat gerade eine wunderschöne, personalisierte Geschichte erlebt – erstellt von Dreamable.`;
    return `${intro}\n\nDreamable erstellt magische Geschichten, in denen dein Kind der Held ist. Jede Geschichte ist einzigartig und wird speziell für dein Kind erstellt.\n\nProbier es aus: ${DREAMABLE_URL}?utm_source=share&utm_medium=email\n\nViele Grüße!`;
  }

  /* ---------- build share UI ---------- */
  function buildShareSection(childName) {
    const section = ce("div", { class: "dm-share" });

    section.appendChild(
      ce("span", { class: "dm-share-label", textContent: "Geschichte teilen" })
    );

    const btnRow = ce("div", { class: "dm-share-buttons" });
    const shareText = buildShareText(childName);
    const shareUrl = `${DREAMABLE_URL}?utm_source=share`;

    // 1) WhatsApp
    const waUrl = "https://wa.me/?text=" + encodeURIComponent(shareText);
    const waBtn = ce("a", {
      class: "dm-share-btn dm-share-btn--wa",
      href: waUrl,
      target: "_blank",
      rel: "noopener",
      innerHTML: ICON_WA + " WhatsApp"
    });
    btnRow.appendChild(waBtn);

    // 2) E-Mail
    const emailUrl = "mailto:?subject=" +
      encodeURIComponent(buildEmailSubject(childName)) +
      "&body=" + encodeURIComponent(buildEmailBody(childName));
    const emailBtn = ce("a", {
      class: "dm-share-btn dm-share-btn--email",
      href: emailUrl,
      innerHTML: ICON_EMAIL + " E-Mail"
    });
    btnRow.appendChild(emailBtn);

    // 3) Native Share (mobile: zeigt Instagram, TikTok, Pinterest etc.)
    if (navigator.share) {
      const nativeBtn = ce("button", {
        class: "dm-share-btn dm-share-btn--native",
        innerHTML: ICON_SHARE + " Mehr teilen",
        onclick: async function () {
          try {
            await navigator.share({
              title: childName
                ? `${childName}s magisches Abenteuer – Dreamable`
                : "Ein magisches Abenteuer – Dreamable",
              text: shareText,
              url: shareUrl
            });
          } catch (e) {
            if (e.name !== "AbortError") console.warn("[Share] error:", e);
          }
        }
      });
      btnRow.appendChild(nativeBtn);
    }

    // 4) Link kopieren (Desktop-Fallback + generell nützlich)
    const copiedSpan = ce("span", { class: "dm-share-copied", textContent: "Kopiert!" });
    const copyBtn = ce("button", {
      class: "dm-share-btn dm-share-btn--copy",
      innerHTML: ICON_COPY + " Link kopieren",
      onclick: function () {
        navigator.clipboard.writeText(shareUrl).then(() => {
          copiedSpan.classList.add("visible");
          setTimeout(() => copiedSpan.classList.remove("visible"), 2000);
        }).catch(() => {
          // Fallback für ältere Browser
          const ta = ce("textarea", { style: { position: "fixed", opacity: "0" } });
          ta.value = shareUrl;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
          copiedSpan.classList.add("visible");
          setTimeout(() => copiedSpan.classList.remove("visible"), 2000);
        });
      }
    });
    btnRow.appendChild(copyBtn);
    btnRow.appendChild(copiedSpan);

    section.appendChild(btnRow);
    return section;
  }

  /* ---------- build rating UI ---------- */
  function buildRatingSection(requestId) {
    const section = ce("div", { class: "dm-rating" });
    let selectedRating = 0;

    // check localStorage if already rated
    const storageKey = "dm_rated_" + (requestId || "unknown");
    if (localStorage.getItem(storageKey)) {
      const thanks = ce("div", {
        class: "dm-rating-thanks visible",
        textContent: "Danke für deine Bewertung! ⭐"
      });
      section.appendChild(thanks);
      return section;
    }

    section.appendChild(
      ce("span", { class: "dm-rating-label", textContent: "Wie hat euch die Geschichte gefallen?" })
    );
    section.appendChild(
      ce("span", { class: "dm-rating-sublabel", textContent: "Dein Feedback hilft uns, bessere Geschichten zu erstellen." })
    );

    // Stars
    const starsRow = ce("div", { class: "dm-stars" });
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const star = ce("div", {
        class: "dm-star",
        innerHTML: ICON_STAR,
        "data-value": String(i)
      });
      star.querySelector("svg").classList.add("dm-star");
      star.style.display = "inline-block";

      star.onmouseenter = () => {
        stars.forEach((s, idx) => {
          const svg = s.querySelector("svg") || s;
          if (idx < i) svg.classList.add("hover-preview");
          else svg.classList.remove("hover-preview");
        });
      };
      star.onmouseleave = () => {
        stars.forEach(s => {
          const svg = s.querySelector("svg") || s;
          svg.classList.remove("hover-preview");
        });
      };
      star.onclick = () => {
        selectedRating = i;
        stars.forEach((s, idx) => {
          const svg = s.querySelector("svg") || s;
          if (idx < i) { svg.classList.add("active"); svg.classList.remove("hover-preview"); }
          else { svg.classList.remove("active"); svg.classList.remove("hover-preview"); }
        });
        submitBtn.disabled = false;
      };

      stars.push(star);
      starsRow.appendChild(star);
    }
    section.appendChild(starsRow);

    // Comment
    const commentBox = ce("textarea", {
      class: "dm-comment-box",
      placeholder: "Optional: Was hat euch besonders gefallen? Was können wir besser machen?"
    });
    section.appendChild(commentBox);

    // Submit
    const submitBtn = ce("button", {
      class: "dm-rating-submit",
      textContent: "Bewertung absenden",
      disabled: "true"
    });

    // Thanks message (hidden initially)
    const thanksEl = ce("div", {
      class: "dm-rating-thanks",
      textContent: "Vielen Dank für deine Bewertung! ⭐ Das hilft uns sehr."
    });
    section.appendChild(thanksEl);

    submitBtn.onclick = async function () {
      if (!selectedRating || !requestId) return;

      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet …";

      try {
        const res = await fetch(RATE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request_id: requestId,
            rating: selectedRating,
            rating_comment: (commentBox.value || "").trim()
          })
        });

        // Akzeptiere jede 2xx Antwort als Erfolg
        if (res.ok || res.status === 200 || res.status === 202) {
          // Speichere in localStorage, dass diese Story bereits bewertet wurde
          try { localStorage.setItem(storageKey, "1"); } catch (e) {}

          // UI: verstecke Eingabe, zeige Danke
          starsRow.style.display = "none";
          commentBox.style.display = "none";
          submitBtn.style.display = "none";
          const label = section.querySelector(".dm-rating-label");
          const sublabel = section.querySelector(".dm-rating-sublabel");
          if (label) label.style.display = "none";
          if (sublabel) sublabel.style.display = "none";
          thanksEl.classList.add("visible");
        } else {
          submitBtn.textContent = "Nochmal versuchen";
          submitBtn.disabled = false;
        }
      } catch (err) {
        console.warn("[Rating] submit error:", err);
        submitBtn.textContent = "Nochmal versuchen";
        submitBtn.disabled = false;
      }
    };

    section.appendChild(submitBtn);
    return section;
  }

  /* ---------- MAIN: inject into story output ---------- */
  // This function is called by the story output script after rendering
  // We expose it globally so it can be called, OR we use a MutationObserver
  function injectShareAndRating(worldKey, childName, requestId) {
    const containerId = worldKey + "-share-rating-container";
    let container = document.getElementById(containerId);

    // Fallback: wenn kein Webflow-Container existiert, hängen wir
    // ans Ende des world-Wrappers an
    if (!container) {
      const worldWrapper = document.getElementById("world-" + worldKey);
      if (worldWrapper) {
        container = ce("div", { id: containerId });
        worldWrapper.appendChild(container);
      }
    }

    if (!container) {
      console.warn("[ShareRating] No container found for world:", worldKey);
      return;
    }

    // Verhindere Doppel-Injection
    if (container.dataset.injected === "true") return;
    container.dataset.injected = "true";

    const wrapper = ce("div", { class: "dm-share-rating" });

    // 1) Share
    wrapper.appendChild(buildShareSection(childName));

    // 2) Divider
    wrapper.appendChild(ce("hr", { class: "dm-divider" }));

    // 3) Rating
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("t") || urlParams.get("token") || requestId || "";
    wrapper.appendChild(buildRatingSection(token));

    container.appendChild(wrapper);
  }

  // Expose globally so the main script can call it
  window.__dreamableInjectShareRating = injectShareAndRating;

  /* ---------- AUTO-DETECT: observe state-story visibility ---------- */
  // Falls die Hauptskript-Integration nicht manuell gemacht wird,
  // beobachten wir automatisch wann state-story sichtbar wird
  const observer = new MutationObserver(() => {
    const storyState = document.getElementById("state-story");
    if (!storyState || storyState.hidden) return;

    // Finde die sichtbare Welt
    const worlds = ["aa", "kp", "sb"];
    for (const w of worlds) {
      const worldEl = document.getElementById("world-" + w);
      if (worldEl && !worldEl.hidden && worldEl.offsetParent !== null) {
        // Child-Name aus dem Titel extrahieren
        const titleEl = document.getElementById(w + "-story-title");
        const titleText = titleEl ? titleEl.textContent : "";

        // request_id aus URL
        const urlParams = new URLSearchParams(window.location.search);
        const requestId = urlParams.get("t") || urlParams.get("token") || "";

        // Child-Name: wir versuchen es aus dem URL oder lassen es leer
        // (der Share-Text funktioniert auch ohne)
        const childName = ""; // wird ggf. vom Hauptscript übergeben

        injectShareAndRating(w, childName, requestId);
        break;
      }
    }
  });

  // Starte Observer sobald DOM ready
  function startObserver() {
    const target = document.getElementById("state-story");
    if (target) {
      observer.observe(target, { attributes: true, attributeFilter: ["hidden", "style"] });
      // Check auch sofort falls schon sichtbar
      if (!target.hidden) {
        setTimeout(() => observer.disconnect() || observer.observe(target, { attributes: true }), 100);
      }
    } else {
      setTimeout(startObserver, 500);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }
})();
