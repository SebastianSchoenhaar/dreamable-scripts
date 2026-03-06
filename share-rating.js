//Rate & Share button script v7 - passive (called by showStory)
// Changes from v6:
// - 3 share text variants (proud, screenfree, tired) instead of generic text
// - Story title included in share text
// - UTM tracking per variant (utm_content=proud/screenfree/tired)
// - Bottom sheet UI on mobile instead of instant native share
// - Updated function signature: injectShareAndRating(worldKey, childName, requestId, storyTitle)
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

  // ===== CSS =====
  var STYLE = '#dm-share-rating-global{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;overflow:visible!important;max-height:none!important;height:auto!important;width:100%!important;pointer-events:auto!important}'
    + '.dm-share-rating{display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;overflow:visible!important;margin-top:28px;max-width:800px;margin-left:auto;margin-right:auto;padding:0 20px}'
    + '.dm-share{margin-bottom:28px;display:block!important;visibility:visible!important;position:relative}'
    + '.dm-share-main-btn{display:inline-flex!important;align-items:center;gap:8px;padding:12px 24px;border-radius:28px;font-size:15px;font-weight:600;text-decoration:none;cursor:pointer;border:2px solid #5856d6;background:#5856d6;color:#fff;transition:all .2s ease;font-family:inherit;visibility:visible!important;opacity:1!important}'
    + '.dm-share-main-btn:hover{background:#4745b5;border-color:#4745b5;transform:translateY(-1px);box-shadow:0 4px 12px rgba(88,86,214,.3)}'
    + '.dm-share-main-btn svg{width:20px;height:20px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'
    // Bottom sheet (mobile + desktop fallback)
    + '.dm-share-sheet-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:99998;opacity:0;transition:opacity .25s ease}'
    + '.dm-share-sheet-overlay.open{display:block;opacity:1}'
    + '.dm-share-sheet{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -8px 40px rgba(0,0,0,.15);z-index:99999;padding:20px 20px 32px;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1)}'
    + '.dm-share-sheet.open{display:block;transform:translateY(0)}'
    + '.dm-share-sheet-handle{width:36px;height:4px;background:#ddd;border-radius:4px;margin:0 auto 16px}'
    + '.dm-share-sheet-title{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:4px}'
    + '.dm-share-sheet-sub{font-size:13px;color:#888;margin-bottom:16px}'
    + '.dm-share-variant{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:14px;cursor:pointer;border:1.5px solid #eee;background:#fafafa;margin-bottom:10px;transition:all .15s ease;text-align:left;width:100%}'
    + '.dm-share-variant:hover{border-color:#5856d6;background:#f8f7ff}'
    + '.dm-share-variant:active{transform:scale(.98)}'
    + '.dm-share-variant-emoji{font-size:24px;flex-shrink:0;line-height:1}'
    + '.dm-share-variant-text{flex:1}'
    + '.dm-share-variant-label{font-size:14px;font-weight:600;color:#333;margin-bottom:2px}'
    + '.dm-share-variant-preview{font-size:12px;color:#888;line-height:1.4}'
    + '.dm-share-channels{display:flex;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid #eee}'
    + '.dm-share-channel-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 12px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #eee;background:#fff;color:#333;transition:all .15s}'
    + '.dm-share-channel-btn:hover{border-color:#5856d6;background:#f8f7ff}'
    + '.dm-share-channel-btn svg{width:18px;height:18px;flex-shrink:0}'
    // Toast
    + '.dm-share-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#333;color:#fff;padding:10px 20px;border-radius:24px;font-size:14px;font-weight:500;opacity:0;transition:all .3s ease;z-index:99999;pointer-events:none}'
    + '.dm-share-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}'
    // Divider + rating (unchanged from v6)
    + '.dm-divider{border:none;border-top:1px solid #eee;margin:24px 0;display:block!important}'
    + '.dm-hidden{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important}'
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

  // ===== Icons =====
  var ICON_SHARE_BTN = '<svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var ICON_EMAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="#5856d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var ICON_STAR = '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

  // ===== Share text variants =====
  function buildShareVariants(childName, storyTitle) {
    var n = (childName || "").trim();
    var t = (storyTitle || "").trim();
    var displayName = n || "mein Kind";

    return [
      {
        key: "proud",
        emoji: "\uD83D\uDCD6",
        label: "Geschichte teilen",
        text: (t ? "\u201E" + t + "\u201C \u2014 " : "")
            + "Eine Geschichte nur f\u00FCr " + displayName
            + ", mit echtem Namen, echten Orten und echten Freunden! \uD83C\uDF1F\n"
            + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=proud",
        emailSubject: (t ? t + " \u2014 " : "") + "Eine personalisierte Geschichte f\u00FCr " + displayName + "! \uD83C\uDF1F",
        emailBody: "Hallo!\n\n"
            + (t ? 'Wir haben gerade "' + t + '" erstellt \u2014 ' : "Wir haben gerade ")
            + "eine personalisierte Geschichte, in der " + displayName + " der Held ist.\n\n"
            + "Dreamable erstellt einzigartige Geschichten mit echtem Namen, echten Orten und echten Freunden deines Kindes.\n\n"
            + "Probier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=proud\n\n"
            + "Viele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=proud"
      },
      {
        key: "screenfree",
        emoji: "\uD83D\uDCF5",
        label: "Bildschirmfrei-Tipp teilen",
        text: "Wir haben eine Alternative zu Bildschirmzeit entdeckt: personalisierte H\u00F6rgeschichten, in denen "
            + displayName + " der Held ist. Bildschirmfrei & perfekt zum Einschlafen \uD83D\uDCA4\n"
            + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=screenfree",
        emailSubject: "Bildschirmfrei-Tipp: Personalisierte H\u00F6rgeschichten \uD83D\uDCA4",
        emailBody: "Hallo!\n\n"
            + "Wir haben eine tolle Alternative zu Bildschirmzeit entdeckt: Dreamable erstellt personalisierte H\u00F6rgeschichten, in denen "
            + displayName + " der Held ist.\n\n"
            + "Komplett bildschirmfrei, perfekt zum Einschlafen, und jede Geschichte ist einzigartig.\n\n"
            + "Probier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=screenfree\n\n"
            + "Viele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=screenfree"
      },
      {
        key: "tired",
        emoji: "\uD83D\uDE05",
        label: "Eltern-Tipp teilen",
        text: "Wenn dein Kind auch zum 100. Mal dieselbe Geschichte h\u00F6ren will: "
            + "Dreamable erstellt jedes Mal eine neue, personalisierte Geschichte mit deinem Kind als Held. "
            + "Echte Rettung f\u00FCr m\u00FCde Eltern \uD83D\uDE05\n"
            + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=tired",
        emailSubject: "Nie wieder dieselbe Geschichte 100x vorlesen \uD83D\uDE05",
        emailBody: "Hallo!\n\n"
            + "Kennst du das? Zum hundertsten Mal dieselbe Geschichte vorlesen?\n\n"
            + "Dreamable erstellt jedes Mal eine NEUE, personalisierte Geschichte \u2014 mit dem Namen, den Orten und den Interessen deines Kindes.\n\n"
            + "Probier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=tired\n\n"
            + "Viele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=tired"
      }
    ];
  }

  function showToast(msg) {
    var old = document.querySelector(".dm-share-toast"); if (old) old.remove();
    var t = ce("div", { class: "dm-share-toast", textContent: msg });
    document.body.appendChild(t);
    setTimeout(function(){ t.classList.add("show"); }, 10);
    setTimeout(function(){ t.classList.remove("show"); setTimeout(function(){ t.remove(); }, 300); }, 2000);
  }

  // ===== SHARE SECTION (v7: bottom sheet with variants) =====
  function buildShareSection(childName, storyTitle) {
    var section = ce("div", { class: "dm-share" });
    var variants = buildShareVariants(childName, storyTitle);

    // Main button
    var mainBtn = ce("button", { class: "dm-share-main-btn", innerHTML: ICON_SHARE_BTN + " Geschichte teilen" });

    // Overlay
    var overlay = ce("div", { class: "dm-share-sheet-overlay" });

    // Bottom sheet
    var sheet = ce("div", { class: "dm-share-sheet" });
    sheet.appendChild(ce("div", { class: "dm-share-sheet-handle" }));
    sheet.appendChild(ce("div", { class: "dm-share-sheet-title", textContent: "Geschichte teilen" }));
    sheet.appendChild(ce("div", { class: "dm-share-sheet-sub", textContent: "W\u00E4hle eine Nachricht, die zu dir passt:" }));

    // Selected variant state
    var selectedVariant = null;
    var channelRow = null;

    function closeSheet() {
      sheet.classList.remove("open");
      overlay.classList.remove("open");
      // Reset selection
      selectedVariant = null;
      sheet.querySelectorAll(".dm-share-variant").forEach(function(v) {
        v.style.borderColor = "#eee";
        v.style.background = "#fafafa";
      });
      if (channelRow) channelRow.style.display = "none";
    }

    overlay.onclick = closeSheet;

    // Variant buttons
    variants.forEach(function(v) {
      var variantEl = ce("div", { class: "dm-share-variant" });
      variantEl.appendChild(ce("span", { class: "dm-share-variant-emoji", textContent: v.emoji }));
      var textWrap = ce("div", { class: "dm-share-variant-text" });
      textWrap.appendChild(ce("div", { class: "dm-share-variant-label", textContent: v.label }));
      // Preview: first 60 chars of share text
      var preview = v.text.substring(0, 80).replace(/\n/g, " ");
      if (v.text.length > 80) preview += "\u2026";
      textWrap.appendChild(ce("div", { class: "dm-share-variant-preview", textContent: preview }));
      variantEl.appendChild(textWrap);

      variantEl.onclick = function() {
        selectedVariant = v;
        // Highlight selected
        sheet.querySelectorAll(".dm-share-variant").forEach(function(el) {
          el.style.borderColor = "#eee";
          el.style.background = "#fafafa";
        });
        variantEl.style.borderColor = "#5856d6";
        variantEl.style.background = "#f8f7ff";
        // Show channel buttons
        if (channelRow) channelRow.style.display = "flex";
      };

      sheet.appendChild(variantEl);
    });

    // Channel buttons (WhatsApp, Email, Link kopieren)
    channelRow = ce("div", { class: "dm-share-channels", style: { display: "none" } });

    // WhatsApp
    var waBtn = ce("button", { class: "dm-share-channel-btn", innerHTML: ICON_WA + " WhatsApp" });
    waBtn.onclick = function() {
      if (!selectedVariant) return;
      window.open("https://wa.me/?text=" + encodeURIComponent(selectedVariant.text), "_blank");
      closeSheet();
    };
    channelRow.appendChild(waBtn);

    // Email
    var emailBtn = ce("button", { class: "dm-share-channel-btn", innerHTML: ICON_EMAIL + " E-Mail" });
    emailBtn.onclick = function() {
      if (!selectedVariant) return;
      window.location.href = "mailto:?subject=" + encodeURIComponent(selectedVariant.emailSubject) + "&body=" + encodeURIComponent(selectedVariant.emailBody);
      closeSheet();
    };
    channelRow.appendChild(emailBtn);

    // Copy link
    var copyBtn = ce("button", { class: "dm-share-channel-btn", innerHTML: ICON_COPY + " Link" });
    copyBtn.onclick = function() {
      if (!selectedVariant) return;
      var url = selectedVariant.copyUrl;
      navigator.clipboard.writeText(url).then(function() {
        showToast("Link kopiert! \u2705");
      }).catch(function() {
        var ta = document.createElement("textarea");
        ta.value = url; ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
        showToast("Link kopiert! \u2705");
      });
      closeSheet();
    };
    channelRow.appendChild(copyBtn);

    sheet.appendChild(channelRow);

    // Main button opens sheet
    mainBtn.onclick = function() {
      sheet.classList.add("open");
      overlay.classList.add("open");
    };

    section.appendChild(overlay);
    section.appendChild(sheet);
    section.appendChild(mainBtn);
    return section;
  }

  // ===== RATING SECTION (unchanged from v6) =====
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
          starsRow.classList.add("dm-hidden");
          commentBox.classList.add("dm-hidden");
          submitBtn.classList.add("dm-hidden");
          var label = section.querySelector(".dm-rating-label"); if (label) label.classList.add("dm-hidden");
          var sublabel = section.querySelector(".dm-rating-sublabel"); if (sublabel) sublabel.classList.add("dm-hidden");
          thanksEl.classList.add("visible");
        } else { submitBtn.textContent = "Nochmal versuchen"; submitBtn.disabled = false; }
      } catch (err) { console.warn("[Rating]", err); submitBtn.textContent = "Nochmal versuchen"; submitBtn.disabled = false; }
    };
    section.appendChild(submitBtn);
    return section;
  }

  // ===== INJECTION (called by showStory) =====
  // v7: added storyTitle parameter
  function injectShareAndRating(worldKey, childName, requestId, storyTitle) {
    var cid = "dm-share-rating-global";
    var old = document.getElementById(cid); if (old) old.remove();
    var ss = document.getElementById("state-story"); if (!ss) return;

    var container = ce("div", { id: cid });
    ss.appendChild(container);

    var wrapper = ce("div", { class: "dm-share-rating" });
    wrapper.appendChild(buildShareSection(childName, storyTitle));
    wrapper.appendChild(ce("hr", { class: "dm-divider" }));
    wrapper.appendChild(buildRatingSection(requestId));
    container.appendChild(wrapper);

    // Force overflow visible on ancestors
    var p = container.parentElement;
    while (p && p !== document.body) {
      if (getComputedStyle(p).overflow === "hidden") p.style.overflow = "visible";
      p = p.parentElement;
    }
    console.log("[ShareRating] v7 injected", { worldKey: worldKey, childName: childName, storyTitle: storyTitle });
  }

  // Register globally
  window.__dreamableInjectShareRating = injectShareAndRating;
  console.log("[ShareRating] v7 ready (passive)");
})();
