/* ==========================================================================
   안심ON — 함께ON (병실)
   Figma: together-1 (787:1195), together-1-1 (869:2424), together-2 (787:1032)
   The three frames are one screen: the room photo for the selected day, and a
   supply sheet that peeks at the bottom until it is pulled up to full height.
   ========================================================================== */

(function () {
  var ui = App.ui;
  var store = App.store;
  var data = App.data;

  var FILTERS = ["전체", "물품", "간식"];

  /* Figma draws the sheet as two labelled groups, one per category. */
  var GROUPS = [
    { category: "물품", label: "필요 물품" },
    { category: "간식", label: "보낸 간식" }
  ];

  /* The three spot positions are baked into together.css (Figma 787:1348-1350). */
  var SPOTS = ["a", "b", "c"];

  var LEVEL_CLASS = { enough: "ok", low: "low", out: "out" };

  var LEVEL_NOTE = "남은 양을 세 단계로 알려드려요. "
    + "충분해요는 여유가 있고, 조금 남았어요는 곧 준비가 필요하며, "
    + "부족해요는 지금 채워주셔야 해요.";

  /* Fallbacks for the sheet travel, in case the custom properties can't be
     read (older engines drop unknown custom properties from computed style). */
  var SHEET_SHUT = 574;
  var SHEET_OPEN = 51;
  var DRAG_THRESHOLD = 60;

  function seed() {
    store.seed("supplies", data.supplies);
    store.seed("togetherDay", data.roomDays[0].date);
    store.seed("togetherFilter", "전체");
    store.seed("sheetOpen", false);
    store.seed("togetherInfo", false);
    store.seed("togetherDaysOpen", false);
  }

  function currentDay() {
    var iso = store.get("togetherDay", data.roomDays[0].date);
    for (var i = 0; i < data.roomDays.length; i++) {
      if (data.roomDays[i].date === iso) return data.roomDays[i];
    }
    return data.roomDays[0];
  }

  function dayLabel(iso) {
    return ui.dateLabel(iso) + " (" + ui.dowLabel(iso) + ")";
  }

  /* --- pieces ------------------------------------------------------------ */

  function roomHead(day) {
    var p = data.patient;
    var open = store.get("togetherDaysOpen", false);

    return '<header class="room-head">'
      + '<div class="room-head__identity">'
      + '<h1 class="room-head__name">'
      + '<button type="button" class="room-head__pick" data-action="toggle-days"'
      + ' aria-haspopup="listbox" aria-expanded="' + open + '">'
      + ui.esc(p.name) + "님 병실" + ui.icon("chevron-down")
      + "</button></h1>"
      + '<p class="room-head__ward">' + ui.esc(p.hospital + " · " + p.ward) + "</p>"
      + (open ? dayList(day) : "")
      + "</div>"
      + ui.icon("bell", { button: true, className: "room-head__bell", label: "알림", action: "notify" })
      + "</header>";
  }

  function dayList(day) {
    return '<div class="room-days" role="listbox" aria-label="날짜 선택">'
      + data.roomDays.map(function (d) {
        return '<button type="button" class="room-days__item" role="option"'
          + ' data-action="pick-day" data-date="' + ui.esc(d.date) + '"'
          + ' aria-selected="' + (d.date === day.date) + '">'
          + '<span class="room-days__date">' + ui.esc(dayLabel(d.date)) + "</span>"
          + '<span class="room-days__mood">' + ui.esc(d.mood) + "</span>"
          + "</button>";
      }).join("")
      + "</div>";
  }

  function moodCard(day) {
    return '<section class="mood-card" aria-labelledby="together-mood">'
      + '<p class="mood-card__label" id="together-mood">오늘의 병실</p>'
      + '<p class="mood-card__text">' + ui.esc(day.mood) + "</p>"
      + "</section>";
  }

  function roomshot(day) {
    var spots = (day.hotspots || []).map(function (h, i) {
      return '<button type="button" class="roomshot__spot roomshot__spot--' + SPOTS[i % SPOTS.length] + '"'
        + ' data-action="hotspot" data-label="' + ui.esc(h.label) + '"'
        + ' aria-label="' + ui.esc(h.label) + '"></button>';
    }).join("");

    return '<figure class="roomshot">'
      + '<img class="roomshot__img" src="' + ui.esc(day.photo) + '" alt="'
      + ui.esc(data.patient.name) + '님 병실 사진">'
      + spots
      + "</figure>";
  }

  function sheet(day) {
    var open = store.get("sheetOpen", false);
    var filter = store.get("togetherFilter", "전체");
    var info = store.get("togetherInfo", false);
    var rows = store.get("supplies", []);

    var groups = GROUPS.filter(function (g) {
      return filter === "전체" || filter === g.category;
    }).map(function (g) {
      return { label: g.label, rows: rows.filter(function (r) { return r.category === g.category; }) };
    }).filter(function (g) { return g.rows.length; });

    var body = groups.length
      ? groups.map(function (g, i) {
        return (i ? '<hr class="supplies__divider">' : "")
          + '<h3 class="supplies__group">' + ui.esc(g.label) + "</h3>"
          + '<ul class="supply-list">' + g.rows.map(supplyRow).join("") + "</ul>";
      }).join("")
      : emptyState("해당하는 물품이 없어요", "다른 분류를 선택해 보세요.");

    return '<section class="supplies' + (open ? " supplies--expanded" : "") + '"'
      + ' id="together-sheet" aria-labelledby="together-supplies">'
      + '<button type="button" class="supplies__grabber" data-action="toggle-sheet"'
      + ' aria-controls="together-sheet" aria-expanded="' + open + '"'
      + ' aria-label="' + (open ? "물품 리스트 접기" : "물품 리스트 펼치기") + '"></button>'

      /* The title row doubles as a second, fatter handle — tap or drag. */
      + '<div class="supplies__head" data-action="toggle-sheet">'
      + '<h2 class="supplies__title" id="together-supplies">챙길 것이 있어요</h2>'
      + ui.icon("info-circle", {
        button: true, className: "supplies__info", label: "안내", action: "toggle-info"
      })
      + "</div>"

      + (info ? '<p class="supplies__note" role="note">' + ui.esc(LEVEL_NOTE) + "</p>" : "")

      + '<div class="supplies__filters" role="tablist" aria-label="물품 분류">'
      + FILTERS.map(function (f) {
        return '<button type="button" class="chip' + (f === "전체" ? " chip--all" : "") + '"'
          + ' role="tab" data-action="supply-filter" data-filter="' + f + '"'
          + ' aria-selected="' + (f === filter) + '">'
          + (f === "전체" ? "" : '<span class="chip__dot" aria-hidden="true"></span>')
          + f + "</button>";
      }).join("")
      + '<p class="supplies__updated">최신 업데이트 '
      + ui.esc(day.updatedAt || data.suppliesUpdatedAt) + "</p>"
      + "</div>"

      + body
      + "</section>";
  }

  function supplyRow(r) {
    var cls = LEVEL_CLASS[r.level] || "ok";
    return '<li class="supply">'
      + '<span class="supply__avatar">' + ui.icon("logo") + "</span>"
      + '<span class="supply__body">'
      + '<span class="supply__title">'
      + '<span class="supply__name">' + ui.esc(r.name) + "</span>"
      + '<span class="supply__sep" aria-hidden="true"></span>'
      + '<span class="supply__qty">' + ui.esc(r.count) + "개</span>"
      + "</span>"
      + '<span class="supply__date">전달일 ' + ui.esc(r.deliveredAt) + "</span>"
      + "</span>"
      + '<span class="supply__status supply__status--' + cls + '">'
      + ui.esc(data.levelLabels[r.level] || "") + "</span>"
      + "</li>";
  }

  function emptyState(title, text) {
    return '<div class="empty">'
      + '<span class="empty__glyph">' + ui.CHAT_GLYPH + "</span>"
      + '<p class="empty__title">' + ui.esc(title) + "</p>"
      + '<p class="empty__text">' + ui.esc(text) + "</p>"
      + "</div>";
  }

  /* --- view -------------------------------------------------------------- */

  var bound = null;

  App.registerView("together", {
    title: "함께ON",

    render: function () {
      seed();
      var day = currentDay();

      return '<main class="screen screen--together" data-node-id="787:1195">'
        + '<div class="together__body">'
        + ui.statusbar()
        + roomHead(day)
        + moodCard(day)
        + roomshot(day)
        + sheet(day)
        + "</div>"
        + ui.navbar("together")
        + "</main>";
    },

    mount: function (root) {
      var screen = root.querySelector(".screen--together");
      var el = root.querySelector(".supplies");
      var travel = sheetTravel(screen);
      var drag = null;
      var dragged = false;

      function setOpen(next) {
        store.set("sheetOpen", next);
        App.refresh();
      }

      /* --- click ----------------------------------------------------------- */

      function onClick(e) {
        var hit = e.target.closest("[data-action]");
        var action = hit ? hit.dataset.action : "";
        var redraw = false;

        /* Any tap that isn't the switcher itself puts the day list away. */
        if (store.get("togetherDaysOpen", false) && action !== "toggle-days") {
          store.set("togetherDaysOpen", false);
          redraw = true;
        }

        if (action === "toggle-sheet") {
          var swallow = dragged;          // the click a finished drag leaves behind
          dragged = false;
          if (!swallow) {
            store.set("sheetOpen", !store.get("sheetOpen", false));
            redraw = true;
          }
        } else if (action === "supply-filter") {
          store.set("togetherFilter", hit.dataset.filter);
          redraw = true;
        } else if (action === "toggle-days") {
          store.set("togetherDaysOpen", !store.get("togetherDaysOpen", false));
          redraw = true;
        } else if (action === "pick-day") {
          store.set("togetherDay", hit.dataset.date);
          redraw = true;
        } else if (action === "toggle-info") {
          store.set("togetherInfo", !store.get("togetherInfo", false));
          redraw = true;
        } else if (action === "hotspot") {
          ui.toast(hit.dataset.label);
        } else if (action === "notify") {
          ui.toast("알림은 준비 중입니다.");
        }

        if (redraw) App.refresh();
      }

      /* --- drag ------------------------------------------------------------ */

      function onDown(e) {
        if (!el || e.button > 0) return;
        if (!e.target.closest(".supplies__grabber, .supplies__head")) return;
        if (e.target.closest(".supplies__info")) return;
        drag = { from: e.clientY, dy: 0, moved: false };
        dragged = false;
        el.classList.add("supplies--dragging");
        /* Keep the gesture even if the finger leaves the handle. */
        try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* not supported */ }
      }

      function onMove(e) {
        if (!drag || !el) return;
        var open = store.get("sheetOpen", false);
        var span = travel.shut - travel.open;
        var dy = Math.max(open ? 0 : -span, Math.min(open ? span : 0, e.clientY - drag.from));
        drag.dy = dy;
        if (Math.abs(dy) > 4) drag.moved = true;
        el.style.setProperty("--sheet-drag", dy + "px");
      }

      function onUp() {
        if (!drag || !el) return;
        var d = drag;
        drag = null;
        el.classList.remove("supplies--dragging");
        el.style.removeProperty("--sheet-drag");
        if (!d.moved) return;          // a plain tap — onClick toggles it
        dragged = true;                // swallow the click this drag produced
        if (Math.abs(d.dy) > DRAG_THRESHOLD) setOpen(!store.get("sheetOpen", false));
      }

      root.addEventListener("click", onClick);
      root.addEventListener("pointerdown", onDown);
      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerup", onUp);
      root.addEventListener("pointercancel", onUp);

      /* The router reuses one #view element, so every listener has to come
         back off again in unmount — otherwise they stack up on each refresh. */
      bound = { root: root, click: onClick, down: onDown, move: onMove, up: onUp };
    },

    unmount: function () {
      if (!bound) return;
      bound.root.removeEventListener("click", bound.click);
      bound.root.removeEventListener("pointerdown", bound.down);
      bound.root.removeEventListener("pointermove", bound.move);
      bound.root.removeEventListener("pointerup", bound.up);
      bound.root.removeEventListener("pointercancel", bound.up);
      bound = null;
    }
  });

  /** The two rest positions of the sheet, read off the screen's custom props. */
  function sheetTravel(screen) {
    var shut = SHEET_SHUT;
    var open = SHEET_OPEN;
    if (screen && window.getComputedStyle) {
      var cs = getComputedStyle(screen);
      shut = parseFloat(cs.getPropertyValue("--sheet-top")) || shut;
      open = parseFloat(cs.getPropertyValue("--sheet-top-open")) || open;
    }
    return { shut: shut, open: open };
  }
})();
