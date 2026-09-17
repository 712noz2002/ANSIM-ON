/* ==========================================================================
   안심ON — 기록
   Figma: list-1 (787:1745), list-1 변형 (873:3052), list-1-1 (873:3272)
   One screen: month switcher, date strip, and the day's care timeline.
   The three frames are the same screen with a different date selected and a
   different scroll position, so they are one view here.
   ========================================================================== */

(function () {
  var ui = App.ui;
  var store = App.store;
  var data = App.data;

  var MONTHS = ["2026-07-01", "2026-08-01", "2026-09-01", "2026-10-01", "2026-11-01", "2026-12-01"];

  function seed() {
    store.seed("records", data.records());
    store.seed("selectedDate", data.TODAY);
    store.seed("monthOpen", false);
  }

  /* --- pieces ------------------------------------------------------------ */

  function head(iso) {
    return '<header class="recordhead">'
      + '<button type="button" class="recordhead__month" data-action="open-months"'
      + ' aria-expanded="' + store.get("monthOpen", false) + '">'
      + ui.monthLabel(iso)
      + ui.icon("chevron-down-16", { size: 16 })
      + "</button></header>";
  }

  function dates(iso) {
    return '<section class="recorddates" aria-label="날짜 선택">'
      + '<div class="recorddates__viewport u-scroll-x" data-strip>'
      + ui.datestrip(ui.monthDays(iso), iso)
      + "</div></section>";
  }

  function timeline(iso) {
    var entries = (store.get("records", {})[iso] || []);

    if (!entries.length) {
      var future = iso > data.TODAY;
      return '<div class="empty">'
        + '<span class="empty__glyph">' + ui.CHAT_GLYPH + "</span>"
        + '<p class="empty__title">' + (future ? "아직 기록이 없어요" : "이 날은 기록이 없어요") + "</p>"
        + '<p class="empty__text">'
        + (future ? "돌봄이 끝나면 이곳에 순서대로 올라옵니다." : "다른 날짜를 선택해 보세요.")
        + "</p></div>";
    }

    var groups = data.periods.map(function (period) {
      var rows = entries.filter(function (e) { return e.period === period.key; });
      if (!rows.length) return "";
      return '<article class="timeline__group">'
        + '<header class="timeline__head">'
        + '<span class="timeline__dot" aria-hidden="true"></span>'
        + '<h3 class="timeline__label">' + ui.esc(period.label) + "</h3>"
        + '<p class="timeline__time">' + ui.esc(period.time) + "</p>"
        + "</header>"
        + rows.map(function (r) {
          return '<button type="button" class="timeline__card" data-action="entry"'
            + ' data-title="' + ui.esc(r.title) + '" data-at="' + ui.esc(r.at) + '">'
            + '<span class="timeline__avatar">' + ui.CHAT_GLYPH + "</span>"
            + '<span><span class="timeline__card-title">' + ui.esc(r.title) + "</span>"
            + '<span class="timeline__card-time">' + ui.esc(r.at) + " 기록</span></span></button>";
        }).join("")
        + "</article>";
    }).join("");

    return '<div class="timeline timeline--records">' + groups + "</div>";
  }

  function monthPicker(iso) {
    if (!store.get("monthOpen", false)) return "";
    var currentMonth = iso.slice(0, 7);
    var items = MONTHS.map(function (m) {
      return '<button type="button" class="picker__item" data-action="pick-month" data-month="' + m + '"'
        + ' aria-current="' + (m.slice(0, 7) === currentMonth) + '">' + ui.monthLabel(m) + "</button>";
    }).join("");
    return '<div class="picker" data-action="close-months">'
      + '<div class="picker__panel">'
      + '<p class="picker__title">월 선택</p>'
      + '<div class="picker__grid">' + items + "</div>"
      + "</div></div>";
  }

  /* --- view -------------------------------------------------------------- */

  App.registerView("records", {
    title: "기록",

    /* Same as 홈's menu: the month picker should not be waiting when the user
       returns to 기록 later. */
    unmount: function () {
      if (store.get("monthOpen", false)) store.set("monthOpen", false);
    },

    render: function () {
      seed();
      var iso = store.get("selectedDate", data.TODAY);
      return '<main class="screen screen--list" data-node-id="787:1745">'
        + ui.statusbar(false)
        + head(iso)
        + dates(iso)
        + timeline(iso)
        + ui.navbar("records")
        + monthPicker(iso)
        + "</main>";
    },

    mount: function (root) {
      ui.centerSelected(root.querySelector("[data-strip]"));

      root.addEventListener("click", function (e) {
        var el = e.target.closest("[data-action]");
        if (!el) return;
        var action = el.dataset.action;

        if (action === "pick-date") {
          store.set("selectedDate", el.dataset.date);
          App.refresh();
        } else if (action === "open-months") {
          store.set("monthOpen", true);
          App.refresh();
        } else if (action === "close-months") {
          /* only the scrim itself closes, not a click inside the panel */
          if (e.target !== el) return;
          store.set("monthOpen", false);
          App.refresh();
        } else if (action === "pick-month") {
          var month = el.dataset.month;
          var day = store.get("selectedDate", data.TODAY).slice(8);
          var days = ui.monthDays(month);
          var next = days.indexOf(month.slice(0, 8) + day) > -1 ? month.slice(0, 8) + day : days[0];
          store.set("selectedDate", next);
          store.set("monthOpen", false);
          App.refresh();
        } else if (action === "entry") {
          ui.toast(el.dataset.title + " · " + el.dataset.at + " 기록");
        }
      });
    }
  });
})();
