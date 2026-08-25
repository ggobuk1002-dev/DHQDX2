/**
 * 금동대향로 가상웹전시 - 동물별 상세 댓글/소통 시스템 (commentSystem.js)
 * Source of Truth: MD문서/reply.md
 */

const DEFAULT_ANIMAL_COMMENTS = {
  // 01 말
  '01': [
    {
      id: 'cmt-01-1',
      name: '김○○',
      text: '말 발가락이 원래 여러 개였다가 하나로 진화했다는 사실이 정말 놀라워요! 🐴',
      likes: 28,
      createdAt: 1714500000000,
      replies: [
        {
          id: 'cmt-01-1-1',
          name: '박○○',
          text: '맞아요! 단단한 땅을 빨리 달리려고 가운데 발가락만 남은 거래요.',
          likes: 14,
          createdAt: 1714503600000,
          replies: [
            {
              id: 'cmt-01-1-1-1',
              name: '이○○',
              text: '등자랑 편자가 발명되면서 인류 역사도 크게 바뀌었대요.',
              likes: 9,
              createdAt: 1714507200000,
              replies: []
            }
          ]
        }
      ]
    },
    {
      id: 'cmt-01-2',
      name: '최○○',
      text: '백제 유물에 조각된 말의 생동감 넘치는 자세가 아주 멋지네요.',
      likes: 19,
      createdAt: 1714510000000,
      replies: []
    }
  ],

  // 02 호랑이
  '02': [
    {
      id: 'cmt-02-1',
      name: '강○○',
      text: '호랑이의 세로 줄무늬가 숲속에서 완벽한 위장색이 된다는 게 신기해요! 🐯',
      likes: 31,
      createdAt: 1714512000000,
      replies: [
        {
          id: 'cmt-02-1-1',
          name: '윤○○',
          text: '사자는 무리 사냥을 하지만 호랑이는 단독 사냥에 특화되어 근력이 엄청나대요.',
          likes: 16,
          createdAt: 1714515000000,
          replies: []
        }
      ]
    },
    {
      id: 'cmt-02-2',
      name: '정○○',
      text: '조선시대와 백제 시대 한반도에 호랑이가 많이 살았다는 역사 기록이 흥미로워요.',
      likes: 22,
      createdAt: 1714518000000,
      replies: []
    }
  ],

  // 03 사자
  '03': [
    {
      id: 'cmt-03-1',
      name: '한○○',
      text: '수사자의 짙은 갈기가 건강과 체온, 성선택의 신호였다니 재미있네요! 🦁',
      likes: 25,
      createdAt: 1714520000000,
      replies: []
    },
    {
      id: 'cmt-03-2',
      name: '임○○',
      text: '서역에서 전래된 사자 도상이 백제 향로에 당당히 새겨져 있는 게 인상적입니다.',
      likes: 18,
      createdAt: 1714523000000,
      replies: []
    }
  ],

  // 04 족제비
  '04': [
    {
      id: 'cmt-04-1',
      name: '서○○',
      text: '몸통이 가늘고 길어서 좁은 굴속 설치류를 사냥하기에 완벽한 체형이네요.',
      likes: 17,
      createdAt: 1714525000000,
      replies: []
    }
  ],

  // 05 원숭이
  '05': [
    {
      id: 'cmt-05-1',
      name: '오○○',
      text: '손과 발 모두 물건을 쥘 수 있는 파지력 덕분에 나무 위 생활에 완벽 적응했군요. 🐒',
      likes: 20,
      createdAt: 1714528000000,
      replies: []
    }
  ],

  // 06 사슴
  '06': [
    {
      id: 'cmt-06-1',
      name: '신○○',
      text: '매년 저렇게 큰 뿔이 통째로 자라나고 탈락한다니 포유류의 재생 능력이 경이롭습니다! 🦌',
      likes: 26,
      createdAt: 1714530000000,
      replies: []
    }
  ],

  // 07 멧돼지
  '07': [
    {
      id: 'cmt-07-1',
      name: '황○○',
      text: '멧돼지가 흙을 파헤치는 굴토 행동이 숲의 생태계를 순환시키는 역할을 한다니 의외네요.',
      likes: 23,
      createdAt: 1714533000000,
      replies: []
    }
  ],

  // 08 코끼리
  '08': [
    {
      id: 'cmt-08-1',
      name: '이○○',
      text: '코끼리 발바닥에도 몸무게를 지탱하는 특별한 충격 흡수 패드가 있다는 게 놀라워요! 🐘',
      likes: 35,
      createdAt: 1714535000000,
      replies: [
        {
          id: 'cmt-08-1-1',
          name: '박○○',
          text: '이렇게 큰 몸으로 가파른 곳도 이동할 수 있다는 게 신기해요.',
          likes: 18,
          createdAt: 1714538000000,
          replies: []
        }
      ]
    }
  ],

  // 09 이상한 부리를 가진 새
  '09': [
    {
      id: 'cmt-09-1',
      name: '배○○',
      text: '다윈 핀치새처럼 부리 모양이 먹이에 맞춰 다양하게 진화하는 적응방산의 표본이군요!',
      likes: 21,
      createdAt: 1714540000000,
      replies: []
    }
  ],

  // 10 뱀을 물고 있는 야수
  '10': [
    {
      id: 'cmt-10-1',
      name: '송○○',
      text: '맹독의 뱀을 사냥하기 위해 수용체 자체를 변형시켜 독 면역을 가졌다니 진화의 힘은 대단합니다.',
      likes: 29,
      createdAt: 1714542000000,
      replies: []
    }
  ],

  // 11 볏을 가진 새
  '11': [
    {
      id: 'cmt-11-1',
      name: '유○○',
      text: '볏이 화려할수록 건강하다는 성선택의 신호라는 점이 흥미로워요. 🐓',
      likes: 19,
      createdAt: 1714545000000,
      replies: []
    }
  ],

  // 12 악어
  '12': [
    {
      id: 'cmt-12-1',
      name: '정○○',
      text: '악어가 아주 오래전부터 비슷한 모습으로 살아왔다는 게 신기해요. 🐊',
      likes: 33,
      createdAt: 1714548000000,
      replies: [
        {
          id: 'cmt-12-1-1',
          name: '김○○',
          text: '오래된 모습이라고 해서 진화하지 않은 건 아니라는 설명이 재미있었어요.',
          likes: 21,
          createdAt: 1714551000000,
          replies: []
        }
      ]
    }
  ],

  // 13 물고기
  '13': [
    {
      id: 'cmt-13-1',
      name: '조○○',
      text: '물고기의 지느러미 뼈 구조가 육상 척추동물의 사지로 진화했다는 틱타알릭 이야기가 감동적이에요. 🐟',
      likes: 27,
      createdAt: 1714553000000,
      replies: []
    }
  ],

  // 14 물범
  '14': [
    {
      id: 'cmt-14-1',
      name: '최○○',
      text: '물범과 물개의 지느러미발 형태와 수영 방식 차이를 비교해보니 확실히 알겠어요! 🦭',
      likes: 30,
      createdAt: 1714556000000,
      replies: [
        {
          id: 'cmt-14-1-1',
          name: '정○○',
          text: '수달이랑 비슷하게 생겼는데 수중 추진 메커니즘이 완전히 다르네요. 🔍',
          likes: 15,
          createdAt: 1714559000000,
          replies: []
        }
      ]
    }
  ],

  // 15 수달
  '15': [
    {
      id: 'cmt-15-1',
      name: '김○○',
      text: '수달이 물속에서 헤엄치는 모습이 정말 귀여워요! 🦦',
      likes: 42,
      createdAt: 1714561000000,
      replies: [
        {
          id: 'cmt-15-1-1',
          name: '박○○',
          text: '해달이랑 수달의 코 모양이 다르다는 걸 처음 알았어요.',
          likes: 24,
          createdAt: 1714564000000,
          replies: [
            {
              id: 'cmt-15-1-1-1',
              name: '이○○',
              text: '물에 사는 동물인데도 육지에서도 생활한다는 게 신기해요.',
              likes: 13,
              createdAt: 1714567000000,
              replies: []
            }
          ]
        }
      ]
    },
    {
      id: 'cmt-15-2',
      name: '문○○',
      text: '털의 밀도가 1제곱센티미터당 수만 가닥이라 물이 피부에 닿지 않는대요!',
      likes: 26,
      createdAt: 1714570000000,
      replies: []
    }
  ],

  // 16 백로
  '16': [
    {
      id: 'cmt-16-1',
      name: '안○○',
      text: '백로가 단일 종이 아니라 왜가리과 내 여러 흰 새를 통칭하는 이름이었다니 새로워요. 🪶',
      likes: 21,
      createdAt: 1714572000000,
      replies: []
    }
  ],

  // 17 달리는 새
  '17': [
    {
      id: 'cmt-17-1',
      name: '노○○',
      text: '비행 능력을 포기하는 대신 폭발적인 달리기 근육을 얻은 진화적 트레이드오프가 멋집니다.',
      likes: 24,
      createdAt: 1714575000000,
      replies: []
    }
  ],

  // 18 봉황 (금시조)
  '18': [
    {
      id: 'cmt-18-1',
      name: '박○○',
      text: '금동대향로 꼭대기에 있는 봉황이 정말 위풍당당하고 멋있어요! 🦅',
      likes: 45,
      createdAt: 1714578000000,
      replies: [
        {
          id: 'cmt-18-1-1',
          name: '최○○',
          text: '실제 새들의 특징을 살펴보고 나니까 상상 속 봉황의 모습도 새롭게 보이네요.',
          likes: 29,
          createdAt: 1714581000000,
          replies: []
        }
      ]
    },
    {
      id: 'cmt-18-2',
      name: '전○○',
      text: '며느리발톱과 긴 꼬리깃이 닭과 공작의 화려한 특징을 완벽하게 조합했네요.',
      likes: 22,
      createdAt: 1714584000000,
      replies: []
    }
  ],

  // 19 용
  '19': [
    {
      id: 'cmt-19-1',
      name: '이○○',
      text: '뱀처럼 긴 몸과 여러 동물의 신체 특징이 함께 조각되어 있다는 게 신기해요. 🐉',
      likes: 38,
      createdAt: 1714587000000,
      replies: [
        {
          id: 'cmt-19-1-1',
          name: '김○○',
          text: '향로 전체를 받치고 있는 용의 역동적인 자세에서 백제 장인의 기상이 느껴집니다.',
          likes: 27,
          createdAt: 1714590000000,
          replies: []
        }
      ]
    }
  ]
};

class CommentManager {
  constructor() {
    this.storageKey = 'exhibition_comments_data_v3';
    this.likedStorageKey = 'liked_comments_set_v3';
    this.data = this.loadData();
    this.likedSet = this.loadLikedSet();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load comments from localStorage', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_ANIMAL_COMMENTS));
  }

  saveData() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save comments to localStorage', e);
    }
  }

  loadLikedSet() {
    try {
      const saved = localStorage.getItem(this.likedStorageKey);
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {}
    return new Set();
  }

  saveLikedSet() {
    try {
      localStorage.setItem(this.likedStorageKey, JSON.stringify(Array.from(this.likedSet)));
    } catch (e) {}
  }

  getComments(animalCode) {
    const code = String(animalCode || '01').padStart(2, '0');
    if (!this.data[code]) {
      this.data[code] = [];
    }
    return this.data[code];
  }

  getTop3Popular(animalCode) {
    const comments = this.getComments(animalCode);
    if (!comments || comments.length === 0) return [];

    return [...comments]
      .filter(c => c.likes > 0)
      .sort((a, b) => {
        if (b.likes !== a.likes) {
          return b.likes - a.likes;
        }
        return a.createdAt - b.createdAt;
      })
      .slice(0, 3);
  }

  addComment(animalCode, text, authorName = null) {
    const code = String(animalCode || '01').padStart(2, '0');
    if (!text || !text.trim()) return null;

    const names = ['김○○', '이○○', '박○○', '최○○', '정○○', '강○○', '조○○', '윤○○', '장○○', '임○○'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newComment = {
      id: `cmt-${code}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: (authorName && authorName.trim()) ? authorName.trim() : randomName,
      text: text.trim(),
      likes: 0,
      createdAt: Date.now(),
      replies: []
    };

    if (!this.data[code]) {
      this.data[code] = [];
    }

    this.data[code].unshift(newComment);
    this.saveData();
    return newComment;
  }

  addReply(animalCode, parentCommentId, text, authorName = null) {
    const code = String(animalCode || '01').padStart(2, '0');
    if (!text || !text.trim()) return null;

    const names = ['김○○', '이○○', '박○○', '최○○', '정○○', '강○○', '조○○', '윤○○', '장○○', '임○○'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const newReply = {
      id: `reply-${code}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: (authorName && authorName.trim()) ? authorName.trim() : randomName,
      text: text.trim(),
      likes: 0,
      createdAt: Date.now(),
      replies: []
    };

    const parent = this.findCommentById(this.data[code] || [], parentCommentId);
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push(newReply);
      this.saveData();
      return newReply;
    }
    return null;
  }

  findCommentById(commentList, id) {
    for (const c of commentList) {
      if (c.id === id) return c;
      if (c.replies && c.replies.length > 0) {
        const found = this.findCommentById(c.replies, id);
        if (found) return found;
      }
    }
    return null;
  }

  toggleLike(commentId) {
    let target = null;
    for (const code in this.data) {
      target = this.findCommentById(this.data[code], commentId);
      if (target) break;
    }

    if (!target) return { liked: false, likes: 0 };

    const isLiked = this.likedSet.has(commentId);
    if (isLiked) {
      this.likedSet.delete(commentId);
      target.likes = Math.max(0, target.likes - 1);
    } else {
      this.likedSet.add(commentId);
      target.likes += 1;
    }

    this.saveData();
    this.saveLikedSet();
    return { liked: !isLiked, likes: target.likes };
  }

  isLiked(commentId) {
    return this.likedSet.has(commentId);
  }
}

window.commentManager = new CommentManager();
