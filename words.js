// 교육부 지정 초등영단어 800개 - 카테고리별 그룹화
const wordGroups = {
    "동물": [
        {word: "animal", meaning: "동물"}, {word: "cat", meaning: "고양이"}, {word: "dog", meaning: "개"}, 
        {word: "bird", meaning: "새"}, {word: "fish", meaning: "고기/낚시하다"}, {word: "bear", meaning: "곰"}, 
        {word: "chicken", meaning: "닭"}, {word: "cow", meaning: "암소"}, {word: "duck", meaning: "오리"}, 
        {word: "hen", meaning: "암닭"}, {word: "horse", meaning: "말"}, {word: "lion", meaning: "사자"}, 
        {word: "monkey", meaning: "원숭이"}, {word: "pig", meaning: "돼지"}, {word: "sheep", meaning: "양"}, 
        {word: "tiger", meaning: "호랑이"}, {word: "dolphin", meaning: "돌고래"}, {word: "elephant", meaning: "코끼리"}, 
        {word: "giraffe", meaning: "기린"}, {word: "kangaroo", meaning: "캥거루"}, {word: "panda", meaning: "판다"}, 
        {word: "rabbit", meaning: "토끼"}, {word: "snake", meaning: "뱀"}, {word: "turtle", meaning: "거북이"}, 
        {word: "whale", meaning: "고래"}, {word: "wolf", meaning: "늑대"}, {word: "zebra", meaning: "얼룩말"}, 
        {word: "deer", meaning: "사슴"}, {word: "fox", meaning: "여우"}, {word: "frog", meaning: "개구리"}, 
        {word: "goat", meaning: "염소"}, {word: "hippo", meaning: "하마"}, {word: "mouse", meaning: "쥐"}, 
        {word: "penguin", meaning: "펭귄"}, {word: "shark", meaning: "상어"}, {word: "spider", meaning: "거미"}
    ],
    "음식": [
        {word: "apple", meaning: "사과"}, {word: "banana", meaning: "바나나"}, {word: "bread", meaning: "빵"}, 
        {word: "breakfast", meaning: "아침"}, {word: "butter", meaning: "버터"}, {word: "cake", meaning: "케이크"}, 
        {word: "candy", meaning: "사탕"}, {word: "cheese", meaning: "치즈"}, {word: "coffee", meaning: "커피"}, 
        {word: "cream", meaning: "크림"}, {word: "dinner", meaning: "저녁"}, {word: "egg", meaning: "계란"}, 
        {word: "food", meaning: "음식"}, {word: "fruit", meaning: "과일"}, {word: "grape", meaning: "포도"}, 
        {word: "hamburger", meaning: "햄버거"}, {word: "juice", meaning: "주스"}, {word: "lunch", meaning: "점심식사"}, 
        {word: "meat", meaning: "고기"}, {word: "melon", meaning: "멜론"}, {word: "milk", meaning: "우유"}, 
        {word: "orange", meaning: "오렌지"}, {word: "pear", meaning: "배"}, {word: "rice", meaning: "쌀"}, 
        {word: "salad", meaning: "샐러드"}, {word: "salt", meaning: "소금"}, {word: "soup", meaning: "스프"}, 
        {word: "strawberry", meaning: "딸기"}, {word: "sugar", meaning: "설탕"}, {word: "supper", meaning: "저녁식사"}, 
        {word: "tea", meaning: "차"}, {word: "tomato", meaning: "토마토"}, {word: "vegetable", meaning: "야채"}, 
        {word: "water", meaning: "물"}, {word: "pizza", meaning: "피자"}, {word: "sandwich", meaning: "샌드위치"}
    ],
    "신체": [
        {word: "arm", meaning: "팔"}, {word: "back", meaning: "뒤에"}, {word: "body", meaning: "몸"}, 
        {word: "ear", meaning: "귀"}, {word: "eye", meaning: "눈"}, {word: "face", meaning: "얼굴"}, 
        {word: "finger", meaning: "손가락"}, {word: "foot", meaning: "발"}, {word: "hair", meaning: "머리카락"}, 
        {word: "hand", meaning: "손"}, {word: "head", meaning: "머리"}, {word: "heart", meaning: "마음/상징"}, 
        {word: "knee", meaning: "무릎"}, {word: "leg", meaning: "다리"}, {word: "lip", meaning: "입술"}, 
        {word: "mouth", meaning: "입"}, {word: "neck", meaning: "목"}, {word: "nose", meaning: "코"}, 
        {word: "shoulder", meaning: "어깨"}, {word: "tooth", meaning: "이"}, {word: "brain", meaning: "뇌"}, 
        {word: "chest", meaning: "가슴"}, {word: "elbow", meaning: "팔꿈치"}, {word: "stomach", meaning: "배"}, 
        {word: "throat", meaning: "목"}, {word: "thumb", meaning: "엄지"}, {word: "toe", meaning: "발가락"}, 
        {word: "tongue", meaning: "혀"}, {word: "wrist", meaning: "손목"}, {word: "ankle", meaning: "발목"}
    ],
    "학용품": [
        {word: "book", meaning: "책"}, {word: "pen", meaning: "펜/만년필"}, {word: "pencil", meaning: "연필"}, 
        {word: "desk", meaning: "책상"}, {word: "bag", meaning: "가방"}, {word: "eraser", meaning: "지우개"}, 
        {word: "paper", meaning: "종이"}, {word: "ruler", meaning: "자"}, {word: "chalk", meaning: "분필"}, 
        {word: "crayon", meaning: "크레옹"}, {word: "dictionary", meaning: "사전"}, {word: "diary", meaning: "일기"}, 
        {word: "lesson", meaning: "학과"}, {word: "library", meaning: "도서관"}, {word: "note", meaning: "공책"}, 
        {word: "page", meaning: "쪽"}, {word: "school", meaning: "학교"}, {word: "student", meaning: "학생"}, 
        {word: "teacher", meaning: "가르치다"}, {word: "class", meaning: "학급"}, {word: "classmate", meaning: "동급생"}, 
        {word: "homework", meaning: "숙제"}, {word: "test", meaning: "시험"}, {word: "study", meaning: "공부하다"}, 
        {word: "learn", meaning: "배우다"}, {word: "read", meaning: "읽다"}, {word: "write", meaning: "쓰다"}, 
        {word: "listen", meaning: "듣다"}, {word: "speak", meaning: "이야기하다"}, {word: "computer", meaning: "컴퓨터"}
    ],
    "색깔": [
        {word: "black", meaning: "검정색"}, {word: "blue", meaning: "푸른"}, {word: "brown", meaning: "갈색"}, 
        {word: "color", meaning: "색깔"}, {word: "gray", meaning: "회색"}, {word: "green", meaning: "녹색"}, 
        {word: "orange", meaning: "오렌지"}, {word: "pink", meaning: "분홍"}, {word: "red", meaning: "빨강"}, 
        {word: "white", meaning: "하얀색"}, {word: "yellow", meaning: "노랑색"}, {word: "bright", meaning: "밝은"}, 
        {word: "dark", meaning: "어두운"}, {word: "light", meaning: "빛"}, {word: "rainbow", meaning: "무지개"}, 
        {word: "gold", meaning: "금"}, {word: "silver", meaning: "은"}, {word: "purple", meaning: "보라색"}, 
        {word: "violet", meaning: "보라색"}, {word: "navy", meaning: "네이비"}, {word: "cream", meaning: "크림색"}
    ],
    "가족": [
        {word: "family", meaning: "가족"}, {word: "mother", meaning: "어머니"}, {word: "father", meaning: "아버지"}, 
        {word: "baby", meaning: "아기"}, {word: "brother", meaning: "형제"}, {word: "sister", meaning: "자매"}, 
        {word: "son", meaning: "아들"}, {word: "daughter", meaning: "딸"}, {word: "aunt", meaning: "이모,고모"}, 
        {word: "uncle", meaning: "삼촌"}, {word: "cousin", meaning: "사촌"}, {word: "grandmother", meaning: "할머니"}, 
        {word: "grandfather", meaning: "할아버지"}, {word: "parent", meaning: "부모"}, {word: "child", meaning: "어린이"}, 
        {word: "boy", meaning: "소년"}, {word: "girl", meaning: "소녀"}, {word: "man", meaning: "사람/남자"}, 
        {word: "woman", meaning: "여자"}, {word: "people", meaning: "사람"}, {word: "friend", meaning: "친구"}, 
        {word: "kid", meaning: "아이"}, {word: "lady", meaning: "숙녀"}, {word: "daddy", meaning: "아빠/아버지"}, 
        {word: "mommy", meaning: "엄마"}, {word: "husband", meaning: "남편"}, {word: "wife", meaning: "아내"}
    ],
    "집과 물건": [
        {word: "house", meaning: "집"}, {word: "home", meaning: "집"}, {word: "room", meaning: "방"}, 
        {word: "door", meaning: "문"}, {word: "window", meaning: "창문"}, {word: "wall", meaning: "벽"}, 
        {word: "floor", meaning: "마루"}, {word: "ceiling", meaning: "천장"}, {word: "chair", meaning: "의자"}, 
        {word: "table", meaning: "식탁/탁자"}, {word: "bed", meaning: "침대"}, {word: "kitchen", meaning: "부엌"}, 
        {word: "box", meaning: "상자"}, {word: "bottle", meaning: "병"}, {word: "bowl", meaning: "사발"}, 
        {word: "cup", meaning: "컵"}, {word: "plate", meaning: "접시"}, {word: "spoon", meaning: "숟가락"}, 
        {word: "fork", meaning: "포크"}, {word: "knife", meaning: "칼"}, {word: "basket", meaning: "바구니"}, 
        {word: "clock", meaning: "시계"}, {word: "lamp", meaning: "등불"}, {word: "mirror", meaning: "거울"}, 
        {word: "picture", meaning: "그림"}, {word: "toy", meaning: "인형"}, {word: "doll", meaning: "인형"}, 
        {word: "ball", meaning: "공"}, {word: "balloon", meaning: "풍선"}, {word: "curtain", meaning: "커튼"}
    ],
    "옷과 신발": [
        {word: "clothes", meaning: "옷"}, {word: "shirt", meaning: "셔츠"}, {word: "dress", meaning: "드레스"}, 
        {word: "pants", meaning: "바지"}, {word: "skirt", meaning: "치마"}, {word: "coat", meaning: "코트"}, 
        {word: "jacket", meaning: "재킷"}, {word: "sweater", meaning: "스웨터"}, {word: "hat", meaning: "모자"}, 
        {word: "cap", meaning: "모자"}, {word: "shoe", meaning: "구두"}, {word: "sock", meaning: "양말"}, 
        {word: "glove", meaning: "장갑"}, {word: "belt", meaning: "벨트"}, {word: "tie", meaning: "매다"}, 
        {word: "button", meaning: "단추"}, {word: "pocket", meaning: "주머니"}, {word: "uniform", meaning: "제복"}, 
        {word: "pajamas", meaning: "잠옷"}, {word: "underwear", meaning: "속옷"}, {word: "scarf", meaning: "스카프"}
    ]
};

// 기존 방식과 호환성을 위한 전체 단어 배열
const englishWords = Object.values(wordGroups).flat();