export type Roast = 'jasne' | 'średnie' | 'ciemne';
export type Grind = 'ziarna' | 'mielona drobno' | 'mielona grubo';

export interface ProductVariant {
  weight: 250 | 1000;
  priceCents: number;
}

export interface Product {
  slug: string;
  name: string;
  origin: string;
  region?: string;
  roast: Roast;
  kind: 'single origin' | 'mieszanka';
  process?: 'washed' | 'natural' | 'honey';
  notes: [string, string, string];
  description: string;
  story: string;
  altitudeMasl?: number;
  variants: ProductVariant[];
  grinds: Grind[];
  badges?: ('bestseller' | 'nowość' | 'limitowana')[];
  palette: { bag: string; accent: string };
  rating: number;
}

const ALL_GRINDS: Grind[] = ['ziarna', 'mielona drobno', 'mielona grubo'];

export const products: Product[] = [
  {
    slug: 'etiopia-yirgacheffe',
    name: 'Etiopia Yirgacheffe',
    origin: 'Etiopia',
    region: 'Yirgacheffe, strefa Gedeo',
    roast: 'jasne',
    kind: 'single origin',
    process: 'washed',
    notes: ['jagody', 'jaśmin', 'cytrusy'],
    description:
      'Herbaciana i kwiatowa klasyka jasnego wypału — jagody, jaśmin i cytrusowy finisz. Od tej kawy zaczyna się specialty.',
    story:
      'Yirgacheffe to miejsce, w którym arabica rośnie od zawsze — półdzikie krzewy w przydomowych ogrodach strefy Gedeo, na wysokości około 2100 m n.p.m. Drobne ziarna odmian heirloom dojrzewają tu powoli, w cieniu starych drzew, co przekłada się na gęstość i złożoność smaku.\n\nPo zbiorze wiśnie kawowca trafiają do stacji mycia, gdzie fermentują w chłodnej wodzie ze strumieni, a potem schną na afrykańskich łóżkach nawet dwa tygodnie. To właśnie staranna obróbka mokra daje tę czystość profilu, z której słynie region.\n\nW filiżance: herbaciana lekkość, jaśmin, dojrzałe jagody i cytrusowy finisz, który długo nie znika. Palimy ją jasno, żeby niczego z tego nie zgubić. Polecamy do metod przelewowych — V60 albo Chemex.',
    altitudeMasl: 2100,
    variants: [
      { weight: 250, priceCents: 5400 },
      { weight: 1000, priceCents: 17290 },
    ],
    grinds: ALL_GRINDS,
    badges: ['bestseller'],
    palette: { bag: '#56603f', accent: '#a8b07a' },
    rating: 4.9,
  },
  {
    slug: 'kolumbia-huila',
    name: 'Kolumbia Huila',
    origin: 'Kolumbia',
    region: 'Huila',
    roast: 'średnie',
    kind: 'single origin',
    process: 'washed',
    notes: ['karmel', 'czerwone jabłko', 'orzech laskowy'],
    description:
      'Słodka, soczysta i bezbłędnie czysta — karmel, czerwone jabłko i orzechowy finisz. Kawa na każdy dzień i każdą metodę.',
    story:
      'Huila to południowo-zachodnia Kolumbia — wulkaniczne zbocza masywu Nevado del Huila, około 1700 m n.p.m. Kawę uprawiają tu głównie rodzinne gospodarstwa o powierzchni dwóch–trzech hektarów, zrzeszone w lokalnych kooperatywach.\n\nOdmiany caturra i castillo przechodzą klasyczną obróbkę mokrą: kilkanaście godzin fermentacji w tankach, mycie i powolne suszenie w przydomowych suszarniach pod dachem. Efekt to kawa o czystym, słodkim profilu — bezpieczny wybór, który nie jest nudny.\n\nŚredni wypał podkreśla karmelową słodycz, soczystość czerwonego jabłka i orzechowy finisz. Sprawdza się w każdej metodzie — od dripa po ekspres ciśnieniowy.',
    altitudeMasl: 1700,
    variants: [
      { weight: 250, priceCents: 4900 },
      { weight: 1000, priceCents: 15690 },
    ],
    grinds: ALL_GRINDS,
    badges: ['bestseller'],
    palette: { bag: '#7a4632', accent: '#c98a64' },
    rating: 4.8,
  },
  {
    slug: 'brazylia-cerrado',
    name: 'Brazylia Cerrado',
    origin: 'Brazylia',
    region: 'Cerrado Mineiro',
    roast: 'średnie',
    kind: 'single origin',
    process: 'natural',
    notes: ['mleczna czekolada', 'prażone orzechy', 'melasa'],
    description:
      'Brazylijski natural o kremowym body i niskiej kwasowości. Mleczna czekolada z orzechami — stworzona do espresso i kaw mlecznych.',
    story:
      'Cerrado Mineiro to pierwszy brazylijski region kawowy z chronionym oznaczeniem pochodzenia. Rozległe, nasłonecznione plantacje na płaskowyżu około 1100 m n.p.m. i wyraźny podział na porę suchą i deszczową dają wyjątkowo powtarzalne, dojrzałe zbiory.\n\nZiarna obrabiane są na sucho — wiśnie schną w całości na betonowych patiach, a miąższ oddaje ziarnu całą swoją słodycz. To klasyczny brazylijski natural: niska kwasowość i ciężkie, kremowe body.\n\nW smaku mleczna czekolada, prażone orzechy i melasa. Nasz wybór na codzienne espresso i kawy mleczne — w cappuccino smakuje jak deser.',
    altitudeMasl: 1100,
    variants: [
      { weight: 250, priceCents: 4200 },
      { weight: 1000, priceCents: 13400 },
    ],
    grinds: ALL_GRINDS,
    badges: ['bestseller'],
    palette: { bag: '#8a6b46', accent: '#cfa97a' },
    rating: 4.7,
  },
  {
    slug: 'kenia-aa',
    name: 'Kenia AA',
    origin: 'Kenia',
    region: 'Nyeri',
    roast: 'jasne',
    kind: 'single origin',
    process: 'washed',
    notes: ['czarna porzeczka', 'grejpfrut', 'cukier trzcinowy'],
    description:
      'Winna, intensywna i bezkompromisowa — czarna porzeczka i grejpfrut na słodkiej, trzcinowej bazie. Kenia w najlepszym wydaniu.',
    story:
      'Nyeri leży w centralnej Kenii — czerwone, wulkaniczne gleby u podnóża góry Kenii i plantacje na wysokości około 1800 m n.p.m. Symbol AA oznacza największe sito, czyli najbardziej dorodne ziarna z całego zbioru, głównie odmian SL28 i SL34.\n\nKenijskie stacje mycia słyną z podwójnej fermentacji: ziarno fermentuje, jest myte, a następnie moczone w czystej wodzie nawet dobę. Ten proces wyostrza kwasowość i nadaje kawie charakterystyczną, winną strukturę.\n\nTo kawa o dużej intensywności — czarna porzeczka, grejpfrut i słodycz cukru trzcinowego. Jasny wypał, zdecydowany charakter. Dla tych, którzy w kawie szukają napięcia, nie ukojenia.',
    altitudeMasl: 1800,
    variants: [
      { weight: 250, priceCents: 6400 },
      { weight: 1000, priceCents: 20490 },
    ],
    grinds: ALL_GRINDS,
    palette: { bag: '#6e3a3a', accent: '#b5766f' },
    rating: 4.9,
  },
  {
    slug: 'gwatemala-antigua',
    name: 'Gwatemala Antigua',
    origin: 'Gwatemala',
    region: 'Antigua',
    roast: 'średnie',
    kind: 'single origin',
    process: 'washed',
    notes: ['gorzka czekolada', 'pomarańcza', 'przyprawy korzenne'],
    description:
      'Elegancka kawa z doliny trzech wulkanów — gorzka czekolada, pomarańcza i korzenne przyprawy w zrównoważonej filiżance.',
    story:
      'Antigua leży w dolinie otoczonej trzema wulkanami — Agua, Fuego i Acatenango. Pył wulkaniczny regularnie użyźnia tutejsze gleby, a chłodne noce na wysokości około 1600 m n.p.m. spowalniają dojrzewanie wiśni i zagęszczają smak ziarna.\n\nOdmiany bourbon i caturra przechodzą obróbkę mokrą w tradycyjnych beneficios, a potem schną na słońcu, na rozległych patiach pośród kolonialnej zabudowy. Region szczyci się jedną z najdłuższych kawowych tradycji Ameryki Środkowej.\n\nŚredni wypał wydobywa z niej gorzką czekoladę, pomarańczę i korzenne przyprawy. Kawa o eleganckiej strukturze — równie dobra z dripa, co z kawiarki.',
    altitudeMasl: 1600,
    variants: [
      { weight: 250, priceCents: 5200 },
      { weight: 1000, priceCents: 16600 },
    ],
    grinds: ALL_GRINDS,
    palette: { bag: '#4e5a55', accent: '#93a69b' },
    rating: 4.6,
  },
  {
    slug: 'peru-cajamarca',
    name: 'Peru Cajamarca',
    origin: 'Peru',
    region: 'Cajamarca',
    roast: 'jasne',
    kind: 'single origin',
    process: 'honey',
    notes: ['miód', 'gruszka', 'migdały'],
    description:
      'Organiczna kawa z andyjskich ogrodów leśnych, obrabiana metodą honey. Miękka słodycz miodu i gruszki, migdałowy finisz.',
    story:
      'Cajamarca to północne Peru — Andy porośnięte lasem chmurowym i małe gospodarstwa położone około 1850 m n.p.m. Kawa rośnie tu w systemach agroleśnych, między bananowcami i drzewami inga, a większość upraw ma certyfikację ekologiczną.\n\nTen lot przeszedł obróbkę honey: po usunięciu skórki ziarno schnie w słodkim miąższu, który oddaje mu część swoich cukrów. Suszenie w zacienionych tunelach trwa dłużej niż zwykle, ale wynagradza to wyraźną słodyczą.\n\nProfil jest miękki i okrągły — miód, soczysta gruszka, migdałowy finisz. Jasny wypał, łagodna kwasowość. Dobra propozycja na pierwsze spotkanie z kawami jaśniej palonymi.',
    altitudeMasl: 1850,
    variants: [
      { weight: 250, priceCents: 4700 },
      { weight: 1000, priceCents: 14990 },
    ],
    grinds: ALL_GRINDS,
    badges: ['nowość'],
    palette: { bag: '#9c8458', accent: '#d6c193' },
    rating: 4.7,
  },
  {
    slug: 'indonezja-sumatra',
    name: 'Indonezja Sumatra',
    origin: 'Indonezja',
    region: 'Aceh, płaskowyż Gayo',
    roast: 'ciemne',
    kind: 'single origin',
    notes: ['ciemna czekolada', 'cedr', 'tytoń'],
    description:
      'Gęsta i ziemista, mokro łuskana po indonezyjsku. Ciemna czekolada, cedr i tytoń — kawa do french pressa i mocnego espresso.',
    story:
      'Płaskowyż Gayo w prowincji Aceh, północna Sumatra — jeden z najbardziej rozpoznawalnych kawowych terroirów Azji. Uprawy rozciągają się wokół jeziora Tawar, na wysokości około 1400 m n.p.m., w klimacie, w którym wilgoć nigdy nie znika.\n\nTutejsi rolnicy stosują giling basah, czyli mokre łuskanie — ziarno trafia do suszenia jeszcze w półmiękkim stanie, z wysoką wilgotnością. To właśnie ta metoda, spotykana niemal wyłącznie w Indonezji, odpowiada za ziemisty, gęsty charakter sumatrzańskich kaw.\n\nPalimy ją ciemno. W filiżance ciemna czekolada, cedr i nuta tytoniu — kawa ciężka, niska w kwasowości, stworzona do french pressa i mocnego espresso.',
    altitudeMasl: 1400,
    variants: [
      { weight: 250, priceCents: 5100 },
      { weight: 1000, priceCents: 16290 },
    ],
    grinds: ALL_GRINDS,
    palette: { bag: '#3d3a45', accent: '#8a8398' },
    rating: 4.5,
  },
  {
    slug: 'rwanda-nyamasheke',
    name: 'Rwanda Nyamasheke',
    origin: 'Rwanda',
    region: 'Nyamasheke, jezioro Kivu',
    roast: 'jasne',
    kind: 'single origin',
    process: 'washed',
    notes: ['czerwone winogrona', 'hibiskus', 'brązowy cukier'],
    description:
      'Mikrolot czerwonego bourbona znad jeziora Kivu — soczyste winogrona i hibiskus. Kilkanaście worków, wyłącznie w ziarnach.',
    story:
      'Nyamasheke leży na zachodzie Rwandy, nad brzegiem jeziora Kivu. Krzewy czerwonego bourbona rosną tu na stromych tarasach, około 1950 m n.p.m. — wysokość i równikowe słońce dają ziarno o niezwykłej gęstości i słodyczy.\n\nTen mikrolot pochodzi z jednej stacji mycia i jednego zbioru. Wiśnie selekcjonowano ręcznie, trzykrotnie: na krzewie, przy odbiorze i na stołach flotacyjnych. Do Polski przyjechało kilkanaście worków — gdy się skończą, wrócimy po kolejny zbiór za rok.\n\nProfil jest soczysty i winny: czerwone winogrona, kwiatowa nuta hibiskusa, finisz brązowego cukru. Sprzedajemy ją wyłącznie w ziarnach — ta kawa zasługuje na świeże mielenie.',
    altitudeMasl: 1950,
    variants: [
      { weight: 250, priceCents: 6900 },
      { weight: 1000, priceCents: 21990 },
    ],
    grinds: ['ziarna'],
    badges: ['limitowana'],
    palette: { bag: '#5b3147', accent: '#a97391' },
    rating: 5.0,
  },
  {
    slug: 'rzemieslnik',
    name: 'Rzemieślnik',
    origin: 'Brazylia / Etiopia',
    roast: 'ciemne',
    kind: 'mieszanka',
    notes: ['kakao', 'karmel', 'suszona śliwka'],
    description:
      'Nasza autorska mieszanka espresso — kakao, karmel i suszona śliwka pod gęstą cremą. Fundament palarni od 2019 roku.',
    story:
      'Rzemieślnik to nasza autorska mieszanka espresso — fundament, od którego w 2019 roku zaczęła się ta palarnia. Łączymy w niej 70% brazylijskiego naturala z Cerrado z 30% mytej Etiopii, palone osobno i mieszane dopiero po wypale.\n\nBrazylia daje ciało, kakao i karmelową słodycz; Etiopia dokłada owocowy błysk, dzięki któremu espresso nie robi się płaskie. Profil wypału dopracowywaliśmy przez kilka miesięcy, aż crema, słodycz i tekstura zaczęły się spinać w jedno.\n\nW espresso: kakao, karmel i suszona śliwka, gęsta crema, długi finisz. Wybacza błędy, więc dobrze czuje się także w domowych ekspresach — ciśnieniowych i automatycznych.',
    variants: [
      { weight: 250, priceCents: 4500 },
      { weight: 1000, priceCents: 14400 },
    ],
    grinds: ALL_GRINDS,
    badges: ['bestseller'],
    palette: { bag: '#2e2420', accent: '#c99a5f' },
    rating: 4.8,
  },
  {
    slug: 'wieczorna',
    name: 'Wieczorna',
    origin: 'Kolumbia / Brazylia',
    roast: 'średnie',
    kind: 'mieszanka',
    notes: ['czekolada deserowa', 'wanilia', 'orzech włoski'],
    description:
      'Bezkofeinowa mieszanka odkofeinowana ekstraktem z trzciny cukrowej. Czekolada deserowa i wanilia — na spokojny wieczór.',
    story:
      'Wieczorna powstała z prostego powodu — sami chcieliśmy pić dobrą kawę po osiemnastej. To mieszanka ziaren z Kolumbii i Brazylii pozbawiona kofeiny metodą Sugar Cane EA, w której naturalny ester z trzciny cukrowej delikatnie wypłukuje kofeinę, nie zabierając smaku.\n\nProces przebiega w niskiej temperaturze i nie narusza struktury ziarna, dzięki czemu w filiżance zostaje pełna słodycz i ciało — większość gości w ciemno nie zgaduje, że to bezkofeinowa.\n\nŚredni wypał daje czekoladę deserową, miękką wanilię i orzech włoski. Parz ją, jak lubisz — wieczorem, bez kalkulowania, czy zaśniesz.',
    variants: [
      { weight: 250, priceCents: 4600 },
      { weight: 1000, priceCents: 14690 },
    ],
    grinds: ALL_GRINDS,
    badges: ['nowość'],
    palette: { bag: '#39465a', accent: '#8ba0bd' },
    rating: 4.6,
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getBestsellers(): Product[] {
  return products.filter((product) => product.badges?.includes('bestseller'));
}
