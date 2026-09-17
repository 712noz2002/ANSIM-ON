/* ==========================================================================
   안심ON — Seed data
   Everything the prototype starts with. The store copies this into
   localStorage on first run; after that the user's own changes win.
   Content is taken verbatim from the Figma frames wherever the frame showed it.
   ========================================================================== */

window.App = window.App || {};

App.data = (function () {
  var TODAY = "2026-09-08";

  var patient = {
    name: "김영숙",
    hospital: "더조은요양병원",
    ward: "3병동 305호",
    guardian: "김수진"
  };

  /* --- 돌봄 흐름 ---------------------------------------------------------- */

  var periods = [
    { key: "morning",   label: "아침 돌봄", time: "06:00 - 09:00" },
    { key: "forenoon",  label: "오전 돌봄", time: "09:00 - 12:00" },
    { key: "lunch",     label: "점심 돌봄", time: "12:00 - 13:00" },
    { key: "afternoon", label: "오후 돌봄", time: "13:00 - 17:00" }
  ];

  /* A day's entries. Weekdays get the full routine, weekends a lighter one;
     days after TODAY have nothing yet. */
  function entriesFor(iso) {
    if (iso > TODAY) return [];
    var d = new Date(iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
    var weekend = d.getDay() === 0 || d.getDay() === 6;
    var seed = d.getDate();
    var rows = [
      { period: "morning",   title: "아침 식사",   at: stamp(8, 4 + (seed % 9)) },
      { period: "forenoon",  title: "오전 생활",   at: stamp(11, 15 + (seed % 12)) },
      { period: "forenoon",  title: "위생관리",    at: stamp(11, 24 + (seed % 7)) },
      { period: "lunch",     title: "점심 식사",   at: stamp(12, 32 + (seed % 10)) },
      { period: "afternoon", title: "오후 생활",   at: stamp(14, 10 + (seed % 15)) },
      { period: "afternoon", title: "재활 운동",   at: stamp(15, 20 + (seed % 11)) }
    ];
    if (weekend) rows = rows.filter(function (r) { return r.title !== "재활 운동"; });
    if (iso === TODAY) rows = rows.slice(0, 2); // 오늘은 오전까지만 기록됨
    return rows;
  }

  function stamp(h, m) {
    h += Math.floor(m / 60);
    m = m % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  }

  function records() {
    var out = {};
    for (var day = 1; day <= 30; day++) {
      var iso = "2026-09-" + String(day).padStart(2, "0");
      out[iso] = entriesFor(iso);
    }
    return out;
  }

  /* --- 확인할 내용 -------------------------------------------------------- */

  var notices = [
    {
      id: "n1",
      kind: "진료",
      title: "추가 검사 안내",
      text: "김영숙님의 무릎 통증 원인을\n확인하기 위한 검사입니다.",
      at: "2026-09-08T06:20:00",
      read: false
    },
    {
      id: "n2",
      kind: "진료",
      title: "문의 결과",
      text: "9월 2일에 남겨주신 문의에 대한\n문의 답변이 도착했습니다.",
      at: "2026-09-08T00:30:00",
      read: false,
      goto: "#/ask/list"
    },
    {
      id: "n3",
      kind: "면회",
      title: "면회 안내",
      text: "내일 오후 3시 면회가 예정되어 있습니다.\n면회 전 확인할 내용을 살펴보세요.",
      at: "2026-09-07T11:57:00",
      read: false
    }
  ];

  /* --- 함께 ON 카드 ------------------------------------------------------- */

  var togetherTip = {
    title: "함께 ON",
    text: "이번 면회 때 어머니와 가을 이야기를 나눠보세요.\n요즘 병동에서 가을 풍경 이야기에 관심을 많이 보이셨어요."
  };

  /* --- 문의 -------------------------------------------------------------- */

  var suggestions = [
    "오늘 식사는 어떠셨나요?",
    "오늘 특별한 변화가 있었나요?",
    "의료진에게 확인하고 싶은 게 있어요",
    "행정 관련 문의"
  ];

  /* 보호자가 첫 마디를 남기면 병원이 먼저 건네는 인사 (ask-2-1 의 첫 흰 말풍선) */
  var askOpeningReply = "네, 어떤 점을 확인하고 싶으신가요? 편하게 말씀해주세요.";

  /* 준비된 대본을 다 쓴 뒤의 기본 응답 */
  var askFallbackReply = "말씀 주신 내용 확인 중입니다. 확인되는 대로 알려드릴게요.";

  var inquiries = [
    {
      id: "q1",
      subject: "무릎 검사 일정 관련 문의",
      author: "김수진",
      createdAt: "2026-09-08T10:12:00",
      status: "checking",
      topic: "이동 중 멍 확인",
      steps: [
        { title: "문의 접수", at: "2026.08.24 10:12", note: "문의 주제 : 이동 중 멍 확인", noteStyle: "quote" },
        { title: "병원 확인중", at: "2026.08.24 12:20", note: "담당 간호사가 확인을 진행하고 있어요", noteStyle: "card" }
      ],
      messages: [
        { from: "me", text: "어머니 팔에 멍이 있던데, 어떻게 된 건지 궁금합니다" },
        { from: "staff", text: "걱정되셨겠어요. 정확한 상황을 확인해 담당자에게 전달할게요. 멍은 언제 발견하셨나요?" },
        { from: "me", text: "오늘 면회갔다가 봤는데, 저희 어머니 제대로 돌본 거 맞아요?" },
        { from: "staff", text: "멍은 팔의 어느 부위에 있었나요?" },
        { from: "me", text: "정확히는 기억이 안 나는데, 어깨 가까이 있었어요" },
        { from: "staff", text: "네, 바로 담당자에게 확인할게요. 오늘 발견된 어깨 근처 멍의 원인과 조치 내용을 확인해 알려드리겠습니다.", action: { label: "문의 진행 상황 확인", goto: "#/ask/q1" } }
      ]
    },
    {
      id: "q2",
      subject: "식사량이 줄어든 것 같아요",
      author: "김수진",
      createdAt: "2026-09-02T09:40:00",
      status: "waiting",
      topic: "식사량 감소",
      steps: [
        { title: "문의 접수", at: "2026.09.02 09:40", note: "문의 주제 : 식사량 감소", noteStyle: "quote" }
      ],
      messages: [
        { from: "me", text: "요즘 식사량이 줄어든 것 같은데 확인 부탁드립니다" }
      ]
    },
    {
      id: "q3",
      subject: "욕창 관리 문의",
      author: "김수진",
      createdAt: "2026-08-24T15:20:00",
      status: "done",
      topic: "이동 중 멍 확인",
      steps: [
        { title: "문의 접수", at: "2026.08.24 10:12", note: "문의 주제 : 이동 중 멍 확인", noteStyle: "quote" },
        { title: "병원 확인중", at: "2026.08.24 12:20", note: "담당 간호사가 확인을 진행하고 있어요", noteStyle: "card" },
        { title: "병원 확인 결과", at: "2026.08.24 14:45", note: "오늘 오전 이동 중 침상 변경 과정에서 생긴 멍을 확인하였어요. 현재 통증은 없고 상태를 관찰하고 있습니다.", noteStyle: "quote" },
        { title: "다음 계획", at: "2026.08.24 14:45", note: "상태 변화가 있으면 추가 안내드리겠습니다.", noteStyle: "quote" },
        { title: "확인 완료", at: "2026.08.24 15:20", note: "해당 문의가 완료되었어요.", noteStyle: "card", done: true }
      ],
      messages: [
        { from: "me", text: "욕창 관리는 어떻게 하고 계신가요?" },
        { from: "staff", text: "2시간마다 체위 변경을 하고 있고, 피부 상태는 매일 기록하고 있습니다." }
      ]
    }
  ];

  var statusLabels = {
    checking: "확인중",
    waiting: "답변대기",
    done: "완료"
  };

  /* --- 함께 ON (병실) ----------------------------------------------------- */

  var roomDays = [
    {
      date: "2026-09-08",
      mood: "평온한 하루가 이어지고 있어요",
      photo: "assets/img/room-together-1.jpg",
      updatedAt: "09:30 (화)",
      hotspots: [
        { top: 8, left: 62, size: 84, label: "창가 액자" },
        { top: 42, left: 4, size: 62, label: "협탁 위" },
        { top: 48, left: 48, size: 62, label: "보조 의자" }
      ]
    },
    {
      date: "2026-09-07",
      mood: "가족과 함께해 더 따뜻한 하루",
      photo: "assets/img/room-together-2.jpg",
      updatedAt: "18:20 (월)",
      hotspots: [
        { top: 8, left: 62, size: 84, label: "가족 사진" },
        { top: 42, left: 4, size: 62, label: "창가 화분" },
        { top: 44, left: 46, size: 62, label: "침상 옆" }
      ]
    }
  ];

  var supplies = [
    { id: "s1", category: "물품", name: "물티슈",     count: 4, level: "enough",  deliveredAt: "09.08 (화)" },
    { id: "s2", category: "물품", name: "속기저귀",   count: 4, level: "low",     deliveredAt: "09.08 (화)" },
    { id: "s3", category: "물품", name: "겉기저귀",   count: 4, level: "enough",  deliveredAt: "09.08 (화)" },
    { id: "s4", category: "물품", name: "방수 패드",  count: 4, level: "low",     deliveredAt: "09.08 (화)" },
    { id: "s5", category: "물품", name: "휴지",       count: 4, level: "low",     deliveredAt: "09.08 (화)" },
    { id: "s6", category: "간식", name: "견과류 세트", count: 4, level: "low",    deliveredAt: "09.08 (화)" },
    { id: "s7", category: "간식", name: "카스테라",   count: 4, level: "enough",  deliveredAt: "09.08 (화)" },
    { id: "s8", category: "간식", name: "종합영양제", count: 4, level: "out",     deliveredAt: "09.08 (화)" }
  ];

  var levelLabels = { enough: "충분해요", low: "조금 남았어요", out: "부족해요" };

  return {
    TODAY: TODAY,
    patient: patient,
    periods: periods,
    records: records,
    notices: notices,
    togetherTip: togetherTip,
    suggestions: suggestions,
    askOpeningReply: askOpeningReply,
    askFallbackReply: askFallbackReply,
    inquiries: inquiries,
    statusLabels: statusLabels,
    roomDays: roomDays,
    supplies: supplies,
    levelLabels: levelLabels,
    suppliesUpdatedAt: "09:30 (화)"
  };
})();
