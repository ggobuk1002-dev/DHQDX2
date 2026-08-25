/**
 * 금동대향로 가상웹전시 종합 데이터셋 (19종 표준화)
 * Source of Truth: MD문서/con_Mapping.md, main.md, references.md
 */
const EXHIBITION_DATA = {
  "metadata": {
    "title": "금동대향로 자연사박물관",
    "subtitle": "자세히 보아야 예쁘다. 너도 그렇다.",
    "team": "향로 없는 향로팀",
    "theme": "금동대향로로 본 인류사",
    "sourceInfo": "소장처: 국립부여박물관 | 국가유산포털 | 한국학중앙연구원",
    "description": "백제금동대향로는 1993년 부여 능산리 절터에서 기적처럼 온전한 모습으로 출토되었습니다. 뚜껑에는 첩첩산중과 악사·동물들이, 몸체에는 연꽃과 수중 생물들이, 받침에는 용이 용틀임하고 있습니다. 본 전시는 문화유산 속에 담긴 생명과 자연을 매개로 인류와 생태계의 역사를 함께 탐색합니다."
  },
  "layers": [
    {
      "id": "intro",
      "name": "향로 전체",
      "title": "하나의 유물을 마주하다",
      "desc": "높이 61.8cm, 무게 11.8kg의 웅장한 백제 금속공예의 정수. 금동대향로가 품은 수많은 세계로 안내합니다.",
      "bg": null,
      "cameraPos": {
        "x": 0,
        "y": 0.1,
        "z": 2.3
      },
      "target": {
        "x": 0,
        "y": 0,
        "z": 0
      },
      "align": "center"
    },
    {
      "id": "celestial",
      "name": "1. 천상 (봉황)",
      "category": "sky",
      "title": "하늘을 품은 날갯짓, 봉황",
      "desc": "향로 정상에서 목과 부리로 여의주를 품고 날개를 활짝 편 봉황. 백제인이 꿈꾸었던 가장 높은 이상세계의 시작입니다.",
      "bg": "Asset/2. Main/bg/bg_celestial.webp",
      "cameraPos": {
        "x": -0.35,
        "y": 0.75,
        "z": 1.1
      },
      "target": {
        "x": 0,
        "y": 0.55,
        "z": 0
      },
      "align": "left"
    },
    {
      "id": "sky",
      "name": "2. 하늘 (신선 세계)",
      "category": "sky",
      "title": "음악이 흐르는 신선의 산",
      "desc": "피리, 소비파, 현금, 북을 연주하는 5인의 악사와 하늘을 노니는 선인들. 자연과 인간이 조화를 이루는 영적 공간입니다.",
      "bg": "Asset/2. Main/bg/bg_sky.webp",
      "cameraPos": {
        "x": 0.4,
        "y": 0.45,
        "z": 1.0
      },
      "target": {
        "x": 0,
        "y": 0.35,
        "z": 0
      },
      "align": "right"
    },
    {
      "id": "land",
      "name": "3. 육지 (산악 세계)",
      "category": "land",
      "title": "첩첩산중 생명의 터전",
      "desc": "23개의 겹겹이 솟은 산봉우리 사이에 호랑이, 사슴, 멧돼지, 말 등 11종의 동물들과 기마수렵상이 살아 숨 쉽니다.",
      "bg": "Asset/2. Main/bg/bg_land.webp",
      "cameraPos": {
        "x": -0.45,
        "y": 0.2,
        "z": 1.2
      },
      "target": {
        "x": 0,
        "y": 0.15,
        "z": 0
      },
      "align": "left"
    },
    {
      "id": "water",
      "name": "4. 물가 (연꽃 몸체)",
      "category": "water",
      "title": "피어나는 연꽃과 수중 생태",
      "desc": "활짝 피어난 3단의 연꽃잎 사이로 악어, 물고기, 수달, 물범, 백로 등 6종의 동물들이 노니는 생명의 물가가 펼쳐집니다.",
      "bg": "Asset/2. Main/bg/bg_waterside.webp",
      "cameraPos": {
        "x": 0.45,
        "y": -0.15,
        "z": 1.1
      },
      "target": {
        "x": 0,
        "y": -0.15,
        "z": 0
      },
      "align": "right"
    },
    {
      "id": "sea",
      "name": "5. 바다 (용 받침)",
      "category": "sea",
      "title": "기운을 뿜어 올리는 용",
      "desc": "한 다리를 치켜들고 물을 박차며 하늘로 솟구치듯 연꽃 몸체를 입으로 떠받치고 있는 용. 바다를 다스리는 신이자 백제의 역동적 기운을 상징합니다.",
      "bg": "Asset/2. Main/bg/bg_sea.webp",
      "cameraPos": {
        "x": 0,
        "y": -0.45,
        "z": 1.2
      },
      "target": {
        "x": 0,
        "y": -0.4,
        "z": 0
      },
      "align": "center"
    }
  ],
  "animals": [
    {
      "id": 1,
      "code": "01",
      "name": "말",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "말의 이동과 발가락의 진화",
      "simpleDesc": "단단한 땅을 빠르게 달리는 인간의 오랜 동반자이자 기마문화의 상징.",
      "glb": "Asset/3. Exhibition/glb/01.glb",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-1.webp",
      "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel01-2.webp",
      "icon": "Asset/2. Main/icon/01.webp",
      "iconDark": "Asset/2. Main/icon_dark/01_dark.webp",
      "features": [
        "세 굽에서 하나의 외발굽으로 진화한 발가락",
        "초원 환경에 적응한 길고 강력한 다리 구조",
        "등자와 편자의 발명을 통해 확장된 인류 이동의 역사"
      ],
      "scienceStory": "말의 조상인 에오히푸스는 네 개에서 세 개의 발가락을 가졌으나, 초원 환경이 확장되면서 단단한 지면을 빠르게 달리기 위해 가운뎃발가락 하나만 남은 외발굽(Ungula)으로 진화했습니다. 이는 기회주의적 영양 섭취 및 인류의 기마 수렵 문화와 깊게 연계됩니다.",
      "sourceCode": "REF_01_HORSE",
      "sourceText": "출처: 국립부여박물관 소장 백제금동대향로 도판 | 한국자연사학회 포유류 진화 계통 연구",
      "mapCoords": {
        "x": 22.5,
        "y": 48.0
      }
    },
    {
      "id": 2,
      "code": "02",
      "name": "호랑이",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "맹수의 위용과 먹이사슬의 정점",
      "simpleDesc": "백제의 깊은 산악을 다스리는 최상위 포식자이자 벽사의 상징.",
      "glb": "Asset/3. Exhibition/glb/02.glb",
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel02.webp",
      "icon": "Asset/2. Main/icon/02.webp",
      "iconDark": "Asset/2. Main/icon_dark/02_dark.webp",
      "features": [
        "산봉우리 사이에서 먹이를 응시하는 역동적인 자세",
        "날카로운 송곳니와 근육질의 앞다리 표현",
        "백제 산악 생태계의 최고 정점 포식자"
      ],
      "scienceStory": "호랑이는 고양이과 최상위 포식자로서 강력한 악력과 신축성 있는 척추 구조를 통해 산악 지형을 은밀하게 이동하며 사냥합니다. 백제 장인은 향로 뚜껑의 험준한 산악 지형 속에 호랑이를 배치하여 생태계의 긴장감과 입체감을 완성했습니다.",
      "sourceCode": "REF_02_TIGER",
      "sourceText": "출처: 국립부여박물관 도록 | 한반도 포유류 생태 도감",
      "mapCoords": {
        "x": 28.0,
        "y": 42.0
      }
    },
    {
      "id": 3,
      "code": "03",
      "name": "사자",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "서역에서 전래된 백수의 왕",
      "simpleDesc": "실크로드를 건너 백제에 전해진 위엄과 불교적 수호의 상징.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel03.webp",
      "icon": "Asset/2. Main/icon/03.webp",
      "iconDark": "Asset/2. Main/icon_dark/03_dark.webp",
      "features": [
        "풍성한 갈기와 웅크린 채 포효하는 듯한 조형미",
        "서역과 중국을 거쳐 백제에 수용된 외래 맹수의 이미지",
        "수호와 불교 사상을 융합한 독창적 표현"
      ],
      "scienceStory": "사자는 아프리카와 서아시아가 원산지인 맹수로, 한반도에는 서역과의 활발한 대외 교류를 통해 문화적 도상으로 전래되었습니다. 백제 금속공예가는 전해 들은 사자의 특징(갈기, 웅장한 체구)을 토대로 고유의 상상력을 더해 조형화했습니다.",
      "sourceCode": "REF_03_LION",
      "sourceText": "출처: 국립부여박물관 | 백제의 대외교류사 연구",
      "mapCoords": {
        "x": 35.5,
        "y": 45.0
      }
    },
    {
      "id": 4,
      "code": "04",
      "name": "족제비",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "날렵한 몸과 뛰어난 적응력",
      "simpleDesc": "바위틈과 굴을 자유자재로 누비는 민첩한 소형 포식자.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel04.webp",
      "icon": "Asset/2. Main/icon/04.webp",
      "iconDark": "Asset/2. Main/icon_dark/04_dark.webp",
      "features": [
        "바위와 수풀 사이를 날렵하게 지나가는 유연한 몸체",
        "작은 틈새도 파고드는 체형과 호기심 어린 시선",
        "산악 생태계의 중간 포식자로서의 생태적 역할"
      ],
      "scienceStory": "족제비과 동물은 가늘고 긴 유선형 체형과 짧은 다리를 지녀 좁은 구멍이나 바위틈에 숨은 설치류를 사냥하는 데 완벽히 적응했습니다. 향로의 산악 묘사에서도 사실적인 생태 관찰이 돋보입니다.",
      "sourceCode": "REF_04_WEASEL",
      "sourceText": "출처: 국립부여박물관 도록 | 한국 생태도감",
      "mapCoords": {
        "x": 41.0,
        "y": 50.0
      }
    },
    {
      "id": 5,
      "code": "05",
      "name": "원숭이",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "나무를 타는 지혜로운 영장류",
      "simpleDesc": "나무 위에서 도구를 다루듯 지혜롭고 영민한 산림의 거주자.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel05.webp",
      "icon": "Asset/2. Main/icon/05.webp",
      "iconDark": "Asset/2. Main/icon_dark/05_dark.webp",
      "features": [
        "나뭇가지를 쥐고 균형을 잡는 손발 구조",
        "입체적인 얼굴 표정과 영민한 눈망울",
        "산림 수관층(Canopy)을 오가는 입체적 공간 활용"
      ],
      "scienceStory": "원숭이는 맞설 수 있는 엄지손가락(대지대립성)과 뛰어난 입체 시각을 통해 복잡한 나뭇가지 사이를 3차원적으로 이동합니다. 고대 동아시아에서 원숭이는 재앙을 쫓고 지혜를 가져다주는 상징으로 여겨졌습니다.",
      "sourceCode": "REF_05_MONKEY",
      "sourceText": "출처: 국립부여박물관 | 동아시아 고대 영장류 도상사",
      "mapCoords": {
        "x": 47.0,
        "y": 38.0
      }
    },
    {
      "id": 6,
      "code": "06",
      "name": "사슴",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "우아한 뿔과 신선의 동반자",
      "simpleDesc": "신선의 세계와 장수를 상징하는 온순하고 우아한 초식동물.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel06.webp",
      "icon": "Asset/2. Main/icon/06.webp",
      "iconDark": "Asset/2. Main/icon_dark/06_dark.webp",
      "features": [
        "매년 탈락하고 새로 자라나는 가지 친 뿔(Antler)",
        "경계심을 품고 귀를 쫑긋 세운 우아한 실루엣",
        "신선과 함께 이상향을 노니는 평화로운 상징"
      ],
      "scienceStory": "사슴의 뿔은 뼈 조직으로 매년 봄 새로 자라 가을에 완성되며, 이는 생명력과 부활, 장수를 상징합니다. 짝수 발가락(우제목)을 지녀 숲속과 경사지를 안정감 있게 뛰어다닙니다.",
      "sourceCode": "REF_06_DEER",
      "sourceText": "출처: 국립부여박물관 | 한국의 척추동물학",
      "mapCoords": {
        "x": 53.0,
        "y": 46.0
      }
    },
    {
      "id": 7,
      "code": "07",
      "name": "멧돼지",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "땅을 일구는 강인한 엄니",
      "simpleDesc": "땅속 뿌리와 먹이를 찾아 파헤치는 강인한 산림의 개척자.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel07.webp",
      "icon": "Asset/2. Main/icon/07.webp",
      "iconDark": "Asset/2. Main/icon_dark/07_dark.webp",
      "features": [
        "위로 솟구친 강력한 엄니와 다부진 체구",
        "두꺼운 가죽과 목 근육의 사실적인 입체 묘사",
        "사냥꾼의 화살을 피해 돌진하는 역동적 긴장감"
      ],
      "scienceStory": "멧돼지의 엄니는 지속적으로 자라나는 송곳니로, 숲의 흙을 파헤쳐 토양을 순환시키고 식물의 발아를 돕는 핵심 생태계 엔지니어 역할을 수행합니다.",
      "sourceCode": "REF_07_BOAR",
      "sourceText": "출처: 국립부여박물관 | 한국 야생동물 생태학",
      "mapCoords": {
        "x": 59.0,
        "y": 52.0
      }
    },
    {
      "id": 8,
      "code": "08",
      "name": "코끼리",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "지상 최대의 거구와 신비로운 코",
      "simpleDesc": "남방과 서역의 상상력이 더해진 거대하고 신비로운 지혜의 동물.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel08.webp",
      "icon": "Asset/2. Main/icon/08.webp",
      "iconDark": "Asset/2. Main/icon_dark/08_dark.webp",
      "features": [
        "자유자재로 휘어지는 긴 코와 부채꼴 모양의 귀",
        "신선이 타고 있는 독특하고 신비로운 구도",
        "불교 전래와 함께 성스러운 동물로 인식된 도상"
      ],
      "scienceStory": "코끼리의 코는 4만 개 이상의 근육으로 이루어진 정밀한 감각 및 조작 기관입니다. 백제 금동대향로에는 신선이 코끼리를 타고 산길을 가는 모습이 새겨져 있어 동서 문물 교류의 흔적을 엿볼 수 있습니다.",
      "sourceCode": "REF_08_ELEPHANT",
      "sourceText": "출처: 국립부여박물관 | 백제와 인도·서역 문화교류사",
      "mapCoords": {
        "x": 65.0,
        "y": 40.0
      }
    },
    {
      "id": 9,
      "code": "09",
      "name": "이상한 부리를 가진 새",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "독특한 부리 형태와 조류의 다양성",
      "simpleDesc": "기이하게 굽은 부리로 산림 생태계의 틈새를 공략하는 신비의 새.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel09.webp",
      "icon": "Asset/2. Main/icon/09.webp",
      "iconDark": "Asset/2. Main/icon_dark/09_dark.webp",
      "features": [
        "먹이 사냥에 특화된 과장되고 독특한 부리 곡선",
        "산봉우리 바위 위에 웅크린 날카로운 눈매",
        "현실과 상상의 경계에 서 있는 조류의 묘사"
      ],
      "scienceStory": "새의 부리는 먹이의 종류와 섭식 방식에 따라 놀라울 정도로 다양하게 적응 방산(Adaptive Radiation)합니다. 향로의 독특한 부리 형태는 코뿔새(Hornbill)나 왜가리류의 관찰에서 영감을 얻었을 가능성을 시사합니다.",
      "sourceCode": "REF_09_STRANGE_BIRD",
      "sourceText": "출처: 국립부여박물관 | 조류 진화와 부리 형태학 연구",
      "mapCoords": {
        "x": 71.0,
        "y": 35.0
      }
    },
    {
      "id": 10,
      "code": "10",
      "name": "뱀을 물고 있는 야수",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "파충류와 포식자의 숙명적 대결",
      "simpleDesc": "독사를 제압하며 먹이사슬의 균형을 유지하는 용맹한 맹수.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel10.webp",
      "icon": "Asset/2. Main/icon/10.webp",
      "iconDark": "Asset/2. Main/icon_dark/10_dark.webp",
      "features": [
        "꿈틀거리는 뱀을 입에 단단히 문 긴장감 넘치는 구도",
        "포식자의 근육과 뱀의 비늘이 맞부딪히는 역동성",
        "악을 물리치고 사악한 기운을 쫓는 벽사의 의미"
      ],
      "scienceStory": "몽구스, 오소리, 맹금류 등 일부 포식자들은 독사에 대한 신경독 저항성이나 날렵한 반사신경을 진화시켜 독사를 포식합니다. 이는 자연 생태계의 개체수 조절에 필수적입니다.",
      "sourceCode": "REF_10_BEAST_SNAKE",
      "sourceText": "출처: 국립부여박물관 도록 | 동물 행동 진화학",
      "mapCoords": {
        "x": 76.5,
        "y": 48.0
      }
    },
    {
      "id": 11,
      "code": "11",
      "name": "볏을 가진 새",
      "layer": "land",
      "layerName": "육지 (산악)",
      "panelTheme": "화려한 머리 볏과 성 선택",
      "simpleDesc": "머리 위에 화려한 장식 볏을 뽐내며 영역을 지키는 숲의 새.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel11.webp",
      "icon": "Asset/2. Main/icon/11.webp",
      "iconDark": "Asset/2. Main/icon_dark/11_dark.webp",
      "features": [
        "머리 위에 높이 솟은 부채꼴 모양의 화려한 볏",
        "날개를 살짝 펴고 깃털을 가다듬는 섬세한 자세",
        "산림 수풀 속에서 눈에 띄는 화려한 도상"
      ],
      "scienceStory": "조류의 볏(Crest)은 성 선택(Sexual Selection)과 신호 전달의 핵심 장치로, 짝을 유혹하거나 경쟁자를 위협할 때 세워 크기를 과시합니다. 후투티나 댕기물떼새 등의 도상학적 기원을 가집니다.",
      "sourceCode": "REF_11_CRESTED_BIRD",
      "sourceText": "출처: 국립부여박물관 | 조류 생태 행동도감",
      "mapCoords": {
        "x": 82.0,
        "y": 37.0
      }
    },
    {
      "id": 12,
      "code": "12",
      "name": "악어",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "고대 파충류의 생존 전략과 갑옷",
      "simpleDesc": "물속에 은밀히 잠복하다 기습하는 수중 생태계의 강력한 포식자.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel12.webp",
      "icon": "Asset/2. Main/icon/12.webp",
      "iconDark": "Asset/2. Main/icon_dark/12_dark.webp",
      "features": [
        "골편(Osteoderm)으로 뒤덮인 단단한 등가죽 표현",
        "수면 위로 눈과 콧구멍만 내놓을 수 있는 두개골 구조",
        "연꽃잎 몸체에서 물가로 이어지는 경계부 배치"
      ],
      "scienceStory": "악어는 중생대부터 거의 형태를 바꾸지 않고 살아남은 살아있는 화석입니다. 강력한 꼬리와 턱 힘, 그리고 체온 조절을 돕는 골편 가죽은 물과 육지를 오가는 반수생 생활에 최적화되어 있습니다.",
      "sourceCode": "REF_12_CROCODILE",
      "sourceText": "출처: 국립부여박물관 | 양서파충류학 논총",
      "mapCoords": {
        "x": 25.0,
        "y": 72.0
      }
    },
    {
      "id": 13,
      "code": "13",
      "name": "물고기",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "유선형 몸체와 유영의 미학",
      "simpleDesc": "활짝 핀 연꽃잎 사이를 헤엄치며 풍요와 다산을 상징하는 어류.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel13.webp",
      "icon": "Asset/2. Main/icon/13.webp",
      "iconDark": "Asset/2. Main/icon_dark/13_dark.webp",
      "features": [
        "부드럽게 휘어진 유선형 몸통과 지느러미의 율동",
        "물살을 가르는 비늘의 세밀한 음각 표현",
        "연꽃 줄기와 수중 공간의 평화로운 조화"
      ],
      "scienceStory": "어류의 유선형 체형과 측선(옆줄) 감각기관은 수압과 진동을 감지하여 물속에서 저항을 최소화하고 민첩하게 이동할 수 있게 합니다. 고대 동아시아에서 물고기는 다산과 풍요의 대표적 상징입니다.",
      "sourceCode": "REF_13_FISH",
      "sourceText": "출처: 국립부여박물관 | 한국 담수어류 도감",
      "mapCoords": {
        "x": 36.0,
        "y": 78.0
      }
    },
    {
      "id": 14,
      "code": "14",
      "name": "물범",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "해양 포유류의 지느러미발 진화",
      "simpleDesc": "육지 포유류에서 바다로 돌아가 지느러미발을 갖추게 된 수생 포유류.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/N_Panel14.jpg",
      "icon": "Asset/2. Main/icon/14.webp",
      "iconDark": "Asset/2. Main/icon_dark/14_dark.webp",
      "features": [
        "매끄러운 방추형 몸매와 둥근 머리",
        "물속에서 추진력을 얻는 지느러미 형태의 다리",
        "백제 서해안 연안 생태계와의 밀접한 연관성"
      ],
      "scienceStory": "물범(기각류)은 육상 식육목 조상에서 갈라져 나와 체온을 유지하는 두꺼운 피하지방층과 지느러미발(Flipper)을 진화시켜 해양 생활에 완벽히 적응했습니다.",
      "sourceCode": "REF_14_SEAL",
      "sourceText": "출처: 국립부여박물관 도록 | 국립수산과학원 해양포유류 연구",
      "mapCoords": {
        "x": 47.0,
        "y": 74.0
      }
    },
    {
      "id": 15,
      "code": "15",
      "name": "수달",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "물가 생태계의 건강성을 알리는 지표종",
      "simpleDesc": "물속을 자유자재로 유영하며 물고기를 사냥하는 영리한 수생 족제비과 동물.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel15.webp",
      "icon": "Asset/2. Main/icon/15.webp",
      "iconDark": "Asset/2. Main/icon_dark/15_dark.webp",
      "features": [
        "발가락 사이의 물갈퀴와 방수성이 뛰어난 이중 털",
        "물고기를 물고 바위 위로 올라오는 특유의 동작",
        "맑은 하천과 연안 생태계의 건강성을 상징"
      ],
      "scienceStory": "수달은 발가락 사이의 물갈퀴와 물속에서 방향을 조절하는 노 역할을 하는 두꺼운 꼬리를 지녀 물속에서 최고의 기동성을 발휘합니다. 맑은 물에만 서식하는 대표적 환경 지표종입니다.",
      "sourceCode": "REF_15_OTTER",
      "sourceText": "출처: 국립부여박물관 | 한국수달보호협회 생태자료",
      "mapCoords": {
        "x": 58.0,
        "y": 76.0
      }
    },
    {
      "id": 16,
      "code": "16",
      "name": "백로",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "긴 다리와 부리로 물가를 거니는 왜가리과",
      "simpleDesc": "연못가 얕은 물을 조용히 걸으며 먹이를 낚아채는 청초한 섭금류.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel16-1.webp",
      "panelImg2": "Asset/3. Exhibition/N_Panel/webp/N_Panel16-2.webp",
      "icon": "Asset/2. Main/icon/16.webp",
      "iconDark": "Asset/2. Main/icon_dark/16_dark.webp",
      "features": [
        "물에 젖지 않고 걸을 수 있는 길쭉한 목과 다리",
        "연꽃 잎사귀 사이에서 먹이를 응시하는 고요한 자세",
        "동양화와 공예에서 청렴과 고결함을 뜻하는 전통 상징"
      ],
      "scienceStory": "백로는 긴 다리(경골·족근골)로 얕은 물을 거닐며 S자로 굽어진 목을 순식간에 뻗어 물고기를 작살처럼 낚아챕니다. 연꽃 습지 생태계의 대표적인 조류입니다.",
      "sourceCode": "REF_16_EGRET",
      "sourceText": "출처: 국립부여박물관 | 한국의 섭금류 생태도감",
      "mapCoords": {
        "x": 69.0,
        "y": 70.0
      }
    },
    {
      "id": 17,
      "code": "17",
      "name": "달리는 새",
      "layer": "water",
      "layerName": "물가 (연꽃 몸체)",
      "panelTheme": "지상 주행에 특화된 튼튼한 다리",
      "simpleDesc": "날기보다 물가 펄과 풀밭을 빠르게 질주하는 강인한 주행 조류.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel18.webp",
      "icon": "Asset/2. Main/icon/17.webp",
      "iconDark": "Asset/2. Main/icon_dark/17_dark.webp",
      "features": [
        "날개를 뒤로 젖히고 긴 보폭으로 달리는 역동적 형상",
        "강인하게 발달한 허벅지와 발가락 관절",
        "습지와 초원을 가로지르는 속도감 넘치는 조형"
      ],
      "scienceStory": "타조나 뜸부기류처럼 일부 조류는 비행 근육 대신 다리 골격과 건(Tendon)을 강화하여 지상 주행에 에너지를 집중하는 방향으로 진화했습니다.",
      "sourceCode": "REF_17_RUNNING_BIRD",
      "sourceText": "출처: 국립부여박물관 | 조류 생체역학 연구",
      "mapCoords": {
        "x": 80.0,
        "y": 74.0
      }
    },
    {
      "id": 18,
      "code": "18",
      "name": "금시조 (봉황)",
      "layer": "sky",
      "layerName": "천상 · 하늘 (뚜껑 정상)",
      "panelTheme": "태평성대를 알리는 신성한 이상세계의 정점",
      "simpleDesc": "향로 정상에서 목과 부리로 여의주를 품고 날개를 활짝 편 이상향의 상징.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel19.webp",
      "icon": "Asset/2. Main/icon/18.webp",
      "iconDark": "Asset/2. Main/icon_dark/18_dark.webp",
      "features": [
        "턱 밑과 부리에 여의주를 품고 힘차게 펼친 양 날개",
        "백제 특유의 부드럽고 우아하게 치켜 올라간 꼬리 깃",
        "가슴 윗부분에 뚫려 향 연기를 뿜어내는 신성한 기운"
      ],
      "scienceStory": "봉황은 동아시아 신화에서 닭의 머리, 뱀의 목, 제비의 턱, 공작의 꼬리 등 실존하는 여러 아름다운 새들의 특징을 결합하여 창조한 궁극의 성스러운 도상입니다.",
      "sourceCode": "REF_18_PHOENIX",
      "sourceText": "출처: 국립부여박물관 | 삼국시대 봉황 및 환두대도 문양 연구",
      "mapCoords": {
        "x": 50.0,
        "y": 14.0
      }
    },
    {
      "id": 19,
      "code": "19",
      "name": "용",
      "layer": "sea",
      "layerName": "바다 · 해저 (받침대)",
      "panelTheme": "물을 박차고 솟구쳐 세계를 떠받치는 힘",
      "simpleDesc": "바다를 다스리며 하늘로 솟구치듯 연꽃 몸체를 입으로 떠받든 역동적 신수.",
      "glb": null,
      "panelImg": "Asset/3. Exhibition/N_Panel/webp/N_Panel20.webp",
      "icon": "Asset/2. Main/icon/19.webp",
      "iconDark": "Asset/2. Main/icon_dark/19_dark.webp",
      "features": [
        "한 다리를 번쩍 치켜들고 연꽃 밑부분을 입으로 문 역동적 자태",
        "연화당초문으로 휘감긴 투조(透彫) 몸통과 꼬리의 생동감",
        "하늘과 땅, 물을 연결하는 백제 금속공예 최고의 조형력"
      ],
      "scienceStory": "용은 뱀의 몸, 물고기 비늘, 사슴 뿔, 독수리 발톱 등 물과 육지, 하늘의 강인한 생명체들이 융합된 수신(水神)이자 제왕의 상징으로, 거대한 향로 전체의 하중을 분산하며 균형을 잡는 공학적 지지대 역할을 수행합니다.",
      "sourceCode": "REF_19_DRAGON",
      "sourceText": "출처: 국립부여박물관 | 백제 금동대향로 주조기술과 용 도상학",
      "mapCoords": {
        "x": 50.0,
        "y": 88.0
      }
    }
  ],
  "unwrappedMap": "Asset/3. Exhibition/N_Panel/webp/unwrapped_map.webp",
  "finalEmblem": "Asset/Final.webp"
};
