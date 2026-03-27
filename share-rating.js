//Rate & Share button script v8 - native Webflow elements
// Changes from v7:
// - Uses native Webflow elements instead of generating DOM
// - Only bottom sheet overlay is JS-generated
// - SB-Explanation gets "Wissensblatt teilen" with specific share texts
// - Stars use opacity toggle on existing Webflow elements
// - ~60% less code than v7
(function () {
  var RATE_WEBHOOK_URL = "https://hook.eu2.make.com/7touay6xs4s7ixo9rxn8hr9tyn8dp4gi";
  var DREAMABLE_URL = "https://dreamable.kids";

  var $ = function(id) { return document.getElementById(id); };

  // ===== Minimal CSS (only bottom sheet + toast + stars) =====
  var STYLE = '.dm-sheet-overlay{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:99998;opacity:0;transition:opacity .25s ease}'
    + '.dm-sheet-overlay.open{display:block;opacity:1}'
    + '.dm-sheet{display:none;position:fixed;bottom:0;left:0;right:0;background:#fff;border-radius:20px 20px 0 0;box-shadow:0 -8px 40px rgba(0,0,0,.15);z-index:99999;padding:20px 20px 32px;transform:translateY(100%);transition:transform .3s cubic-bezier(.32,.72,0,1)}'
    + '.dm-sheet.open{display:block;transform:translateY(0)}'
    + '.dm-sheet-handle{width:36px;height:4px;background:#ddd;border-radius:4px;margin:0 auto 16px}'
    + '.dm-sheet-title{font-size:16px;font-weight:700;color:#1a1a2e;margin-bottom:4px}'
    + '.dm-sheet-sub{font-size:13px;color:#888;margin-bottom:16px}'
    + '.dm-sheet-variant{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;border-radius:14px;cursor:pointer;border:1.5px solid #eee;background:#fafafa;margin-bottom:10px;transition:all .15s ease;text-align:left;width:100%}'
    + '.dm-sheet-variant:hover{border-color:#5856d6;background:#f8f7ff}'
    + '.dm-sheet-channels{display:none;gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid #eee}'
    + '.dm-sheet-channels.open{display:flex}'
    + '.dm-sheet-ch-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 12px;border-radius:12px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #eee;background:#fff;color:#333;transition:all .15s}'
    + '.dm-sheet-ch-btn:hover{border-color:#5856d6;background:#f8f7ff}'
    + '.dm-sheet-ch-btn svg{width:18px;height:18px;flex-shrink:0}'
    + '.dm-toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(20px);background:#333;color:#fff;padding:10px 20px;border-radius:24px;font-size:14px;font-weight:500;opacity:0;transition:all .3s ease;z-index:99999;pointer-events:none}'
    + '.dm-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}';

  if (!$("dm-css-v8")) {
    var s = document.createElement("style");
    s.id = "dm-css-v8";
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  // ===== Icons =====
  var ICON_WA = '<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';
  var ICON_EMAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="#5856d6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>';
  var ICON_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  // ===== Toast =====
  function showToast(msg) {
    var old = document.querySelector(".dm-toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.className = "dm-toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.classList.add("show"); }, 10);
    setTimeout(function() { t.classList.remove("show"); setTimeout(function() { t.remove(); }, 300); }, 2000);
  }

  // ===== Share Variants =====
  function buildVariants(childName, storyTitle, isExplanation) {
    var n = (childName || "").trim();
    var t = (storyTitle || "").trim();
    var d = n || "mein Kind";

    if (isExplanation) {
      return [
        {
          key: "wissensblatt", emoji: "\uD83E\uDDE0", label: "Wissensblatt teilen",
          text: (t ? "\"" + t + "\" \u2014 " : "") + "Schlauberger hat es " + d + " erkl\u00E4rt \u2014 mit Wow-Fakt und Probier-Tipp! \uD83E\uDD8A\n" + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=wissensblatt",
          emailSubject: (t ? t + " \u2014 " : "") + "Schlauberger hat es " + d + " erkl\u00E4rt! \uD83E\uDD8A",
          emailBody: "Hallo!\n\n" + (t ? "Wir haben gerade \"" + t + "\" erkl\u00E4rt bekommen \u2014 " : "") + "Schlauberger erkl\u00E4rt Kindern die Welt, mit Wow-Fakt und Probier-Tipp zum Nachmachen!\n\nProbier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=wissensblatt\n\nViele Gr\u00FC\u00DFe!",
          copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=wissensblatt"
        },
        {
          key: "neugier", emoji: "\uD83D\uDCA1", label: "Neugier-Tipp teilen",
          text: d + " wollte wissen: " + (t ? "\"" + t + "\"" : "eine spannende Frage") + ". Dreamable erkl\u00E4rt Kinderfragen kindgerecht \u2014 mit Wow-Fakt und Experiment! \uD83D\uDD2C\n" + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=neugier",
          emailSubject: "Kinderfragen kindgerecht beantwortet \uD83D\uDCA1",
          emailBody: "Hallo!\n\n" + d + " wollte wissen: " + (t ? "\"" + t + "\"" : "eine spannende Frage") + ".\n\nDreamable erkl\u00E4rt Kinderfragen kindgerecht \u2014 mit Wow-Fakt und Experiment zum Nachmachen.\n\nProbier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=neugier\n\nViele Gr\u00FC\u00DFe!",
          copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=neugier"
        }
      ];
    }

    return [
      {
        key: "proud", emoji: "\uD83D\uDCD6", label: "Geschichte teilen",
        text: (t ? "\u201E" + t + "\u201C \u2014 " : "") + "Eine Geschichte nur f\u00FCr " + d + ", mit echtem Namen, echten Orten und echten Freunden! \uD83C\uDF1F\n" + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=proud",
        emailSubject: (t ? t + " \u2014 " : "") + "Eine personalisierte Geschichte f\u00FCr " + d + "! \uD83C\uDF1F",
        emailBody: "Hallo!\n\n" + (t ? "Wir haben gerade \"" + t + "\" erstellt \u2014 " : "Wir haben gerade ") + "eine personalisierte Geschichte, in der " + d + " der Held ist.\n\nDreamable erstellt einzigartige Geschichten mit echtem Namen, echten Orten und echten Freunden deines Kindes.\n\nProbier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=proud\n\nViele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=proud"
      },
      {
        key: "screenfree", emoji: "\uD83D\uDCF5", label: "Bildschirmfrei-Tipp teilen",
        text: "Wir haben eine Alternative zu Bildschirmzeit entdeckt: personalisierte H\u00F6rgeschichten, in denen " + d + " der Held ist. Bildschirmfrei & perfekt zum Einschlafen \uD83D\uDCA4\n" + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=screenfree",
        emailSubject: "Bildschirmfrei-Tipp: Personalisierte H\u00F6rgeschichten \uD83D\uDCA4",
        emailBody: "Hallo!\n\nWir haben eine tolle Alternative zu Bildschirmzeit entdeckt: Dreamable erstellt personalisierte H\u00F6rgeschichten, in denen " + d + " der Held ist.\n\nKomplett bildschirmfrei, perfekt zum Einschlafen, und jede Geschichte ist einzigartig.\n\nProbier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=screenfree\n\nViele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=screenfree"
      },
      {
        key: "tired", emoji: "\uD83D\uDE05", label: "Eltern-Tipp teilen",
        text: "Wenn dein Kind auch zum 100. Mal dieselbe Geschichte h\u00F6ren will: Dreamable erstellt jedes Mal eine neue, personalisierte Geschichte mit deinem Kind als Held. Echte Rettung f\u00FCr m\u00FCde Eltern \uD83D\uDE05\n" + DREAMABLE_URL + "?utm_source=share&utm_medium=whatsapp&utm_content=tired",
        emailSubject: "Nie wieder dieselbe Geschichte 100x vorlesen \uD83D\uDE05",
        emailBody: "Hallo!\n\nKennst du das? Zum hundertsten Mal dieselbe Geschichte vorlesen?\n\nDreamable erstellt jedes Mal eine NEUE, personalisierte Geschichte \u2014 mit dem Namen, den Orten und den Interessen deines Kindes.\n\nProbier es kostenlos aus: " + DREAMABLE_URL + "?utm_source=share&utm_medium=email&utm_content=tired\n\nViele Gr\u00FC\u00DFe!",
        copyUrl: DREAMABLE_URL + "?utm_source=share&utm_medium=copy&utm_content=tired"
      }
    ];
  }

  // ===== Bottom Sheet (JS-generated, only overlay UI) =====
  var sheetOverlay = null;
  var sheetEl = null;
  var channelRow = null;
  var selectedVariant = null;

  function createSheet() {
    if (sheetOverlay) return;

    sheetOverlay = document.createElement("div");
    sheetOverlay.className = "dm-sheet-overlay";
    sheetOverlay.onclick = closeSheet;

    sheetEl = document.createElement("div");
    sheetEl.className = "dm-sheet";
    sheetEl.innerHTML = '<div class="dm-sheet-handle"></div>'
      + '<div class="dm-sheet-title" id="dm-sheet-title">Geschichte teilen</div>'
      + '<div class="dm-sheet-sub">W\u00E4hle eine Nachricht, die zu dir passt:</div>'
      + '<div id="dm-sheet-variants"></div>';

    // Channel buttons
    channelRow = document.createElement("div");
    channelRow.className = "dm-sheet-channels";

    var waBtn = document.createElement("button");
    waBtn.className = "dm-sheet-ch-btn";
    waBtn.innerHTML = ICON_WA + " WhatsApp";
    waBtn.onclick = function() {
      if (selectedVariant) window.open("https://wa.me/?text=" + encodeURIComponent(selectedVariant.text), "_blank");
      closeSheet();
    };

    var emailBtn = document.createElement("button");
    emailBtn.className = "dm-sheet-ch-btn";
    emailBtn.innerHTML = ICON_EMAIL + " E-Mail";
    emailBtn.onclick = function() {
      if (selectedVariant) window.location.href = "mailto:?subject=" + encodeURIComponent(selectedVariant.emailSubject) + "&body=" + encodeURIComponent(selectedVariant.emailBody);
      closeSheet();
    };

    var copyBtn = document.createElement("button");
    copyBtn.className = "dm-sheet-ch-btn";
    copyBtn.innerHTML = ICON_COPY + " Link";
    copyBtn.onclick = function() {
      if (!selectedVariant) return;
      navigator.clipboard.writeText(selectedVariant.copyUrl).then(function() {
        showToast("Link kopiert! \u2705");
      }).catch(function() {
        var ta = document.createElement("textarea");
        ta.value = selectedVariant.copyUrl;
        ta.style.cssText = "position:fixed;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast("Link kopiert! \u2705");
      });
      closeSheet();
    };

    channelRow.appendChild(waBtn);
    channelRow.appendChild(emailBtn);
    channelRow.appendChild(copyBtn);
    sheetEl.appendChild(channelRow);

    document.body.appendChild(sheetOverlay);
    document.body.appendChild(sheetEl);
  }

  function openSheet(variants, isExplanation) {
    createSheet();
    selectedVariant = null;
    channelRow.classList.remove("open");

    var title = $("dm-sheet-title");
    if (title) title.textContent = isExplanation ? "Wissensblatt teilen" : "Geschichte teilen";

    var container = $("dm-sheet-variants");
    container.innerHTML = "";

    variants.forEach(function(v) {
      var el = document.createElement("div");
      el.className = "dm-sheet-variant";
      var preview = v.text.substring(0, 80).replace(/\n/g, " ");
      if (v.text.length > 80) preview += "\u2026";
      el.innerHTML = '<span style="font-size:24px;flex-shrink:0;line-height:1">' + v.emoji + '</span>'
        + '<div style="flex:1"><div style="font-size:14px;font-weight:600;color:#333;margin-bottom:2px">' + v.label + '</div>'
        + '<div style="font-size:12px;color:#888;line-height:1.4">' + preview + '</div></div>';
      el.onclick = function() {
        selectedVariant = v;
        container.querySelectorAll(".dm-sheet-variant").forEach(function(x) {
          x.style.borderColor = "#eee";
          x.style.background = "#fafafa";
        });
        el.style.borderColor = "#5856d6";
        el.style.background = "#f8f7ff";
        channelRow.classList.add("open");
      };
      container.appendChild(el);
    });

    sheetOverlay.classList.add("open");
    sheetEl.classList.add("open");
  }

  function closeSheet() {
    if (sheetOverlay) sheetOverlay.classList.remove("open");
    if (sheetEl) sheetEl.classList.remove("open");
  }

  // ===== RATING (native Webflow elements) =====
  function setupRating(requestId) {
    var starsRow = $("dm-stars-row");
    var comment = $("dm-comment");
    var submitBtn = $("dm-btn-submit");
    var thanks = $("dm-thanks");
    var label = $("dm-rating-label");
    var sublabel = $("dm-rating-sublabel");

    if (!starsRow || !submitBtn) return;

    var selectedRating = 0;
    var storageKey = "dm_rated_" + (requestId || "unknown");

    // Already rated?
    try {
      if (localStorage.getItem(storageKey)) {
        if (starsRow) starsRow.style.display = "none";
        if (comment) comment.style.display = "none";
        if (submitBtn) submitBtn.style.display = "none";
        if (label) label.style.display = "none";
        if (sublabel) sublabel.style.display = "none";
        if (thanks) thanks.style.display = "block";
        return;
      }
    } catch(e) {}

    // Setup stars
    var stars = [];
    for (var i = 1; i <= 5; i++) {
      var star = $("dm-star-" + i);
      if (star) {
        star.style.cursor = "pointer";
        star.style.opacity = "0.3";
        star.style.transition = "transform 0.15s ease, opacity 0.15s ease";
        stars.push(star);
      }
    }

    stars.forEach(function(star, idx) {
      star.onmouseenter = function() {
        stars.forEach(function(s, j) {
          s.style.opacity = (j <= idx) ? "0.6" : "0.3";
          s.style.transform = (j <= idx) ? "scale(1.1)" : "";
        });
      };
      star.onmouseleave = function() {
        stars.forEach(function(s, j) {
          s.style.opacity = (j < selectedRating) ? "1" : "0.3";
          s.style.transform = "";
        });
      };
      star.onclick = function() {
        selectedRating = idx + 1;
        stars.forEach(function(s, j) {
          s.style.opacity = (j < selectedRating) ? "1" : "0.3";
        });
        if (submitBtn) submitBtn.disabled = false;
      };
    });

    // Submit
    if (submitBtn) submitBtn.disabled = true;
    submitBtn.onclick = async function() {
      if (!selectedRating || !requestId) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet\u2026";
      try {
        var res = await fetch(RATE_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request_id: requestId,
            rating: selectedRating,
            rating_comment: (comment ? comment.value || "" : "").trim()
          })
        });
        if (res.ok) {
          try { localStorage.setItem(storageKey, "1"); } catch(e) {}
          if (starsRow) starsRow.style.display = "none";
          if (comment) comment.style.display = "none";
          submitBtn.style.display = "none";
          if (label) label.style.display = "none";
          if (sublabel) sublabel.style.display = "none";
          if (thanks) thanks.style.display = "block";
        } else {
          submitBtn.textContent = "Nochmal versuchen";
          submitBtn.disabled = false;
        }
      } catch(err) {
        console.warn("[Rating]", err);
        submitBtn.textContent = "Nochmal versuchen";
        submitBtn.disabled = false;
      }
    };
  }

  // ===== MAIN: called by showStory =====
  function injectShareAndRating(worldKey, childName, requestId, storyTitle) {
    var section = $("dm-share-rating-section");
    if (!section) return;

    var isExplanation = (worldKey === "sb-explanation");
    var variants = buildVariants(childName, storyTitle, isExplanation);

    // Show section
    section.style.display = "";

    // Share button
    var shareBtn = $("dm-btn-share");
    if (shareBtn) {
      shareBtn.textContent = isExplanation ? "\uD83E\uDDE0 Wissensblatt teilen" : "\uD83D\uDCD6 Geschichte teilen";
      shareBtn.onclick = function() { openSheet(variants, isExplanation); };
    }

    // Rating
    setupRating(requestId);

    console.log("[ShareRating] v8 injected", { worldKey: worldKey, isExplanation: isExplanation });
  }

  // Register globally
  window.__dreamableInjectShareRating = injectShareAndRating;
  console.log("[ShareRating] v8 ready (native Webflow)");
})();
