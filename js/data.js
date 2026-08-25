/**
 * 금동대향로 가상웹전시 종합 데이터셋 (19종 표준화)
 * Source of Truth: MD문서/con_Mapping.md, main.md, references.md
 */
const EXHIBITION_DATA = {
  metadata: {
    title: '금동대향로 자연사박물관',
    subtitle: '자세히 보아야 예쁘다. 너도 그렇다.',
    team: '향로 없는 향로팀',
    theme: '금동대향로로 본 인류사',
    sourceInfo: '소장처: 국립부여박물관 | 국가유산포털 | 한국학중앙연구원',
    description: '백제금동대향로는 1993년 부여 능산리 절터에서 기적처럼 온전한 모습으로 출토되었습니다. 뚜껑에는 첩첩산중과 악사·동물들이, 몸체에는 연꽃과 수중 생물들이, 받침에는 용이 용틀임하고 있습니다. 본 전시는 문화유산 속에 담긴 생명과 자연을 매개로 인류와 생태계의 역사를 함께 탐색합니다.'
  },
  layers: [
    {
      id: 'celestial',
      layerIndex: 1,
      name: '1층위 · 천상 (봉황)',
      shortName: '천상',
      category: 'sky',
      title: '하늘을 품은 날갯짓, 봉황',
      desc: '향로 정상에서 목과 부리로 여의주를 품고 날개를 활짝 편 봉황. 백제인이 꿈꾸었던 가장 높은 이상세계의 시작입니다.',
      bg: 'Asset/2. Main/bg/bg_celestial.webp',
      animalCodes: ['18']
    },
    {
      id: 'sky',
      layerIndex: 2,
      name: '2층위 · 하늘 (신선 세계)',
      shortName: '하늘',
      category: 'sky',
      title: '음악이 흐르는 신선의 산',
      desc: '피리, 소비파, 현금, 북을 연주하는 5인의 악사와 하늘을 노니는 선인들. 자연과 인간이 조화를 이루는 영적 공간입니다.',
      bg: 'Asset/2. Main/bg/bg_sky.webp',
      animalCodes: []
    },
    {
      id: 'land',
      layerIndex: 3,
      name: '3층위 · 육지 (산악 세계)',
      shortName: '육지',
      category: 'land',
      title: '첩첩산중 생명의 터전',
      desc: '23개의 겹겹이 솟은 산봉우리 사이에 호랑이, 사슴, 멧돼지, 말 등 11종의 동물들과 기마수렵상이 살아 숨 쉽니다.',
      bg: 'Asset/2. Main/bg/bg_land.webp',
      animalCodes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11']
    },
    {
      id: 'water',
      layerIndex: 4,
      name: '4층위 · 물가 (연꽃 몸체)',
      shortName: '물가',
      category: 'water',
      title: '피어나는 연꽃과 수중 생태',
      desc: '활짝 피어난 3단의 연꽃잎 사이로 악어, 물고기, 수달, 물범, 백로 등 6종의 동물들이 노니는 생명의 물가가 펼쳐집니다.',
      bg: 'Asset/2. Main/bg/bg_waterside.webp',
      animalCodes: ['12', '13', '14', '15', '16', '17']
    },
    {
      id: 'sea',
      layerIndex: 5,
      name: '5층위 · 바다 (용 받침)',
      shortName: '바다',
      category: 'sea',
      title: '기운을 뿜어 올리는 용',
      desc: '한 다리를 치켜들고 물을 박차며 하늘로 솟구치듯 연꽃 몸체를 입으로 떠받치고 있는 용. 바다를 다스리는 신이자 백제의 역동적 기운을 상징합니다.',
      bg: 'Asset/2. Main/bg/bg_sea.webp',
      animalCodes: ['19']
    }
  ],
  animals: [
    {
      id: 1,
      code: '01',
      name: '말',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 18, y: 45 },
      panelTheme: '말의 이동과 발가락의 진화',
      simpleDesc: '단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/01.glb',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel01-2.webp',
      icon: 'Asset/2. Main/icon/01.webp',
      iconDark: 'Asset/2. Main/icon_dark/01_dark.webp',
      features: [
        '세 굽에서 하나의 외발굽으로 진화한 발가락',
        '초원 환경에 적응한 길고 강력한 다리 구조',
        '등자와 편자의 발명을 통해 확장된 인류 이동의 역사'
      ],
      scienceStory: '말의 조상인 에오히푸스는 네 개에서 세 개의 발가락을 가졌으나, 초원 환경이 확장되면서 단단한 지면을 빠르게 달리기 위해 가운뎃발가락 하나만 남은 외발굽(Ungula)으로 진화했습니다. 이는 기회주의적 영양 섭취 및 인류의 기마 수렵 문화와 깊게 연계됩니다.',
                        sourceCode: 'R01',
      referenceList: [
        { code: 'R01-01', text: 'MacFadden, B. J. (2005). Evolution. Fossil horses—evidence for evolution.' },
        { code: 'R01-02', text: 'Rebay-Salisbury, K. (2018). Horses, Wagons, and Chariots.' },
        { code: 'R01-03', text: 'Kanne, K. (2022). Riding, Ruling, and Resistance: Equestrianism and Political Authority in the Hungarian Bronze Age.' },
        { code: 'R01-04', text: 'Librado, P. et al. (2021). The origins and spread of domestic horses from the Western Eurasian steppes.' },
        { code: 'R01-05', text: 'Al Jassim, R. A. M. & Andrews, F. M. (2009). The Bacterial Community of the Horse Gastrointestinal Tract and Its Relation to Fermentative Acidosis, Laminitis, Colic, and Stomach Ulcers.' }
      ],
      assetList: [
        { code: 'A01-01', text: 'https://digital.khs.go.kr/record/recordDetail3D.do?ichDataUid=13936867936769100228&bizId=BIZ202300050001&orderCdList=B&pageSe=3D&searchText=%25EB%25A7%2590&checkbox=false&searchClick=N' }
      ],
    },
    {
      id: 2,
      code: '02',
      name: '호랑이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 26, y: 35 },
      panelTheme: '최상위 포식자의 위용과 단독 사냥 전략',
      simpleDesc: '산중을 지배하는 맹수이자 한반도 생태계의 정점에 선 최상위 포식자.',
      assetType: 'glb',
      glb: 'Asset/3. Exhibition/glb/02.glb',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel02.webp',
      icon: 'Asset/2. Main/icon/02.webp',
      iconDark: 'Asset/2. Main/icon_dark/02_dark.webp',
      features: [
        '울창한 산림에 완벽히 은폐되는 줄무늬 위장색',
        '숨죽여 다가가 단숨에 제압하는 발톱과 송곳니',
        '단독 생활에 최적화된 넓은 행동권과 영역 표시'
      ],
      scienceStory: '호랑이는 산악 지형의 수풀 속에서 몸을 숨기기 위해 세로 줄무늬를 발달시켰습니다. 사자와 달리 단독 사냥을 하므로 폭발적인 단거리 질주 근력과 척추의 유연성을 갖추고 있습니다.',
                        sourceCode: 'R02',
      referenceList: [
        { code: 'R02-01', text: '백호의 유전, 열성 형질, SLC45A2, 근친교배' },
        { code: 'R02-02', text: 'Xu, X. et al. (2013). The Genetic Basis of White Tigers. Current Biology, 23(11), 1031–1035. DOI: 10.1016/j.cub.2013.04.054.' },
        { code: 'R02-03', text: '한반도 호랑이 감소, 포획, 농업 확대, 서식지 파괴' },
        { code: 'R02-04', text: 'Seeley, J. & Skabelund, A. (2015). Tigers—Real and Imagined—in Korea’s Physical and' },
        { code: 'R02-05', text: 'Cultural Landscape. Environmental History, 20(3), 475–492. DOI: 10.1093/envhis/emv079.' }
      ],
      assetList: [
        { code: 'A02-01', text: 'https://digital.khs.go.kr/record/recordDetail3D.do?ichDataUid=13936867937885100373&bizId=BIZ202300050001&orderCdList=M&orderCdList=M&pageSe=3D&searchText=%25EC%2584%259C%25EB%259D%25BC%25EB%25B2%258C%2520%25ED%2598%25B8%25EB%259E%2591%25EC%259D%25B4&checkbox=false&searchClick=N' }
      ],
    },
    {
      id: 3,
      code: '03',
      name: '사자',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 34, y: 55 },
      panelTheme: '무리 사냥과 갈기의 사회적 신호',
      simpleDesc: '개방된 초원에서 무리를 지어 협력하는 백수의 왕이자 불교의 수호자.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Lion" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel03.webp',
      icon: 'Asset/2. Main/icon/03.webp',
      iconDark: 'Asset/2. Main/icon_dark/03_dark.webp',
      features: [
        '우두머리 수컷의 체급과 건강을 과시하는 풍성한 갈기',
        '암수 간의 뚜렷한 성적이형성(Sexual Dimorphism)',
        '사바나 개활지에서 프라이드(무리)를 이뤄 조직적으로 사냥'
      ],
      scienceStory: '사자는 개활지 초원에서 시야가 트인 환경 때문에 단독 은폐가 어려워 무리(Pride)를 형성했습니다. 수컷의 어두운 갈기는 테스토스테론 수치와 영양 상태를 암컷과 경쟁자에게 전달하는 시각적 신호입니다.',
                        sourceCode: 'R03',
      referenceList: [
        { code: 'R03-01', text: '사자 갈기, 성선택, 수컷의 상태 신호' },
        { code: 'R03-02', text: 'West, P. M. & Packer, C. (2002). Sexual Selection, Temperature, and the Lion\'s Mane. Science, 297(5585), 1339–1343. DOI: 10.1126/science.1073257.' },
        { code: 'R03-03', text: '사자의 문제 해결, 학습, 기억, 사회적 지능 가설' },
        { code: 'R03-04', text: 'Borrego, N. & Dowling, B. (2016). Lions (Panthera leo) solve, learn, and remember a novel resource acquisition problem. Animal Cognition, 19(5), 1019–1025. DOI: 10.1007/s10071-016-1009-y.' },
        { code: 'R03-05', text: '동굴사자의 분포, 한반도 출현' }
      ],
      assetList: [
        { code: 'A03-01', text: 'https://skfb.ly/KCBU' }
      ],
    },
    {
      id: 4,
      code: '04',
      name: '족제비',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 42, y: 40 },
      panelTheme: '원통형 체형과 기동성 높은 사냥',
      simpleDesc: '좁은 굴과 덤불 속을 자유자재로 누비는 민첩한 소형 육식동물.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Mink (Lowpoly)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/18b390f0dcc943288cc0971e5328159f/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel04.webp',
      icon: 'Asset/2. Main/icon/04.webp',
      iconDark: 'Asset/2. Main/icon_dark/04_dark.webp',
      features: [
        '설치류의 굴속으로 침투하기 유리한 길고 유연한 체형',
        '짧은 다리와 높은 기초대사율에 맞춘 잦은 사냥 습성',
        '위기 상황에서 분비하는 항문선의 강력한 화학 방어 물질'
      ],
      scienceStory: '족제비과 동물은 원통형의 길쭉한 신체 구조를 통해 지중 터널이나 바위틈에 서식하는 먹이를 효과적으로 추적합니다. 표면적 대비 부피가 커 체온 손실이 빠르므로 지속적인 에너지 섭취가 필요합니다.',
                        sourceCode: 'R04',
      referenceList: [
        { code: 'R04-01', text: '족제비의 신체 형태와 소형 포식자로서의 생태' },
        { code: 'R04-02', text: 'King, C. M. (1980). The weasel Mustela nivalis and its prey in an English woodland. Journal of Animal Ecology, 49(1), 127–159.' },
        { code: 'R04-03', text: '족제비의 식성과 소형 설치류 포식' },
        { code: 'R04-04', text: 'McDonald, R. A., Webbon, C., & Harris, S. (2000). The diet of stoats (Mustela erminea) and weasels (Mustela nivalis) in Great Britain. Journal of Zoology, 252(3), 363–371. DOI: 10.1111/j.1469-7998.2000.tb00631.x.' },
        { code: 'R04-05', text: '생태적 니치(niche)의 개념' }
      ],
      assetList: [
        { code: 'A04-01', text: '[https://skfb.ly/oKByZ](https://skfb.ly/oKByZ)' },
        { code: 'A04-02', text: '[https://skfb.ly/oEAwv](https://skfb.ly/oEAwv)' }
      ](https://skfb.ly/oKByZ)' },
        { code: 'A04-02', text: '[https://skfb.ly/oEAwv](https://skfb.ly/oEAwv)' }
      ],
    },
    {
      id: 5,
      code: '05',
      name: '원숭이',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 50, y: 60 },
      panelTheme: '마주보는 엄지손가락과 수상 생활 적응',
      simpleDesc: '입체적 시야와 정교한 손놀림으로 수관층을 자유롭게 이동하는 영장류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Monkey 3D animal" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/90df1c6b146749f1ba1f3346831a2f57/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel05.webp',
      icon: 'Asset/2. Main/icon/05.webp',
      iconDark: 'Asset/2. Main/icon_dark/05_dark.webp',
      features: [
        '나뭇가지를 쥐는 마주보는 엄지(Opposable Thumb)',
        '양안시를 통한 정밀한 3차원 거리 측정 능력',
        '복잡한 사회적 상호작용과 도구 활용 지능'
      ],
      scienceStory: '원숭이를 비롯한 영장류는 숲의 수관층에서 입체적으로 나뭇가지를 잡고 건너뛰기 위해 엄지손가락의 대립성과 안면 전면 배치 안구를 진화시켰습니다. 이는 도구 사용과 대뇌 피질 발달의 시초가 되었습니다.',
                        sourceCode: 'R05',
      referenceList: [
        { code: 'R05-01', text: '영장류의 손·발 구조와 파지 능력' },
        { code: 'R05-02', text: 'Napier, J. R. & Napier, P. H. (1967). A Handbook of Living Primates: Morphology, Ecology and Behaviour of Nonhuman Primates. Academic Press.' },
        { code: 'R05-03', text: '인간과 다른 영장류의 진화적 관계' },
        { code: 'R05-04', text: 'Cartmill, M. & Smith, F. H. (2011). The Human Lineage. Wiley-Blackwell.' },
        { code: 'R05-05', text: '영장류의 번식 행동과 성적 신호' }
      ],
      assetList: [
        { code: 'A05-01', text: 'https://skfb.ly/pMuOH' }
      ],
    },
    {
      id: 6,
      code: '06',
      name: '사슴',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 58, y: 35 },
      panelTheme: '매년 재생되는 골질 뿔과 초식 반추 시스템',
      simpleDesc: '맑은 눈망울과 우아한 뿔을 지닌 숲의 전령이자 장수를 상징하는 길조.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Deer Family" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/00dd0126dcc0483392afa0a396d05f92/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel06.webp',
      icon: 'Asset/2. Main/icon/06.webp',
      iconDark: 'Asset/2. Main/icon_dark/06_dark.webp',
      features: [
        '피부(녹용)에서 완전한 뼈로 매년 탈락 및 재생되는 뿔(Antler)',
        '섬유질 식물을 분해하는 4개의 방으로 나뉜 반추위',
        '포식자를 감시하기 위해 좌우로 넓게 배치된 수평 타원형 동공'
      ],
      scienceStory: '사슴의 뿔은 소의 영구적인 뿔(Horn)과 달리 매년 자라고 떨어지는 골질 조직으로, 포유류 중 가장 빠른 줄기세포 기반 조직 재생 능력을 보여줍니다. 또한 넓은 시야각의 동공은 수풀 속 포식자를 조기에 발견합니다.',
                        sourceCode: 'R06',
      referenceList: [
        { code: 'R06-01', text: '사슴뿔의 재생과 성장' },
        { code: 'R06-02', text: 'Li, C. & Suttie, J. M. (2012). Morphogenetic aspects of deer antler development. Frontiers in Bioscience (Elite Edition), 4(5), 1836–1842. DOI: 10.2741/505.' },
        { code: 'R06-03', text: 'Feleke, M., Bennett, S., Chen, J., Hu, X., Williams, D. & Xu, J. (2020). New physiological insights into the phenomena of deer antler: A unique model for skeletal tissue regeneration. Journal of Orthopaedic Translation, 27, 57–66. DOI: 10.1016/j.jot.2020.10.012.' },
        { code: 'R06-04', text: 'Li, C. (2023). Deer antler renewal gives insights into mammalian epimorphic regeneration. Cell Regeneration, 12, 26.' },
        { code: 'R06-05', text: 'Kruuk, L. E. B., Slate, J., Pemberton, J. M., Brotherstone, S., Guinness, F. & Clutton-Brock, T. H. (2002). Antler size in red deer: heritability and selection but no evolution. Evolution, 56(8), 1683–1695. DOI: 10.1111/j.0014-3820.2002.tb01480.x.' }
      ],
      assetList: [
        { code: 'A06-01', text: 'https://skfb.ly/6BHXp' }
      ],
    },
    {
      id: 7,
      code: '07',
      name: '멧돼지',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 66, y: 55 },
      panelTheme: '굴토 습성과 숲의 토양 생태계 교란자',
      simpleDesc: '강인한 주둥이와 엄니로 흙을 파헤치는 산림 생태계의 엔지니어.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Boar Realistic" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/e2761cb2839447b6beb0b4ed132b0895/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel07.webp',
      icon: 'Asset/2. Main/icon/07.webp',
      iconDark: 'Asset/2. Main/icon_dark/07_dark.webp',
      features: [
        '단단한 토양과 바위를 뒤집는 연골성 주둥이 디스크',
        '위아래가 맞물리며 지속적으로 날카로워지는 자가 연마 엄니',
        '진흙 목욕을 통한 체온 조절 및 외부 기생충 방제'
      ],
      scienceStory: '멧돼지는 후각이 극도로 발달하여 땅속 20cm 깊이의 뿌리와 구근을 찾아냅니다. 멧돼지가 땅을 갈아엎는 행위(Rooting)는 산림 토양에 산소를 공급하고 식물 종자의 발아를 돕는 핵심 생태계 서비스 역할을 합니다.',
                        sourceCode: 'R07',
      referenceList: [
        { code: 'R07-01', text: '멧돼지의 굴토 행동과 토양 교란' },
        { code: 'R07-02', text: 'Bueno, C. G., Alados, C. L., Gómez-García, D., Barrio, I. C., & García-González, R. (2009). Understanding the main factors in the extent and distribution of wild boar rooting on alpine grasslands. Journal of Zoology, 279, 195–202. DOI: 10.1111/j.1469-7998.2009.00607.x.' },
        { code: 'R07-03', text: '멧돼지 굴토와 식물 다양성' },
        { code: 'R07-04', text: 'Horčičková, E., et al. (2019). Wild boar (Sus scrofa) increases species diversity of semidry grassland: Field experiment with simulated soil disturbances. Ecology and Evolution, 9(5), 2765–2774. DOI: 10.1002/ece3.4950.' },
        { code: 'R07-05', text: '멧돼지 굴토가 토양에 미치는 영향' }
      ],
      assetList: [
        { code: 'A07-01', text: 'https://skfb.ly/oSyL7' }
      ],
    },
    {
      id: 8,
      code: '08',
      name: '코끼리',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 74, y: 40 },
      panelTheme: '수만 개 근육의 코와 골격 생체역학',
      simpleDesc: '거대한 몸체와 정교한 코를 지닌 지혜로운 거인.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="African Elephant, skeleton" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/0a7cb290616442c88f89107d9a11f8f0/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel08.webp',
      icon: 'Asset/2. Main/icon/08.webp',
      iconDark: 'Asset/2. Main/icon_dark/08_dark.webp',
      features: [
        '뼈 없이 4만 개 이상의 근육 다발로 구성된 코(Proboscis)',
        '수 톤의 하중을 분산하는 발바닥의 두터운 쿠션 패드',
        '초저주파를 이용해 수 킬로미터 밖과 소통하는 청각 체계'
      ],
      scienceStory: '코끼리의 코는 코와 윗입술이 융합 진화한 기관으로, 무거운 통나무를 들면서도 바닥의 쌀알을 집을 수 있을 만큼 섬세합니다. 직립 기둥 형태의 다리 뼈 구조는 최소한의 근육 에너지로 거대한 체중을 지탱합니다.',
                        sourceCode: 'R08',
      referenceList: [
        { code: 'R08-01', text: 'Jannel, A., Nair, J. P., Panagiotopoulou, O., Romilio, A. & Salisbury, S. W. (2019). “Keep your feet on the ground”: Simulated range of motion and hind foot posture of the Middle Jurassic sauropod *Rhoetosaurus brownei* and its implications for sauropod biology. *Journal of Morphology*, 280(6), 849–878. DOI: 10.1002/jmor.20989.' },
        { code: 'R08-02', text: 'Fischer, M. S., Schaller, N., & others. (2007). The structure of the cushions in the feet of African elephants (*Loxodonta africana*). *Journal of Anatomy*, 210.' },
        { code: 'R08-03', text: '→ 코끼리 발의 섬유성·지방성 쿠션과 체중 지지, 힘의 분산을 뒷받침하는 자료.' },
        { code: 'R08-04', text: 'Lee, R. et al. (2016). Foot pressure distributions during walking in African elephants (*Loxodonta africana*). *Journal of Experimental Biology*.' },
        { code: 'R08-05', text: '→ 코끼리의 발바닥 패드가 보행 중 하중을 분산하는 구조와 기능을 뒷받침.' }
      ],
      assetList: [
        { code: 'A08-01', text: 'https://skfb.ly/QWCR' }
      ],
    },
    {
      id: 9,
      code: '09',
      name: '이상한 부리를 가진 새',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 82, y: 58 },
      panelTheme: '먹이 자원에 따른 부리의 형태적 방산적응',
      simpleDesc: '특이한 곡선 부리를 지녀 자연의 다양한 먹이에 적응한 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Finches Birds (Lowpoly)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/1c27c1bec5f6440981a2673db56d0c11/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel09.webp',
      icon: 'Asset/2. Main/icon/09.webp',
      iconDark: 'Asset/2. Main/icon_dark/09_dark.webp',
      features: [
        '특정 식물의 꿀, 씨앗, 곤충을 채취하기 위해 특화된 부리 곡률',
        '비행 에너지를 줄이기 위한 경량화된 두개골과 케라틴 부리 표면',
        '다윈의 핀치새로 대표되는 진화론적 적응방산(Adaptive Radiation)'
      ],
      scienceStory: '새의 부리는 손이 없는 조류에게 만능 도구입니다. 서식지의 먹이 종류에 따라 부리의 길이, 두께, 곡률이 극적으로 분화하여 생태적 지위를 분할합니다.',
                        sourceCode: 'R09',
      referenceList: [
        { code: 'R09-01', text: '새의 부리 형태와 먹이 이용의 관계' },
        { code: 'R09-02', text: 'Abzhanov, A., Kuo, W. P., Hartmann, C., Grant, B. R., Grant, P. R., & Tabin, C. J. (2006). The calmodulin pathway and evolution of elongated beak morphology in Darwin\'s finches. Nature, 442, 563–567. DOI: 10.1038/nature04843.' },
        { code: 'R09-03', text: '다윈핀치의 부리 다양성과 적응방산' },
        { code: 'R09-04', text: 'Grant, P. R., & Grant, B. R. (2024). From microcosm to macrocosm: adaptive radiation of Darwin\'s finches. Evolutionary Journal of the Linnean Society, 3(1), kzae006. DOI: 10.1093/evolinnean/kzae006.' },
        { code: 'R09-05', text: '다윈핀치의 생태적 다양화와 적응방산' }
      ],
      assetList: [
        { code: 'A09-01', text: 'https://skfb.ly/oLDKA' }
      ],
    },
    {
      id: 10,
      code: '10',
      name: '뱀을 물고 있는 야수',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 89, y: 38 },
      panelTheme: '독성 파충류에 대한 면역성과 포식자-피식자 공진화',
      simpleDesc: '맹독의 뱀을 제압하여 물고 있는 백제의 신비로운 맹수.',
      assetType: 'gif',
      embedHtml: '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#05070a;position:relative;"><img src="Asset/3. Exhibition/glb/cramorant-gorging.gif" style="max-width:85%;max-height:80%;object-fit:contain;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.8);" alt="뱀을 물고 있는 야수 (먹이 포식 애니메이션)"><span style="color:var(--text-muted);font-size:0.85rem;margin-top:0.75rem;">🎬 포식-피식 공진화 생태 모션 에셋</span></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel10.webp',
      icon: 'Asset/2. Main/icon/10.webp',
      iconDark: 'Asset/2. Main/icon_dark/10_dark.webp',
      features: [
        '신경독에 저항성을 갖는 니코틴성 아세틸콜린 수용체 변이',
        '뱀의 공격 속도를 능가하는 반사신경과 두터운 털가죽',
        '뱀의 머리를 정확히 타격하여 무력화시키는 사냥 기술'
      ],
      scienceStory: '라텔이나 몽구스 같은 동물들은 맹독성 뱀을 사냥하기 위해 아세틸콜린 수용체 구조를 변형시켜 독소가 결합하지 못하도록 진화시켰습니다.',
                        sourceCode: 'R10',
      referenceList: [
        { code: 'R10-01', text: '붉은 여왕 가설의 기초 개념' },
        { code: 'R10-02', text: 'Van Valen, L. (1973). A new evolutionary law. Evolutionary Theory, 1, 1–30.' },
        { code: 'R10-03', text: '포식자와 피식자의 공진화 및 붉은 여왕 가설' },
        { code: 'R10-04', text: 'Stenseth, N. C. & Maynard Smith, J. (1984). Coevolution in ecosystems: Red Queen evolution or stasis? Evolution, 38(4), 870–880.' },
        { code: 'R10-05', text: '스피팅코브라의 사람 얼굴에 대한 독 분사 행동' }
      ],
      assetList: [
        { code: 'A10-01', text: 'https://skfb.ly/6XUDU' }
      ],
    },
    {
      id: 11,
      code: '11',
      name: '볏을 가진 새',
      layer: 'land',
      layerName: '육지 (산악)',
      layerCoords: { x: 95, y: 55 },
      panelTheme: '성선택(Sexual Selection)과 화려한 장식 깃의 진화',
      simpleDesc: '머리 위에 화려한 볏을 세우고 구애하는 우아한 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Great Argus (NHMW-ZOO-VS-70946 &amp; 70947)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/e3827c13a3364e8084797531b58c6ed6/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel11-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel11-2.webp',
      icon: 'Asset/2. Main/icon/11.webp',
      iconDark: 'Asset/2. Main/icon_dark/11_dark.webp',
      features: [
        '포식자에게 눈에 띄는 위험을 감수하고 번식 경쟁을 위해 발달한 머리 볏',
        '구애 의식 시 펼쳐지는 부채꼴 형태의 시각 디스플레이',
        '자비의 원리(Handicap Principle)에 기반한 우수한 유전자 증명'
      ],
      scienceStory: '화려한 볏과 꼬리 깃털은 생존에는 불리하지만, 짝짓기 선택에서 건강함과 면역력을 증명하는 핸디캡 이론의 대표적 산물입니다.',
                        sourceCode: 'R11',
      referenceList: [
        { code: 'R11-01', text: '볏을 가진 새의 성선택과 성적이형' },
        { code: 'R11-02', text: 'Andersson, M. (1994). Sexual Selection. Princeton University Press.' },
        { code: 'R11-03', text: '조류의 성적이형과 성 차이의 발생' },
        { code: 'R11-04', text: 'Mank, J. E. (2009). Sex and the evolution of reproductive strategies. Nature Reviews Genetics, 10, 504–513.' },
        { code: 'R11-05', text: '조류의 ZZ/ZW 성결정 체계' }
      ],
      assetList: [
        { code: 'A11-01', text: 'https://skfb.ly/o7yPD' }
      ],
    },
    {
      id: 12,
      code: '12',
      name: '악어',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 20, y: 50 },
      panelTheme: '반수생 잠복 사냥과 원시 파충류 골판 방어갑',
      simpleDesc: '수면 아래 숨어 눈과 콧구멍만 내놓고 사냥하는 수중의 절대 강자.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Australian Freshwater Crocodile ( underwater )" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d87d75c454554ca78ac582c6a130e7cb/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel12.webp',
      icon: 'Asset/2. Main/icon/12.webp',
      iconDark: 'Asset/2. Main/icon_dark/12_dark.webp',
      features: [
        '머리 상단에 일직선으로 배치되어 잠수 중에도 호흡과 감시가 가능한 감각기관',
        '피부 아래에 골화된 판(Osteoderms)으로 이루어진 천연 방탄 갑옷',
        '물속에서 먹이를 찢어 삼키는 데스 롤(Death Roll) 회전력'
      ],
      scienceStory: '악어는 중생대부터 신체 설계를 거의 바꾸지 않은 살아있는 화석입니다. 눈, 귀, 콧구멍이 두개골 최상단에 수평으로 배치되어 몸 전체를 수중에 숨긴 채 완벽한 기습을 감행합니다.',
                        sourceCode: 'R12',
      referenceList: [
        { code: 'R12-01', text: '악어류의 형태 진화와 생태적 다양성' },
        { code: 'R12-02', text: 'Godoy, P. L. (2020). Crocodylomorph cranial shape evolution and its relationship with body size and ecology. *Journal of Evolutionary Biology, 33*(1), 4–21.' },
        { code: 'R12-03', text: '악어류의 진화와 형태적 보수성' },
        { code: 'R12-04', text: 'Stockdale, M. T. & Benton, M. J. (2021). Environmental drivers of body size evolution in crocodile-line archosaurs. *Communications Biology, 4*.' },
        { code: 'R12-05', text: '파충류의 학습과 인지능력' }
      ],
      assetList: [
        { code: 'A12-01', text: 'https://skfb.ly/pAot9' }
      ],
    },
    {
      id: 13,
      code: '13',
      name: '물고기 (실러캔스/육기어류)',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 35, y: 40 },
      panelTheme: '지느러미에서 사지동물의 다리로의 진화적 가교',
      simpleDesc: '수중에서 육지로 진출한 척추동물의 위대한 도약을 품은 존재.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="coelacanth (genus Latimeria)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/162ba6f0282c453789c77a4fa2f84e6e/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel13.webp',
      icon: 'Asset/2. Main/icon/13.webp',
      iconDark: 'Asset/2. Main/icon_dark/13_dark.webp',
      features: [
        '근육질 줄기와 뼈대가 내장되어 다리처럼 작동하는 육질 지느러미(Lobe-fin)',
        '물속 흐름과 전기장을 감지하는 측선(Lateral Line) 감각계',
        '데본기 육상 척추동물(사지류)의 직접적 조상 형태 보존'
      ],
      scienceStory: '실러캔스와 같은 육기어류의 지느러미 내부에는 인간의 팔다리와 상동 구조인 상완골, 요골, 척골의 원형 뼈대가 존재합니다.',
                        sourceCode: 'R13',
      referenceList: [
        { code: 'R13-01', text: '물고기의 지느러미와 사지의 진화' },
        { code: 'R13-02', text: 'Shubin, N. H., Daeschler, E. B. & Jenkins, F. A. Jr. (2006). The pectoral fin of Tiktaalik roseae and the origin of the tetrapod limb. Nature, 440, 764–771. DOI: 10.1038/nature04637.' },
        { code: 'R13-03', text: '물고기 턱과 인두궁의 진화' },
        { code: 'R13-04', text: 'DeLaurier, A. (2019). Evolution and development of the fish jaw skeleton. WIREs Developmental Biology, 8(1), e337. DOI: 10.1002/wdev.337.' },
        { code: 'R13-05', text: '척추동물 턱의 진화' }
      ],
      assetList: [
        { code: 'A13-01', text: '[https://skfb.ly/oEuLR](https://skfb.ly/oEuLR)' },
        { code: 'A13-02', text: 'https://skfb.ly/6U8op' }
      ](https://skfb.ly/oEuLR)' },
        { code: 'A13-02', text: 'https://skfb.ly/6U8op' }
      ],
    },
    {
      id: 14,
      code: '14',
      name: '물범',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 50, y: 58 },
      panelTheme: '육상 식육류의 해양 복귀와 유선형 지느러미발 진화',
      simpleDesc: '두터운 지방층과 지느러미발로 차가운 물살을 가르는 해양 포유류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="seal" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/38dc4e92f17e444597274bff6be913c2/embed?autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel14.webp',
      icon: 'Asset/2. Main/icon/14.webp',
      iconDark: 'Asset/2. Main/icon_dark/14_dark.webp',
      features: [
        '발가락 사이에 물갈퀴가 발달하여 변형된 지느러미발(Flipper)',
        '극저온의 물속에서도 체온을 유지하는 두꺼운 피하지방층(Blubber)',
        '잠수 중 산소를 효율적으로 저장하는 미오글로빈 농식 근육'
      ],
      scienceStory: '물범과 물개 등의 기각류는 곰이나 족제비와 공통 조상을 공유하는 육상 포유류였으나 바다로 복귀하여 사지가 지느러미발로 진화했습니다.',
                        sourceCode: 'R14',
      referenceList: [
        { code: 'R14-01', text: '물범의 수렴진화와 수중 적응' },
        { code: 'R14-02', text: 'Nery, M. F., Borges, B., Dragalzew, A. A., & Kohlsdorf, T. (2016). Selection on different genes with equivalent functions: the convergence story told by Hox genes along the evolution of aquatic mammalian lineages. *BMC Evolutionary Biology, 16*, 233. DOI: 10.1186/s12862-016-0682-4.' },
        { code: 'R14-03', text: '기각류의 형태와 수영 방식 비교' },
        { code: 'R14-04', text: 'Pierce, S. E., & Schmitt, D. (2011). Comparative axial morphology in pinnipeds and its correlation with aquatic locomotory behaviour. *Journal of Anatomy, 219*(4), 462–472. DOI: 10.1111/j.1469-7580.2011.01406.x.' },
        { code: 'R14-05', text: '물범과 물개·바다사자의 수영 방식과 수렴' }
      ],
      assetList: [
        { code: 'A14-01', text: 'https://skfb.ly/6SPy7' }
      ](https://skfb.ly/oKByZ)' },
        { code: 'A14-02', text: '[https://skfb.ly/oEAwv](https://skfb.ly/oEAwv)' }
      ],
    },
    {
      id: 15,
      code: '15',
      name: '수달',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 65, y: 38 },
      panelTheme: '방수 털 구조와 수중 진동 감지 수염(Vibrissae)',
      simpleDesc: '물과 육지를 오가며 하천 생태계의 건강성을 대변하는 지표종.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Sea Otter Mammal (Endangered)" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/188d7264dc354c7195cf47f4540bf252/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel15.webp',
      icon: 'Asset/2. Main/icon/15.webp',
      iconDark: 'Asset/2. Main/icon_dark/15_dark.webp',
      features: [
        '공기층을 가두어 물이 피부에 닿지 않게 하는 이중 구조 방수 모피',
        '탁한 물속에서도 먹이 물고기의 미세 진동을 포착하는 입가의 감각수염',
        '수중에서 방향을 전환하는 노 역할을 하는 유연한 근육질 꼬리'
      ],
      scienceStory: '수달의 털은 제곱센티미터당 수만 가닥의 치밀한 솜털로 이루어져 공기 방울을 포획합니다. 이를 통해 수중 저체온증을 방지합니다.',
                        sourceCode: 'R15',
      referenceList: [
        { code: 'R15-01', text: '수달류의 분류와 계통' },
        { code: 'R15-02', text: 'Koepfli, K.-P. et al. (2008). Multigene phylogeny of the Mustelidae: Resolving relationships, tempo and biogeographic history of a mammalian adaptive radiation. *BMC Biology, 6*, 10. DOI: 10.1186/1741-7007-6-10.' },
        { code: 'R15-03', text: '해달의 분류 및 진화' },
        { code: 'R15-04', text: 'Sato, J. J. et al. (2006). The molecular phylogeny of mustelids: Effects of evolutionary constraints and incomplete lineage sorting. *Systematic Biology, 55*(3), 425–439. DOI: 10.1080/10635150600769505.' },
        { code: 'R15-05', text: '수달의 털과 수중생활·체온 유지' }
      ],
      assetList: [
        { code: 'A15-01', text: 'https://skfb.ly/oSKos' }
      ],
    },
    {
      id: 16,
      code: '16',
      name: '백로',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 80, y: 52 },
      panelTheme: '물 굴절 보정과 경추 굽힘을 통한 정밀 작살 사냥',
      simpleDesc: '물가에 고요히 서서 날렵하게 물고기를 낚아채는 청결의 상징.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Realistic Heron 3D Model" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/95a74fb41f1a46f0acec81a2d6c85093/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel16.webp',
      icon: 'Asset/2. Main/icon/16.webp',
      iconDark: 'Asset/2. Main/icon_dark/16_dark.webp',
      features: [
        'S자로 접혔다 탄성으로 튀어나가는 특수 변형 경추(목뼈) 구조',
        '빛의 굴절각을 시각 신경망에서 실시간 보정하는 시각 연산',
        '펄이나 얕은 여울에 발이 빠지지 않도록 넓게 벌어지는 긴 발가락'
      ],
      scienceStory: '백로는 물 표면에서 발생하는 빛의 굴절을 뇌 시각 피질에서 계산하여, 실제 위치보다 떠 보이는 물고기를 정확하게 작살처럼 내리꽂아 포획합니다.',
                        sourceCode: 'R16',
      referenceList: [
        { code: 'R16-01', text: '백로·왜가리의 분류와 명칭' },
        { code: 'R16-02', text: 'Integrated Taxonomic Information System (ITIS). Ardeidae Leach, 1820 — Herons, Egrets, Bitterns.' },
        { code: 'R16-03', text: '백로가 왜가리과 내 여러 새를 가리키는 명칭이라는 근거' },
        { code: 'R16-04', text: 'British Trust for Ornithology (BTO). Ardeidae – Herons.' },
        { code: 'R16-05', text: '색채 범주화와 무지개' }
      ],
      assetList: [
        { code: 'A16-01', text: 'https://skfb.ly/pvzLN' }
      ],
    },
    {
      id: 17,
      code: '17',
      name: '달리는 새 (주조류)',
      layer: 'water',
      layerName: '물가 (연꽃 몸체)',
      layerCoords: { x: 92, y: 44 },
      panelTheme: '비행 포기와 지상 질주 골격으로의 역행 진화',
      simpleDesc: '날개를 접고 대지를 힘차게 질주하는 지상 적응 조류.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Little Spotted Kiwi" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/b61466de53d24988835bb755dc2f73da/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-2.webp',
      panelImg3: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-3.webp',
      icon: 'Asset/2. Main/icon/17.webp',
      iconDark: 'Asset/2. Main/icon_dark/17_dark.webp',
      features: [
        '비행 근육이 부착되던 용골봉(Keel)의 소실 및 편평한 흉골',
        '강력한 추진력을 제공하는 발달된 대퇴골과 두툼한 건(Tendon)',
        '단단한 땅과의 마찰을 줄이기 위해 감소된 발가락 수'
      ],
      scienceStory: '타조, 키위 같은 주조류는 날기 위해 드는 막대한 에너지 대사 대신 지상 질주력을 극대화하는 방향으로 진화했습니다.',
                        sourceCode: 'R17',
      referenceList: [
        { code: 'R17-01', text: '날지 않는 새의 진화와 비행 능력 상실' },
        { code: 'R17-02', text: 'Dececchi, T. A. & Larsson, H. C. E. (2013). Body and limb size dissociation at the origin of birds: implications for scaling and the evolution of flight. Evolution, 67(4), 1235–1246.' },
        { code: 'R17-03', text: '새·박쥐·익룡의 날개와 비행 형태의 진화' },
        { code: 'R17-04', text: 'Wang, X., Kellner, A. W. A., Zhou, Z. & Campos, D. A. (2009). Pterosaur diversity and the origin of flight. Science, 326(5958), 250–253.' },
        { code: 'R17-05', text: '새·박쥐·익룡의 비행과 수렴진화' }
      ],
      assetList: [
        { code: 'A17-01', text: 'https://skfb.ly/onu6x' }
      ],
    },
    {
      id: 18,
      code: '18',
      name: '봉황 (금시조)',
      layer: 'celestial',
      layerName: '천상 (정상)',
      layerCoords: { x: 50, y: 45 },
      panelTheme: '태양 숭배와 조류의 궁극적 이상화 형태',
      simpleDesc: '향로 정상에서 여의주를 품고 날개를 펴 태평성대를 알리는 신조.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="food (pes) rooster" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/778006bf99114fde8898b61104bc43d4/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-1.webp',
      panelImg2: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-2.webp',
      panelImg3: 'Asset/3. Exhibition/N_Panel/webp/N_Panel17-3.webp',
      icon: 'Asset/2. Main/icon/18.webp',
      iconDark: 'Asset/2. Main/icon_dark/18_dark.webp',
      features: [
        '닭의 머리, 뱀의 목, 제비의 턱, 공작의 꼬리가 융합된 복합 상징',
        '목과 부리 사이에 둥근 여의주를 품은 백제 특유의 조형미',
        '가슴과 날개깃에 설계된 향 연기 분출 통로'
      ],
      scienceStory: '봉황은 꿩, 공작, 맹금류의 가장 강력하고 화려한 해부학적 형질들이 결합된 상징적 생명체입니다.',
                        sourceCode: 'R18',
      referenceList: [
        { code: 'R18-01', text: '며느리발톱(spur)의 형태와 기능' },
        { code: 'R18-02', text: 'Davison, G. W. H. (1985). Avian spurs. Journal of Zoology, 206(1), 117–123.' },
        { code: 'R18-03', text: '새와 뱀의 상징적 대칭' },
        { code: 'R18-04', text: 'Vaz da Silva, F. (2011). Cosmos in a painting: Reflections on Judeo-Christian creation symbolism. Cosmos, 26, 53–77.' },
        { code: 'R18-05', text: '가루다(Garuda)와 나가(Nāga)의 신화적 관계' }
      ],
      assetList: [
        { code: 'A18-01', text: 'https://skfb.ly/6TWAv' }
      ],
    },
    {
      id: 19,
      code: '19',
      name: '용',
      layer: 'sea',
      layerName: '바다 (받침)',
      layerCoords: { x: 50, y: 50 },
      panelTheme: '수생 파충류의 역동성과 유체역학적 투조 기법',
      simpleDesc: '용틀임하며 물을 박차고 솟아올라 향로 전체를 떠받치는 신성한 용.',
      assetType: 'embed',
      embedHtml: '<div class="sketchfab-embed-wrapper"><iframe title="Animated Realistic Lowpoly Chinese Dragon" frameborder="0" allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src="https://sketchfab.com/models/d942a0d167594169b3f037f562458d38/embed?autospin=1&autostart=1&transparent=1&dnt=1"></iframe></div>',
      panelImg: 'Asset/3. Exhibition/N_Panel/webp/N_Panel19.webp',
      icon: 'Asset/2. Main/icon/19.webp',
      iconDark: 'Asset/2. Main/icon_dark/19_dark.webp',
      features: [
        '한 다리를 치켜들고 용틀임하는 역동적 3차원 입체 투조 주조',
        '뱀의 몸체, 물고기 비늘, 사슴 뿔, 독수리 발톱이 결합된 수신(水神)',
        '하부의 하중을 분산하면서도 부유감을 극대화한 구조역학적 설계'
      ],
      scienceStory: '용의 도상은 고대인들이 거대 악어, 비단뱀 등을 관찰하며 물을 다스리는 궁극의 생명체로 승화시킨 것입니다.',
                        sourceCode: 'R19',
      referenceList: [
        { code: 'R19-01', text: '뱀탐지 이론과 위협 자극에 대한 주의 편향' },
        { code: 'R19-02', text: 'Isbell, L. A. (2006). Snakes as agents of evolutionary change: The case of the primate visual system. Journal of Human Evolution, 51(1), 1–35.' },
        { code: 'R19-03', text: '뱀에 대한 선택적 주의와 탐지' },
        { code: 'R19-04', text: 'LoBue, V., & DeLoache, J. S. (2008). Detecting the snake in the grass: Attention to fear-relevant stimuli by adults and young children. Psychological Science, 19(3), 284–289.' },
        { code: 'R19-05', text: '위협 자극에 대한 준비성(Preparedness)과 공포 학습' }
      ],
      assetList: [
        { code: 'A19-01', text: 'https://skfb.ly/pyzur' }
      ],
    }
  ]
};

window.EXHIBITION_DATA = EXHIBITION_DATA;
