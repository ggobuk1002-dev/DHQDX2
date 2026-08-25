/**
 * ============================================================
 * EXHIBITION DATA ARCHIVE (Source of Truth)
 * 19 Animals & 5 Sacred Layers of Baekje Incense Burner
 * Fully Validated & Synchronized with MD Documentation
 * ============================================================
 */

const EXHIBITION_DATA = {
  layers: [
    {
      id: 'celestial',
      layerIndex: 1,
      name: '천상',
      shortName: '천상',
      category: 'celestial',
      title: '하늘을 품은 날갯짓, 봉황',
      desc: '향로의 가장 높은 곳에는 일반적으로 봉황으로 해석되는 새가 여의주를 턱 아래에 품고 날개를 펼친 채 서 있습니다. 봉황으로 보는 견해가 가장 널리 받아들여지지만, 천계·가릉빈가·금시조 등 다른 해석도 있습니다.',
      bg: 'Asset/2. Main/bg/bg_celestial.webp',
      animalCodes: ['18']
    },
    {
      id: 'sky',
      layerIndex: 2,
      name: '산꼭대기',
      shortName: '산꼭대기',
      category: 'sky',
      title: '음악이 흐르는 신선의 산',
      desc: '산 모양 뚜껑의 상부에는 완함·종적·배소·거문고·북을 연주하는 다섯 악사가 자리합니다. 산 사이사이에는 향연이 빠져나오는 구멍이 있어, 향을 피우면 산악 세계 사이로 연기가 피어오르도록 설계되었습니다.',
      bg: 'Asset/2. Main/bg/bg_sky.webp',
      animalCodes: []
    },
    {
      id: 'land',
      layerIndex: 3,
      name: '삼신산',
      shortName: '삼신산',
      category: 'land',
      title: '첩첩산중, 생명의 터전',
      desc: '겹겹이 솟아오른 향로의 산악은 신선이 산다고 여겨진 삼신산을 형상화한 것으로 해석됩니다. 산 모양 뚜껑에는 여러 겹의 봉우리와 산길·시냇물·폭포·호수가 표현되어 있고, 그 사이에 호랑이·사슴·멧돼지 등 현실의 동물과 상상의 동물, 기마수렵상과 여러 인물상이 배치되어 있습니다.',
      bg: 'Asset/2. Main/bg/bg_land.webp',
      animalCodes: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '17']
    },
    {
      id: 'water',
      layerIndex: 4,
      name: '연꽃과 물가',
      shortName: '연꽃과 물가',
      category: 'water',
      title: '피어나는 연꽃과 수중 생태',
      desc: '활짝 핀 연꽃을 닮은 몸체의 꽃잎 사이에는 물고기·사슴·학을 비롯한 여러 동물과 인물이 표현되어 있습니다. 일부 형상은 악어처럼 보이는 동물이나 날개 달린 신령한 짐승으로 해석되며, 정확한 종류를 확정하기 어려운 존재도 있습니다.',
      bg: 'Asset/2. Main/bg/bg_waterside.webp',
      animalCodes: ['12', '13', '14', '15', '16']
    },
    {
      id: 'sea',
      layerIndex: 5,
      name: '바다',
      shortName: '바다',
      category: 'sea',
      title: '기운을 뿜어 올리는 용',
      desc: '향로의 가장 아래에는 한 마리 용이 연꽃 모양 몸체를 입으로 물고, 하늘로 치솟듯 고개를 들어 향로 전체를 떠받치고 있습니다. 몸통과 꼬리, 구름 모양의 갈기를 투조로 장식해 강한 움직임과 생동감을 보여줍니다.',
      bg: 'Asset/2. Main/bg/bg_sea.webp',
      animalCodes: ['19']
    }
  ],
  animals: [
    {
        "id": 1,
        "code": "01",
        "name": "말",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 8,
            "y": 68
        },
        "panelTheme": "단단한 발굽과 초원 질주의 생체역학",
        "simpleDesc": "단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.",
        "assetType": "glb",
        "glb": "Asset/3. Exhibition/glb/01.glb",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp",
        "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-2.webp",
        "icon": "Asset/2. Main/icon/01.webp",
        "iconDark": "Asset/2. Main/icon_dark/01_dark.webp",
        "features": [
            "체중을 지탱하고 충격을 흡수하는 단일 제3지 발굽",
            "달릴 때 반동 에너지를 극대화하는 긴 다리와 힘줄",
            "넓은 시야로 포식자를 감시하는 측면 배치 눈"
        ],
        "scienceStory": "말은 진화 과정에서 발가락 수를 줄여 가운데 발가락 하나로 달리는 특수한 발굽 구조를 갖추었습니다.",
        "sourceCode": "R01",
        "referenceList": [
            {
                "code": "R01-01",
                "text": "말의 발굽 해부학과 충격 흡수 메커니즘"
            },
            {
                "code": "R01-02",
                "text": "Thomason, J. J. (1998). The equine hoof: Mechanics and function. Equine Veterinary Journal, 30(S26), 7–12."
            },
            {
                "code": "R01-03",
                "text": "말의 서서 자는 메커니즘(stay apparatus)"
            },
            {
                "code": "R01-04",
                "text": "Hartmann, E., et al. (2017). Sleep behaviour in horses: Effects of housing and management. Applied Animal Behaviour Science, 196, 68–74."
            },
            {
                "code": "R01-05",
                "text": "기마문화와 말의 진화사"
            }
        ],
        "assetList": [
            {
                "code": "A01-01",
                "text": "https://digital.khs.go.kr/record/recordDetail3D.do?ichDataUid=13936867936769100228"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C01.webp",
            "visualGuide": "금령총 기마인물형토기 사진",
            "story": "일본 고분시대의 말모양 하니와에서도 화려한 말갖춤이 표현되어 당시 승마문화와 유력자의 위세를 엿볼 수 있습니다. 6세기 초 신라의 금령총에서 발견된 기마인물형토기는 사람이 말을 타고 있는 모습을 본뜬 토기로, 안장과 재갈, 발걸이 등 실제 말갖춤이 세밀하게 표현되어 있습니다. 무덤에 함께 묻혔다는 점에서 현실의 이동수단을 넘어 죽은 이의 사후 여정과도 연결된 존재였을 가능성이 있습니다.",
            "artifacts": [
                {
                    "title": "금령총 기마인물형토기 (국보)",
                    "museum": "국립중앙박물관",
                    "url": "https://www.museum.go.kr/MUSEUM/contents/M0501000000.do?pageSize=10&relicRecommendCategory=&relicRecommendId=16888&sc=COM.RELIC_NAME&schM=view&sv=%ED%86%A0%EA%B8%B0"
                },
                {
                    "title": "말모양 하니와 (Horse-shaped Haniwa)",
                    "museum": "Tochigi Digital Museum / Sketchfab",
                    "url": "https://sketchfab.com/3d-models/horse-shaped-haniwa-72ef0391a09643a0a4942f0a3e38b2fb"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "발가락 하나로 달리는 동물",
            "didYouKnowDesc": "말의 발굽 안에는 사실 발가락뼈가 숨어 있습니다. 사람의 손가락으로 치면 가운데손가락 하나로 달리는 셈이에요.",
            "question": "말은 서서 잠을 잘 수 있다?",
            "answer": "O",
            "explanation": "말은 서서 얕은 잠을 잘 수 있습니다. 하지만 깊은 잠을 자려면 몸을 바닥에 눕혀야 합니다.",
            "reference": "근거 01 · Hartmann et al., Applied Animal Behaviour Science (2017)",
            "refRange": "말의 수면 행동과 환경"
        }
    },
    {
        "id": 2,
        "code": "02",
        "name": "호랑이",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 16,
            "y": 58
        },
        "panelTheme": "최상위 포식자의 위용과 단독 사냥 전략",
        "simpleDesc": "산중을 지배하는 맹수이자 한반도 생태계의 정점에 선 최상위 포식자.",
        "assetType": "glb",
        "glb": "Asset/3. Exhibition/glb/02.glb",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel02.webp",
        "icon": "Asset/2. Main/icon/02.webp",
        "iconDark": "Asset/2. Main/icon_dark/02_dark.webp",
        "features": [
            "울창한 산림에 완벽히 은폐되는 줄무늬 위장색",
            "숨죽여 다가가 단숨에 제압하는 발톱과 송곳니",
            "단독 생활에 최적화된 넓은 행동권과 영역 표시"
        ],
        "scienceStory": "호랑이는 고양이과 동물 중에서도 물을 두려워하지 않고 헤엄치며 사냥하는 탁월한 수영 능력을 지녔습니다.",
        "sourceCode": "R02",
        "referenceList": [
            {
                "code": "R02-01",
                "text": "호랑이의 수영 행동과 물속 적응"
            },
            {
                "code": "R02-02",
                "text": "Smithsonian’s National Zoo. (n.d.). Tiger (Panthera tigris)."
            },
            {
                "code": "R02-03",
                "text": "백호의 유전적 변이와 근친교배 문제"
            },
            {
                "code": "R02-04",
                "text": "Xu, X., et al. (2013). The genetic basis of white tigers. Current Biology, 23(11), 1031–1035."
            },
            {
                "code": "R02-05",
                "text": "호랑이의 서식지 보존과 생태"
            }
        ],
        "assetList": [
            {
                "code": "A02-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C02.webp",
            "visualGuide": "부여 군수리 호자 및 북위 호랑이 장대받침",
            "story": "부여 군수리에서 출토된 호자는 호랑이의 모습을 본떠 만든 백제 사비기의 토기입니다. 호랑이의 몸과 생활용품의 기능이 결합된 모습은 백제가 중국에서 전해진 형식을 받아들이면서도 자신들의 생활문화 안에서 새롭게 활용한 사례입니다. 5세기 중국 북위의 호랑이 모양 장대받침 역시 강한 동물의 형상을 생활·의례용 기물에 결합하여 백제의 호자와 비교해 볼 수 있습니다.",
            "artifacts": [
                {
                    "title": "Pole base in the form of a tiger",
                    "museum": "The Metropolitan Museum of Art",
                    "url": "https://www.metmuseum.org/art/collection/search/54028"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "백호는 새로운 종이 아니다",
            "didYouKnowDesc": "백호는 새로운 종이 아니라 흰 털을 만드는 유전적 특징이 나타난 호랑이입니다. 흰 새끼를 얻으려고 가까운 친척끼리 계속 번식시키면 사시·척추 이상 같은 건강 문제가 함께 늘 수 있습니다.",
            "question": "호랑이는 고양이과라서 물을 싫어한다?",
            "answer": "X",
            "explanation": "호랑이는 헤엄을 잘 치며 더위를 식히거나 강을 건널 때 물에 들어갑니다. 물속에서 사냥한 기록도 있지만, 모든 개체가 언제나 같은 행동을 한다는 뜻은 아닙니다.",
            "reference": "근거 02 · Smithsonian’s National Zoo, Tiger",
            "refRange": "호랑이의 수영·물속 행동"
        }
    },
    {
        "id": 3,
        "code": "03",
        "name": "사자",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 24,
            "y": 74
        },
        "panelTheme": "군집 생활과 갈기의 성선택 진화",
        "simpleDesc": "백수의 왕이자 프라이드를 이끄는 용맹한 사바나의 맹수.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Lion\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel03.webp",
        "icon": "Asset/2. Main/icon/03.webp",
        "iconDark": "Asset/2. Main/icon_dark/03_dark.webp",
        "features": [
            "수컷의 위엄과 건강 상태를 알리는 웅장한 갈기",
            "암컷 중심의 조직적인 협동 사냥 체계(프라이드)",
            "포효를 통해 수 킬로미터 밖까지 전달하는 영역 경고"
        ],
        "scienceStory": "사자의 갈기는 테스토스테론 호르몬과 영양 상태를 암컷과 경쟁자에게 알리는 시각적 지표입니다.",
        "sourceCode": "R03",
        "referenceList": [
            {
                "code": "R03-01",
                "text": "수사자 갈기의 성선택과 사회적 신호 기능"
            },
            {
                "code": "R03-02",
                "text": "West, P. M., & Packer, C. (2002). Sexual selection, temperature, and the lion's mane. Science, 297(5585), 1339–1343."
            },
            {
                "code": "R03-03",
                "text": "사자의 집단 사냥과 프라이드 구조"
            },
            {
                "code": "R03-04",
                "text": "Smithsonian’s National Zoo. (n.d.). Lion (Panthera leo)."
            },
            {
                "code": "R03-05",
                "text": "아시아사자의 역사적 분포"
            }
        ],
        "assetList": [
            {
                "code": "A03-01",
                "text": "https://skfb.ly/6R6tM"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C03.webp",
            "visualGuide": "메트로폴리탄 미술관 굽타 사자 기둥머리 조각",
            "story": "5~6세기 인도 굽타시대의 ‘기둥머리 위에 선 사자’는 건축물을 떠받치는 사자의 모습으로 힘과 권위를 드러냅니다. 인도에서 사자는 왕권과 부처의 가르침, 신성함을 상징하며 종교와 교역을 따라 널리 전해졌습니다. 백제금동대향로의 사자 역시 먼 지역에서 전해진 동물의 이미지와 의미를 백제의 방식으로 수용하여 이상세계에 담아낸 사례입니다.",
            "artifacts": [
                {
                    "title": "Lion Standing on a Pillar Capital",
                    "museum": "The Metropolitan Museum of Art",
                    "url": "https://www.metmuseum.org/art/collection/search/38393"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "갈기는 건강을 알리는 신호",
            "didYouKnowDesc": "수사자의 갈기는 성호르몬과 영양 상태 등의 영향을 받으며 짝과 경쟁자에게 상태를 알리는 성선택 신호로 연구됩니다.",
            "question": "사자는 새끼를 강하게 키우려고 절벽에서 떨어뜨린다?",
            "answer": "X",
            "explanation": "그 이야기는 옛 비유와 속설에 가깝습니다. 실제 암사자는 새끼를 숨겨 보호하고 젖을 먹이며, 같은 무리의 암컷들이 함께 새끼를 돌보기도 합니다.",
            "reference": "근거 03 · Smithsonian’s National Zoo, Lion",
            "refRange": "사자 무리의 번식·새끼 돌봄"
        }
    },
    {
        "id": 4,
        "code": "04",
        "name": "족제비",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 32,
            "y": 62
        },
        "panelTheme": "유연한 체형과 민첩한 소형 육식수의 적응",
        "simpleDesc": "가늘고 긴 몸으로 좁은 틈을 자유자재로 누비는 날렵한 사냥꾼.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Japanese Weasel\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/18b390f0dcc943288cc0971e5328159f/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel04.webp",
        "icon": "Asset/2. Main/icon/04.webp",
        "iconDark": "Asset/2. Main/icon_dark/04_dark.webp",
        "features": [
            "굴 속으로 침투하기에 최적화된 원통형의 유연한 척추",
            "강한 호기심과 빠른 신진대사로 쉴 새 없이 움직이는 활동성",
            "체구에 비해 강력한 무는 힘과 예리한 송곳니"
        ],
        "scienceStory": "족제비는 가늘고 긴 체형 덕분에 설치류의 좁은 굴 속까지 침투하여 먹이를 사냥할 수 있습니다.",
        "sourceCode": "R04",
        "referenceList": [
            {
                "code": "R04-01",
                "text": "족제비과 동물의 체형 진화와 에너지 대사"
            },
            {
                "code": "R04-02",
                "text": "Brown, J. H., & Lasiewski, R. C. (1972). Metabolism of weasels: The cost of being long and thin. Ecology, 53(5), 939–943."
            },
            {
                "code": "R04-03",
                "text": "족제비의 항문샘 화학 신호"
            },
            {
                "code": "R04-04",
                "text": "Zhang, J. X., et al. (2003). Potential chemical signals in the anal gland secretion of the Siberian weasel. Chemical Senses, 28(8), 707–713."
            },
            {
                "code": "R04-05",
                "text": "족제비의 생태적 지위"
            }
        ],
        "assetList": [
            {
                "code": "A04-01",
                "text": "https://skfb.ly/6Ws7v"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "냄새로 전하는 족제비의 자기소개",
            "didYouKnowDesc": "족제비(Mustela sibirica)는 꼬리 아래쪽의 항문샘에서 냄새 물질을 냅니다. 연구자들이 그 성분을 분석한 결과, 냄새 물질의 종류와 비율에는 종·성별·나이를 구분하는 단서가 담길 수 있었습니다.",
            "question": "족제비는 땅 위에서만 움직이며 물이나 나무에서는 사냥하지 못한다?",
            "answer": "X",
            "explanation": "족제비는 땅뿐 아니라 물과 나무에서도 움직일 수 있습니다. 헤엄쳐 물에 사는 들쥐를 뒤쫓거나 나무에 올라 다람쥐를 추격한 행동이 보고되었습니다. 길고 가는 몸은 좁은 곳을 지나는 데 유리하지만 활동 공간이 땅에만 한정되는 것은 아닙니다.",
            "reference": "근거 17 · Law, Mammalian Species (2018)",
            "refRange": "족제비의 이동 거리·수영·나무 타기·먹이 추격 행동"
        }
    },
    {
        "id": 5,
        "code": "05",
        "name": "원숭이",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 40,
            "y": 54
        },
        "panelTheme": "수목 적응과 영장류의 고도화된 입체시각",
        "simpleDesc": "나뭇가지를 자유롭게 건너다니며 영리하게 행동하는 영장류.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Monkey with Banana\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/90df1c6b146749f1ba1f3346831a2f57/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel05.webp",
        "icon": "Asset/2. Main/icon/05.webp",
        "iconDark": "Asset/2. Main/icon_dark/05_dark.webp",
        "features": [
            "물건을 움켜쥐기에 적합한 맞섬손가락(대향지)",
            "거리감을 정확하게 측정하는 전방 배치 양안시각",
            "복잡한 무리 생활을 유지하는 다양한 표정과 사회성"
        ],
        "scienceStory": "영장류의 양안 입체시각과 손가락 구조는 나무 위에서 먹이를 찾고 안전하게 이동하기 위한 진화적 적응입니다.",
        "sourceCode": "R05",
        "referenceList": [
            {
                "code": "R05-01",
                "text": "영장류 시각 진화 가설(Visual predation hypothesis)"
            },
            {
                "code": "R05-02",
                "text": "Cartmill, M. (1974). Rethinking primate origins. Science, 184(4135), 436–443."
            },
            {
                "code": "R05-03",
                "text": "인류와 영장류의 공통 조상 계통수"
            },
            {
                "code": "R05-04",
                "text": "Smithsonian Human Origins Program. (n.d.). Primate and Human Evolution."
            },
            {
                "code": "R05-05",
                "text": "영장류의 도구 사용과 인지능력"
            }
        ],
        "assetList": [
            {
                "code": "A05-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C05.webp",
            "visualGuide": "도쿄국립박물관 원숭이형 하니와",
            "story": "일본 고분시대의 원숭이형 하니와는 사람을 닮은 얼굴과 몸짓을 흙으로 표현한 무덤 조형물입니다. 원숭이는 인간과 닮은 모습 때문에 여러 문화에서 익살과 모방, 영리함을 상징해 왔습니다. 백제금동대향로의 원숭이 역시 산악세계에 생동감을 더하며 인간과 동물의 경계를 생각하게 합니다.",
            "artifacts": [
                {
                    "title": "원숭이형 하니와 (Monkey Haniwa)",
                    "museum": "도쿄국립박물관 (e-Museum)",
                    "url": "https://emuseum.nich.go.jp/detail?content_base_id=100618&content_part_id=001&content_pict_id=002&langId=en&webView=0"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "사람과 원숭이는 친척이지 조상과 후손이 아니다",
            "didYouKnowDesc": "사람은 오늘날의 원숭이에서 직접 진화하지 않았습니다. 사람과 구세계원숭이의 계통은 약 2,500만 년 전 무렵부터 서로 다른 길로 갈라지기 시작했고, 사람과 침팬지·보노보의 계통은 약 800만~600만 년 전에 갈라진 것으로 추정됩니다. 사람만 더 진화한 존재가 아니라, 원숭이를 비롯한 모든 동물도 각자의 환경에서 우리와 같은 시간 동안 진화해 온 존재입니다.",
            "question": "사람은 오늘날의 원숭이보다 더 많이 진화한 동물이다?",
            "answer": "X",
            "explanation": "사람과 오늘날의 원숭이는 공통 조상에서 갈라진 뒤 같은 시간 동안 각자의 환경에 맞게 진화했습니다. 진화는 위아래의 순위가 아니라 갈라지는 나뭇가지에 가깝습니다.",
            "reference": "근거 04 · Smithsonian Human Origins Program",
            "refRange": "사람과 현생 영장류의 공통 조상"
        }
    },
    {
        "id": 6,
        "code": "06",
        "name": "사슴",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 48,
            "y": 72
        },
        "panelTheme": "골질 뿔의 재생 메커니즘과 초식 동물의 반추 생리",
        "simpleDesc": "우아한 뿔을 자랑하며 산림을 평화롭게 거니는 초식 동물.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Deer Family\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/00dd0126dcc0483392afa0a396d05f92/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel06.webp",
        "icon": "Asset/2. Main/icon/06.webp",
        "iconDark": "Asset/2. Main/icon_dark/06_dark.webp",
        "features": [
            "해마다 새로 자라나는 골질 성분의 거대한 녹용과 뿔",
            "질긴 섬유질을 소화시키는 4개의 위와 반추(되새김질)",
            "소리를 입체적으로 감지하는 크고 유연한 귓바퀴"
        ],
        "scienceStory": "사슴의 뿔은 포유류 중에서 유일하게 매년 완전히 새로 재생되는 가장 빠르게 성장하는 뼈 조직입니다.",
        "sourceCode": "R06",
        "referenceList": [
            {
                "code": "R06-01",
                "text": "사슴 뿔의 재생 생물학과 줄기세포 연구"
            },
            {
                "code": "R06-02",
                "text": "Kierdorf, U., et al. (2009). Deer antler regeneration: Cells, tissues, and molecular mechanisms. Journal of Experimental Zoology, 312B(7), 785–799."
            },
            {
                "code": "R06-03",
                "text": "순록의 암수 뿔 형질 비교"
            },
            {
                "code": "R06-04",
                "text": "U.S. National Park Service. (n.d.). Caribou Antlers."
            },
            {
                "code": "R06-05",
                "text": "사슴의 반추 생리학"
            }
        ],
        "assetList": [
            {
                "code": "A06-01",
                "text": "https://skfb.ly/6Ws7v"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C06.webp",
            "visualGuide": "사슴형 하니와 및 풍납토성 사슴뼈 유물",
            "story": "사산조의 사슴무늬 항아리 조각과 일본의 사슴형 하니와는 같은 사슴을 서로 다른 문화적 맥락에서 표현한 유산입니다. 사슴은 왕실의 사냥과 생명력, 무덤과 의례를 상징했으며, 해마다 뿔이 떨어지고 다시 자라는 생태는 재생과 갱신의 의미로 이어졌습니다. 풍납토성에서 출토된 사슴뼈는 백제인이 실제로 사슴을 사냥하고 이용했음을 증명합니다.",
            "artifacts": [
                {
                    "title": "사슴형 하니와 (Deer Haniwa)",
                    "museum": "하마마쓰시 문화유산 아카이브",
                    "url": "https://adeac.jp/hamamatsu-city/catalog/mp000130-2022"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "사슴뿔은 살아서 자라는 뼈",
            "didYouKnowDesc": "일반적인 뿔은 뼈 위에 각질 껍질이 덮인 영구 구조지만, 사슴뿔은 뼈 자체이며 녹각피, 즉 뿔을 덮는 피부(antler velvet) 아래에서 빠르게 자랍니다.",
            "question": "사슴은 언제나 수컷만 뿔이 있다?",
            "answer": "X",
            "explanation": "대부분의 사슴과에서는 수컷에게만 뿔이 나지만 순록은 암컷도 뿔이 납니다. 다만 보통 수컷의 뿔이 더 크고 가지가 많습니다.",
            "reference": "근거 05 · U.S. National Park Service, Caribou",
            "refRange": "순록 암수의 뿔"
        }
    },
    {
        "id": 7,
        "code": "07",
        "name": "멧돼지",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 56,
            "y": 64
        },
        "panelTheme": "후각 기반의 섭식과 단단한 주둥이의 땅 파기 행동",
        "simpleDesc": "단단한 주둥이와 거친 힘으로 땅을 파헤치며 숲을 건강하게 가꾸는 야생동물.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Boar Realistic\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/e2761cb2839447b6beb0b4ed132b0895/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel07.webp",
        "icon": "Asset/2. Main/icon/07.webp",
        "iconDark": "Asset/2. Main/icon_dark/07_dark.webp",
        "features": [
            "흙과 뿌리를 손쉽게 뒤집는 원반형 연골 주둥이",
            "자라나며 날카롭게 갈리는 상하 송곳니(엄니)",
            "체온 조절과 기생충 제거를 위한 진흙 목욕(월로잉)"
        ],
        "scienceStory": "멧돼지는 땀샘이 거의 발달하지 않아 체온을 낮추기 위해 진흙 목욕을 하며, 이는 피부 기생충을 제거하는 데도 필수적입니다.",
        "sourceCode": "R07",
        "referenceList": [
            {
                "code": "R07-01",
                "text": "멧돼지의 땅 파기 행동과 산림 토양 생태계"
            },
            {
                "code": "R07-02",
                "text": "Studnitz, M., et al. (2007). Why do pigs root and in what will they root? Applied Animal Behaviour Science, 107(3-4), 183–197."
            },
            {
                "code": "R07-03",
                "text": "멧돼지의 체온 조절과 진흙 목욕"
            },
            {
                "code": "R07-04",
                "text": "Bracke, M. B. (2011). Review of wallowing in pigs: Description of the behaviour and its motivational basis. Applied Animal Behaviour Science, 132(1-2), 1–13."
            },
            {
                "code": "R07-05",
                "text": "야생 멧돼지의 치아 형태학"
            }
        ],
        "assetList": [
            {
                "code": "A07-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "culturalData": {
            "embedHtml": "<div class=\"sketchfab-embed-wrapper\" style=\"width:100%;height:100%;\"><iframe title=\"天理市荒蒔古墳出土猪形埴輪\" style=\"width:100%;height:100%;border:0;\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/dadaed5bbf4b4902b17111471cabea85/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
            "visualGuide": "아라마키고분 멧돼지형 하니와 3D",
            "story": "일본 아라마키고분의 멧돼지형 하니와와 사산조의 ‘돌진하는 멧돼지’ 장식은 멧돼지의 강한 힘과 야생성을 보여줍니다. 길들여진 돼지와 달리 멧돼지는 사냥의 대상이자 인간이 맞서야 할 자연의 에너지로 인식되었습니다. 풍납토성에서 출토된 멧돼지 뼈와 함께 향로의 멧돼지는 생활세계의 동물이 신선과 공존하는 이상세계로 옮겨진 모습입니다.",
            "artifacts": [
                {
                    "title": "아라마키고분 출토 멧돼지형 하니와 3D",
                    "museum": "Otemae University / Sketchfab",
                    "url": "https://sketchfab.com/3d-models/dadaed5bbf4b4902b17111471cabea85"
                },
                {
                    "title": "Wall panel with a charging boar",
                    "museum": "The Metropolitan Museum of Art",
                    "url": "https://www.metmuseum.org/art/collection/search/322649"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "진흙은 멧돼지의 천연 에어컨",
            "didYouKnowDesc": "멧돼지는 땀으로 체온을 낮추기 어려워 진흙 목욕을 이용합니다. 진흙은 더위를 줄이고 피부의 기생충 관리에도 도움을 줄 수 있습니다.",
            "question": "돼지는 하루 종일 먹고 잠만 자는 동물이다?",
            "answer": "X",
            "explanation": "돼지는 깨어 있는 시간의 많은 부분을 코로 땅을 뒤지며 먹이를 찾고 주변을 탐색하는 데 씁니다. 다른 개체와 상호작용하고 경험을 통해 배우는 활동적인 동물입니다.",
            "reference": "근거 06 · Studnitz et al., Applied Animal Behaviour Science (2007)",
            "refRange": "돼지의 탐색·땅 파기 행동 종설"
        }
    },
    {
        "id": 8,
        "code": "08",
        "name": "코끼리",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 64,
            "y": 76
        },
        "panelTheme": "초대형 육상 동물의 수력학적 코와 골격 지지",
        "simpleDesc": "거대한 몸집과 정교한 근육질 코를 가진 지혜로운 거인.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"African Elephant, skeleton\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/0a7cb290616442c88f89107d9a11f8f0/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel08.webp",
        "icon": "Asset/2. Main/icon/08.webp",
        "iconDark": "Asset/2. Main/icon_dark/08_dark.webp",
        "features": [
            "뼈 없이 4만 개 이상의 근육 다발로 구성된 만능 코",
            "거대한 하중을 분산하는 기둥 모양의 다리와 쿠션 발바닥",
            "열을 방출하여 체온을 조절하는 거대한 부채꼴 귀"
        ],
        "scienceStory": "코끼리의 코는 코와 윗입술이 합쳐진 고도로 진화된 수압 골격 기관으로, 수 리터의 물을 흡입하고 작은 풀잎까지 집어 올립니다.",
        "sourceCode": "R08",
        "referenceList": [
            {
                "code": "R08-01",
                "text": "코끼리 코의 생체역학 및 근육수력학"
            },
            {
                "code": "R08-02",
                "text": "Kier, W. M., & Smith, K. K. (1985). Tongues, tentacles and trunks: The biomechanics of movement in muscular-hydrostats. Zoological Journal of the Linnean Society, 83(4), 307–324."
            },
            {
                "code": "R08-03",
                "text": "상아의 해부학과 밀렵 피해"
            },
            {
                "code": "R08-04",
                "text": "Ministry of Environment, Forest and Climate Change, India. (2025). Guidelines on Ivory Management."
            },
            {
                "code": "R08-05",
                "text": "코끼리의 저주파 통신"
            }
        ],
        "assetList": [
            {
                "code": "A08-01",
                "text": "https://skfb.ly/6R6tM"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C08.webp",
            "visualGuide": "빅토리아&앨버트 박물관 남아시아 코끼리상",
            "story": "5~6세기 남아시아의 코끼리 조각은 코끼리가 힘과 권위, 지혜와 종교적 위엄을 상징하는 동물이었음을 보여줍니다. 코끼리가 살지 않았던 백제의 금동대향로에 이 동물이 등장한다는 점은 실물보다 이미지와 지식이 교역로를 따라 먼 지역까지 이동했음을 보여줍니다.",
            "artifacts": [
                {
                    "title": "Elephant figure (남아시아 코끼리상)",
                    "museum": "Victoria and Albert Museum (V&A)",
                    "url": "https://collections.vam.ac.uk/item/O39822/figure-unknown/"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "코와 윗입술이 합쳐진 만능 기관",
            "didYouKnowDesc": "코끼리의 코는 코와 윗입술이 합쳐진 기관으로 호흡, 후각, 물 마시기, 먹이 집기와 소통을 담당합니다.",
            "question": "코끼리의 상아는 잘려도 안전하게 다시 자란다?",
            "answer": "X",
            "explanation": "상아는 계속 자라는 앞니이지만 뿌리 쪽에는 신경과 혈관이 있습니다. 특히 밀렵으로 온전한 상아를 빼앗는 과정에서는 코끼리가 죽으며, 남은 조직도 심한 손상과 감염 위험에 놓입니다.",
            "reference": "근거 07 · 인도 환경·산림·기후변화부 상아 절단 지침 (2025); WWF 상아 해설",
            "refRange": "상아의 구조·밀렵 피해"
        }
    },
    {
        "id": 9,
        "code": "09",
        "name": "이상한 부리를 가진 새",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 72,
            "y": 56
        },
        "panelTheme": "먹이원에 따른 부리 형태의 적응방산",
        "simpleDesc": "독특한 부리 모양으로 특수한 먹이 생태를 암시하는 신비로운 새.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Bird\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/1c27c1bec5f6440981a2673db56d0c11/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel09.webp",
        "icon": "Asset/2. Main/icon/09.webp",
        "iconDark": "Asset/2. Main/icon_dark/09_dark.webp",
        "features": [
            "특정 먹이를 파먹거나 쪼개기에 적합한 특수화된 부리",
            "산악 지형에서 균형을 잡는 긴 꼬리깃",
            "나뭇가지를 단단히 움켜쥐는 4개의 발가락"
        ],
        "scienceStory": "새의 부리는 단단한 씨앗, 곤충, 꽃꿀 등 먹이 환경에 맞춰 놀랍도록 다양하게 형태가 분화하는 적응방산의 대표적 기관입니다.",
        "sourceCode": "R09",
        "referenceList": [
            {
                "code": "R09-01",
                "text": "다윈핀치류의 부리 형태 진화와 자연선택"
            },
            {
                "code": "R09-02",
                "text": "Grant, P. R., & Grant, B. R. (2002). Unpredictable evolution in a 30-year study of Darwin's finches. Science, 296(5568), 707–711."
            },
            {
                "code": "R09-03",
                "text": "조류 부리의 발생학적 분화"
            },
            {
                "code": "R09-04",
                "text": "Abzhanov, A., et al. (2004). Bmp4 and morphological variation of beaks in Darwin's finches. Science, 305(5689), 1462–1465."
            },
            {
                "code": "R09-05",
                "text": "조류 섭식 생태학"
            }
        ],
        "assetList": [
            {
                "code": "A09-01",
                "text": "https://skfb.ly/6Ws7v"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "먹이에 따라 달라진 부리",
            "didYouKnowDesc": "다윈핀치류는 씨앗·곤충·선인장 등 서로 다른 먹이를 이용하면서 부리의 크기와 모양이 달라졌습니다. 공통 조상에서 여러 생태적 역할로 갈라진 적응방산의 대표 사례입니다.",
            "question": "모든 새의 부리는 같은 모양이다?",
            "answer": "X",
            "explanation": "부리는 먹이와 먹는 방법에 따라 굵고 단단하거나, 길고 가늘거나, 갈고리처럼 굽는 등 다양합니다. 향로 속 새는 특정 종으로 확정하지 않고 부리의 차이를 관찰합니다.",
            "reference": "근거 14 · Grant & Grant, Science (2002)",
            "refRange": "다윈핀치류의 부리와 먹이 적응"
        }
    },
    {
        "id": 10,
        "code": "10",
        "name": "뱀을 물고 있는 야수",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 80,
            "y": 70
        },
        "panelTheme": "포식자와 피식자의 진화적 군비경쟁",
        "simpleDesc": "독사를 물어 제압하며 맹렬한 기세를 뿜어내는 숲의 맹수.",
        "assetType": "embed",
        "embedHtml": "<div class=\"stage-media-card\" style=\"width:100%;height:100%;min-height:380px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle,rgba(30,30,45,0.9) 0%,rgba(10,10,18,0.98) 100%);border-radius:16px;border:1px solid rgba(212,175,55,0.25);padding:1.5rem;\"><img src=\"Asset/3. Exhibition/glb/cramorant-gorging.gif\" alt=\"뱀을 물고 있는 야수\" style=\"max-width:85%;max-height:320px;object-fit:contain;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.6);margin-bottom:1rem;\"><span style=\"font-size:0.85rem;color:var(--accent-gold);letter-spacing:0.5px;\">🎬 먹이를 제압하는 야수 생태 모션 에셋</span></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel10.webp",
        "icon": "Asset/2. Main/icon/10.webp",
        "iconDark": "Asset/2. Main/icon_dark/10_dark.webp",
        "features": [
            "뱀의 반격을 피하기 위한 번개 같은 반사신경과 두꺼운 가죽",
            "독사를 꽉 물어 경추를 부수는 강력한 턱 힘",
            "생태계 내 포식압을 시각화한 긴장감 넘치는 격투 구도"
        ],
        "scienceStory": "포식자와 먹이는 독의 치명성과 이에 대항하는 면역·회피 능력 간의 끊임없는 진화적 군비경쟁(Evolutionary arms race)을 벌입니다.",
        "sourceCode": "R10",
        "referenceList": [
            {
                "code": "R10-01",
                "text": "포식자와 먹이의 진화적 군비경쟁"
            },
            {
                "code": "R10-02",
                "text": "Dawkins, R., & Krebs, J. R. (1979). Arms races between and within species. Proceedings of the Royal Society of London. Series B, 205(1161), 489–511."
            },
            {
                "code": "R10-03",
                "text": "스피팅코브라의 표적 추적 행동"
            },
            {
                "code": "R10-04",
                "text": "Westhoff, G., et al. (2010). Spitting cobras adjust their venom distribution to match the direction of prey. Journal of Experimental Biology, 213(11), 1797–1804."
            },
            {
                "code": "R10-05",
                "text": "독소 저항성의 진화"
            }
        ],
        "assetList": [
            {
                "code": "A10-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "공격과 방어가 서로를 바꾸는 진화",
            "didYouKnowDesc": "포식자와 먹이는 서로의 공격과 방어에 맞춰 계속 진화합니다. 뱀의 독과 이를 피하거나 견디는 포식자의 방어처럼 상대의 적응이 또 다른 적응을 부르는 현상을 진화적 군비경쟁이라고 합니다.",
            "question": "사람도 다른 동물의 진화에 영향을 줄 수 있을까요?",
            "answer": "O",
            "explanation": "사람의 사냥이나 서식지 변화는 다른 동물의 생존과 번식에 영향을 줄 수 있습니다. 예를 들어 스피팅코브라는 움직이는 표적의 얼굴을 따라가며 움직임을 예측해 독을 뿜습니다. 실험에서는 사람의 얼굴을 대상으로 했을 때 높은 명중률을 보였습니다.",
            "reference": "근거 13 · Westhoff et al., Journal of Experimental Biology (2010)",
            "refRange": "스피팅코브라의 표적 추적"
        }
    },
    {
        "id": 11,
        "code": "11",
        "name": "볏을 가진 새",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 88,
            "y": 58
        },
        "panelTheme": "머리 장식깃의 감각 수용 및 성선택 기능",
        "simpleDesc": "화려한 머리 볏을 세우고 신호와 매력을 발산하는 아름다운 새.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Pangolin\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/e3827c13a3364e8084797531b58c6ed6/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel11-1.webp",
        "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel11-2.webp",
        "icon": "Asset/2. Main/icon/11.webp",
        "iconDark": "Asset/2. Main/icon_dark/11_dark.webp",
        "features": [
            "구애와 감정 표현을 위해 기립하는 머리 상부의 볏깃",
            "공기의 미세한 진동을 감지하는 기계적 수용체 역할",
            "동종 간의 정체성을 식별하는 시각적 랜드마크"
        ],
        "scienceStory": "조류의 볏깃은 단순한 장식에 그치지 않고 구애 날갯짓 때 발생하는 공기 파동을 감지하는 감각 보조 기관으로도 작용합니다.",
        "sourceCode": "R11",
        "referenceList": [
            {
                "code": "R11-01",
                "text": "인도공작 볏깃의 기계적 진동 감각 수용"
            },
            {
                "code": "R11-02",
                "text": "Kane, S. A., et al. (2018). Biomechanics of the peafowl's crest: A sensor of social signals. PLOS ONE, 13(11), e0207247."
            },
            {
                "code": "R11-03",
                "text": "조류 깃털 장식의 성선택과 핸디캡 원리"
            },
            {
                "code": "R11-04",
                "text": "Zahavi, A. (1975). Mate selection—A selection for a handicap. Journal of Theoretical Biology, 53(1), 205–214."
            },
            {
                "code": "R11-05",
                "text": "꿩과 조류의 형태적 다양성"
            }
        ],
        "assetList": [
            {
                "code": "A11-01",
                "text": "https://skfb.ly/6Ws7v"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "볏깃은 흔들림을 느끼는 감각 장치일 수 있다",
            "didYouKnowDesc": "인도공작의 머리 볏은 단순한 장식만이 아닐 수 있습니다. 실험에서 공작의 볏깃은 구애 행동 때 생기는 진동과 비슷한 공기 움직임에 잘 반응했고, 수컷의 날갯짓을 흉내 낸 바람에도 실제로 흔들렸습니다. 연구진은 볏깃이 사회적 신호를 느끼는 데 도움을 줄 가능성을 제시했습니다.",
            "question": "인도공작의 볏깃은 수컷의 구애 날갯짓이 만든 공기 움직임에 진동할 수 있다?",
            "answer": "O",
            "explanation": "실험실에서 수컷 공작의 구애 날갯짓을 흉내 내자 그 바람에 볏깃이 실제로 진동했습니다. 볏깃은 구애 행동 때 생기는 진동 주파수에도 잘 반응했습니다. 다만 이 연구는 모든 볏 있는 새가 같은 기능을 가진다는 뜻이 아니라, 인도공작에서 감각 기능의 가능성을 보여 준 결과입니다.",
            "reference": "근거 18 · Kane et al., PLOS ONE (2018)",
            "refRange": "인도공작의 볏깃·구애 진동·날갯짓 모사 실험"
        }
    },
    {
        "id": 12,
        "code": "12",
        "name": "악어",
        "layer": "water",
        "layerName": "연꽃과 물가",
        "layerCoords": {
            "x": 18,
            "y": 70
        },
        "panelTheme": "반수생 포식자의 단방향 호흡과 감각골판",
        "simpleDesc": "강가와 늪지대에 잠복하여 먹이를 노리는 고대 파충류의 후예.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Nile Crocodile\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/d87d75c454554ca78ac582c6a130e7cb/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel12.webp",
        "icon": "Asset/2. Main/icon/12.webp",
        "iconDark": "Asset/2. Main/icon_dark/12_dark.webp",
        "features": [
            "물 표면 위로 눈과 콧구멍만 내놓는 잠복형 두개골",
            "몸을 보호하고 열을 흡수하는 단단한 골판(피부골)",
            "물살을 가르고 추진력을 만드는 강력한 납작 꼬리"
        ],
        "scienceStory": "악어는 조류와 마찬가지로 폐 속에서 공기가 한 방향으로만 흐르는 고효율 단방향 기류 호흡계를 지니고 있습니다.",
        "sourceCode": "R12",
        "referenceList": [
            {
                "code": "R12-01",
                "text": "악어류와 조류의 단방향 기류 폐 호흡 비교"
            },
            {
                "code": "R12-02",
                "text": "Farmer, C. G. (2015). Similarity of pulmonary airflow in crocodilians and birds. The Anatomical Record, 298(6), 1081–1092."
            },
            {
                "code": "R12-03",
                "text": "악어의 수중 감각 돔 기관(ISO)"
            },
            {
                "code": "R12-04",
                "text": "Soares, D. (2002). An ancient sensory organ in crocodilians. Nature, 417(6886), 241–242."
            },
            {
                "code": "R12-05",
                "text": "지배파충류의 진화사"
            }
        ],
        "assetList": [
            {
                "code": "A12-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C12.webp",
            "visualGuide": "토리노 이집트 박물관 악어 신 소베크 조각",
            "story": "5~6세기 인도의 강가 여신상 아래에는 악어를 닮은 상상동물 마카라가 표현되어 강의 힘과 풍요를 상징하며, 이집트의 소베크 신앙에서도 악어는 두려움과 생명의 물을 함께 품은 존재로 여겨졌습니다. 백제금동대향로에도 악어로 해석되는 파충류가 등장하여 물의 강한 생명력이 백제 문화 속에 형상화되었음을 알 수 있습니다.",
            "artifacts": [
                {
                    "title": "Statuette of the crocodile Sobek",
                    "museum": "Museo Egizio (토리노 이집트 박물관)",
                    "url": "https://collezioni.museoegizio.it/en-GB/material/Cat_934/"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "기억하고 학습하는 파충류",
            "didYouKnowDesc": "악어류는 주변 환경과 먹이의 특징을 경험을 통해 학습하고, 이를 기억하는 행동이 관찰됩니다. 파충류도 주변 환경을 경험하고 배우며 살아갑니다.",
            "question": "새와 악어의 폐에는 공기가 한 방향으로 흐르는 공통점이 있다?",
            "answer": "O",
            "explanation": "새는 기낭과 폐를 함께 사용하고 악어는 다른 방식으로 공기를 보내므로 구조가 똑같지는 않습니다. 하지만 두 계통 모두 폐의 주요 통로에서 한 방향 기류가 확인되어, 먼 공통 조상의 호흡 진화를 이해하는 단서가 됩니다.",
            "reference": "근거 08 · Farmer, Anatomical Record (2015)",
            "refRange": "새와 현생 악어류의 단방향 기류 비교"
        }
    },
    {
        "id": 13,
        "code": "13",
        "name": "물고기",
        "layer": "water",
        "layerName": "연꽃과 물가",
        "layerCoords": {
            "x": 35,
            "y": 72
        },
        "panelTheme": "유체역학적 유선형 체형과 측선 감각계",
        "simpleDesc": "연꽃 수면 아래를 유영하며 풍요로운 수중 생태계를 이루는 어류.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Common Carp\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/162ba6f0282c453789c77a4fa2f84e6e/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel13.webp",
        "icon": "Asset/2. Main/icon/13.webp",
        "iconDark": "Asset/2. Main/icon_dark/13_dark.webp",
        "features": [
            "물의 저항을 최소화하는 유선형 방추형 몸매와 점액질 비늘",
            "수류와 수압의 변화를 감지하는 정밀한 측선(옆줄)",
            "부력을 조절하여 수심을 자유롭게 오르내리는 부레"
        ],
        "scienceStory": "인간을 비롯한 포유류의 턱과 귓속 작은 뼈들은 고대 어류의 아가미 활(Pharyngeal arch) 구조가 진화하여 변형된 것입니다.",
        "sourceCode": "R13",
        "referenceList": [
            {
                "code": "R13-01",
                "text": "어류 아가미궁에서 포유류 턱 및 중이골로의 진화"
            },
            {
                "code": "R13-02",
                "text": "Woronowicz, K. C., & Schneider, R. A. (2019). Molecular and cellular mechanisms of evolutionary innovation in the vertebrate jaw. Developmental Biology, 452(1), 1–11."
            },
            {
                "code": "R13-03",
                "text": "어류의 측선 감각계와 유체 감지"
            },
            {
                "code": "R13-04",
                "text": "Bleckmann, H., & Zelick, R. (2009). Lateral line system of fish. Integrative Zoology, 4(1), 13–25."
            },
            {
                "code": "R13-05",
                "text": "담수 어류의 삼투 조절"
            }
        ],
        "assetList": [
            {
                "code": "A13-01",
                "text": "https://skfb.ly/6Ws7v"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C13.webp",
            "visualGuide": "한성백제박물관 풍납토성 주형 어망추",
            "story": "풍납토성에서 출토된 배 모양의 주형 어망추는 그물에 매달아 사용하던 백제의 대표적인 어로 도구입니다. 이는 물고기가 단순한 상징이 아니라 백제인의 식량과 생업을 지탱한 현실의 소중한 자원이었음을 증명합니다. 백제금동대향로의 물고기는 이러한 현실의 풍요가 이상세계로 승화된 모습입니다.",
            "artifacts": [
                {
                    "title": "주형 어망추 (배모양 그물추)",
                    "museum": "한성백제박물관",
                    "url": "https://baekjemuseum.seoul.go.kr/module/index.jsp?boardid=a&cpage=26&mmode=content&mpid=SBM0301000000&pid=6682&s_que=&strsearch="
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "물고기 조상의 구조가 우리의 턱과 귀에 남아 있다",
            "didYouKnowDesc": "척추동물 조상의 아가미 활 구조는 진화 과정에서 새로운 역할을 얻었습니다. 앞쪽 구조는 턱을 이루고, 일부 뼈는 변화해 포유류 가운데귀의 작은 뼈가 되었습니다.",
            "question": "우리의 턱과 가운데귀 뼈 일부는 물고기 조상의 아가미활과 이어지는 진화의 흔적이다?",
            "answer": "O",
            "explanation": "진화는 기존 구조를 없애기만 하는 것이 아니라 형태와 기능을 바꾸어 새 역할에 활용합니다. 포유류의 턱과 가운데귀 뼈에는 척추동물 아가미궁 구조의 오랜 역사가 남아 있습니다.",
            "reference": "근거 09 · Woronowicz & Schneider, Developmental Biology (2019)",
            "refRange": "물고기 턱·포유류 턱과 가운데귀 뼈의 진화"
        }
    },
    {
        "id": 14,
        "code": "14",
        "name": "물범",
        "layer": "water",
        "layerName": "연꽃과 물가",
        "layerCoords": {
            "x": 52,
            "y": 75
        },
        "panelTheme": "기각류의 잠수 생리와 두꺼운 피하지방 단열",
        "simpleDesc": "동해와 바다를 헤엄치며 물과 육지를 넘나드는 해양 포유류.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Seal\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/38dc4e92f17e444597274bff6be913c2/embed?autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel14.webp",
        "icon": "Asset/2. Main/icon/14.webp",
        "iconDark": "Asset/2. Main/icon_dark/14_dark.webp",
        "features": [
            "차가운 바닷물에서도 체온을 유지하는 두꺼운 피하지방층(블러버)",
            "지느러미 모양으로 변형된 유선형 앞뒤 물갈퀴",
            "귓바퀴가 퇴화하여 물속 저항을 줄인 매끄러운 머리"
        ],
        "scienceStory": "기각류는 고래, 바다소와 서로 다른 육상 포유류 조상에서 출발했으나 바다 환경에 적응하며 비슷한 체형으로 수렴 진화했습니다.",
        "sourceCode": "R14",
        "referenceList": [
            {
                "code": "R14-01",
                "text": "해양 포유류의 수렴 진화와 유전체 비교"
            },
            {
                "code": "R14-02",
                "text": "Foote, A. D., et al. (2015). Convergent evolution of the genomes of marine mammals. Nature Genetics, 47(3), 272–275."
            },
            {
                "code": "R14-03",
                "text": "기각류의 잠수 생리학과 산소 저장"
            },
            {
                "code": "R14-04",
                "text": "Kooyman, G. L. (1989). Diverse divers: Physiology and behaviour. Springer-Verlag."
            },
            {
                "code": "R14-05",
                "text": "독도 강치(바다사자)의 생태사"
            }
        ],
        "assetList": [
            {
                "code": "A14-01",
                "text": "https://skfb.ly/6V9tL"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C14.webp",
            "visualGuide": "독도 강치 유물 및 3D 데이터",
            "story": "백제금동대향로에는 물범으로 해석되는 해양동물이 표현되어 있습니다. 물과 육지를 오가는 물범의 모습은 백제인이 바다의 생명까지 이상세계의 구성원으로 바라보았음을 보여줍니다. 이와 함께 과거 동해와 독도 일대에 살았으나 멸종된 강치의 역사를 통해 바다 생태계와 인간의 공존의 가치를 되새기게 합니다.",
            "artifacts": [
                {
                    "title": "독도 강치 뼈 3D 및 역사 기록물",
                    "museum": "동북아역사재단 독도연구소",
                    "url": "https://contents.nahf.or.kr/dokdo/item/level.do?levelId=iscac.d_0003_0020_0020"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "귀와 걸음걸이를 보면 정체가 보인다",
            "didYouKnowDesc": "참물범류는 겉으로 드러난 귓바퀴가 없고 육지에서 배를 끌듯 움직입니다. 반면 물개와 바다사자는 귓바퀴가 있고 뒷지느러미를 몸 아래로 돌려 육지에서 이동할 수 있습니다.",
            "question": "강치·고래·바다소는 가까운 친척이라 몸이 비슷하다?",
            "answer": "X",
            "explanation": "이들은 서로 다른 포유류 계통에서 각각 물속 생활에 적응했습니다. 물의 저항을 줄이는 유선형 몸과 헤엄용 팔다리가 비슷해진 것은 같은 환경에서 나타난 수렴 진화입니다.",
            "reference": "근거 10 · Foote et al., Nature Genetics (2015)",
            "refRange": "기각류·고래·바다소의 독립적 해양 적응"
        }
    },
    {
        "id": 15,
        "code": "15",
        "name": "수달",
        "layer": "water",
        "layerName": "연꽃과 물가",
        "layerCoords": {
            "x": 68,
            "y": 70
        },
        "panelTheme": "방수 모피와 촉각 수염의 수중 사냥 전략",
        "simpleDesc": "깨끗한 하천을 헤엄치며 물고기를 쫓는 수중의 날렵한 사냥꾼.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Eurasian Otter\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/188d7264dc354c7195cf47f4540bf252/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel15.webp",
        "icon": "Asset/2. Main/icon/15.webp",
        "iconDark": "Asset/2. Main/icon_dark/15_dark.webp",
        "features": [
            "밀도 높은 솜털 사이에 공기층을 가두는 최상급 방수 털",
            "탁한 물속에서도 물고기의 파동을 감지하는 민감한 수염",
            "물살을 차고 나가는 물갈퀴 발과 노 역할을 하는 꼬리"
        ],
        "scienceStory": "수달은 제곱센티미터당 수십만 가닥의 촘촘한 이중 모피 구조를 지녀 차가운 물속에서도 체온 손실 없이 장시간 사냥할 수 있습니다.",
        "sourceCode": "R15",
        "referenceList": [
            {
                "code": "R15-01",
                "text": "수달 털의 방수 단열 구조와 열 보존 메커니즘"
            },
            {
                "code": "R15-02",
                "text": "Kuhn, C. A., & Meyer, W. (2010). Comparative hair structure in semiaquatic mammals. Journal of Morphology, 271(9), 1114–1124."
            },
            {
                "code": "R15-03",
                "text": "북아메리카수달의 수중 감각과 얼굴 수염"
            },
            {
                "code": "R15-04",
                "text": "Smithsonian’s National Zoo. (n.d.). North American River Otter."
            },
            {
                "code": "R15-05",
                "text": "담수 생태계 건강성 지표종으로서의 수달"
            }
        ],
        "assetList": [
            {
                "code": "A15-01",
                "text": "https://skfb.ly/6R6tM"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "수염으로 물속을 읽는 사냥꾼",
            "didYouKnowDesc": "북아메리카수달은 길고 뻣뻣하며 매우 민감한 얼굴 수염으로 물속 먹이를 찾고 붙잡는 데 도움을 받습니다. 물속에서는 귀와 콧구멍을 닫고, 촘촘한 속털과 거친 겉털로 물을 튕겨 냅니다.",
            "question": "북아메리카수달은 물속에서 먹이를 찾을 때 눈에만 의존한다?",
            "answer": "X",
            "explanation": "북아메리카수달은 물속에서 눈뿐 아니라 길고 민감한 얼굴 수염도 이용합니다. 이 수염은 먹이의 위치를 알아내고 붙잡는 데 도움을 줍니다. 물속에서는 귀와 콧구멍을 닫을 수도 있습니다.",
            "reference": "근거 19 · Smithsonian’s National Zoo, North American River Otter",
            "refRange": "북아메리카수달의 얼굴 수염·수중 감각·귀와 콧구멍"
        }
    },
    {
        "id": 16,
        "code": "16",
        "name": "백로",
        "layer": "water",
        "layerName": "연꽃과 물가",
        "layerCoords": {
            "x": 80,
            "y": 68
        },
        "panelTheme": "긴 목과 다리의 도섭 행동 및 시차 보정 작살 사냥",
        "simpleDesc": "긴 다리로 물가를 조용히 거닐다 순식간에 먹이를 낚아채는 물새.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Realistic Heron 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/95a74fb41f1a46f0acec81a2d6c85093/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel16.webp",
        "icon": "Asset/2. Main/icon/16.webp",
        "iconDark": "Asset/2. Main/icon_dark/16_dark.webp",
        "features": [
            "깊은 물에서도 몸을 적시지 않고 걸을 수 있는 긴 다리",
            "빛의 굴절을 계산하여 물고기를 찌르는 작살형 부리",
            "용수철처럼 접혔다 순간적으로 뻗어나가는 S자형 경추"
        ],
        "scienceStory": "백로류는 물 표면의 빛 굴절로 인한 위치 오차를 뇌에서 보정하여 물속 물고기를 정확하게 타격합니다.",
        "sourceCode": "R16",
        "referenceList": [
            {
                "code": "R16-01",
                "text": "왜가리과 조류의 물속 시각 굴절 보정과 타격 정확도"
            },
            {
                "code": "R16-02",
                "text": "Katzir, G., & Intrator, N. (1987). Striking of underwater prey by a reef heron, Egretta gularis schistacea. Journal of Comparative Physiology A, 160(4), 517–523."
            },
            {
                "code": "R16-03",
                "text": "백로류의 분류학적 정의"
            },
            {
                "code": "R16-04",
                "text": "국립생물자원관 국가생물종지식정보시스템. (n.d.). 왜가리과 백로류."
            },
            {
                "code": "R16-05",
                "text": "조류의 깃털 방수 생리"
            }
        ],
        "assetList": [
            {
                "code": "A16-01",
                "text": "https://skfb.ly/6TWAv"
            }
        ],
        "culturalData": {
            "embedHtml": "<div class=\"sketchfab-embed-wrapper\" style=\"width:100%;height:100%;\"><iframe title=\"500 Korean won coin\" style=\"width:100%;height:100%;border:0;\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/2fa97e66fcb4455ca87b4be8a2e602f7/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
            "visualGuide": "대한민국 500원 주화 학 3D",
            "story": "동아시아에서 학(두루미)은 오랜 세월 장수와 고결함, 길상을 상징해 온 새였습니다. 이러한 전통적인 상징성은 오늘날 대한민국의 500원 주화로 이어져 비상하는 대한민국의 도약을 나타냅니다. 향로 속 학과 500원 주화를 함께 보면 한 동물에 담긴 길상의 상징이 시대를 초월해 계승되고 있음을 알 수 있습니다.",
            "artifacts": [
                {
                    "title": "대한민국 500원 주화 학 (500 KRW Coin 3D)",
                    "museum": "Sketchfab 3D Archive",
                    "url": "https://skfb.ly/oFvsp"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "깃털은 방수복이자 보온재",
            "didYouKnowDesc": "백로처럼 물가에서 생활하는 새에게 가지런한 깃털은 물을 튕기고 체온을 지키는 장비입니다. 기름 오염으로 깃털이 엉키면 이 기능이 크게 약해집니다.",
            "question": "‘백로’는 하나의 종 이름이다?",
            "answer": "X",
            "explanation": "‘백로’는 흰 깃털을 가진 여러 왜가리류를 묶어 부르는 이름입니다. 쇠백로·중백로·대백로처럼 서로 다른 종이 포함되므로, 한 종의 고유 이름으로만 보면 안 됩니다.",
            "reference": "근거 11 · 국립생물자원관 국가생물종지식정보시스템",
            "refRange": "왜가리과 백로류의 종 분류"
        }
    },
    {
        "id": 17,
        "code": "17",
        "name": "달리는 새 (타조)",
        "layer": "land",
        "layerName": "삼신산",
        "layerCoords": {
            "x": 94,
            "y": 75
        },
        "panelTheme": "비행 상실과 지상 주행을 위한 거대 골격 진화",
        "simpleDesc": "날개를 접고 강인한 두 다리로 광활한 대지를 질주하는 거대한 주금류.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Little Spotted Kiwi\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/b61466de53d24988835bb755dc2f73da/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-1.webp",
        "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-2.webp",
        "panelImg3": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-3.webp",
        "icon": "Asset/2. Main/icon/17.webp",
        "iconDark": "Asset/2. Main/icon_dark/17_dark.webp",
        "features": [
            "체중을 줄이고 달리기 속도를 높인 2개의 강력한 발가락",
            "용골봉이 퇴화하고 날개 대신 발달한 거대한 대퇴부 근육",
            "달릴 때 균형을 잡고 방향을 전환하는 보조 날개"
        ],
        "scienceStory": "타조와 같은 주금류는 비행 능력을 잃는 대신 지상 질주에 특화되어 시속 70km 이상의 속도로 달릴 수 있습니다.",
        "sourceCode": "R17",
        "referenceList": [
            {
                "code": "R17-01",
                "text": "주금류의 비행 상실과 수렴적 다발적 진화 역사"
            },
            {
                "code": "R17-02",
                "text": "Harshman, J., et al. (2008). Phylogenomic evidence for multiple losses of flight in ratite birds. PNAS, 105(36), 13462–13467."
            },
            {
                "code": "R17-03",
                "text": "타조의 달리기 역학과 에너지 효율"
            },
            {
                "code": "R17-04",
                "text": "Rubenson, J., et al. (2011). Adaptations for running in ostrich locomotion. Journal of Anatomy, 218(1), 74–90."
            },
            {
                "code": "R17-05",
                "text": "거대 주금류의 고생물학"
            }
        ],
        "assetList": [
            {
                "code": "A17-01",
                "text": "https://skfb.ly/6TWAv"
            }
        ],
        "quizData": {
            "didYouKnowTitle": "날지 못하는 새의 역사는 한 갈래가 아니다",
            "didYouKnowDesc": "타조·레아·에뮤·화식조·키위는 날지 못하는 큰 새라는 공통점이 있습니다. 그러나 유전자 연구는 이들의 공통 조상 한 번만 비행 능력을 잃은 것이 아니라, 여러 계통에서 비행 능력이 각각 사라졌을 가능성을 보여 줍니다. 비슷한 몸의 특징이 서로 다른 계통에서 되풀이해 나타난 사례입니다.",
            "question": "타조·레아·에뮤 같은 큰 날지 못하는 새는 모두 비행 능력을 잃은 하나의 공통 조상에서 갈라졌다?",
            "answer": "X",
            "explanation": "20개 핵 유전자를 비교한 연구에서는 날 수 있는 티나무가 주금류 계통 안에 놓였습니다. 이 결과를 가장 잘 설명하는 가설은 타조·레아·호주 지역의 주금류 계통에서 비행 능력이 적어도 세 번 독립적으로 사라졌다는 것입니다. 비슷한 달리기형 몸이 반드시 한 번만 생겼다는 뜻은 아닙니다.",
            "reference": "근거 20 · Harshman et al., PNAS (2008)",
            "refRange": "20개 핵 유전자·현생 주금류와 티나무·비행 능력의 독립적 상실"
        }
    },
    {
        "id": 18,
        "code": "18",
        "name": "봉황 (금시조)",
        "layer": "celestial",
        "layerName": "천상",
        "layerCoords": {
            "x": 50,
            "y": 45
        },
        "panelTheme": "태양 숭배와 조류의 궁극적 이상화 형태",
        "simpleDesc": "향로 정상에서 여의주를 품고 날개를 펴 태평성대를 알리는 신조.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"food (pes) rooster\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/778006bf99114fde8898b61104bc43d4/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel18.webp",
        "icon": "Asset/2. Main/icon/18.webp",
        "iconDark": "Asset/2. Main/icon_dark/18_dark.webp",
        "features": [
            "닭의 머리, 뱀의 목, 제비의 턱, 공작의 꼬리가 융합된 복합 상징",
            "목과 부리 사이에 둥근 여의주를 품은 백제 특유의 조형미",
            "가슴과 날개깃에 설계된 향 연기 분출 통로"
        ],
        "scienceStory": "봉황은 꿩, 공작, 맹금류의 가장 강력하고 화려한 해부학적 형질들이 결합된 상징적 생명체입니다.",
        "sourceCode": "R18",
        "referenceList": [
            {
                "code": "R18-01",
                "text": "며느리발톱(spur)의 형태와 기능"
            },
            {
                "code": "R18-02",
                "text": "Davison, G. W. H. (1985). Avian spurs. Journal of Zoology, 206(1), 117–123."
            },
            {
                "code": "R18-03",
                "text": "새와 뱀의 상징적 대칭"
            },
            {
                "code": "R18-04",
                "text": "Vaz da Silva, F. (2011). Cosmos in a painting: Reflections on Judeo-Christian creation symbolism. Cosmos, 26, 53–77."
            },
            {
                "code": "R18-05",
                "text": "가루다(Garuda)와 나가(Nāga)의 신화적 관계"
            }
        ],
        "assetList": [
            {
                "code": "A18-01",
                "text": "https://skfb.ly/6TWAv"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C18.webp",
            "visualGuide": "부여 외리 봉황무늬 벽돌 3D",
            "story": "부여 외리 출토 봉황무늬 벽돌에는 긴 꼬리와 화려한 깃을 지닌 상서로운 새가 조각되어 있습니다. 봉황은 태평성대와 왕권의 정당성, 조화로운 세계를 상징하는 이상적인 존재입니다. 백제금동대향로 정상의 봉황 역시 연꽃과 산악세계 위에서 향로의 우주 질서를 완성합니다.",
            "artifacts": [
                {
                    "title": "부여 외리 봉황무늬 벽돌 (보물)",
                    "museum": "국립중앙박물관 e뮤지엄",
                    "url": "https://www.museum.go.kr/MUSEUM/contents/M0505000000.do?relicId=179706&schM=view&searchId=search"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "봉황, 금시조로도 해석될 수 있다",
            "didYouKnowDesc": "향로 정상부의 새는 국립부여박물관의 공식 설명에서 봉황으로 불립니다. 다만 일부 도상 해석에서는 금시조와 연결할 가능성도 제시됩니다.",
            "question": "뱀과 새를 한 계통으로 묶을 수 있을까요?",
            "answer": "O",
            "explanation": "뱀과 새는 생김새가 아주 다르지만, 공통 조상에서 갈라져 나온 하나의 계통에 포함됩니다. 이 계통을 석형류(Sauropsida)라고 합니다.",
            "reference": "근거 15 · Brusatte et al., Current Biology (2015)",
            "refRange": "조류의 공룡 기원과 파충류 계통"
        }
    },
    {
        "id": 19,
        "code": "19",
        "name": "용",
        "layer": "sea",
        "layerName": "바다",
        "layerCoords": {
            "x": 50,
            "y": 50
        },
        "panelTheme": "수생 파충류의 역동성과 유체역학적 투조 기법",
        "simpleDesc": "용틀임하며 물을 박차고 솟아올라 향로 전체를 떠받치는 신성한 용.",
        "assetType": "embed",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"><iframe title=\"Animated Realistic Lowpoly Chinese Dragon\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/d942a0d167594169b3f037f562458d38/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe></div>",
        "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel19.webp",
        "icon": "Asset/2. Main/icon/19.webp",
        "iconDark": "Asset/2. Main/icon_dark/19_dark.webp",
        "features": [
            "한 다리를 치켜들고 용틀임하는 역동적 3차원 입체 투조 주조",
            "뱀의 몸체, 물고기 비늘, 사슴 뿔, 독수리 발톱이 결합된 수신(水神)",
            "하부의 하중을 분산하면서도 부유감을 극대화한 구조역학적 설계"
        ],
        "scienceStory": "용의 도상은 고대인들이 거대 악어, 비단뱀 등을 관찰하며 물을 다스리는 궁극의 생명체로 승화시킨 것입니다.",
        "sourceCode": "R19",
        "referenceList": [
            {
                "code": "R19-01",
                "text": "뱀탐지 이론과 위협 자극에 대한 주의 편향"
            },
            {
                "code": "R19-02",
                "text": "Isbell, L. A. (2006). Snakes as agents of evolutionary change: The case of the primate visual system. Journal of Human Evolution, 51(1), 1–35."
            },
            {
                "code": "R19-03",
                "text": "뱀에 대한 선택적 주의와 탐지"
            },
            {
                "code": "R19-04",
                "text": "LoBue, V., & DeLoache, J. S. (2008). Detecting the snake in the grass: Attention to fear-relevant stimuli by adults and young children. Psychological Science, 19(3), 284–289."
            },
            {
                "code": "R19-05",
                "text": "위협 자극에 대한 준비성(Preparedness)과 공포 학습"
            }
        ],
        "assetList": [
            {
                "code": "A19-01",
                "text": "https://skfb.ly/pyzur"
            }
        ],
        "culturalData": {
            "image": "Asset/3. Exhibition/C_data/webp/C19.webp",
            "visualGuide": "부여 외리 용무늬 벽돌 3D",
            "story": "부여 외리 출토 용무늬 벽돌에는 구름과 물을 움직이는 용이 역동적으로 표현되어 있습니다. 동아시아에서 용은 비와 물을 다스려 생명과 농경을 돕는 우주적 존재이자 신성한 질서의 수호자입니다. 향로의 몸체를 받치는 용은 하늘과 땅, 바다를 잇는 중심축 역할을 수행합니다.",
            "artifacts": [
                {
                    "title": "부여 외리 용무늬 벽돌 (보물)",
                    "museum": "국립중앙박물관 e뮤지엄",
                    "url": "https://www.museum.go.kr/MUSEUM/contents/M0505000000.do?relicId=196874&schM=view&searchId=search"
                }
            ]
        },
        "quizData": {
            "didYouKnowTitle": "용이 연꽃 세계를 받치다",
            "didYouKnowDesc": "백제금동대향로에서는 용 한 마리가 연꽃 봉오리 형태의 몸체를 아래에서 받칩니다. 용은 장식이 아니라 향로 세계의 아래쪽을 구성합니다.",
            "question": "사람은 흐릿한 그림에서도 뱀을 다른 동물보다 더 잘 찾아낼 수 있을까요?",
            "answer": "O",
            "explanation": "한 실험에서 성인 참가자들은 흐릿하게 가린 뱀, 새, 고양이, 물고기 그림을 보고 동물을 맞췄습니다. 뱀 그림은 다른 동물 그림보다 더 높은 정답률을 보였습니다. 이런 결과는 사람이 뱀처럼 위험할 수 있는 동물을 빠르게 알아차리는 능력을 가지고 있을 가능성을 보여줍니다. 이를 설명하는 가설 가운데 하나가 뱀탐지이론(snake detection theory)입니다.",
            "reference": "근거 16 · Kawai & He, PLOS ONE (2016)",
            "refRange": "성인 20명·노이즈로 흐린 동물 그림 뱀 탐지 실험"
        }
    }
]
};

window.EXHIBITION_DATA = EXHIBITION_DATA;
