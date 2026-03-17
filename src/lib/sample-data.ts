import type { City, Entry } from "./types";

export const sampleCities: City[] = [
  { id: "osaka", name: "Osaka", country: "Japan", lat: 34.6937, lng: 135.5023, entryCount: 4, createdAt: new Date("2025-05-01") },
  { id: "firenze", name: "Firenze", country: "Italy", lat: 43.7696, lng: 11.2558, entryCount: 3, createdAt: new Date("2023-06-01") },
];

export const sampleEntries: Entry[] = [
  {
    id: "e1", cityId: "osaka", cityName: "Osaka", country: "Japan",
    photos: ["/photos/osaka/KakaoTalk_20260317_101011488_02.jpg"],
    title: "도톤보리의 밤, 글리코맨을 만나다",
    text: "오사카에 도착하자마자 도톤보리로 향했다. 글리코맨 간판 앞은 관광객들로 북적였고, 네온사인이 운하 위로 반짝이며 오사카의 활기를 온몸으로 느꼈다. 거리 음식의 향기가 골목마다 가득했다.",
    visitDate: new Date("2025-05-01"), createdAt: new Date("2025-05-01"),
  },
  {
    id: "e2", cityId: "osaka", cityName: "Osaka", country: "Japan",
    photos: ["/photos/osaka/KakaoTalk_20260317_101011488_01.jpg"],
    title: "오사카 츠케멘, 인생 라멘을 만나다",
    text: "현지인 추천으로 찾아간 츠케멘 맛집. 두꺼운 면발에 진한 돈코츠 소스를 찍어 먹는 순간, 이게 진짜 라멘이구나 싶었다. 차슈도 입에서 녹았고, 반숙 달걀은 완벽했다.",
    visitDate: new Date("2025-05-02"), createdAt: new Date("2025-05-02"),
  },
  {
    id: "e3", cityId: "osaka", cityName: "Osaka", country: "Japan",
    photos: ["/photos/osaka/KakaoTalk_20260317_101011488_03.jpg"],
    title: "오사카성, 역사 속을 걷다",
    text: "푸른 하늘 아래 오사카성이 위풍당당하게 서 있었다. 초록빛 나무들 사이로 보이는 하얀 성벽과 금빛 장식이 인상적이었다. 천수각에 올라 내려다본 오사카 시내 풍경도 잊을 수 없다.",
    visitDate: new Date("2025-05-03"), createdAt: new Date("2025-05-03"),
  },
  {
    id: "e4", cityId: "osaka", cityName: "Osaka", country: "Japan",
    photos: ["/photos/osaka/KakaoTalk_20260317_101011488.jpg"],
    title: "HEP FIVE 관람차에서 본 석양",
    text: "우메다의 HEP FIVE 빌딩 꼭대기 빨간 관람차에 올랐다. 해질녘 오사카 시내가 서서히 불을 밝히며 변해가는 풍경이 환상적이었다. 관람차가 한 바퀴 도는 15분이 너무 짧게 느껴졌다.",
    visitDate: new Date("2025-05-03"), createdAt: new Date("2025-05-03"),
  },
  {
    id: "e5", cityId: "firenze", cityName: "Firenze", country: "Italy",
    photos: ["/photos/firenze/KakaoTalk_20260317_101040112.jpg"],
    title: "미켈란젤로 광장에서 본 피렌체",
    text: "언덕 위 미켈란젤로 광장에서 내려다본 피렌체 전경은 숨이 멎을 듯 아름다웠다. 두오모의 붉은 돔, 아르노 강, 그리고 저 멀리 토스카나 산맥까지. 르네상스의 도시가 한눈에 펼쳐졌다.",
    visitDate: new Date("2023-06-15"), createdAt: new Date("2023-06-15"),
  },
  {
    id: "e6", cityId: "firenze", cityName: "Firenze", country: "Italy",
    photos: ["/photos/firenze/KakaoTalk_20260317_101040112_01.jpg"],
    title: "두오모 성당, 브루넬레스키의 걸작",
    text: "가까이 다가가니 두오모의 규모에 압도됐다. 브루넬레스키가 설계한 거대한 돔과 대리석 외벽의 섬세한 문양이 600년 세월을 견딘 것이 믿기지 않았다. 내부의 프레스코화도 경이로웠다.",
    visitDate: new Date("2023-06-16"), createdAt: new Date("2023-06-16"),
  },
  {
    id: "e7", cityId: "firenze", cityName: "Firenze", country: "Italy",
    photos: ["/photos/firenze/KakaoTalk_20260317_101040112_02.jpg"],
    title: "두오모 광장의 인파 속에서",
    text: "두오모 광장은 전 세계에서 온 사람들로 가득했다. 성당 정면의 화려한 고딕 양식 파사드 앞에서 한참을 올려다봤다. 젤라토를 한 손에 들고 광장을 거닐며 피렌체의 여유를 만끽했다.",
    visitDate: new Date("2023-06-16"), createdAt: new Date("2023-06-16"),
  },
];
