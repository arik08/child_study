// 앱 상태 관리
class LearningApp {
    constructor() {
        this.currentScreen = 'loading';
        this.gameMode = null;
        this.currentQuestion = 0;
        this.totalQuestions = 0; // 게임 시작 시 동적으로 설정
        this.gameScore = 0;
        this.totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
        this.userLevel = parseInt(localStorage.getItem('userLevel')) || 1;
        this.gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        this.wordStats = JSON.parse(localStorage.getItem('wordStats')) || {};
        
        // 수학 문제 관련
        this.currentMathProblem = null;
        this.mathStartTime = null;
        
        // 영어 문제 관련
        this.currentWordGroup = null;
        this.currentWordList = [];
        this.currentWordIndex = 0;
        this.englishStartTime = null;
        this.showMeaning = true; // 뜻 표시 여부 (기본적으로 표시)
        
        this.init();
    }

    init() {
        this.updateUI();
        this.setupEventListeners();
        this.showLoadingScreen();
    }

    // 로딩 화면 표시 (즉시 메인 화면으로)
    showLoadingScreen() {
        // 가짜 로딩 제거 - 즉시 메인 화면 표시
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        this.currentScreen = 'main-menu';
    }

    // UI 업데이트
    updateUI() {
        const totalScoreEl = document.getElementById('total-score');
        const userLevelEl = document.getElementById('user-level');
        const gameScoreEl = document.getElementById('game-score');
        const currentQuestionEl = document.getElementById('current-question');
        
        if (totalScoreEl) totalScoreEl.textContent = this.totalScore;
        if (userLevelEl) userLevelEl.textContent = this.userLevel;
        if (gameScoreEl) gameScoreEl.textContent = this.gameScore;
        if (currentQuestionEl) currentQuestionEl.textContent = this.currentQuestion + 1;
        // 무한 모드로 변경 - total-questions 요소는 HTML에서 제거됨
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 영어 답안 버튼
        document.getElementById('know-btn').addEventListener('click', () => {
            this.submitEnglishAnswer(true);
        });

        document.getElementById('dont-know-btn').addEventListener('click', () => {
            this.submitEnglishAnswer(false);
        });

        // 정답 보기 버튼
        document.getElementById('show-answer-btn').addEventListener('click', () => {
            this.showMathAnswer();
        });

        // 캐릭터 클릭 이벤트
        document.getElementById('character').addEventListener('click', () => {
            this.showCharacterMessage();
        });
    }

    // 메인 메뉴 표시
    showMainMenu() {
        this.hideAllScreens();
        document.getElementById('main-menu').classList.remove('hidden');
        this.currentScreen = 'main-menu';
    }

    // 수학 메뉴 표시
    showMathMenu() {
        this.hideAllScreens();
        document.getElementById('math-menu').classList.remove('hidden');
        this.currentScreen = 'math-menu';
    }

    // 영어 메뉴 표시
    showEnglishMenu() {
        this.hideAllScreens();
        document.getElementById('english-menu').classList.remove('hidden');
        this.currentScreen = 'english-menu';
    }

    // 통계 화면 표시
    showStats() {
        this.hideAllScreens();
        document.getElementById('stats-screen').classList.remove('hidden');
        this.currentScreen = 'stats';
        this.updateStatsDisplay();
    }

    // 모든 화면 숨기기
    hideAllScreens() {
        const screens = ['main-menu', 'math-menu', 'english-menu', 'game-screen', 'stats-screen'];
        screens.forEach(screen => {
            document.getElementById(screen).classList.add('hidden');
        });
        
        // 뜻 토글 버튼도 숨기기
        document.getElementById('meaning-toggle-container').classList.add('hidden');
        document.getElementById('word-meaning').classList.add('hidden');
    }

    // 수학 게임 시작
    startMathGame(type) {
        this.gameMode = type;
        this.currentQuestion = 0;
        this.gameScore = 0;
        
        // 무한 모드 - totalQuestions 설정 제거
        
        this.hideAllScreens();
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('math-answers').classList.remove('hidden');
        document.getElementById('english-answers').classList.add('hidden');
        this.currentScreen = 'game';
        this.generateMathProblem();
        this.updateUI();
    }

    // 수학 문제 생성
    generateMathProblem() {
        this.mathStartTime = Date.now();
        let problem = {};
        
        switch (this.gameMode) {
            case 'addition':
                problem = this.generateAdditionProblem();
                break;
            case 'subtraction':
                problem = this.generateSubtractionProblem();
                break;
            case 'multiplication':
                problem = this.generateMultiplicationProblem();
                break;
        }
        
        this.currentMathProblem = problem;
        document.getElementById('question-text').textContent = problem.question;
        document.getElementById('question-visual').innerHTML = problem.visual || '';
        
        // 객관식 선택지 생성
        this.generateMathChoices(problem.answer);
        
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        document.getElementById('show-answer-btn').classList.add('hidden');
        
        this.showCharacterMessage(this.getEncouragementMessage());
    }

    // 덧셈 문제 생성
    generateAdditionProblem() {
        const a = Math.floor(Math.random() * 90) + 10; // 10-99
        const b = Math.floor(Math.random() * 90) + 10; // 10-99
        const answer = a + b;
        
        return {
            question: `${a} + ${b} = ?`,
            answer: answer,
            visual: this.createMathVisual(a, b, '+')
        };
    }

    // 뺄셈 문제 생성
    generateSubtractionProblem() {
        let a = Math.floor(Math.random() * 90) + 10; // 10-99
        let b = Math.floor(Math.random() * 90) + 10; // 10-99
        
        // a가 b보다 크도록 보장
        if (a < b) {
            [a, b] = [b, a];
        }
        
        const answer = a - b;
        
        return {
            question: `${a} - ${b} = ?`,
            answer: answer,
            visual: this.createMathVisual(a, b, '-')
        };
    }

    // 곱셈 문제 생성 (구구단)
    generateMultiplicationProblem() {
        const a = Math.floor(Math.random() * 8) + 2; // 2-9
        const b = Math.floor(Math.random() * 8) + 2; // 2-9
        const answer = a * b;
        
        return {
            question: `${a} × ${b} = ?`,
            answer: answer,
            visual: this.createMathVisual(a, b, '×')
        };
    }

    // 수학 시각화 생성
    createMathVisual(a, b, operator) {
        if (operator === '×' && a <= 5 && b <= 5) {
            // 구구단 시각화 (점 배열)
            let visual = '<div style="display: flex; flex-direction: column; align-items: center; gap: 5px;">';
            for (let i = 0; i < a; i++) {
                visual += '<div style="display: flex; gap: 5px;">';
                for (let j = 0; j < b; j++) {
                    visual += '<div style="width: 20px; height: 20px; background: #4ECDC4; border-radius: 50%;"></div>';
                }
                visual += '</div>';
            }
            visual += '</div>';
            return visual;
        }
        return '';
    }

    // 객관식 선택지 생성
    generateMathChoices(correctAnswer) {
        const choices = [correctAnswer];
        
        // 오답 선택지 3개 생성
        while (choices.length < 4) {
            let wrongAnswer;
            if (correctAnswer < 20) {
                // 작은 수의 경우 ±1~5 범위에서 오답 생성
                wrongAnswer = correctAnswer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 5) + 1);
            } else {
                // 큰 수의 경우 ±1~20 범위에서 오답 생성
                wrongAnswer = correctAnswer + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * 20) + 1);
            }
            
            // 음수나 중복 방지
            if (wrongAnswer > 0 && !choices.includes(wrongAnswer)) {
                choices.push(wrongAnswer);
            }
        }
        
        // 선택지 섞기
        this.shuffleArray(choices);
        
        // 선택지 버튼 생성
        const choicesContainer = document.getElementById('math-choices');
        choicesContainer.innerHTML = '';
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice;
            button.addEventListener('click', () => this.selectMathChoice(choice, correctAnswer));
            choicesContainer.appendChild(button);
        });
    }

    // 수학 선택지 선택
    selectMathChoice(selectedAnswer, correctAnswer) {
        const timeSpent = ((Date.now() - this.mathStartTime) / 1000).toFixed(1);
        const isCorrect = selectedAnswer === correctAnswer;
        
        // 모든 버튼 비활성화
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(btn => {
            btn.classList.add('disabled');
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            } else if (parseInt(btn.textContent) === selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        this.processMathAnswer(isCorrect, timeSpent, correctAnswer);
    }

    // 정답 보기 기능
    showMathAnswer() {
        const correctAnswer = this.currentMathProblem.answer;
        const timeSpent = ((Date.now() - this.mathStartTime) / 1000).toFixed(1);
        
        // 정답 버튼 하이라이트
        const choiceButtons = document.querySelectorAll('.choice-btn');
        choiceButtons.forEach(btn => {
            btn.classList.add('disabled');
            if (parseInt(btn.textContent) === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        // 정답 보기는 오답으로 처리
        this.processMathAnswer(false, timeSpent, correctAnswer, true);
    }

    // 수학 답안 처리
    processMathAnswer(isCorrect, timeSpent, correctAnswer, showedAnswer = false) {
        const feedback = document.getElementById('feedback');
        
        if (isCorrect) {
            // 시간에 따른 다양한 피드백
            let timeBonus = '';
            let encouragement = '';
            
            if (timeSpent < 3) {
                timeBonus = '⚡ 번개처럼 빨라요!';
                encouragement = '천재 같아요! 🌟';
            } else if (timeSpent < 5) {
                timeBonus = '🚀 정말 빨라요!';
                encouragement = '훌륭해요! 👏';
            } else if (timeSpent < 10) {
                timeBonus = '⏰ 좋은 시간이에요!';
                encouragement = '잘했어요! 😊';
            } else {
                timeBonus = '🤔 차근차근 생각했네요!';
                encouragement = '정답입니다! 🎉';
            }
            
            feedback.innerHTML = `
                <div style="text-align: center;">
                    <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">${encouragement}</div>
                    <div style="font-size: 1.1rem; color: #28a745;">${timeBonus}</div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${timeSpent}초 소요</div>
                </div>
            `;
            feedback.className = 'feedback correct';
            
            // 점수 계산 개선
            const baseScore = 100;
            const timeBonus_score = Math.max(50 - Math.floor(timeSpent * 3), 5);
            const totalScore = baseScore + timeBonus_score;
            this.gameScore += totalScore;
            
            // 캐릭터 애니메이션과 메시지
            this.showCharacterCelebration();
            this.showCharacterMessage(this.getCorrectMessage());
            this.playSuccessSound();
            
        } else {
            if (showedAnswer) {
                feedback.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">정답은 <strong>${correctAnswer}</strong>입니다!</div>
                        <div style="font-size: 1rem; color: #6c757d;">다음엔 꼭 맞힐 수 있을 거예요! 💪</div>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${timeSpent}초 소요</div>
                    </div>
                `;
            } else {
                feedback.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">아쉬워요! 😅</div>
                        <div style="font-size: 1.1rem; color: #dc3545;">정답은 <strong>${correctAnswer}</strong>입니다</div>
                        <div style="font-size: 0.9rem; color: #666; margin-top: 0.5rem;">${timeSpent}초 소요</div>
                    </div>
                `;
            }
            feedback.className = 'feedback incorrect';
            this.showCharacterMessage(this.getIncorrectMessage());
            this.playErrorSound();
        }
        
        // 정답 보기 버튼 표시 (틀렸을 때만)
        if (!isCorrect && !showedAnswer) {
            document.getElementById('show-answer-btn').classList.remove('hidden');
            return; // 정답 보기를 누를 때까지 대기
        }
        
        // 수학 게임은 기록을 저장하지 않음 (영어 단어 학습에만 집중)
        
        this.currentQuestion++;
        this.updateUI();
        
        // 빠르게 다음 문제로 넘어가기 (피드백은 계속 표시)
        setTimeout(() => {
            // 무한 진행 - 문제 개수 제한 제거
            this.generateMathProblem();
        }, 800); // 2초에서 0.8초로 단축
        
        // 피드백은 더 오래 표시 (다음 문제가 나와도 계속 보임)
        setTimeout(() => {
            const feedback = document.getElementById('feedback');
            if (feedback && feedback.textContent) {
                feedback.classList.add('floating');
            }
        }, 800);
        
        // 피드백 완전히 사라지기
        setTimeout(() => {
            const feedback = document.getElementById('feedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
        }, 3000);
    }

    // 영어 게임 시작
    startEnglishGame(groupName) {
        this.gameMode = 'english';
        this.currentWordGroup = groupName;
        this.currentWordList = wordGroups[groupName] || englishWords;
        this.currentWordIndex = 0;
        this.currentQuestion = 0;
        this.gameScore = 0;
        
        // 무한 모드 - totalQuestions 설정 제거
        
        // 단어 목록 섞기
        this.shuffleArray(this.currentWordList);
        
        this.hideAllScreens();
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('math-answers').classList.add('hidden');
        document.getElementById('english-answers').classList.remove('hidden');
        
        // 영어 게임 전용 뜻 토글 버튼 표시
        document.getElementById('meaning-toggle-container').classList.remove('hidden');
        
        this.currentScreen = 'game';
        this.generateEnglishProblem();
        this.updateUI();
        this.updateMeaningToggleButton();
    }

    // 영어 문제 생성
    generateEnglishProblem() {
        this.englishStartTime = Date.now();
        const currentWord = this.currentWordList[this.currentWordIndex];
        
        // 뜻 표시 설정에 따라 단어와 뜻을 함께 표시
        const wordDisplay = this.showMeaning 
            ? `${currentWord.word} (${currentWord.meaning})`
            : currentWord.word;
        
        document.getElementById('question-text').textContent = wordDisplay;
        document.getElementById('question-visual').innerHTML = `
            <div style="margin-top: 1rem; padding: 1rem; background: #f0f8ff; border-radius: 10px;">
                <p style="font-size: 1.2rem; color: #666;">이 단어를 아시나요?</p>
                <button onclick="app.speakWord('${currentWord.word}')" style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #4ECDC4; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    🔊 발음 듣기
                </button>
            </div>
        `;
        
        // 별도 뜻 표시 영역은 더 이상 사용하지 않음
        document.getElementById('word-meaning').classList.add('hidden');
        
        document.getElementById('feedback').textContent = '';
        document.getElementById('feedback').className = 'feedback';
        
        this.showCharacterMessage('이 단어를 알고 있나요? 🤔');
    }

    // 단어 발음 재생
    speakWord(word) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    }

    // 뜻 표시/숨김 토글
    toggleMeaningDisplay() {
        this.showMeaning = !this.showMeaning;
        this.updateMeaningToggleButton();
        
        // 현재 문제 다시 생성하여 뜻 표시 상태 반영
        if (this.gameMode === 'english' && this.currentWordList.length > 0) {
            const currentWord = this.currentWordList[this.currentWordIndex];
            const wordDisplay = this.showMeaning 
                ? `${currentWord.word} (${currentWord.meaning})`
                : currentWord.word;
            document.getElementById('question-text').textContent = wordDisplay;
        }
    }

    // 뜻 토글 버튼 상태 업데이트
    updateMeaningToggleButton() {
        const toggleBtn = document.getElementById('meaning-toggle-btn');
        const toggleIcon = document.getElementById('meaning-toggle-icon');
        const toggleText = document.getElementById('meaning-toggle-text');
        
        if (this.showMeaning) {
            toggleIcon.textContent = '🙈';
            toggleText.textContent = '뜻 숨기기';
            toggleBtn.classList.add('hide-meaning');
            toggleBtn.classList.remove('show-meaning');
        } else {
            toggleIcon.textContent = '👁️';
            toggleText.textContent = '뜻 보기';
            toggleBtn.classList.add('show-meaning');
            toggleBtn.classList.remove('hide-meaning');
        }
    }

    // 영어 답안 제출
    submitEnglishAnswer(knows) {
        const currentWord = this.currentWordList[this.currentWordIndex];
        const timeSpent = ((Date.now() - this.englishStartTime) / 1000).toFixed(1);
        
        this.processEnglishAnswer(knows, timeSpent, currentWord);
    }

    // 영어 답안 처리
    processEnglishAnswer(knows, timeSpent, currentWord) {
        const feedback = document.getElementById('feedback');
        
        // 정답 표시
        feedback.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">
                    <strong>${currentWord.word}</strong> = <strong>${currentWord.meaning}</strong>
                </div>
                <div style="font-size: 1rem; color: #666;">
                    ${knows ? '잘했어요! 🎉' : '이제 알았죠! 📚'} (${timeSpent}초)
                </div>
            </div>
        `;
        
        if (knows) {
            feedback.className = 'feedback correct';
            this.gameScore += Math.max(50 - Math.floor(timeSpent * 2), 10);
            this.showCharacterMessage(this.getCorrectMessage());
            this.playSuccessSound();
        } else {
            feedback.className = 'feedback incorrect';
            this.showCharacterMessage('괜찮아요! 다음에는 기억할 거예요! 💪');
            this.playErrorSound();
        }
        
        // 단어 통계 업데이트
        this.updateWordStats(currentWord.word, knows);
        
        // 게임 기록 저장
        this.saveGameRecord('영어', this.currentWordGroup, knows, timeSpent);
        
        this.currentQuestion++;
        this.currentWordIndex++;
        this.updateUI();
        
        // 다음 문제 또는 게임 종료
        setTimeout(() => {
            // 단어 목록이 끝나면 다시 섞어서 반복
            if (this.currentWordIndex >= this.currentWordList.length) {
                this.currentWordIndex = 0;
                this.shuffleArray(this.currentWordList);
            }
            this.generateEnglishProblem();
        }, 1000); // 3초에서 1초로 단축
        
        // 피드백은 더 오래 표시 (다음 문제가 나와도 계속 보임)
        setTimeout(() => {
            const feedback = document.getElementById('feedback');
            if (feedback && feedback.textContent) {
                feedback.classList.add('floating');
            }
        }, 1000);
        
        // 피드백 완전히 사라지기
        setTimeout(() => {
            const feedback = document.getElementById('feedback');
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'feedback';
            }
        }, 4000);
    }

    // 단어 통계 업데이트
    updateWordStats(word, isCorrect) {
        if (!this.wordStats[word]) {
            this.wordStats[word] = { correct: 0, wrong: 0 };
        }
        
        if (isCorrect) {
            this.wordStats[word].correct++;
        } else {
            this.wordStats[word].wrong++;
        }
        
        localStorage.setItem('wordStats', JSON.stringify(this.wordStats));
    }

    // 게임 기록 저장
    saveGameRecord(subject, mode, isCorrect, timeSpent) {
        const record = {
            subject: subject,
            mode: mode,
            isCorrect: isCorrect,
            timeSpent: parseFloat(timeSpent),
            timestamp: new Date().toISOString()
        };
        
        this.gameHistory.unshift(record);
        if (this.gameHistory.length > 100) {
            this.gameHistory = this.gameHistory.slice(0, 100);
        }
        
        localStorage.setItem('gameHistory', JSON.stringify(this.gameHistory));
    }

    // 게임 종료
    endGame() {
        const finalScore = this.gameScore;
        this.totalScore += finalScore;
        
        // 레벨업 체크
        const newLevel = Math.floor(this.totalScore / 1000) + 1;
        const leveledUp = newLevel > this.userLevel;
        this.userLevel = newLevel;
        
        // 로컬 스토리지에 저장
        localStorage.setItem('totalScore', this.totalScore.toString());
        localStorage.setItem('userLevel', this.userLevel.toString());
        
        // 결과 표시
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🎉 게임 완료! 🎉</div>
                <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">획득 점수: ${finalScore}점</div>
                <div style="font-size: 1rem; color: #666;">총 점수: ${this.totalScore}점</div>
                ${leveledUp ? '<div style="font-size: 1.1rem; color: #FF6B9D; margin-top: 0.5rem;">🏆 레벨업! 🏆</div>' : ''}
            </div>
        `;
        feedback.className = 'feedback correct';
        
        this.updateUI();
        this.showCharacterMessage('수고했어요! 정말 잘했어요! 🌟');
        
        if (leveledUp) {
            setTimeout(() => {
                this.showAchievement();
            }, 2000);
        }
        
        // 5초 후 메인 메뉴로 돌아가기
        setTimeout(() => {
            this.showMainMenu();
        }, 5000);
    }

    // 성취 팝업 표시
    showAchievement() {
        const popup = document.getElementById('achievement-popup');
        popup.classList.remove('hidden');
        
        document.querySelector('.achievement-title').textContent = '레벨업!';
        document.querySelector('.achievement-text').textContent = `${this.userLevel}레벨에 도달했어요!`;
    }

    // 성취 팝업 닫기
    closeAchievement() {
        document.getElementById('achievement-popup').classList.add('hidden');
    }

    // 게임 나가기
    exitGame() {
        this.showMainMenu();
    }

    // 통계 표시 업데이트
    updateStatsDisplay() {
        const totalProblems = this.gameHistory.length;
        const correctProblems = this.gameHistory.filter(record => record.isCorrect).length;
        const accuracyRate = totalProblems > 0 ? Math.round((correctProblems / totalProblems) * 100) : 0;
        
        const totalProblemsEl = document.getElementById('total-problems');
        const correctProblemsEl = document.getElementById('correct-problems');
        const accuracyRateEl = document.getElementById('accuracy-rate');
        
        if (totalProblemsEl) totalProblemsEl.textContent = totalProblems;
        if (correctProblemsEl) correctProblemsEl.textContent = correctProblems;
        if (accuracyRateEl) accuracyRateEl.textContent = accuracyRate + '%';
        
        this.updateWordStats();
        this.updateRecentHistory();
    }

    // 최근 기록 업데이트
    updateRecentHistory() {
        const recentRecords = this.gameHistory.slice(0, 10);
        const historyContainer = document.getElementById('recent-history');
        
        historyContainer.innerHTML = recentRecords.map(record => {
            const date = new Date(record.timestamp).toLocaleDateString();
            const result = record.isCorrect ? '✅' : '❌';
            return `
                <div class="history-item">
                    <div class="history-subject">${record.subject} - ${record.mode}</div>
                    <div class="history-result">${result} ${record.timeSpent}초 (${date})</div>
                </div>
            `;
        }).join('');
    }

    // 캐릭터 메시지 표시
    showCharacterMessage(message = null) {
        const messages = message ? [message] : [
            '화이팅! 💪',
            '잘하고 있어요! 😊',
            '집중해봐요! 🤔',
            '거의 다 왔어요! 🌟',
            '멋져요! 👏'
        ];
        
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        const speechBubble = document.getElementById('character-speech');
        speechBubble.textContent = randomMessage;
        
        // 3초 후 메시지 사라지기
        setTimeout(() => {
            speechBubble.textContent = '';
        }, 3000);
    }

    // 캐릭터 축하 애니메이션
    showCharacterCelebration() {
        const character = document.getElementById('character');
        const originalChar = character.textContent;
        
        // 축하 애니메이션 시퀀스
        const celebrationSequence = ['🎉', '⭐', '🎊', '🌟', '🎉'];
        let index = 0;
        
        const animationInterval = setInterval(() => {
            character.textContent = celebrationSequence[index];
            character.style.transform = 'scale(1.3) rotate(10deg)';
            character.style.transition = 'all 0.2s ease';
            
            setTimeout(() => {
                character.style.transform = 'scale(1) rotate(0deg)';
            }, 100);
            
            index++;
            
            if (index >= celebrationSequence.length) {
                clearInterval(animationInterval);
                setTimeout(() => {
                    character.textContent = originalChar;
                    character.style.transform = 'scale(1) rotate(0deg)';
                }, 200);
            }
        }, 200);
    }

    // 격려 메시지 가져오기
    getEncouragementMessage() {
        const messages = [
            '새로운 문제예요! 🤗',
            '이번엔 어떨까요? 🎯',
            '천천히 생각해보세요! 💭',
            '할 수 있어요! 💪',
            '집중! 집중! 🎯'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // 정답 메시지 가져오기
    getCorrectMessage() {
        const messages = [
            '정답이에요! 🎉',
            '대단해요! 👏',
            '완벽해요! ⭐',
            '잘했어요! 😊',
            '최고예요! 🏆'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // 오답 메시지 가져오기
    getIncorrectMessage() {
        const messages = [
            '괜찮아요! 다시 해봐요! 💪',
            '실수는 배움이에요! 📚',
            '다음엔 맞힐 거예요! 😊',
            '포기하지 마세요! 🌟',
            '연습하면 늘어요! 📈'
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // 배열 섞기
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // 단어별 통계 업데이트
    updateWordStats() {
        const wordStatsContainer = document.getElementById('word-stats');
        
        if (Object.keys(this.wordStats).length === 0) {
            wordStatsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📚</div>
                    <h3>아직 영어 단어 학습 기록이 없습니다</h3>
                    <p style="margin-top: 1rem;">영어 단어 게임을 플레이하면 여기에 통계가 표시됩니다!</p>
                </div>
            `;
            return;
        }
        
        // 정확도가 낮은 단어를 우선적으로 표시하고, 학습 횟수가 많은 순으로 정렬
        const sortedWords = Object.entries(this.wordStats)
            .filter(([, stats]) => (stats.correct + stats.wrong) >= 2) // 최소 2회 이상 학습한 단어만
            .sort(([,a], [,b]) => {
                const accuracyA = a.correct / (a.correct + a.wrong);
                const accuracyB = b.correct / (b.correct + b.wrong);
                
                // 정확도가 낮은 순서대로, 같으면 학습 횟수가 많은 순서로
                if (Math.abs(accuracyA - accuracyB) < 0.1) {
                    return (b.correct + b.wrong) - (a.correct + a.wrong);
                }
                return accuracyA - accuracyB;
            })
            .slice(0, 24); // 더 많은 단어 표시 (6x4 그리드)
        
        let statsHTML = '<div class="word-stats-list">';
        
        sortedWords.forEach(([word, stats]) => {
            const total = stats.correct + stats.wrong;
            const accuracy = Math.round((stats.correct / total) * 100);
            const accuracyClass = accuracy >= 80 ? 'excellent' : accuracy >= 60 ? 'good' : 'needs-practice';
            
            // 우선 연습이 필요한 단어를 강조
            const priorityBadge = accuracy < 60 ? '<span style="color: #dc3545; font-weight: bold;">연습 필요!</span>' : '';
            
            statsHTML += `
                <div class="word-stat-item ${accuracyClass}">
                    <div class="word-info">
                        <span class="word-name">${word}</span>
                        <span class="word-accuracy ${accuracyClass}">${accuracy}%</span>
                        ${priorityBadge}
                    </div>
                    <div class="word-details">
                        <span class="correct-count">✅ ${stats.correct}</span>
                        <span class="wrong-count">❌ ${stats.wrong}</span>
                        <span class="total-count">총 ${total}회</span>
                    </div>
                </div>
            `;
        });
        
        statsHTML += '</div>';
        wordStatsContainer.innerHTML = statsHTML;
    }

    // 모든 기록 초기화
    resetAllData() {
        if (confirm('정말로 모든 학습 기록을 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            if (confirm('마지막 확인입니다. 모든 점수, 레벨, 학습 기록이 삭제됩니다.\n계속하시겠습니까?')) {
                // 모든 데이터 초기화
                this.totalScore = 0;
                this.userLevel = 1;
                this.gameHistory = [];
                this.wordStats = {};
                
                // 로컬 스토리지 초기화
                localStorage.removeItem('totalScore');
                localStorage.removeItem('userLevel');
                localStorage.removeItem('gameHistory');
                localStorage.removeItem('wordStats');
                
                // UI 업데이트
                this.updateUI();
                this.updateStatsDisplay();
                
                alert('모든 기록이 초기화되었습니다! 🆕');
            }
        }
    }

    // 성공 사운드 (Web Audio API 또는 간단한 beep)
    playSuccessSound() {
        // 간단한 성공 사운드 구현
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }

    // 오류 사운드
    playErrorSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }
}

// 전역 함수들 (HTML에서 호출)
function showMainMenu() {
    app.showMainMenu();
}

function showMathMenu() {
    app.showMathMenu();
}

function showEnglishMenu() {
    app.showEnglishMenu();
}

function showStats() {
    app.showStats();
}

function startMathGame(type) {
    app.startMathGame(type);
}

function startEnglishGame(groupName) {
    app.startEnglishGame(groupName);
}

function exitGame() {
    app.exitGame();
}

function closeAchievement() {
    app.closeAchievement();
}

// 앱 초기화
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new LearningApp();
});

