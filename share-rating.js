//Rate & Share button script v5 - single button
(function () {
  var RATE_WEBHOOK_URL = "https://hook.eu2.make.com/7touay6xs4s7ixo9rxn8hr9tyn8dp4gi";
  var DREAMABLE_URL = "https://dreamable-mvp.webflow.io";

  function ce(tag, attrs, children) {
    var el = document.createElement(tag);
    if (attrs) Object.entries(attrs).forEach(function(kv) {
      var k = kv[0], v = kv[1];
      if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k === "textContent") el.textContent = v;
      else if (k === "innerHTML") el.innerHTML = v;
      else if (k.startsWith("on")) el[k] = v;
      else el.setAttribute(k, v);
    });
    (children || []).forEach(function(c) { if (c) el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }

  var STYLE = '#dm-share-rating-global{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;overflow:visible!important;max-height:none!important;height:auto!important;width:100%!important;pointer-events:auto!important}'
    + '.dm-share-rating{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;overflow:visible!important;margin-top:28px;max-width:800px;margin-left:auto;margin-right:auto;padding:0 20px}'
    + '.dm-share{margin-bottom:28px;display:block!important;visibility:visible!important;position:relative}'
    + '.dm-share-main-btn{display:inline-flex!important;align-items:center;gap:8px;padding:12px 24px;border-radius:28px;font-size:15px;font-weight:600;text-decoration:none;cursor:pointer;border:2px solid #5856d6;background:#5856d6;color:#fff;transition:all .2s ease;font-family:inherit;visibility:visible!important;opacity:1!important}'
    + '.dm-share-main-btn:hover{background:#4745b5;border-color:#4745b5;transform:translateY(-1px);box-shadow:0 4px 12px rgba(88,86,214,.3)}'
    + '.dm-share-main-btn svg{width:20px;height:20px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
    + '.dm-share-dropdown{display:none;position:absolute;bottom:calc(100% + 8px);left:0;background:#fff;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.15);border:1px solid #e8e8e8;padding:8px;z-index:10000;min-width:220px}'
    + '.dm-share-dropdown.open{display:block!important}'
    + '.dm-share-dropdown-item{display:flex!important;align-items:center;gap:10px;padding:10px 14px;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none;cursor:pointer;border:none;background:transparent;color:#333;transition:background .15s;font-family:inherit;width:100%;text-align:left;visibility:visible!important}'
    + '.dm-share-dropdown-item:hover{background:#f5f5f5}'
    + '.dm-share-dropdown-item svg{width:20px;height:20px;flex-shrink:0}'
    + '.dm-share-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999}'
    + '.dm-share-overlay.open{display:block}'
    + '.dm-share-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#333;color:#fff;padding:10px 20px;border-radius:24px;font-size:14px;font-weight:500;opacity:0;transition:all .3s ease;z-index:99999;pointer-events:none}'
    + '.dm-share-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}'
    + '.dm-divider{border:none;border-top:1px solid #eee;margin:24px 0;display:block!important}'
    + '.dm-rating{display:block!important;visibility:visible!important}'
    + '.dm-rating-label{font-size:15px;font-weight:600;color:#333;margin-bottom:8px;display:block!important}'
    + '.dm-rating-sublabel{font-size:13px;color:#888;margin-bottom:14px;display:block!important}'
    + '.dm-stars{display:flex!important;gap:4px;margin-bottom:14px;visibility:visible!important}'
    + '.dm-star{width:36px;height:36px;cursor:pointer;transition:transform .15s ease;fill:#D1D1D6;stroke:none;display:inline-block!important;visibility:visible!important}'
    + '.dm-star:hover{transform:scale(1.15)}.dm-star.active{fill:#FFB800}.dm-star.hover-preview{fill:#FFD666}'
    + '.dm-comment-box{width:100%;max-width:460px;border:1.5px solid #e0e0e0;border-radius:12px;padding:10px 14px;font-size:14px;font-family:inherit;resize:vertical;min-height:60px;max-height:160px;transition:border-color .2s;box-sizing:border-box;display:block!important;visibility:visible!important}'
    + '.dm-comment-box:focus{border-color:#5856d6;outline:none}.dm-comment-box::placeholder{color:#bbb}'
    + '.dm-rating-submit{margin-top:12px;padding:10px 28px;border-radius:24px;border:none;background:#5856d6;color:#fff;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;font-family:inherit;display:inline-block!important;visibility:visible!important}'
    + '.dm-rating-submit:hover{background:#4745b5;transform:translateY(-1px)}.dm-rating-submit:disabled{background:#ccc;cursor:not-allowed;transform:none}'
    + '.dm-rating-thanks{display:none;padding:14px 18px;background:rgba(52,199,89,.08);border:1px solid rgba(52,199,89,.25);border-radius:12px;font-size:14px;color:#1a7a3a}.dm-rating-thanks.visible{display:block!important}';

  if (!document.getElementById("dm-share-rating-css")) {
    var s = ce("style", { id: "dm-share-rating-css" }); s.textContent = STYLE; document.head.appendChild(s);
  }

  // Icons
  var ICON_SHARE_BTN = '<svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var ICON_EMAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="#5856d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

  // Text builders
  function buildShareText(cn) {
    var n=(cn||"").trim();
    return n
      ? "Schau mal! "+n+" hat gerade ein magisches Abenteuer erlebt! \u2728\uD83C\uDF19 Erstelle auch eine personalisierte Geschichte f\u00FCr dein Kind: "+DREAMABLE_URL+"?utm_source=share"
      : "Schau mal! Mein Kind hat gerade ein magisches Abenteuer erlebt! \u2728\uD83C\uDF19 Erstelle auch eine personalisierte Geschichte f\u00FCr dein Kind: "+DREAMABLE_URL+"?utm_source=share";
  }
  function buildEmailSubject(cn) { var n=(cn||"").trim(); return n ? n+" hat ein magisches Abenteuer erlebt! \u2728" : "Mein Kind hat ein magisches Abenteuer erlebt! \u2728"; }
  function buildEmailBody(cn) {
    var n=(cn||"").trim();
    var intro = n ? "Hallo!\n\n"+n+" hat gerade eine wundersch\u00F6ne, personalisierte Geschichte erlebt \u2013 erstellt von Dreamable." : "Hallo!\n\nMein Kind hat gerade eine wundersch\u00F6ne, personalisierte Geschichte erlebt \u2013 erstellt von Dreamable.";
    return intro+"\n\nDreamable erstellt magische Geschichten, in denen dein Kind der Held ist.\n\nProbier es aus: "+DREAMABLE_URL+"?utm_source=share&utm_medium=email\n\nViele Gr\u00FC\u00DFe!";
  }

  function showToast(msg) {
    var old = document.querySelector(".dm-share-toast"); if (old) old.remove();
    var t = ce("div", { class: "dm-share-toast", textContent: msg });
    document.body.appendChild(t);
    setTimeout(function(){ t.classList.add("show"); }, 10);
    setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ t.remove(); }, 300); }, 2000);
  }

  // ===== SHARE SECTION =====
  function buildShareSection(childName) {
    var section = ce("div", { class: "dm-share" });
    var shareText = buildShareText(childName);
    var shareUrl = DREAMABLE_URL + "?utm_source=share";

    var mainBtn = ce("button", { class: "dm-share-main-btn", innerHTML: ICON_SHARE_BTN + " Geschichte teilen" });

    // MOBILE: native share dialog (shows WhatsApp, iMessage, Instagram etc.)
    if (navigator.share) {
      mainBtn.onclick = async function() {
        try {
          await navigator.share({
            title: childName ? childName+"s magisches Abenteuer" : "Ein magisches Abenteuer",
            text: shareText,
            url: shareUrl
          });
        } catch(e) { if (e.name !== "AbortError") console.warn("[Share]", e); }
      };
      section.appendChild(mainBtn);
      return section;
    }

    // DESKTOP: dropdown with options
    var overlay = ce("div", { class: "dm-share-overlay" });
    var dropdown = ce("div", { class: "dm-share-dropdown" });

    function close() { dropdown.classList.remove("open"); overlay.classList.remove("open"); }
    overlay.onclick = close;

    // WhatsApp
    dropdown.appendChild(ce("a", {
      class: "dm-share-dropdown-item",
      href: "https://wa.me/?text=" + encodeURIComponent(shareText),
      target: "_blank", rel: "noopener",
      innerHTML: ICON_WA + " WhatsApp",
      onclick: function() { close(); }
    }));

    // E-Mail
    dropdown.appendChild(ce("a", {
      class: "dm-share-dropdown-item",
      href: "mailto:?subject=" + encodeURIComponent(buildEmailSubject(childName)) + "&body=" + encodeURIComponent(buildEmailBody(childName)),
      innerHTML: ICON_EMAIL + " E-Mail",
      onclick: function() { close(); }
    }));

    // Link kopieren
    dropdown.appendChild(ce("button", {
      class: "dm-share-dropdown-item",
      innerHTML: ICON_COPY + " Link kopieren",
      onclick: function() {
        close();
        navigator.clipboard.writeText(shareUrl).then(function() {
          showToast("Link kopiert! \u2705");
        }).catch(function() {
          var ta = document.createElement("textarea");
          ta.value = shareUrl; ta.style.cssText = "position:fixed;opacity:0";
          document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
          showToast("Link kopiert! \u2705");
        });
      }
    }));

    mainBtn.onclick = function() {
      if (dropdown.classList.contains("open")) close();
      else { dropdown.classList.add("open"); overlay.classList.add("open"); }
    };

    section.appendChild(overlay);
    section.appendChild(dropdown);
    section.appendChild(mainBtn);
    return section;
  }

  // ===== RATING SECTION =====
  function buildRatingSection(requestId) {
    var section = ce("div", { class: "dm-rating" });
    var selectedRating = 0;
    var storageKey = "dm_rated_" + (requestId || "unknown");
    try { if (localStorage.getItem(storageKey)) { section.appendChild(ce("div", { class: "dm-rating-thanks visible", textContent: "Danke f\u00FCr deine Bewertung! \u2B50" })); return section; } } catch(e) {}

    section.appendChild(ce("span", { class: "dm-rating-label", textContent: "Wie hat euch die Geschichte gefallen?" }));
    section.appendChild(ce("span", { class: "dm-rating-sublabel", textContent: "Dein Feedback hilft uns, bessere Geschichten zu erstellen." }));

    var starsRow = ce("div", { class: "dm-stars" });
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      (function(idx) {
        var star = ce("div", { class: "dm-star", innerHTML: ICON_STAR, "data-value": String(idx) });
        var svg = star.querySelector("svg"); if (svg) svg.classList.add("dm-star");
        star.style.display = "inline-block";
        star.onmouseenter = function() { stars.forEach(function(s, j) { var sv = s.querySelector("svg") || s; if (j < idx) sv.classList.add("hover-preview"); else sv.classList.remove("hover-preview"); }); };
        star.onmouseleave = function() { stars.forEach(function(s) { (s.querySelector("svg") || s).classList.remove("hover-preview"); }); };
        star.onclick = function() { selectedRating = idx; stars.forEach(function(s, j) { var sv = s.querySelector("svg") || s; if (j < idx) { sv.classList.add("active"); sv.classList.remove("hover-preview"); } else { sv.classList.remove("active"); sv.classList.remove("hover-preview"); } }); submitBtn.disabled = false; };
        stars.push(star); starsRow.appendChild(star);
      })(i);
    }
    section.appendChild(starsRow);

    var commentBox = ce("textarea", { class: "dm-comment-box", placeholder: "Optional: Was hat euch besonders gefallen? Was k\u00F6nnen wir besser machen?" });
    section.appendChild(commentBox);

    var submitBtn = ce("button", { class: "dm-rating-submit", textContent: "Bewertung absenden", disabled: "true" });
    var thanksEl = ce("div", { class: "dm-rating-thanks", textContent: "Vielen Dank f\u00FCr deine Bewertung! \u2B50 Das hilft uns sehr." });
    section.appendChild(thanksEl);

    submitBtn.onclick = async function () {
      if (!selectedRating || !requestId) return;
      submitBtn.disabled = true; submitBtn.textContent = "Wird gesendet \u2026";
      try {
        var res = await fetch(RATE_WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request_id: requestId, rating: selectedRating, rating_comment: (commentBox.value || "").trim() }) });
        if (res.ok) {
          try { localStorage.setItem(storageKey, "1"); } catch (e) {}
          starsRow.style.display = "none"; commentBox.style.display = "none"; submitBtn.style.display = "none";
          var label = section.querySelector(".dm-rating-label"); if (label) label.style.display = "none";
          var sublabel = section.querySelector(".dm-rating-sublabel"); if (sublabel) sublabel.style.display = "none";
          thanksEl.classList.add("visible");
        } else { submitBtn.textContent = "Nochmal versuchen"; submitBtn.disabled = false; }
      } catch (err) { console.warn("[Rating]", err); submitBtn.textContent = "Nochmal versuchen"; submitBtn.disabled = false; }
    };
    section.appendChild(submitBtn);
    return section;
  }

  // ===== INJECTION =====
  function injectShareAndRating(worldKey, childName, requestId) {
    var cid = "dm-share-rating-global";
    var old = document.getElementById(cid); if (old) old.remove();
    var ss = document.getElementById("state-story"); if (!ss) return;

    var container = ce("div", { id: cid });
    ss.appendChild(container);

    var wrapper = ce("div", { class: "dm-share-rating" });
    wrapper.appendChild(buildShareSection(childName));
    wrapper.appendChild(ce("hr", { class: "dm-divider" }));
    var urlParams = new URLSearchParams(window.location.search);
    var token = urlParams.get("t") || urlParams.get("token") || requestId || "";
    wrapper.appendChild(buildRatingSection(token));
    container.appendChild(wrapper);

    // Force overflow visible on ancestors
    var p = container.parentElement;
    while (p && p !== document.body) {
      if (getComputedStyle(p).overflow === "hidden") p.style.overflow = "visible";
      p = p.parentElement;
    }
    console.log("[ShareRating] v5 injected");
  }

  window.__dreamableInjectShareRating = injectShareAndRating;

  // ===== AUTO-DETECT =====
  function tryInject() {
    var target = document.getElementById("state-story");
    if (!target || target.hidden) return false;
    var worlds = ["aa", "kp", "sb"];
    for (var i = 0; i < worlds.length; i++) {
      var w = worlds[i], el = document.getElementById("world-" + w);
      if (el && !el.hidden) {
        var u = new URLSearchParams(window.location.search);
        injectShareAndRating(w, "", u.get("t") || u.get("token") || "");
        return true;
      }
    }
    return false;
  }

  var pc = 0;
  function poll() { if (tryInject()) return; pc++; if (pc < 120) setTimeout(poll, 500); }

  var obs = new MutationObserver(function() { tryInject(); });
  function start() {
    var t = document.getElementById("state-story");
    if (t) obs.observe(t, { attributes: true, attributeFilter: ["hidden","style"], childList: true });
    poll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
