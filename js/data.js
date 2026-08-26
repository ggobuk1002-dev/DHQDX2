/**
 * ============================================================
 * EXHIBITION DATA ARCHIVE (Source of Truth)
 * 19 Animals & 5 Sacred Layers of Baekje Incense Burner
 * Canonical 5 Layers: [천상], [산마루], [삼신산], [연꽃과 물가], [바다]
 * ============================================================
 */

const EXHIBITION_DATA = {
  "layers": [
    {
      "id": "celestial",
      "layerIndex": 1,
      "name": "천상",
      "shortName": "천상",
      "category": "celestial",
      "title": "하늘을 품은 날갯짓, 봉황",
      "desc": "향로의 가장 높은 곳에는 일반적으로 봉황으로 해석되는 새가 여의주를 턱 아래에 품고 날개를 펼친 채 서 있습니다. 봉황으로 보는 견해가 가장 널리 받아들여지지만, 천계·가릉빈가·금시조 등 다른 해석도 있습니다.",
      "bg": "Asset/2. Main/bg/bg_celestial.webp",
      "animalCodes": [
        "18"
      ]
    },
    {
      "id": "sky",
      "layerIndex": 2,
      "name": "산마루",
      "shortName": "산마루",
      "category": "sky",
      "title": "음악이 흐르는 신선의 산",
      "desc": "산 모양 뚜껑의 상부에는 완함·종적·배소·거문고·북을 연주하는 다섯 악사가 자리합니다. 산 사이사이에는 향연이 빠져나오는 구멍이 있어, 향을 피우면 산악 세계 사이로 연기가 피어오르도록 설계되었습니다.",
      "bg": "Asset/2. Main/bg/bg_sky.webp",
      "animalCodes": []
    },
    {
      "id": "land",
      "layerIndex": 3,
      "name": "삼신산",
      "shortName": "삼신산",
      "category": "land",
      "title": "첩첩산중, 생명의 터전",
      "desc": "겹겹이 솟아오른 향로의 산악은 신선이 산다고 여겨진 삼신산을 형상화한 것으로 해석됩니다. 산 모양 뚜껑에는 여러 겹의 봉우리와 산길·시냇물·폭포·호수가 표현되어 있고, 그 사이에 호랑이·사슴·멧돼지 등 현실의 동물과 상상의 동물, 기마수렵상과 여러 인물상이 배치되어 있습니다.",
      "bg": "Asset/2. Main/bg/bg_land.webp",
      "animalCodes": [
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "17"
      ]
    },
    {
      "id": "water",
      "layerIndex": 4,
      "name": "연꽃과 물가",
      "shortName": "연꽃과 물가",
      "category": "water",
      "title": "피어나는 연꽃과 수중 생태",
      "desc": "활짝 핀 연꽃을 닮은 몸체의 꽃잎 사이에는 물고기·사슴·학을 비롯한 여러 동물과 인물이 표현되어 있습니다. 일부 형상은 악어처럼 보이는 동물이나 날개 달린 신령한 짐승으로 해석되며, 정확한 종류를 확정하기 어려운 존재도 있습니다.",
      "bg": "Asset/2. Main/bg/bg_waterside.webp",
      "animalCodes": [
        "12",
        "13",
        "14",
        "15",
        "16"
      ]
    },
    {
      "id": "sea",
      "layerIndex": 5,
      "name": "바다",
      "shortName": "바다",
      "category": "sea",
      "title": "기운을 뿜어 올리는 용",
      "desc": "향로의 가장 아래에는 한 마리 용이 연꽃 모양 몸체를 입으로 물고, 하늘로 치솟듯 고개를 들어 향로 전체를 떠받치고 있습니다. 몸통과 꼬리, 구름 모양의 갈기를 투조로 장식해 강한 움직임과 생동감을 보여줍니다.",
      "bg": "Asset/2. Main/bg/bg_sea.webp",
      "animalCodes": [
        "19"
      ]
    }
  ],
  "animals": [
    {
      "id": 1,
      "code": "01",
      "name": "말",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_01.webp",
        "location": "산악형 뚜껑의 산봉우리 사이에 인물과 함께 표현되어 있습니다.",
        "appearance": "말을 타고 이동하거나, 말 위에서 몸을 돌려 활을 쏘는 기마수렵 장면으로 나타납니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 22,
        "y": 82
      },
      "panelTheme": "단단한 발굽과 초원 질주의 생체역학",
      "quizData": {
        "didYouKnowTitle": "발가락 하나로 달리는 동물",
        "didYouKnowDesc": "말의 발굽 안에는 사실 발가락뼈가 숨어 있습니다. 사람의 손가락으로 치면 가운데손가락 하나로 달리는 셈이에요.",
        "question": "말은 서서 잠을 잘 수 있다?",
        "answer": "O",
        "explanation": "말은 서서 얕은 잠을 잘 수 있습니다. 하지만 깊은 잠을 자려면 몸을 바닥에 눕혀야 합니다.",
        "reference": "근거 01 · Hartmann et al., *Applied Animal Behaviour Science* (2017)",
        "refRange": "말"
      },
      "simpleDesc": "단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.",
      "assetType": "glb",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp",
      "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-2.webp",
      "icon": "Asset/2. Main/icon/01.webp",
      "iconDark": "Asset/2. Main/icon_dark/01_dark.webp",
      "scienceStory": "말은 진화 과정에서 발가락 수를 줄여 가운데 발가락 하나로 달리는 특수한 발굽 구조를 갖추었습니다.",
      "sourceCode": "R01",
      "referenceList": [
        {
          "code": "R01-01",
          "text": "말 화석을 통한 말의 진화"
        },
        {
          "code": "R01-02",
          "text": "승마와 정치적 권력"
        },
        {
          "code": "R01-03",
          "text": "말의 가축화와 서유라시아 확산"
        },
        {
          "code": "R01-04",
          "text": "말의 장내 미생물과 소화기 질환"
        },
        {
          "code": "R01-05",
          "text": "말 발굽 관리와 편자의 역사"
        },
        {
          "code": "R01-06",
          "text": "말·전쟁·등자 논제"
        },
        {
          "code": "R01-07",
          "text": "말과 인간 사회의 역사적 관계"
        },
        {
          "code": "R01-08",
          "text": "말의 단일 발가락 진화와 생체역학"
        },
        {
          "code": "R01-09",
          "text": "말 앞발의 해부학과 발가락 감소"
        },
        {
          "code": "R01-10",
          "text": "말의 단일 발가락 진화와 생체역학"
        },
        {
          "code": "R01-11",
          "text": "말의 발자국과 단일 발굽의 진화"
        },
        {
          "code": "R01-12",
          "text": "말의 가축화와 선사시대 인간 사회"
        },
        {
          "code": "R01-13",
          "text": "말 등자의 기원과 발전"
        },
        {
          "code": "R01-14",
          "text": "말 발굽 관리와 편자의 역사"
        },
        {
          "code": "R01-15",
          "text": "고대 이란의 편자와 말 발굽 관리"
        }
      ],
      "assetList": [
        {
          "code": "A01-01",
          "text": "국가유산 디지털 서비스. 「서라벌_천년왕경_말」. 공공누리 제1유형(출처표시)."
        }
      ],
      "glb": "Asset/3. Exhibition/glb/01.glb",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C01.webp",
        "visualGuide": "금령총 기마인물형토기",
        "story": "일본 고분시대의 말모양 하니와에서도 화려한 말갖춤이 표현되어, 당시 승마문화와 유력자의 위세를 엿볼 수 있습니다. 6세기 초 신라의 금령총에서 발견된 기마인물형토기는 사람이 말을 타고 있는 모습을 본뜬 토기입니다. 말에는 안장과 재갈, 발걸이 등 당시 실제 사용했던 말갖춤이 세밀하게 표현되어 있어 신라의 기마생활을 엿볼 수 있습니다. 이 토기가 무덤에 함께 묻혔다는 점에서, 말은 현실의 이동수단을 넘어 죽은 이의 사후 여정과도 연결된 존재였을 가능성이 있습니다. 일본 고분시대의 말모양 하니와에서도 화려한 말갖춤이 표현되어, 당시 승마문화와 유력자의 위세를 엿볼 수 있습니다.",
        "artifacts": [
          {
            "title": "금령총 기마인물형토기",
            "museum": "국립중앙박물관",
            "url": "https://www.museum.go.kr/MUSEUM/contents/M0501000000.do?pageSize=10&relicRecommendCategory=&relicRecommendId=16888&sc=COM.RELIC_NAME&schM=view&sv=%ED%86%A0%EA%B8%B0"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 2,
      "code": "02",
      "name": "호랑이",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_02.webp",
        "location": "산악형 뚜껑의 여러 산봉우리 사이에 자리하고 있습니다.",
        "appearance": "줄무늬가 표현된 네발짐승이 산속을 움직이는 듯한 모습으로 조각되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 14,
        "y": 68
      },
      "panelTheme": "맹수의 위엄과 산림 매복의 해부학",
      "quizData": {
        "didYouKnowTitle": "백호는 새로운 종이 아니다",
        "didYouKnowDesc": "백호는 새로운 종이 아니라 흰 털을 만드는 유전적 특징이 나타난 호랑이입니다. 흰 새끼를 얻으려고 가까운 친척끼리 계속 번식시키면 사시·척추 이상 같은 건강 문제가 함께 늘 수 있습니다.",
        "question": "호랑이는 고양이과라서 물을 싫어한다?",
        "answer": "X",
        "explanation": "호랑이는 헤엄을 잘 치며 더위를 식히거나 강을 건널 때 물에 들어갑니다. 물속에서 사냥한 기록도 있지만, 모든 개체가 언제나 같은 행동을 한다는 뜻은 아닙니다.",
        "reference": "근거 02 · Smithsonian’s National Zoo, Tiger",
        "refRange": "호랑이의 수영·물속 행동"
      },
      "simpleDesc": "강력한 근육과 은밀한 사냥 기술을 지닌 백두대간의 최상위 포식자.",
      "assetType": "glb",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel02.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/02.webp",
      "iconDark": "Asset/2. Main/icon_dark/02_dark.webp",
      "scienceStory": "호랑이는 매복과 기습에 최적화된 유연한 척추와 강력한 앞다리 근육을 발달시켰습니다.",
      "sourceCode": "R02",
      "referenceList": [
        {
          "code": "R02-01",
          "text": "백호의 체색을 결정하는 유전적 기초"
        },
        {
          "code": "R02-02",
          "text": "한반도 호랑이 감소, 포획, 농업 확대, 서식지 파괴"
        },
        {
          "code": "R02-03",
          "text": "일제강점기 호랑이 포획·해수구제정책"
        },
        {
          "code": "R02-04",
          "text": "조선 전기 한반도의 Panthera 분포·서식지"
        }
      ],
      "assetList": [
        {
          "code": "A02-01",
          "text": "국가유산 디지털 서비스. 「서라벌_천년왕경_호랑이」. 공공누리 제1유형(출처표시)."
        }
      ],
      "glb": "Asset/3. Exhibition/glb/02.glb",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C02.webp",
        "visualGuide": "호랑이 모양 장대받침 / 부여 군수리 호자",
        "story": "부여 군수리에서 출토된 호자는 호랑이의 모습을 본떠 만든 백제 사비기의 토기입니다. 호랑이의 몸과 생활용품의 기능이 결합된 모습은, 백제가 중국에서 전해진 형식을 받아들이면서도 자신들의 생활문화 안에서 새롭게 활용한 사례로 볼 수 있습니다.\n\n[연결 유산: 중국 북위 호랑이 모양 장대받침]\n5세기 중국 북위의 호랑이 모양 장대받침은 엎드린 호랑이의 모습을 돌로 조각해 실용적인 기물의 형태와 결합한 유물입니다. 호랑이라는 강한 동물의 형상이 생활·의례용 물건의 조형으로 활용되었다는 점에서 백제의 호자와 비교해 볼 수 있습니다.",
        "artifacts": [
          {
            "title": "Pole base in the form of a tiger",
            "museum": "The Metropolitan Museum of Art",
            "url": "https://www.metmuseum.org/art/collection/search/54028"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 3,
      "code": "03",
      "name": "사자",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_03.webp",
        "location": "산악형 뚜껑의 신선세계에 여러 현실·상상동물과 함께 자리합니다.",
        "appearance": "비교적 작은 네발짐승 형태로 표현되어 있어 가까이 들여다보아야 모습을 확인할 수 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 28,
        "y": 64
      },
      "panelTheme": "갈기와 사회적 무리 사냥의 진화",
      "quizData": {
        "didYouKnowTitle": "갈기는 건강을 알리는 신호",
        "didYouKnowDesc": "수사자의 갈기는 성호르몬과 영양 상태 등의 영향을 받으며 짝과 경쟁자에게 상태를 알리는 성선택 신호로 연구됩니다.",
        "question": "사자는 새끼를 강하게 키우려고 절벽에서 떨어뜨린다?",
        "answer": "X",
        "explanation": "그 이야기는 옛 비유와 속설에 가깝습니다. 실제 암사자는 새끼를 숨겨 보호하고 젖을 먹이며, 같은 무리의 암컷들이 함께 새끼를 돌보기도 합니다.",
        "reference": "근거 03 · Smithsonian’s National Zoo, Lion",
        "refRange": "사자 무리의 번식·새끼 돌봄"
      },
      "simpleDesc": "풍성한 갈기와 무리 생활을 통해 백수(百獸)의 왕으로 군림한 맹수.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel03.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/03.webp",
      "iconDark": "Asset/2. Main/icon_dark/03_dark.webp",
      "scienceStory": "수컷 사자의 웅장한 갈기는 체온 상승의 불리함을 감수하고도 번식 경쟁에서 우위를 점하는 성선택의 대표적 형질입니다.",
      "sourceCode": "R03",
      "referenceList": [
        {
          "code": "R03-01",
          "text": "사자 갈기의 성선택과 환경적 요인"
        },
        {
          "code": "R03-02",
          "text": "사자의 문제 해결, 학습, 기억, 사회적 지능 가설"
        },
        {
          "code": "R03-03",
          "text": "동굴사자의 분포, 한반도 출현"
        },
        {
          "code": "R03-04",
          "text": "사자 새끼 돌봄, 무리 생활"
        }
      ],
      "assetList": [
        {
          "code": "A03-01",
          "text": "https://skfb.ly/KCBU"
        }
      ],
      "embedHtml": "<iframe title=\"사자 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/b279685790ac4194b51707df5cd245d4/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C03.webp",
        "visualGuide": "기둥머리 위에 선 사자 (인도 굽타시대)",
        "story": "5~6세기 인도 굽타시대의 ‘기둥머리 위에 선 사자’는 건축물을 떠받치는 사자의 모습으로 힘과 권위를 드러냅니다. 인도에서 사자는 왕권을 상징했으며, 불교에서는 부처의 가르침과 신성함을 나타내는 형상으로 활용되었습니다. 이러한 사자의 이미지는 종교와 교역을 따라 실제 사자가 살지 않던 지역까지 널리 전해졌습니다. 백제금동대향로의 사자 역시 먼 지역에서 전해진 동물의 이미지와 의미를 백제의 방식으로 받아들여 이상세계에 표현한 사례입니다. 이를 통해 동물뿐 아니라 그 이미지와 이야기도 국경을 넘어 이동했음을 엿볼 수 있습니다.",
        "artifacts": [
          {
            "title": "Lion Standing on a Pillar Capital",
            "museum": "The Metropolitan Museum of Art",
            "url": "https://www.metmuseum.org/art/collection/search/38393"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 4,
      "code": "04",
      "name": "족제비",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_04.webp",
        "location": "산악형 뚜껑에 표현된 작은 네발짐승 가운데 하나입니다.",
        "appearance": "길쭉한 몸과 짧은 다리를 가진 낮은 체형으로 보여 족제비과 동물로 해석되기도 합니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 40,
        "y": 84
      },
      "panelTheme": "유연한 체형과 소형 포식자의 생태",
      "quizData": {
        "didYouKnowTitle": "냄새로 전하는 족제비의 자기소개",
        "didYouKnowDesc": "족제비(*Mustela sibirica*)는 꼬리 아래쪽의 항문샘에서 냄새 물질을 냅니다. 연구자들이 그 성분을 분석한 결과, 냄새 물질의 종류와 비율에는 종·성별·나이를 구분하는 단서가 담길 수 있었습니다.",
        "question": "족제비는 땅 위에서만 움직이며 물이나 나무에서는 사냥하지 못한다?",
        "answer": "X",
        "explanation": "족제비는 땅뿐 아니라 물과 나무에서도 움직일 수 있습니다. 헤엄쳐 물에 사는 들쥐를 뒤쫓거나 나무에 올라 다람쥐를 추격한 행동이 보고되었습니다. 길고 가는 몸은 좁은 곳을 지나는 데 유리하지만 활동 공간이 땅에만 한정되는 것은 아닙니다.",
        "reference": "근거 17 · \\[Law, *Mammalian Species* (2018)\\](https://doi.org/10.1093/mspecies/sey013)",
        "refRange": "족제비(*Mustela sibirica*)의 이동 거리·수영·나무 타기·먹이 추격 행동"
      },
      "simpleDesc": "가늘고 긴 몸으로 좁은 굴속을 누비며 민첩하게 사냥하는 작은 맹수.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel04.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/04.webp",
      "iconDark": "Asset/2. Main/icon_dark/04_dark.webp",
      "scienceStory": "족제비과는 체표면적이 넓어 열 손실이 큼에도 불구하고, 좁은 터널 속 먹이를 추적하기 위해 극단적으로 길고 유연한 몸체 구조를 선택했습니다.",
      "sourceCode": "R04",
      "referenceList": [
        {
          "code": "R04-01",
          "text": "족제비의 신체 형태와 소형 포식자로서의 생태"
        },
        {
          "code": "R04-02",
          "text": "족제비의 식성과 소형 설치류 포식"
        },
        {
          "code": "R04-03",
          "text": "생태적 니치(niche)의 개념"
        },
        {
          "code": "R04-04",
          "text": "니치 개념의 현대적 해석과 생태적 지위"
        }
      ],
      "assetList": [
        {
          "code": "A04-01",
          "text": "[https://skfb.ly/oKByZ](https://skfb.ly/oKByZ)"
        }
      ],
      "embedHtml": "<iframe title=\"족제비 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/18b390f0dcc943288cc0971e5328159f/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "panelImg3": null,
      "culturalData": null
    },
    {
      "id": 5,
      "code": "05",
      "name": "원숭이",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_05.webp",
        "location": "산악형 뚜껑의 산봉우리 사이에 자리하고 있습니다.",
        "appearance": "몸을 세우거나 앉아 주변을 바라보는 듯한 자세로 표현되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 32,
        "y": 55
      },
      "panelTheme": "정교한 손발과 수상 생활의 적응",
      "quizData": {
        "didYouKnowTitle": "사람과 원숭이는 친척이지 조상과 후손이 아니다",
        "didYouKnowDesc": "사람은 오늘날의 원숭이에서 직접 진화하지 않았습니다. 사람과 구세계원숭이의 계통은 약 2,500만 년 전 무렵부터 서로 다른 길로 갈라지기 시작했고, 사람과 침팬지·보노보의 계통은 약 800만~600만 년 전에 갈라진 것으로 추정됩니다. 사람만 더 진화한 존재가 아니라, 원숭이를 비롯한 모든 동물도 각자의 환경에서 우리와 같은 시간 동안 진화해 온 존재입니다.",
        "question": "사람은 오늘날의 원숭이보다 더 많이 진화한 동물이다?",
        "answer": "X",
        "explanation": "사람과 오늘날의 원숭이는 공통 조상에서 갈라진 뒤 같은 시간 동안 각자의 환경에 맞게 진화했습니다. 진화는 위아래의 순위가 아니라 갈라지는 나뭇가지에 가깝습니다.",
        "reference": "근거 04 · Smithsonian Human Origins Program",
        "refRange": "사람과 현생 영장류의 공통 조상"
      },
      "simpleDesc": "나뭇가지를 쥐는 손과 영리한 지능으로 숲을 탐색하는 영장류.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel05.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/05.webp",
      "iconDark": "Asset/2. Main/icon_dark/05_dark.webp",
      "scienceStory": "영장류의 엄지손가락 대립 구조와 지문은 나뭇가지를 안전하게 잡고 도구를 조작하는 진화적 디딤돌이 되었습니다.",
      "sourceCode": "R05",
      "referenceList": [
        {
          "code": "R05-01",
          "text": "영장류의 손·발 구조와 파지 능력"
        },
        {
          "code": "R05-02",
          "text": "인간과 다른 영장류의 진화적 관계"
        },
        {
          "code": "R05-03",
          "text": "영장류의 번식 행동과 성적 신호"
        },
        {
          "code": "R05-04",
          "text": "한반도 화석 마카크의 계통적 관계"
        },
        {
          "code": "R05-05",
          "text": "북한 플라이스토세 마카크류 화석과 당시 환경"
        }
      ],
      "assetList": [
        {
          "code": "A05-01",
          "text": "https://skfb.ly/pMuOH"
        }
      ],
      "embedHtml": "<iframe title=\"원숭이 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/90df1c6b146749f1ba1f3346831a2f57/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C05.webp",
        "visualGuide": "원숭이형 하니와 (일본 고분시대)",
        "story": "일본 고분시대의 원숭이형 하니와는 사람을 닮은 얼굴과 몸짓을 흙으로 표현한 무덤 조형물입니다. 원숭이는 인간과 닮은 모습 때문에 여러 문화에서 익살과 모방, 영리함과 욕망을 상징해 왔습니다. 백제금동대향로의 원숭이 역시 산악세계에 생동감을 더하며 인간과 동물의 경계를 생각하게 합니다. 불교 설화에서는 지혜와 희생의 존재로 등장하기도 하지만 이를 향로에 직접 연결하기는 어렵습니다. 두 유산은 같은 원숭이라도 문화와 맥락에 따라 서로 다른 의미로 표현될 수 있음을 보여줍니다.",
        "artifacts": [
          {
            "title": "원숭이형 하니와 (猿形埴輪)",
            "museum": "Tokyo National Museum / e-Museum",
            "url": "https://emuseum.nich.go.jp/detail?content_base_id=100618&content_part_id=001&content_pict_id=002&langId=en&webView=0"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 6,
      "code": "06",
      "name": "사슴",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_06.webp",
        "location": "사슴은 산악형 뚜껑과 연꽃형 몸체에서 모두 확인됩니다.",
        "appearance": "가느다란 다리와 사슴 특유의 몸 형태를 지닌 네발짐승으로 표현되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 48,
        "y": 62
      },
      "panelTheme": "매년 재생되는 경이로운 뿔의 생체공학",
      "quizData": {
        "didYouKnowTitle": "사슴뿔은 살아서 자라는 뼈",
        "didYouKnowDesc": "일반적인 뿔은 뼈 위에 각질 껍질이 덮인 영구 구조지만, 사슴뿔은 뼈 자체이며 녹각피, 즉 뿔을 덮는 피부(antler velvet) 아래에서 빠르게 자랍니다.",
        "question": "사슴은 언제나 수컷만 뿔이 있다?",
        "answer": "X",
        "explanation": "대부분의 사슴과에서는 수컷에게만 뿔이 나지만 순록은 암컷도 뿔이 납니다. 다만 보통 수컷의 뿔이 더 크고 가지가 많습니다.",
        "reference": "근거 05 · U.S. National Park Service, Caribou",
        "refRange": "순록 암수의 뿔"
      },
      "simpleDesc": "우아한 자태와 계절마다 새로 자라는 장대한 뿔을 지닌 초식동물.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel06.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/06.webp",
      "iconDark": "Asset/2. Main/icon_dark/06_dark.webp",
      "scienceStory": "사슴의 뿔은 포유류 중 유일하게 매년 완전히 탈락하고 줄기세포를 통해 완벽히 재생되는 기적 같은 기관입니다.",
      "sourceCode": "R06",
      "referenceList": [
        {
          "code": "R06-01",
          "text": "사슴뿔의 재생과 성장 메커니즘"
        },
        {
          "code": "R06-02",
          "text": "사슴뿔 발생의 형태형성학적 특성"
        },
        {
          "code": "R06-03",
          "text": "사슴뿔 줄기세포와 포유류 조직 재생"
        },
        {
          "code": "R06-04",
          "text": "사슴뿔 재생을 통한 포유류 재생의학 통찰"
        },
        {
          "code": "R06-05",
          "text": "사슴뿔과 성선택 및 유전적 상관성"
        },
        {
          "code": "R06-06",
          "text": "붉은사슴 뿔 크기의 유전력과 번식 성공도"
        },
        {
          "code": "R06-07",
          "text": "뿔 크기와 수컷의 생애 번식 성공도"
        },
        {
          "code": "R06-08",
          "text": "사슴 뿔의 크기와 성장 비용 및 생애사적 절충"
        },
        {
          "code": "R06-09",
          "text": "사회적 환경이 사슴 성적 형질 투자에 미치는 영향"
        }
      ],
      "assetList": [
        {
          "code": "A06-01",
          "text": "https://skfb.ly/6BHXp"
        }
      ],
      "embedHtml": "<iframe title=\"사슴 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/00dd0126dcc0483392afa0a396d05f92/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C06.webp",
        "visualGuide": "사슴형 하니와",
        "story": "사산조의 사슴무늬 항아리 조각과 일본의 사슴형 하니와는 같은 사슴을 서로 다른 문화적 맥락에서 표현한 유산입니다. 사슴은 왕실의 사냥과 생명력, 무덤과 의례를 상징했으며, 해마다 뿔이 떨어지고 다시 자라는 생태는 재생과 갱신의 의미로 이어졌습니다. 풍납토성에서 출토된 사슴뼈는 백제인이 실제로 사슴을 사냥하고 이용했음을 보여줍니다. 현실의 먹거리이자 자원이었던 사슴은 백제금동대향로에서는 신선과 동물이 공존하는 이상세계의 구성원으로 새롭게 자리합니다.",
        "artifacts": [
          {
            "title": "사슴형 하니와 (鹿形埴輪)",
            "museum": "Hamamatsu City Catalog",
            "url": "https://adeac.jp/hamamatsu-city/catalog/mp000130-2022"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 7,
      "code": "07",
      "name": "멧돼지",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_07.webp",
        "location": "산악형 뚜껑의 산봉우리와 기마수렵 장면 가까이에 자리합니다.",
        "appearance": "낮고 단단한 몸을 가진 멧돼지가 산속에서 움직이는 듯한 모습으로 표현되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 58,
        "y": 82
      },
      "panelTheme": "견고한 주둥이와 생태계 엔지니어링",
      "quizData": {
        "didYouKnowTitle": "진흙은 멧돼지의 천연 에어컨",
        "didYouKnowDesc": "멧돼지는 땀으로 체온을 낮추기 어려워 진흙 목욕을 이용합니다. 진흙은 더위를 줄이고 피부의 기생충 관리에도 도움을 줄 수 있습니다.",
        "question": "돼지는 하루 종일 먹고 잠만 자는 동물이다?",
        "answer": "X",
        "explanation": "돼지는 깨어 있는 시간의 많은 부분을 코로 땅을 뒤지며 먹이를 찾고 주변을 탐색하는 데 씁니다. 다른 개체와 상호작용하고 경험을 통해 배우는 활동적인 동물입니다.",
        "reference": "근거 06 · Studnitz et al., *Applied Animal Behaviour Science* (2007)",
        "refRange": "돼지의 탐색·땅 파기 행동 종설"
      },
      "simpleDesc": "단단한 주둥이로 땅을 파헤치며 숲의 물질 순환을 돕는 야성의 전차.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel07.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/07.webp",
      "iconDark": "Asset/2. Main/icon_dark/07_dark.webp",
      "scienceStory": "멧돼지의 굴토 행동(Rooting)은 토양을 뒤섞어 유기물을 분해하고 다양한 식물의 발아를 돕는 생태계 엔지니어의 핵심 역할입니다.",
      "sourceCode": "R07",
      "referenceList": [
        {
          "code": "R07-01",
          "text": "멧돼지의 굴토 행동과 토양 교란"
        },
        {
          "code": "R07-02",
          "text": "멧돼지 굴토와 식물 다양성"
        },
        {
          "code": "R07-03",
          "text": "멧돼지 굴토가 토양에 미치는 영향"
        },
        {
          "code": "R07-04",
          "text": "멧돼지 굴토와 토양 특성"
        },
        {
          "code": "R07-05",
          "text": "돼지의 가축화와 멧돼지의 관계"
        },
        {
          "code": "R07-06",
          "text": "가축돼지의 기원과 멧돼지로부터의 가축화"
        },
        {
          "code": "R07-07",
          "text": "가축돼지의 분류학적 위치"
        },
        {
          "code": "R07-08",
          "text": "돼지의 진흙 목욕과 체온 조절"
        }
      ],
      "assetList": [
        {
          "code": "A07-01",
          "text": "https://skfb.ly/oSyL7"
        }
      ],
      "embedHtml": "<iframe title=\"멧돼지 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/e2761cb2839447b6beb0b4ed132b0895/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": null,
        "visualGuide": "천리시 아라마키고분 출토 멧돼지형 하니와",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"> <iframe title=\"天理市荒蒔古墳出土猪形埴輪\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/dadaed5bbf4b4902b17111471cabea85/embed?autospin=1&autostart=1&transparent=1&dnt=1\"> </iframe> </div>",
        "story": "일본 아라마키고분의 멧돼지형 하니와와 사산조의 ‘돌진하는 멧돼지’ 장식은 멧돼지의 강한 힘과 야생성을 보여줍니다. 길들여진 돼지와 달리 멧돼지는 사냥의 대상이자 인간이 맞서야 할 자연의 에너지로 인식되었습니다. 풍납토성에서 출토된 돼지·멧돼지 뼈는 백제인의 식생활과 동물 이용 모습을 보여주는 현실의 흔적입니다. 백제금동대향로의 멧돼지는 이러한 생활세계의 동물이 이상세계로 옮겨진 모습으로, 먹거리와 사냥감이면서 동시에 두려움과 생명력을 지닌 야생동물의 여러 모습을 함께 보여줍니다.",
        "artifacts": [
          {
            "title": "天理市荒蒔古墳出土猪形埴輪 (3D)",
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
      "panelImg3": null
    },
    {
      "id": 8,
      "code": "08",
      "name": "코끼리",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_08.webp",
        "location": "산악형 뚜껑의 여러 동물과 인물 사이에 표현되어 있습니다.",
        "appearance": "긴 코와 큰 몸을 가진 코끼리의 등에 사람이 올라탄 모습으로 나타납니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 72,
        "y": 68
      },
      "panelTheme": "기둥 같은 다리와 거대 체구의 완충 역학",
      "quizData": {
        "didYouKnowTitle": "코와 윗입술이 합쳐진 만능 기관",
        "didYouKnowDesc": "코끼리의 코는 코와 윗입술이 합쳐진 기관으로 호흡, 후각, 물 마시기, 먹이 집기와 소통을 담당합니다.",
        "question": "코끼리의 상아는 잘려도 안전하게 다시 자란다?",
        "answer": "X",
        "explanation": "상아는 계속 자라는 앞니이지만 뿌리 쪽에는 신경과 혈관이 있습니다. 특히 밀렵으로 온전한 상아를 빼앗는 과정에서는 코끼리가 죽으며, 남은 조직도 심한 손상과 감염 위험에 놓입니다.",
        "reference": "근거 07 · 인도 환경·산림·기후변화부 상아 절단 지침 (2025); WWF 상아 해설",
        "refRange": "상아의 구조·밀렵 피해"
      },
      "simpleDesc": "수 톤의 체중을 부드럽게 지탱하는 놀라운 발바닥 쿠션의 거인.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel08.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/08.webp",
      "iconDark": "Asset/2. Main/icon_dark/08_dark.webp",
      "scienceStory": "코끼리의 발뒤꿈치에는 두꺼운 지방과 결합조직으로 이루어진 특수 쿠션 패드가 있어 거대한 체중 충격을 완벽하게 흡수합니다.",
      "sourceCode": "R08",
      "referenceList": [
        {
          "code": "R08-01",
          "text": "용각류의 발 구조와 자세, 체중 지지"
        },
        {
          "code": "R08-02",
          "text": "코끼리 발의 섬유성·지방성 쿠션과 체중 지지"
        },
        {
          "code": "R08-03",
          "text": "코끼리 발바닥의 하중 분산과 보행 역학"
        },
        {
          "code": "R08-04",
          "text": "알렉산더 대왕과 전투코끼리"
        },
        {
          "code": "R08-05",
          "text": "헬레니즘 세계의 전투코끼리와 군사적 활용"
        },
        {
          "code": "R08-06",
          "text": "코끼리와 왕권, 환경 및 정치적 역사"
        },
        {
          "code": "R08-07",
          "text": "고대 전쟁에서 전투코끼리의 전술적 활용"
        }
      ],
      "assetList": [
        {
          "code": "A08-01",
          "text": "https://skfb.ly/QWCR"
        }
      ],
      "embedHtml": "<iframe title=\"코끼리 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/0a7cb290616442c88f89107d9a11f8f0/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C08.webp",
        "visualGuide": "코끼리 조각 (Elephant figure)",
        "story": "5~6세기 남아시아의 코끼리 조각은 코끼리가 힘과 권위, 지혜와 종교적 위엄을 상징하는 동물이었음을 보여줍니다. 특히 코끼리와 사자를 함께 표현한 조형에서는 서로 다른 동물의 강한 힘이 결합되기도 했습니다. 코끼리가 살지 않았던 백제의 금동대향로에 이 동물이 등장한다는 점은 실물보다 이미지와 지식이 먼 지역까지 이동했음을 보여줍니다. 향로의 코끼리는 백제인이 직접 본 동물의 기록이라기보다, 불교와 교역을 통해 접한 먼 세계의 지식을 자신들의 이상세계 속에 새롭게 담아낸 흔적이라 할 수 있습니다.",
        "artifacts": [
          {
            "title": "Elephant figure",
            "museum": "Victoria and Albert Museum",
            "url": "https://collections.vam.ac.uk/item/O39822/figure-unknown/"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 9,
      "code": "09",
      "name": "이상한 부리를 가진 새",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_09.webp",
        "location": "산악형 뚜껑의 여러 동물과 새 사이에 자리하고 있습니다.",
        "appearance": "코끼리 코처럼 길게 뻗은 부리와 새의 몸이 결합된 독특한 형상으로 표현되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 18,
        "y": 52
      },
      "panelTheme": "특화된 부리와 적응방산의 비밀",
      "quizData": {
        "didYouKnowTitle": "먹이에 따라 달라진 부리",
        "didYouKnowDesc": "다윈핀치류는 씨앗·곤충·선인장 등 서로 다른 먹이를 이용하면서 부리의 크기와 모양이 달라졌습니다. 공통 조상에서 여러 생태적 역할로 갈라진 적응방산의 대표 사례입니다.",
        "question": "모든 새의 부리는 같은 모양이다?",
        "answer": "X",
        "explanation": "부리는 먹이와 먹는 방법에 따라 굵고 단단하거나, 길고 가늘거나, 갈고리처럼 굽는 등 다양합니다. 향로 속 새는 특정 종으로 확정하지 않고 부리의 차이를 관찰합니다.",
        "reference": "근거 14 · Grant & Grant, *Science* (2002)",
        "refRange": "다윈핀치류의 부리와 먹이 적응"
      },
      "simpleDesc": "독특한 형태의 부리로 특정한 먹이 환경에 완벽히 적응한 상상의 새.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel09.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/09.webp",
      "iconDark": "Asset/2. Main/icon_dark/09_dark.webp",
      "scienceStory": "갈라파고스 핀치처럼 조류의 부리 형태 다양성은 환경과 먹이 자원에 따라 급격히 진화하는 적응방산의 결정적 증거입니다.",
      "sourceCode": "R09",
      "referenceList": [
        {
          "code": "R09-01",
          "text": "새의 부리 형태와 먹이 이용의 관계"
        },
        {
          "code": "R09-02",
          "text": "다윈핀치의 종분화와 적응방산"
        },
        {
          "code": "R09-03",
          "text": "다윈핀치의 생태적 다양화와 적응방산"
        },
        {
          "code": "R09-04",
          "text": "다윈핀치의 니치분화와 생태적 다양성"
        },
        {
          "code": "R09-05",
          "text": "다윈핀치의 적응방산에 대한 종합적 고찰"
        }
      ],
      "assetList": [
        {
          "code": "A09-01",
          "text": "https://skfb.ly/oLDKA"
        }
      ],
      "embedHtml": "<iframe title=\"이상한 부리를 가진 새 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/1c27c1bec5f6440981a2673db56d0c11/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "panelImg3": null,
      "culturalData": null
    },
    {
      "id": 10,
      "code": "10",
      "name": "뱀을 물고 있는 야수",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_10.webp",
        "location": "산악형 뚜껑의 산봉우리 사이에 자리한 상상동물입니다.",
        "appearance": "네발짐승이 입에 길고 가느다란 뱀을 물고 있는 모습으로 표현되어 있습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 88,
        "y": 66
      },
      "panelTheme": "포식과 방어의 끝없는 군비경쟁",
      "quizData": {
        "didYouKnowTitle": "공격과 방어가 서로를 바꾸는 진화",
        "didYouKnowDesc": "포식자와 먹이는 서로의 공격과 방어에 맞춰 계속 진화합니다. 뱀의 독과 이를 피하거나 견디는 포식자의 방어처럼 상대의 적응이 또 다른 적응을 부르는 현상을 진화적 군비경쟁이라고 합니다.",
        "question": "사람도 다른 동물의 진화에 영향을 줄 수 있을까요?",
        "answer": "O",
        "explanation": "사람의 사냥이나 서식지 변화는 다른 동물의 생존과 번식에 영향을 줄 수 있습니다. 예를 들어 스피팅코브라는 움직이는 표적의 얼굴을 따라가며 움직임을 예측해 독을 뿜습니다. 실험에서는 사람의 얼굴을 대상으로 했을 때 높은 명중률을 보였습니다.",
        "reference": "근거 13 · Westhoff et al., *Journal of Experimental Biology* (2010)",
        "refRange": "스피팅코브라의 표적 추적"
      },
      "simpleDesc": "독사에 맞서 치명적인 공격을 가하는 용맹한 야수와 뱀의 대결.",
      "assetType": "gif",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel10.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/10.webp",
      "iconDark": "Asset/2. Main/icon_dark/10_dark.webp",
      "scienceStory": "독사의 치명적인 신경독과 이에 대항하는 포식자의 독 저항성 진화는 생물학에서 말하는 '붉은 여왕 가설(Red Queen Hypothesis)'의 완벽한 사례입니다.",
      "sourceCode": "R10",
      "referenceList": [
        {
          "code": "R10-01",
          "text": "진화적 경쟁과 붉은 여왕 가설"
        },
        {
          "code": "R10-02",
          "text": "포식자와 피식자의 공진화 및 붉은 여왕 가설"
        },
        {
          "code": "R10-03",
          "text": "스피팅코브라의 사람 얼굴에 대한 독 분사 행동"
        },
        {
          "code": "R10-04",
          "text": "스피팅코브라의 표적 추적과 독 분사 정확성"
        },
        {
          "code": "R10-05",
          "text": "스피팅코브라의 진화와 초기 인류와의 시기적 연관성"
        }
      ],
      "assetList": [
        {
          "code": "A10-01",
          "text": "Asset/3. Exhibition/glb/cramorant-gorging.gif"
        }
      ],
      "embedHtml": "<div style=\"width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #0b0f19; border-radius: 8px; overflow: hidden;\"><img src=\"Asset/3. Exhibition/glb/cramorant-gorging.gif\" alt=\"뱀을 물고 있는 야수\" style=\"max-width: 100%; max-height: 100%; object-fit: contain; display: block;\"></div>",
      "panelImg3": null,
      "culturalData": null
    },
    {
      "id": 11,
      "code": "11",
      "name": "볏을 가진 새",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_11.webp",
        "location": "산악형 뚜껑에 표현된 여러 작은 새 가운데 하나입니다.",
        "appearance": "머리 위로 솟은 볏이 특징적인 새의 모습이지만 정확한 종류는 확인되지 않았습니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 68,
        "y": 50
      },
      "panelTheme": "화려한 볏과 성선택의 시각 신호",
      "quizData": {
        "didYouKnowTitle": "볏깃은 흔들림을 느끼는 감각 장치일 수 있다",
        "didYouKnowDesc": "인도공작의 머리 볏은 단순한 장식만이 아닐 수 있습니다. 실험에서 공작의 볏깃은 구애 행동 때 생기는 진동과 비슷한 공기 움직임에 잘 반응했고, 수컷의 날갯짓을 흉내 낸 바람에도 실제로 흔들렸습니다. 연구진은 볏깃이 사회적 신호를 느끼는 데 도움을 줄 가능성을 제시했습니다.",
        "question": "인도공작의 볏깃은 수컷의 구애 날갯짓이 만든 공기 움직임에 진동할 수 있다?",
        "answer": "O",
        "explanation": "실험실에서 수컷 공작의 구애 날갯짓을 흉내 내자 그 바람에 볏깃이 실제로 진동했습니다. 볏깃은 구애 행동 때 생기는 진동 주파수에도 잘 반응했습니다. 다만 이 연구는 모든 볏 있는 새가 같은 기능을 가진다는 뜻이 아니라, 인도공작에서 감각 기능의 가능성을 보여 준 결과입니다.",
        "reference": "근거 18 · \\[Kane et al., *PLOS ONE* (2018)\\](https://doi.org/10.1371/journal.pone.0207247)",
        "refRange": "인도공작의 볏깃·구애 진동·날갯짓 모사 실험"
      },
      "simpleDesc": "머리 위의 깃털 장식으로 자신의 건강과 유전적 우수성을 뽐내는 새.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel11-1.webp",
      "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel11-2.webp",
      "icon": "Asset/2. Main/icon/11.webp",
      "iconDark": "Asset/2. Main/icon_dark/11_dark.webp",
      "scienceStory": "화려한 머리 볏은 포식자의 눈에 띄는 위험에도 불구하고, 배우자에게 자신의 면역력과 생존력을 과시하기 위해 진화한 핸디캡 원리의 산물입니다.",
      "sourceCode": "R11",
      "referenceList": [
        {
          "code": "R11-01",
          "text": "볏을 가진 새의 성선택과 성적이형"
        },
        {
          "code": "R11-02",
          "text": "조류의 성적이형과 성 차이의 발생"
        },
        {
          "code": "R11-03",
          "text": "조류의 ZZ/ZW 성결정 체계"
        },
        {
          "code": "R11-04",
          "text": "조류의 성염색체와 성결정"
        },
        {
          "code": "R11-05",
          "text": "조류의 Z 염색체 유전자 발현과 성적 차이"
        },
        {
          "code": "R11-06",
          "text": "조류에서 Z 염색체 발현량과 성 차이"
        },
        {
          "code": "R11-07",
          "text": "균류의 다양한 교배형"
        },
        {
          "code": "R11-08",
          "text": "균류의 다중 교배형 체계"
        },
        {
          "code": "R11-09",
          "text": "균류의 교배형과 ‘성’ 개념의 구분"
        }
      ],
      "assetList": [
        {
          "code": "A11-01",
          "text": "https://skfb.ly/o7yPD"
        }
      ],
      "embedHtml": "<iframe title=\"볏을 가진 새 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/e3827c13a3364e8084797531b58c6ed6/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe>",
      "panelImg3": null,
      "culturalData": null
    },
    {
      "id": 12,
      "code": "12",
      "name": "악어",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_12.webp",
        "location": "연꽃형 몸체의 꽃잎 사이에 표현된 동물 가운데 하나입니다.",
        "appearance": "길쭉한 몸과 꼬리, 낮은 자세를 가진 파충류형 형상으로 보여 악어로 해석되기도 합니다."
      },
      "layer": "water",
      "layerName": "연꽃과 물가",
      "layerCoords": {
        "x": 16,
        "y": 74
      },
      "panelTheme": "원시의 생체 설계와 수륙양용의 지배자",
      "quizData": {
        "didYouKnowTitle": "기억하고 학습하는 파충류",
        "didYouKnowDesc": "악어류는 주변 환경과 먹이의 특징을 경험을 통해 학습하고, 이를 기억하는 행동이 관찰됩니다. 파충류도 주변 환경을 경험하고 배우며 살아갑니다.",
        "question": "새와 악어의 폐에는 공기가 한 방향으로 흐르는 공통점이 있다?",
        "answer": "O",
        "explanation": "새는 기낭과 폐를 함께 사용하고 악어는 다른 방식으로 공기를 보내므로 구조가 똑같지는 않습니다. 하지만 두 계통 모두 폐의 주요 통로에서 한 방향 기류가 확인되어, 먼 공통 조상의 호흡 진화를 이해하는 단서가 됩니다.",
        "reference": "근거 08 · Farmer, *Anatomical Record* (2015)",
        "refRange": "새와 현생 악어류의 단방향 기류 비교"
      },
      "simpleDesc": "수억 년 동안 거의 변하지 않은 완벽한 수중 매복 포식자.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel12.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/12.webp",
      "iconDark": "Asset/2. Main/icon_dark/12_dark.webp",
      "scienceStory": "악어는 물속에서 눈과 콧구멍만 내놓고 숨을 쉴 수 있는 두개골 구조와 수중 역학에 최적화된 꼬리를 유지해 왔습니다.",
      "sourceCode": "R12",
      "referenceList": [
        {
          "code": "R12-01",
          "text": "악어류의 형태 진화와 생태적 다양성"
        },
        {
          "code": "R12-02",
          "text": "악어류의 진화와 형태적 보수성"
        },
        {
          "code": "R12-03",
          "text": "파충류의 학습과 인지능력"
        },
        {
          "code": "R12-04",
          "text": "파충류의 학습능력에 대한 연구 동향"
        },
        {
          "code": "R12-05",
          "text": "파충류의 인지능력에 대한 기존 관점 재검토"
        },
        {
          "code": "R12-06",
          "text": "나일악어의 폐와 단방향성 기류"
        },
        {
          "code": "R12-07",
          "text": "악어와 조류의 폐 비교 및 단방향성 기류의 진화"
        },
        {
          "code": "R12-08",
          "text": "누의 이동과 나일악어의 포식"
        },
        {
          "code": "R12-09",
          "text": "누의 강 도하와 나일악어"
        }
      ],
      "assetList": [
        {
          "code": "A12-01",
          "text": "https://skfb.ly/pAot9"
        }
      ],
      "embedHtml": "<iframe title=\"악어 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/d87d75c454554ca78ac582c6a130e7cb/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C12.webp",
        "visualGuide": "소베크 악어상 (Statuette of the crocodile Sobek)",
        "story": "5~6세기 인도의 강가 여신상 아래에는 악어를 닮은 상상동물 마카라가 표현되어 강의 힘과 풍요를 상징합니다. 이집트의 소베크 신앙에서도 악어는 두려움과 생명의 물을 함께 품은 존재로 여겨졌습니다. 백제금동대향로에도 악어로 해석되는 파충류가 등장하는데, 이는 먼 지역의 생물에 대한 지식과 이야기가 백제까지 전해졌을 가능성을 보여줍니다. 다만 이들을 직접 연결하기보다, 서로 다른 문화가 물의 강한 힘을 현실의 동물과 신화적 존재를 통해 각기 다르게 형상화했다는 점에 주목할 수 있습니다.",
        "artifacts": [
          {
            "title": "Statuette of the crocodile Sobek",
            "museum": "Museo Egizio",
            "url": "https://collezioni.museoegizio.it/en-GB/material/Cat_934/"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 13,
      "code": "13",
      "name": "물고기",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_13.webp",
        "location": "연꽃형 몸체의 연꽃잎과 꽃잎 사이에 여러 마리가 표현되어 있습니다.",
        "appearance": "물고기다운 몸통과 꼬리지느러미를 가진 모습부터 상상적인 형태까지 다양하게 나타납니다."
      },
      "layer": "water",
      "layerName": "연꽃과 물가",
      "layerCoords": {
        "x": 36,
        "y": 66
      },
      "panelTheme": "유선형 체형과 아가미 호흡의 진화",
      "quizData": {
        "didYouKnowTitle": "물고기 조상의 구조가 우리의 턱과 귀에 남아 있다",
        "didYouKnowDesc": "척추동물 조상의 아가미 활 구조는 진화 과정에서 새로운 역할을 얻었습니다. 앞쪽 구조는 턱을 이루고, 일부 뼈는 변화해 포유류 가운데귀의 작은 뼈가 되었습니다.",
        "question": "우리의 턱과 가운데귀 뼈 일부는 물고기 조상의 아가미활과 이어지는 진화의 흔적이다?",
        "answer": "O",
        "explanation": "진화는 기존 구조를 없애기만 하는 것이 아니라 형태와 기능을 바꾸어 새 역할에 활용합니다. 포유류의 턱과 가운데귀 뼈에는 척추동물 아가미궁 구조의 오랜 역사가 남아 있습니다.",
        "reference": "근거 09 · Woronowicz & Schneider, *Developmental Biology* (2019)",
        "refRange": "물고기 턱·포유류 턱과 가운데귀 뼈의 진화"
      },
      "simpleDesc": "물살을 가르며 생명의 기원인 수중 세계를 유영하는 지느러미의 개척자.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel13.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/13.webp",
      "iconDark": "Asset/2. Main/icon_dark/13_dark.webp",
      "scienceStory": "물고기의 지느러미 속 방사골 구조는 훗날 육상으로 올라온 모든 사지동물의 팔다리 뼈로 진화하는 기원이 되었습니다.",
      "sourceCode": "R13",
      "referenceList": [
        {
          "code": "R13-01",
          "text": "틱타알릭의 가슴지느러미와 사지의 기원"
        },
        {
          "code": "R13-02",
          "text": "물고기 턱과 인두궁의 진화"
        },
        {
          "code": "R13-03",
          "text": "척추동물 턱의 진화"
        },
        {
          "code": "R13-04",
          "text": "아가미활과 턱·가운데귀의 진화"
        },
        {
          "code": "R13-05",
          "text": "『패자의 생명사』"
        }
      ],
      "assetList": [
        {
          "code": "A13-01",
          "text": "[https://skfb.ly/oEuLR](https://skfb.ly/oEuLR)"
        }
      ],
      "embedHtml": "<iframe title=\"물고기 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/162ba6f0282c453789c77a4fa2f84e6e/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C13.webp",
        "visualGuide": "주형 어망추 (풍납토성 출토)",
        "story": "풍납토성에서 출토된 배 모양의 주형 어망추는 그물에 매달아 사용하던 백제의 어로 도구입니다. 이는 물고기가 단순한 상징이 아니라 백제인의 식량과 생업을 지탱한 현실의 자원이었음을 보여줍니다. 강과 바다는 사람과 물자, 정보가 오가는 통로이기도 했습니다. 백제금동대향로의 물고기는 이러한 현실의 물세계가 이상세계로 확장된 모습으로 볼 수 있습니다. 특정 어종이나 의미를 단정하기보다, 백제인의 실제 어로생활과 풍요와 생명을 품은 상징적 물세계를 함께 살펴볼 수 있습니다.",
        "artifacts": [
          {
            "title": "주형 어망추",
            "museum": "한성백제박물관",
            "url": "https://baekjemuseum.seoul.go.kr/module/index.jsp?boardid=a&cpage=26&mmode=content&mpid=SBM0301000000&pid=6682&s_que=&strsearch="
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 14,
      "code": "14",
      "name": "물범",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_14.webp",
        "location": "연꽃형 몸체에 표현된 물·물가와 관련된 동물 가운데 하나입니다.",
        "appearance": "둥글고 유선형의 몸을 가진 수생동물처럼 보여 물범과 비슷한 동물로 해석되기도 합니다."
      },
      "layer": "water",
      "layerName": "연꽃과 물가",
      "layerCoords": {
        "x": 52,
        "y": 78
      },
      "panelTheme": "유선형 몸매와 극저온 잠수 생리학",
      "quizData": {
        "didYouKnowTitle": "귀와 걸음걸이를 보면 정체가 보인다",
        "didYouKnowDesc": "참물범류는 겉으로 드러난 귓바퀴가 없고 육지에서 배를 끌듯 움직입니다. 반면 물개와 바다사자는 귓바퀴가 있고 뒷지느러미를 몸 아래로 돌려 육지에서 이동할 수 있습니다.",
        "question": "강치·고래·바다소는 가까운 친척이라 몸이 비슷하다?",
        "answer": "X",
        "explanation": "이들은 서로 다른 포유류 계통에서 각각 물속 생활에 적응했습니다. 물의 저항을 줄이는 유선형 몸과 헤엄용 팔다리가 비슷해진 것은 같은 환경에서 나타난 수렴 진화입니다.",
        "reference": "근거 10 · Foote et al., *Nature Genetics* (2015)",
        "refRange": "기각류·고래·바다소의 독립적 해양 적응"
      },
      "simpleDesc": "육지에서 바다로 돌아가 매끄러운 몸으로 차가운 파도를 가르는 기각류.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel14.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/14.webp",
      "iconDark": "Asset/2. Main/icon_dark/14_dark.webp",
      "scienceStory": "물범은 육상 식육목 조상에서 갈라져 나와 체온 유지를 위한 두꺼운 피하지방과 지느러미형 사지를 갖추는 수렴진화를 이룩했습니다.",
      "sourceCode": "R14",
      "referenceList": [
        {
          "code": "R14-01",
          "text": "물범의 수렴진화와 수중 적응"
        },
        {
          "code": "R14-02",
          "text": "기각류의 형태와 수영 방식 비교"
        },
        {
          "code": "R14-03",
          "text": "물범과 물개·바다사자의 수영 방식과 수렴"
        },
        {
          "code": "R14-04",
          "text": "물범과 물개·바다사자의 육상 이동 차이"
        },
        {
          "code": "R14-05",
          "text": "Zalophus japonicus*의 분류와 명명 역사"
        },
        {
          "code": "R14-06",
          "text": "Zalophus japonicus*의 분류·기준산지·역사적 분포"
        }
      ],
      "assetList": [
        {
          "code": "A14-01",
          "text": "https://skfb.ly/6SPy7"
        }
      ],
      "embedHtml": "<iframe title=\"물범 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/38dc4e92f17e444597274bff6be913c2/embed?autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C14.webp",
        "visualGuide": "강치 뼈 / 동해 독도 강치의 역사",
        "story": "백제금동대향로에는 물범으로 해석되는 해양동물이 표현되어 있습니다. 물과 육지를 오가는 물범의 모습은 백제인이 바다의 생명까지 이상세계의 구성원으로 바라보았음을 보여줍니다. 이와 함께 떠올릴 수 있는 동물이 과거 동해와 독도 일대에 살았던 강치입니다. 강치는 오랫동안 우리 바다와 함께했지만 인간의 무분별한 포획으로 결국 사라졌습니다. 향로 속 물범과 강치의 역사를 함께 바라보면, 바다의 동물이 인간의 삶과 상상 속에 어떻게 자리해 왔는지, 그리고 자연과의 공존이 왜 중요한지를 생각하게 합니다.",
        "artifacts": [
          {
            "title": "독도 강치 유적 및 생태자료",
            "museum": "동북아역사재단 독도연구소",
            "url": "https://contents.nahf.or.kr/dokdo/item/level.do?levelId=iscac.d_0003_0020_0020"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 15,
      "code": "15",
      "name": "수달",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_15.webp",
        "location": "연꽃형 몸체의 상단 연꽃잎 부근에 자리하고 있습니다.",
        "appearance": "네발짐승이 물고기를 입에 물고 이동하는 듯한 모습으로 표현되어 수달로 해석되기도 합니다."
      },
      "layer": "water",
      "layerName": "연꽃과 물가",
      "layerCoords": {
        "x": 68,
        "y": 64
      },
      "panelTheme": "치밀한 방수 모피와 맑은 하천의 지표종",
      "quizData": {
        "didYouKnowTitle": "수염으로 물속을 읽는 사냥꾼",
        "didYouKnowDesc": "북아메리카수달은 길고 뻣뻣하며 매우 민감한 얼굴 수염으로 물속 먹이를 찾고 붙잡는 데 도움을 받습니다. 물속에서는 귀와 콧구멍을 닫고, 촘촘한 속털과 거친 겉털로 물을 튕겨 냅니다.",
        "question": "북아메리카수달은 물속에서 먹이를 찾을 때 눈에만 의존한다?",
        "answer": "X",
        "explanation": "북아메리카수달은 물속에서 눈뿐 아니라 길고 민감한 얼굴 수염도 이용합니다. 이 수염은 먹이의 위치를 알아내고 붙잡는 데 도움을 줍니다. 물속에서는 귀와 콧구멍을 닫을 수도 있습니다.",
        "reference": "근거 19 · \\[Smithsonian’s National Zoo, North American River Otter\\](https://nationalzoo.si.edu/animals/north-american-river-otter)",
        "refRange": "북아메리카수달의 얼굴 수염·수중 감각·귀와 콧구멍"
      },
      "simpleDesc": "물갈퀴와 빽빽한 털로 하천 생태계를 자유자재로 누비는 수중 사냥꾼.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel15.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/15.webp",
      "iconDark": "Asset/2. Main/icon_dark/15_dark.webp",
      "scienceStory": "수달의 털은 1제곱센티미터당 수만 가닥의 치밀한 방수 구조를 이루어 물이 피부에 직접 닿지 않도록 공기층을 가두어 체온을 보호합니다.",
      "sourceCode": "R15",
      "referenceList": [
        {
          "code": "R15-01",
          "text": "수달류의 분류와 계통"
        },
        {
          "code": "R15-02",
          "text": "해달의 분류 및 진화"
        },
        {
          "code": "R15-03",
          "text": "수달의 털과 수중생활·체온 유지"
        },
        {
          "code": "R15-04",
          "text": "해달의 털과 단열"
        },
        {
          "code": "R15-05",
          "text": "해달의 수중 시각"
        },
        {
          "code": "R15-06",
          "text": "해달의 감각털 및 수중 감각"
        },
        {
          "code": "R15-07",
          "text": "해양 포유류의 기름 오염과 체온 조절"
        }
      ],
      "assetList": [
        {
          "code": "A15-01",
          "text": "https://sketchfab.com/models/57b88c7e30c74b588f28102177849397"
        }
      ],
      "embedHtml": "<div class=\"sketchfab-embed-wrapper\"> <iframe title=\"Model 96A - North American Otter\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/57b88c7e30c74b588f28102177849397/embed?autospin=1&autostart=1&ui_infos=0&dnt=1\"> </iframe> </div>",
      "panelImg3": null,
      "culturalData": null
    },
    {
      "id": 16,
      "code": "16",
      "name": "백로 / 왜가리 / 두루미",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_16.webp",
        "location": "연꽃형 몸체의 상단 연꽃잎과 그 사이에 자리하고 있습니다.",
        "appearance": "긴 다리와 목, 뾰족한 부리를 가진 물새의 모습으로 표현되어 있습니다."
      },
      "layer": "water",
      "layerName": "연꽃과 물가",
      "layerCoords": {
        "x": 85,
        "y": 48
      },
      "panelTheme": "긴 다리와 찰나의 스피어 피싱(Spear-Fishing)",
      "quizData": {
        "didYouKnowTitle": "깃털은 방수복이자 보온재",
        "didYouKnowDesc": "백로처럼 물가에서 생활하는 새에게 가지런한 깃털은 물을 튕기고 체온을 지키는 장비입니다. 기름 오염으로 깃털이 엉키면 이 기능이 크게 약해집니다.",
        "question": "‘백로’는 하나의 종 이름이다?",
        "answer": "X",
        "explanation": "‘백로’는 흰 깃털을 가진 여러 왜가리류를 묶어 부르는 이름입니다. 쇠백로·중백로·대백로처럼 서로 다른 종이 포함되므로, 한 종의 고유 이름으로만 보면 안 됩니다.",
        "reference": "근거 11 · 국립생물자원관 국가생물종지식정보시스템",
        "refRange": "왜가리과 백로류의 종 분류"
      },
      "simpleDesc": "물가에 고요히 서 있다가 벼락같이 물고기를 낚아채는 섭금류.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel16.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/16.webp",
      "iconDark": "Asset/2. Main/icon_dark/16_dark.webp",
      "scienceStory": "왜가리과의 S자형 목 경추 구조는 마치 용수철처럼 에너지를 압축했다가 순간적으로 부리를 발사하는 탄성 투사 메커니즘을 자랑합니다.",
      "sourceCode": "R16",
      "referenceList": [
        {
          "code": "R16-01",
          "text": "백로·왜가리의 분류와 명칭"
        },
        {
          "code": "R16-02",
          "text": "백로가 왜가리과 내 여러 새를 가리키는 명칭이라는 근거"
        },
        {
          "code": "R16-03",
          "text": "색채 범주화와 무지개"
        },
        {
          "code": "R16-04",
          "text": "색채의 연속성과 인간의 범주화"
        }
      ],
      "assetList": [
        {
          "code": "A16-01",
          "text": "https://skfb.ly/pvzLN"
        }
      ],
      "embedHtml": "<iframe title=\"백로 / 왜가리 / 두루미 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/95a74fb41f1a46f0acec81a2d6c85093/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": null,
        "visualGuide": "대한민국 500원 주화 (학 도상 3D)",
        "embedHtml": "<div class=\"sketchfab-embed-wrapper\"> <iframe title=\"500 Korean won coin\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/2fa97e66fcb4455ca87b4be8a2e602f7/embed?autospin=1&autostart=1&transparent=1&dnt=1\"> </iframe> </div>",
        "story": "백제금동대향로에는 백로과 또는 두루미과로 보이는 새가 표현되어 있으며, 흔히 ‘학’으로 해석됩니다. 동아시아에서 학은 오랜 세월 장수와 고결함, 길상을 상징해 온 새였습니다. 이러한 이미지는 오늘날 대한민국의 500원 주화에서도 이어집니다. 주화에 새겨진 학은 전통적인 상징성을 현대적으로 계승하면서, 힘차게 날아오르는 모습으로 대한민국의 발전과 도약을 나타냅니다. 향로 속 학과 500원 주화를 함께 살펴보면, 한 동물에 담긴 상징이 시대에 따라 새로운 의미를 더하며 이어져 왔음을 알 수 있습니다.",
        "artifacts": [
          {
            "title": "500 Korean won coin (3D)",
            "museum": "Sketchfab (https://skfb.ly/oFvsp)",
            "url": "https://skfb.ly/oFvsp"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 17,
      "code": "17",
      "name": "달리는 새",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_17.webp",
        "location": "연꽃형 몸체 상단의 연꽃잎에 표현된 새 가운데 하나입니다.",
        "appearance": "긴 다리를 뒤로 뻗고 몸을 앞으로 움직이는 듯해 달리거나 날아오르는 순간처럼 보입니다."
      },
      "layer": "land",
      "layerName": "삼신산",
      "layerCoords": {
        "x": 84,
        "y": 54
      },
      "panelTheme": "비행을 포기하고 질주를 선택한 다리",
      "quizData": {
        "didYouKnowTitle": "날지 못하는 새의 역사는 한 갈래가 아니다",
        "didYouKnowDesc": "타조·레아·에뮤·화식조·키위는 날지 못하는 큰 새라는 공통점이 있습니다. 그러나 유전자 연구는 이들의 공통 조상 한 번만 비행 능력을 잃은 것이 아니라, 여러 계통에서 비행 능력이 각각 사라졌을 가능성을 보여 줍니다. 비슷한 몸의 특징이 서로 다른 계통에서 되풀이해 나타난 사례입니다.",
        "question": "타조·레아·에뮤 같은 큰 날지 못하는 새는 모두 비행 능력을 잃은 하나의 공통 조상에서 갈라졌다?",
        "answer": "X",
        "explanation": "20개 핵 유전자를 비교한 연구에서는 날 수 있는 티나무가 주금류 계통 안에 놓였습니다. 이 결과를 가장 잘 설명하는 가설은 타조·레아·호주 지역의 주금류 계통에서 비행 능력이 적어도 세 번 독립적으로 사라졌다는 것입니다. 비슷한 달리기형 몸이 반드시 한 번만 생겼다는 뜻은 아닙니다.",
        "reference": "근거 20 · \\[Harshman et al., *PNAS* (2008)\\](https://doi.org/10.1073/pnas.0803242105)",
        "refRange": "20개 핵 유전자·현생 주금류와 티나무·비행 능력의 독립적 상실"
      },
      "simpleDesc": "날개 대신 강력한 다리 근육을 발달시켜 대지를 질주하는 주조류.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-1.webp",
      "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-2.webp",
      "icon": "Asset/2. Main/icon/17.webp",
      "iconDark": "Asset/2. Main/icon_dark/17_dark.webp",
      "scienceStory": "달리는 새는 무거운 날개 비행 근육을 줄이고 다리 힘줄에 에너지를 저장하는 탄성 주행 구조를 발전시켜 장거리 질주 효율을 극대화했습니다.",
      "sourceCode": "R17",
      "referenceList": [
        {
          "code": "R17-01",
          "text": "날지 않는 새의 진화와 비행 능력 상실"
        },
        {
          "code": "R17-02",
          "text": "새·박쥐·익룡의 날개와 비행 형태의 진화"
        },
        {
          "code": "R17-03",
          "text": "새·박쥐·익룡의 비행과 수렴진화"
        },
        {
          "code": "R17-04",
          "text": "수렴진화(Convergent Evolution)의 개념"
        },
        {
          "code": "R17-05",
          "text": "진화적 상쇄(Evolutionary Trade-off)"
        },
        {
          "code": "R17-06",
          "text": "굴절적응(Exaptation)의 개념"
        },
        {
          "code": "R17-07",
          "text": "깃털과 비행 이전 기능에 대한 진화적 논의"
        },
        {
          "code": "R17-08",
          "text": "환원불가능한 복잡성과 진화적 반론"
        }
      ],
      "assetList": [
        {
          "code": "A17-01",
          "text": "https://skfb.ly/onu6x"
        }
      ],
      "embedHtml": "<iframe title=\"달리는 새 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/b61466de53d24988835bb755dc2f73da/embed?autospin=1&autostart=1&transparent=1&ui_infos=0&dnt=1\"></iframe>",
      "panelImg3": "Asset/3. Exhibition/N_Panel/webp/N_Panel17-3.webp",
      "culturalData": null
    },
    {
      "id": 18,
      "code": "18",
      "name": "봉황",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_18.webp",
        "location": "향로의 가장 높은 곳인 산악형 뚜껑 정상에 자리합니다.",
        "appearance": "날개와 긴 꼬리를 펼치고 턱 아래에 구슬을 품은 큰 새로, 일반적으로 봉황으로 보지만 금시조로 해석하는 견해도 있습니다."
      },
      "layer": "celestial",
      "layerName": "천상 (꼭대기)",
      "layerCoords": {
        "x": 50,
        "y": 46
      },
      "panelTheme": "천상의 이상과 백제 왕실의 신령한 상징",
      "quizData": {
        "didYouKnowTitle": "봉황, 금시조로도 해석될 수 있다",
        "didYouKnowDesc": "향로 정상부의 새는 국립부여박물관의 공식 설명에서 봉황으로 불립니다. 다만 일부 도상 해석에서는 금시조와 연결할 가능성도 제시됩니다.",
        "question": "뱀과 새를 한 계통으로 묶을 수 있을까요?",
        "answer": "O",
        "explanation": "뱀과 새는 생김새가 아주 다르지만, 공통 조상에서 갈라져 나온 하나의 계통에 포함됩니다. 이 계통을 석형류(Sauropsida)라고 합니다.",
        "reference": "근거 15 · Brusatte et al., *Current Biology* (2015)",
        "refRange": "조류의 공룡 기원과 파충류 계통"
      },
      "simpleDesc": "향로의 정상에서 세상을 굽어살피며 태평성대를 알리는 신조.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel18.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/18.webp",
      "iconDark": "Asset/2. Main/icon_dark/18_dark.webp",
      "scienceStory": "봉황은 닭의 며느리발톱, 공작의 깃털, 맹금류의 부리 등 현실 조류의 강력하고 아름다운 형질들이 결합되어 탄생한 문화적 이상향의 결정체입니다.",
      "sourceCode": "R18",
      "referenceList": [
        {
          "code": "R18-01",
          "text": "며느리발톱(spur)의 형태와 기능"
        },
        {
          "code": "R18-02",
          "text": "새와 뱀의 상징적 대칭"
        },
        {
          "code": "R18-03",
          "text": "가루다(Garuda)와 나가(Nāga)의 신화적 관계"
        },
        {
          "code": "R18-04",
          "text": "가루다와 나가의 상징적 대립"
        },
        {
          "code": "R18-05",
          "text": "새와 뱀의 계통적 관계"
        }
      ],
      "assetList": [
        {
          "code": "A18-01",
          "text": "https://skfb.ly/6TWAv"
        }
      ],
      "embedHtml": "<iframe title=\"봉황 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/778006bf99114fde8898b61104bc43d4/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C18.webp",
        "visualGuide": "부여 외리 봉황무늬 벽돌 (국립중앙박물관 3D)",
        "story": "부여 외리의 봉황무늬 벽돌에는 긴 꼬리와 화려한 깃을 지닌 상서로운 새가 표현되어 있습니다. 봉황은 태평성대와 왕권의 정당성, 조화로운 세계를 상징하는 존재로, 현실의 여러 새 특징을 결합해 만들어진 이상적인 동물입니다. 백제금동대향로 정상의 새 역시 일반적으로 봉황으로 해석되며, 연꽃과 산악세계 위에서 향로의 우주를 완성합니다. 두 유산을 함께 보면 백제가 상서로운 새의 이미지를 건축과 공예에 반복해 활용하며 이상적 세계와 권위, 길상의 의미를 표현했음을 알 수 있습니다.",
        "artifacts": [
          {
            "title": "부여 외리 봉황무늬 벽돌",
            "museum": "국립중앙박물관",
            "url": "https://www.museum.go.kr/MUSEUM/contents/M0505000000.do?relicId=179706&schM=view&searchId=search"
          }
        ]
      },
      "panelImg3": null
    },
    {
      "id": 19,
      "code": "19",
      "name": "용",
      "iconography": {
        "img": "Asset/3. Exhibition/real_img/real_19.webp",
        "location": "향로의 가장 아래쪽 받침 전체가 한 마리의 용으로 이루어져 있습니다.",
        "appearance": "입으로 연꽃 모양 몸체를 받치고 고개를 치켜든 채 몸과 꼬리를 힘차게 휘감은 역동적인 자세입니다."
      },
      "layer": "sea",
      "layerName": "바다",
      "layerCoords": {
        "x": 50,
        "y": 58
      },
      "panelTheme": "심해를 솟구쳐 향로를 떠받치는 불멸의 생명력",
      "quizData": {
        "didYouKnowTitle": "용이 연꽃 세계를 받치다",
        "didYouKnowDesc": "백제금동대향로에서는 용 한 마리가 연꽃 봉오리 형태의 몸체를 아래에서 받칩니다. 용은 장식이 아니라 향로 세계의 아래쪽을 구성합니다.",
        "question": "사람은 흐릿한 그림에서도 뱀을 다른 동물보다 더 잘 찾아낼 수 있을까요?",
        "answer": "O",
        "explanation": "한 실험에서 성인 참가자들은 흐릿하게 가린 뱀, 새, 고양이, 물고기 그림을 보고 동물을 맞췄습니다. 뱀 그림은 다른 동물 그림보다 더 높은 정답률을 보였습니다. 이런 결과는 사람이 뱀처럼 위험할 수 있는 동물을 빠르게 알아차리는 능력을 가지고 있을 가능성을 보여줍니다. 이를 설명하는 가설 가운데 하나가 뱀탐지이론(snake detection theory)입니다.",
        "reference": "근거 16 · Kawai & He, *PLOS ONE* (2016), doi:10.1371/journal.pone.0164342",
        "refRange": "성인 20명·노이즈로 흐린 동물 그림"
      },
      "simpleDesc": "용트림하는 역동적인 몸체로 지상과 천상을 연결하는 받침대의 수호자.",
      "assetType": "sketchfab",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel19.webp",
      "panelImg2": null,
      "icon": "Asset/2. Main/icon/19.webp",
      "iconDark": "Asset/2. Main/icon_dark/19_dark.webp",
      "scienceStory": "백제금동대향로의 용은 뱀의 몸통, 악어의 턱, 물고기의 비늘 등 수생 및 파충류 포식자들의 원초적 힘에 대한 인류의 공포와 경외심이 투영된 상징입니다.",
      "sourceCode": "R19",
      "referenceList": [
        {
          "code": "R19-01",
          "text": "뱀탐지 이론과 위협 자극에 대한 주의 편향"
        },
        {
          "code": "R19-02",
          "text": "뱀에 대한 선택적 주의와 탐지"
        },
        {
          "code": "R19-03",
          "text": "위협 자극에 대한 준비성(Preparedness)과 공포 학습"
        },
        {
          "code": "R19-04",
          "text": "뱀에 대한 위협 자극의 선택적 탐지"
        },
        {
          "code": "R19-05",
          "text": "동아시아 용의 신화와 상징"
        },
        {
          "code": "R19-06",
          "text": "용문(龍門)과 잉어의 용 승격 설화"
        }
      ],
      "assetList": [
        {
          "code": "A19-01",
          "text": "https://skfb.ly/pyzur"
        }
      ],
      "embedHtml": "<iframe title=\"용 3D Model\" frameborder=\"0\" allowfullscreen mozallowfullscreen=\"true\" webkitallowfullscreen=\"true\" allow=\"autoplay; fullscreen; xr-spatial-tracking\" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share src=\"https://sketchfab.com/models/d942a0d167594169b3f037f562458d38/embed?autospin=1&autostart=1&transparent=1&dnt=1\"></iframe>",
      "culturalData": {
        "image": "Asset/3. Exhibition/C_data/webp/C19.webp",
        "visualGuide": "부여 외리 용무늬 벽돌 (국립중앙박물관 3D)",
        "story": "부여 외리의 용무늬 벽돌에는 구름과 물을 움직이는 상상동물인 용이 역동적으로 표현되어 있습니다. 동아시아에서 용은 비와 물을 다스려 생명과 농경을 돕는 존재이자 왕권과 신성한 질서를 상징했습니다. 백제금동대향로의 용은 아래에서 향로의 몸체를 떠받치며 연꽃과 산악세계, 봉황으로 이어지는 전체 세계의 기반을 이룹니다. 두 유산을 함께 보면 용이 단순한 장식이 아니라 물과 하늘, 땅을 연결하고 세계의 질서를 유지하는 우주적 존재로 표현되었음을 알 수 있습니다.",
        "artifacts": [
          {
            "title": "부여 외리 용무늬 벽돌",
            "museum": "국립중앙박물관",
            "url": "https://www.museum.go.kr/MUSEUM/contents/M0505000000.do?relicId=196874&schM=view&searchId=search"
          }
        ]
      },
      "panelImg3": null
    }
  ]
};

window.EXHIBITION_DATA = EXHIBITION_DATA;
