import React, { useState, useEffect, useRef, useCallback } from 'react';

// Main App component to manage the flow of the website
function App() {
  // `currentPage` state determines which section of the website is displayed.
  // Possible values: 'welcome', 'question_1'...'question_10', 'game_sudoku', 'game_ball', 'game_maze', 'game_snake', 'treasure'.
  const [currentPage, setCurrentPage] = useState('welcome');
  // `questionAnswers` stores the answers provided by the user for each question.
  const [questionAnswers, setQuestionAnswers] = useState({});

  // Array of questions for the quiz section.
  const questions = [
    "أي لون بتحبي تلبسيه أكثر شي؟",
    "أيا أكثر غنية بتحبي غنيلك ياها؟",
    "شو أكثر مكان بتحبي نقضي فيه وقت سوا؟",
    "شو أكثر عبارة بتحبي قلك ياها؟",
    "شو نوع الكتاب يلي بتحبي نقراه سوا ببيتنا؟ وغير يلي ببالي بالك",
    "شو أكثر نوع لمس بتحبي ألمسك ياه ووين؟",
    "إذا بدك توصفي حبنا بفاكهة شو بتكون؟",
    "وقت تكوني تعبانة شو أكثر شي بتحبي أعملك ياه؟",
    "عبالك نتعلم عن النجوم وأسماءها؟",
    "شو نوع الموسيقى يلي بتوصفيها لحبنا؟"
  ];

  // The heartfelt treasure message from Shahed.
  // Removed leading spaces from each line for better text flow with white-space: pre-wrap
  const treasureMessage = `إلى طفلتي المدللة
حبيبتي الصغيرة
جميلتي النابضة بالحياة
إلى من تصنع لي ضحكتي قبل أن تصنع نهاري (وأنتِ تفعلين كليهما)
إلى بوصلة قلبي ومن يتجه لها قلبي دائمًا
إلى حبيبتي الوحيدة التي أؤمن بها
إلى ثقتي الوحيدة
وملجأي الجميل
إلى منزلي الدافئ وحبي الوحيد
أحب كل يوم أقضيه معكِ وكل يوم هو كنز لي
وأنتِ كنزي الوحيد وكم أتمنى يا كنزي أن نكون في بيتنا في يومكِ وكل يوم يا ملكة العمر كله
أحب لمسة يداكِ على وجهي وبين شعري وأحب كل شيء فيكِ
أحب أذنكِ اللذيذة
وأحب قلبكِ الجميل
أحب كيف تضحكين وكيف تحردين وكيف تكابرين
أحب كيف تحبينني وأحب حبنا وأحبكِ أكثر مني ومن حبنا
أحب تذوقكِ مع كل النكهات في العالم
وأريد أن ندور العالم سويًا
أريد أن أتعلم كل لغة في العالم لأجلكِ ولأجل أن أقول احبكِ جدًا
أريد أن آخذكِ لقلبي
كل عام وأنتِ قديستي
كل عام وأنتِ منارتي
كل عام وأنتِ نجومي
كل عام وأنتِ في بيتنا سواء في قلبي أو في الواقع ويارب العام القادم يكون في الواقع
لو أعطيتكِ كلمات العالم كله لن أكفيكِ لأنكِ ببساطة العالم والكلمات كلهم
كل عام وأنتِ حبي الوحيد بخير جميلة مشرقة تنيرين العالم بابتسامتك
منذ اليوم احببت 23 يا اجمل من دخل في هذا العمر
أعوامًا سعيدة طفلتي الصغيرة
`;

  // Handles navigation between different sections of the website.
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Component for the welcome page.
  const WelcomePage = () => (
    <div className="page-container welcome-page-bg">
      <h1 className="welcome-title animate-fade-in-down">
       Happy Birthday my Star ❤️
      </h1>
      <p className="welcome-subtitle animate-fade-in-up">
        هذه رحلة صغيرة أعددتها لكِ خصيصًا.
      </p>
      <button
        onClick={() => navigateTo('question_1')}
        className="button primary-button animate-bounce-slow"
      >
        بلشي يا حلوة
      </button>
    </div>
  );

  // Reusable component for displaying a question and handling input.
  const QuestionPage = ({ questionIndex, questionAnswers, setQuestionAnswers }) => {
    const questionText = questions[questionIndex - 1];
    const [inputValue, setInputValue] = useState(questionAnswers[`question_${questionIndex}`] || '');
    const [llmCompliment, setLlmCompliment] = useState('');
    const [isLoadingCompliment, setIsLoadingCompliment] = useState(false);

    useEffect(() => {
      setInputValue(questionAnswers[`question_${questionIndex}`] || '');
      setLlmCompliment('');
    }, [questionIndex, questionAnswers]);

    const handleInputChange = (e) => {
      setInputValue(e.target.value);
    };

    const generateCompliment = async () => {
      setIsLoadingCompliment(true);
      setLlmCompliment('');
      try {
        // Changed prompt to request a single, direct compliment
        const prompt = `Given the question: '${questionText}' and the answer provided: '${inputValue}', write a single, very short, sweet, and loving compliment (in Arabic) from a partner to their girlfriend, directly related to her answer. Keep it under 20 words. Do not provide options or any additional text, just the compliment.`;
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyB4GxqqBBTFbJ-A_UsLafA3qKzW_RIvzQY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setLlmCompliment(text);
        } else {
          setLlmCompliment('عفوًا، لم أتمكن من توليد تعليق الآن.');
        }
      } catch (error) {
        console.error("Error generating compliment:", error);
        setLlmCompliment('حدث خطأ أثناء توليد التعليق.');
      } finally {
        setIsLoadingCompliment(false);
      }
    };

    const handleNext = () => {
      setQuestionAnswers(prevAnswers => ({
        ...prevAnswers,
        [`question_${questionIndex}`]: inputValue.trim()
      }));

      if (questionIndex < questions.length) {
        navigateTo(`question_${questionIndex + 1}`);
      } else {
        navigateTo('game_sudoku');
      }
    };

    return (
      <div className="page-container question-page-bg">
        <div className="card question-card">
          <h2 className="card-title animate-fade-in">
            السؤال رقم {questionIndex}
          </h2>
          <p className="question-text animate-slide-in-left">
            {questionText}
          </p>
          <textarea
            className="question-textarea animate-fade-in-up"
            placeholder="كتبي جوابك هون حبيبي.."
            value={inputValue}
            onChange={handleInputChange}
          ></textarea>
          <div className="button-group">
            <button
              onClick={handleNext}
              disabled={!inputValue.trim()}
              className={`button primary-button-blue animate-bounce-short ${!inputValue.trim() ? 'button-disabled' : ''}`}
            >
              التالي
            </button>
            {inputValue.trim() && (
                <button
                    onClick={generateCompliment}
                    disabled={isLoadingCompliment}
                    className={`button secondary-button-purple ${isLoadingCompliment ? 'button-disabled' : ''}`}
                >
                    {isLoadingCompliment ? 'جاري التوليد...' : '✨ تعليق ليّ'}
                </button>
            )}
          </div>
          {llmCompliment && (
            <p className="llm-message animate-fade-in-up">
              {llmCompliment}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Sudoku Game Component
  // The correct solution for the puzzle for validation.
  const solvedBoard = [ // Moved outside component to prevent re-creation on re-renders
    [1, 2, 3, 4],
    [4, 3, 2, 1],
    [3, 1, 4, 2],
    [2, 4, 1, 3]
  ];

  const SudokuGame = () => {
    // A simple 4x4 Sudoku puzzle. 0 represents empty cells.
    // This is the initial state of the board.
    const initialBoard = [
      [1, 0, 0, 4],
      [0, 3, 0, 1],
      [0, 1, 4, 0],
      [2, 0, 0, 3]
    ];
    
    const [board, setBoard] = useState(initialBoard.map(row => [...row]));
    const [isSolved, setIsSolved] = useState(false);
    const [message, setMessage] = useState('');

    const handleCellChange = (rowIndex, colIndex, value) => {
      if (value === '' || (value >= '1' && value <= '4')) {
        const newBoard = board.map(row => [...row]);
        newBoard[rowIndex][colIndex] = value === '' ? 0 : parseInt(value);
        setBoard(newBoard);
        setMessage('');
        if (checkSudokuSolved(newBoard, solvedBoard)) {
          setIsSolved(true);
          setMessage('لك انتتت فنااانة 🎉');
        } else {
          setIsSolved(false);
        }
      }
    };

    const checkSudokuSolved = (currentBoard, solution) => {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (currentBoard[i][j] !== solution[i][j]) {
            return false;
          }
        }
      }
      return true;
    };

    useEffect(() => {
      if (checkSudokuSolved(board, solvedBoard)) {
        setIsSolved(true);
        setMessage('والله انك عظيمة 🎉');
      } else {
        setIsSolved(false);
        // Only clear message if it was a success message, otherwise keep error messages if any.
        if (message.includes('تهانينا')) {
          setMessage('');
        }
      }
    }, [board, solvedBoard, message]);

    const handleNextGame = () => {
      navigateTo('game_ball');
    };

    const renderCell = (value, rowIndex, colIndex) => {
      const isFixed = initialBoard[rowIndex][colIndex] !== 0;
      const cellValue = value === 0 ? '' : value;

      return (
        <input
          key={`${rowIndex}-${colIndex}`}
          type="text"
          maxLength="1"
          value={cellValue}
          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
          readOnly={isFixed}
          className={`
            sudoku-cell
            ${isFixed ? 'sudoku-cell-fixed' : 'sudoku-cell-editable'}
            ${(colIndex + 1) % 2 === 0 && colIndex !== 3 ? 'sudoku-border-right' : ''}
            ${(rowIndex + 1) % 2 === 0 && rowIndex !== 3 ? 'sudoku-border-bottom' : ''}
          `}
        />
      );
    };

    return (
      <div className="page-container sudoku-page-bg">
        <div className="card game-card">
          <h2 className="card-title game-title-green animate-scale-in">
             لعبة سودوكو بسيطة كتيير
          </h2>
          <p className="game-instructions animate-fade-in-up">
            املئي الأرقام من 1 إلى 4 في كل صف، عمود، ومربع 2x2.
          </p>

          <div className="sudoku-grid">
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))
            )}
          </div>

          {message && (
            <p className={`game-message animate-fade-in ${isSolved ? 'game-message-success' : 'game-message-error'}`}>
              {message}
            </p>
          )}

          <button
            onClick={handleNextGame}
            disabled={!isSolved}
            className={`button primary-button-green animate-bounce-short ${!isSolved ? 'button-disabled' : ''}`}
          >
            {isSolved ? 'اللعبة التالية (كرة الدوائر)' : 'كملي انستي مافي سكيب هون'}
          </button>
        </div>
      </div>
    );
  };

  // Ball & Circles Game Component
  const BallGame = () => {
    const canvasRef = useRef(null);
    const game = useRef({
      ball: { x: 0, y: 0, radius: 10, dx: 0, dy: 0 },
      circles: [],
      score: 0,
      status: 'playing',
      targetScore: 5,
      ballSpeed: 3,
      circleCount: 5,
      animationFrameId: null,
    });

    const [displayScore, setDisplayScore] = useState(0);
    const [displayGameStatus, setDisplayGameStatus] = useState('playing');

    const drawBall = (ctx, ball) => {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6347';
      ctx.fill();
      ctx.closePath();
    };

    const drawCircle = (ctx, circle) => {
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
      ctx.fillStyle = circle.color;
      ctx.fill();
      ctx.closePath();
    };

    const drawScore = (ctx, currentScore, canvasWidth, targetScore) => {
      ctx.font = '20px Inter';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.fillText(`النقاط: ${currentScore}`, 10, 30);
      ctx.textAlign = 'right';
      ctx.fillText(`الهدف: ${targetScore}`, canvasWidth - 10, 30);
    };

    // Use useCallback for generateCircles to ensure its stability
    const generateCircles = useCallback((canvas, ballObj) => {
      const newCircles = [];
      for (let i = 0; i < game.current.circleCount; i++) {
        let newX, newY, tooClose;
        do {
          newX = Math.random() * (canvas.width - 40) + 20;
          newY = Math.random() * (canvas.height - 40) + 20;
          const distance = Math.sqrt(
            (ballObj.x - newX) ** 2 + (ballObj.y - newY) ** 2
          );
          tooClose = distance < ballObj.radius + 20;
        } while (tooClose);

        newCircles.push({
          x: newX,
          y: newY,
          radius: 8,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
      }
      game.current.circles = newCircles;
    }, [game.current.circleCount]); // Dependencies for generateCircles

    // Wrapped gameLoop in useCallback to make it stable
    const gameLoop = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || game.current.status !== 'playing') {
        game.current.animationFrameId = null;
        return;
      }
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ball = game.current.ball;
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > canvas.width) ball.x = canvas.width - ball.radius;
      if (ball.x - ball.radius < 0) ball.x = ball.radius;
      if (ball.y + ball.radius > canvas.height) ball.y = canvas.height - ball.radius;
      if (ball.y - ball.radius < 0) ball.y = ball.radius;

      game.current.circles = game.current.circles.filter(circle => {
        const distance = Math.sqrt(
          (ball.x - circle.x) ** 2 + (ball.y - circle.y) ** 2
        );
        if (distance < ball.radius + circle.radius) {
          game.current.score += 1;
          setDisplayScore(game.current.score);
          return false;
        }
        return true;
      });

      if (game.current.circles.length === 0 && game.current.score < game.current.targetScore) {
        generateCircles(canvas, game.current.ball);
      }

      if (game.current.score >= game.current.targetScore && game.current.status === 'playing') {
        game.current.status = 'won';
        setDisplayGameStatus('won');
      }

      drawBall(ctx, ball);
      game.current.circles.forEach(c => drawCircle(ctx, c));
      drawScore(ctx, game.current.score, canvas.width, game.current.targetScore);

      game.current.animationFrameId = requestAnimationFrame(gameLoop);
    }, [setDisplayScore, setDisplayGameStatus, generateCircles]); // Add dependencies needed by gameLoop


    // `initializeGame` function wrapped in `useCallback`
    const initializeGame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      game.current.ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        dx: 0,
        dy: 0
      };
      game.current.circles = [];
      game.current.score = 0;
      game.current.status = 'playing';
      game.current.animationFrameId = null;

      setDisplayScore(0);
      setDisplayGameStatus('playing');

      generateCircles(canvas, game.current.ball);

      if (game.current.animationFrameId) {
        cancelAnimationFrame(game.current.animationFrameId);
      }
      game.current.animationFrameId = requestAnimationFrame(gameLoop); 
    }, [gameLoop, generateCircles]); // initializeGame now depends on gameLoop and generateCircles

    useEffect(() => {
      initializeGame();

      const handleKeyDown = (e) => {
        if (game.current.status !== 'playing') return;
        switch (e.key) {
          case 'ArrowUp': game.current.ball.dy = -game.current.ballSpeed; game.current.ball.dx = 0; break;
          case 'ArrowDown': game.current.ball.dy = game.current.ballSpeed; game.current.ball.dx = 0; break;
          case 'ArrowLeft': game.current.ball.dx = -game.current.ballSpeed; game.current.ball.dy = 0; break;
          case 'ArrowRight': game.current.ball.dx = game.current.ballSpeed; game.current.ball.dy = 0; break;
          default: break;
        }
      };

      const handleKeyUp = (e) => {
        if (game.current.status !== 'playing') return;
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowDown': game.current.ball.dy = 0; break;
          case 'ArrowLeft':
          case 'ArrowRight': game.current.ball.dx = 0; break;
          default: break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', initializeGame);

      return () => {
        window.removeEventListener('resize', initializeGame);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        if (game.current.animationFrameId) {
          cancelAnimationFrame(game.current.animationFrameId);
        }
      };
    }, [initializeGame]);

    const handleTouchMove = (direction) => {
        if (game.current.status !== 'playing') return;
        switch (direction) {
            case 'up': game.current.ball.dy = -game.current.ballSpeed; game.current.ball.dx = 0; break;
            case 'down': game.current.ball.dy = game.current.ballSpeed; game.current.ball.dx = 0; break;
            case 'left': game.current.ball.dx = -game.current.ballSpeed; game.current.ball.dy = 0; break;
            case 'right': game.current.ball.dx = game.current.ballSpeed; game.current.ball.dy = 0; break;
            case 'stop': game.current.ball.dx = 0; game.current.ball.dy = 0; break;
            default: break;
        }
    };

    const handleNextGame = () => {
      navigateTo('game_maze');
    };

    const handleResetGame = () => {
        initializeGame();
    };

    return (
      <div className="page-container ball-game-page-bg">
        <div className="card game-card">
          <h2 className="card-title game-title-orange animate-scale-in">
            لعبة كرة تنط وتأكل الدوائر
          </h2>
          <p className="game-instructions animate-fade-in-up">
            استخدمي الأسهم أو الأزرار لجمع 5 دوائر ملونة!
          </p>

          <canvas
            ref={canvasRef}
            className="game-canvas game-canvas-orange"
            style={{ touchAction: 'none' }}
          ></canvas>

          {displayGameStatus === 'won' && (
            <p className="game-message game-message-success animate-fade-in">
              تهانينا! لقد جمعتِ كل الدوائر! 🎉
            </p>
          )}
          {displayGameStatus === 'lost' && (
            <p className="game-message game-message-error animate-fade-in">
              للأسف، لم تجمعي كل الدوائر.
            </p>
          )}

          {/* Display current score */}
          <p className="game-score-display">النقاط: {displayScore} / {game.current.targetScore}</p>


          <div className="on-screen-controls">
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('up')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('up')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬆️
            </button>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('left')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('left')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬅️
            </button>
            <div className="control-spacer"></div>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('right')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('right')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ➡️
            </button>
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('down')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('down')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬇️
            </button>
          </div>

          <div className="button-group-bottom">
            <button
              onClick={handleResetGame}
              className="button secondary-button-gray"
            >
              إعادة اللعب
            </button>
            <button
              onClick={handleNextGame}
              disabled={displayGameStatus !== 'won'}
              className={`button primary-button-orange animate-bounce-short ${displayGameStatus !== 'won' ? 'button-disabled' : ''}`}
            >
              {displayGameStatus === 'won' ? 'اللعبة التالية (المتاهة)' : 'كملي كملي'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Maze Game Component
  const MazeGame = () => {
    const canvasRef = useRef(null);
    const game = useRef({
      maze: [ // 0 = path, 1 = wall, 2 = start, 3 = end
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 3, 1], // End point at (9,8)
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
      player: { x: 0, y: 0, size: 10, speed: 2 }, // Player position and speed
      cellSize: 0, // Calculated cell size
      status: 'playing', // 'playing', 'won'
      animationFrameId: null,
    });

    const [displayGameStatus, setDisplayGameStatus] = useState('playing'); // For displaying messages

    // Helper to find start and end positions
    const findStartEnd = (maze) => {
      let start = { row: 0, col: 0 };
      let end = { row: 0, col: 0 };
      for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
          if (maze[r][c] === 2) {
            start = { row: r, col: c };
          } else if (maze[r][c] === 3) {
            end = { row: r, col: c };
          }
        }
      }
      return { start, end };
    };

    // Draw the maze and player
    const drawMaze = (ctx, maze, player, cellSize, startPos, endPos) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      for (let r = 0; r < maze.length; r++) {
        for (let c = 0; c < maze[r].length; c++) {
          const x = c * cellSize;
          const y = r * cellSize;

          if (maze[r][c] === 1) { // Wall
            ctx.fillStyle = '#4B5563'; // Dark gray for walls
            ctx.fillRect(x, y, cellSize, cellSize);
          } else if (maze[r][c] === 0) { // Path
            ctx.fillStyle = '#D1D5DB'; // Light gray for path
            ctx.fillRect(x, y, cellSize, cellSize);
          }
        }
      }

      // Draw start point
      ctx.fillStyle = '#34D399'; // Green for start
      ctx.beginPath();
      ctx.arc(startPos.col * cellSize + cellSize / 2, startPos.row * cellSize + cellSize / 2, cellSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${cellSize * 0.5}px Inter`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('البداية', startPos.col * cellSize + cellSize / 2, startPos.row * cellSize + cellSize / 2);

      // Draw end point
      ctx.fillStyle = '#EF4444'; // Red for end
      ctx.beginPath();
      ctx.arc(endPos.col * cellSize + cellSize / 2, endPos.row * cellSize + cellSize / 2, cellSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${cellSize * 0.5}px Inter`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('النهاية', endPos.col * cellSize + cellSize / 2, endPos.row * cellSize + cellSize / 2);

      // Draw player ball
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
      ctx.fillStyle = '#6366F1'; // Indigo blue for player
      ctx.fill();
      ctx.closePath();
    };

    // Check for collision with walls
    const checkCollision = (newX, newY, maze, cellSize, playerSize) => {
      const top = newY - playerSize;
      const bottom = newY + playerSize;
      const left = newX - playerSize;
      const right = newX + playerSize;

      // Determine the cells the ball might be overlapping
      const cellsToCheck = [
        [Math.floor(top / cellSize), Math.floor(left / cellSize)],
        [Math.floor(top / cellSize), Math.floor(right / cellSize)],
        [Math.floor(bottom / cellSize), Math.floor(left / cellSize)],
        [Math.floor(bottom / cellSize), Math.floor(right / cellSize)],
      ];

      for (const [r, c] of cellsToCheck) {
        // Check bounds and if it's a wall
        if (r < 0 || r >= maze.length || c < 0 || c >= maze[0].length || maze[r][c] === 1) {
          // Additional check for actual overlap with wall's boundaries (more precise)
          const cellX1 = c * cellSize;
          const cellY1 = r * cellSize;
          const cellX2 = cellX1 + cellSize;
          const cellY2 = cellY1 + cellSize;

          // Check if bounding circles/rects overlap
          if (newX + playerSize > cellX1 && newX - playerSize < cellX2 &&
              newY + playerSize > cellY1 && newY - playerSize < cellY2) {
            return true; // Collision detected
          }
        }
      }
      return false; // No collision
    };


    // Wrapped gameLoop in useCallback to make it stable
    const gameLoop = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || game.current.status !== 'playing') {
        game.current.animationFrameId = null;
        return;
      }
      const ctx = canvas.getContext('2d');
      const { maze, player, cellSize, endPos } = game.current;

      const newPlayerX = player.x + player.dx;
      const newPlayerY = player.y + player.dy;

      // Check for wall collision before moving
      if (!checkCollision(newPlayerX, newPlayerY, maze, cellSize, player.size)) {
        player.x = newPlayerX;
        player.y = newPlayerY;
      } else {
        // If collision, stop movement in that direction
        player.dx = 0;
        player.dy = 0;
      }

      // Check win condition
      const playerGridCol = Math.floor(player.x / cellSize);
      const playerGridRow = Math.floor(player.y / cellSize);

      if (playerGridCol === endPos.col && playerGridRow === endPos.row) {
        game.current.status = 'won';
        setDisplayGameStatus('won');
        cancelAnimationFrame(game.current.animationFrameId);
        return;
      }

      drawMaze(ctx, maze, player, cellSize, game.current.startPos, endPos);
      game.current.animationFrameId = requestAnimationFrame(gameLoop);
    }, [setDisplayGameStatus]); // Only setDisplayGameStatus as dependency, and implicitly game.current data.

    // `initializeGame` function wrapped in `useCallback`
    const initializeGame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const mazeRows = game.current.maze.length;
      const mazeCols = game.current.maze[0].length;

      const maxCanvasSize = Math.min(canvas.offsetWidth, canvas.offsetHeight);
      const calculatedCellSize = Math.floor(maxCanvasSize / Math.max(mazeRows, mazeCols));

      canvas.width = calculatedCellSize * mazeCols;
      canvas.height = calculatedCellSize * mazeRows;
      game.current.cellSize = calculatedCellSize;

      const { start, end } = findStartEnd(game.current.maze);
      game.current.startPos = start;
      game.current.endPos = end;

      game.current.player = {
        x: start.col * calculatedCellSize + calculatedCellSize / 2,
        y: start.row * calculatedCellSize + calculatedCellSize / 2,
        size: calculatedCellSize * 0.35,
        speed: calculatedCellSize / 8,
        dx: 0,
        dy: 0
      };

      game.current.status = 'playing';
      setDisplayGameStatus('playing');

      if (game.current.animationFrameId) {
        cancelAnimationFrame(game.current.animationFrameId);
      }
      game.current.animationFrameId = requestAnimationFrame(gameLoop); 
    }, [game.current.maze, gameLoop]); // Added gameLoop to dependency array

    useEffect(() => {
      initializeGame();

      const handleKeyDown = (e) => {
        if (game.current.status !== 'playing') return;
        const player = game.current.player;
        const speed = player.speed;

        switch (e.key) {
          case 'ArrowUp': player.dy = -speed; player.dx = 0; break;
          case 'ArrowDown': player.dy = speed; player.dx = 0; break;
          case 'ArrowLeft': player.dx = -speed; player.dy = 0; break;
          case 'ArrowRight': player.dx = speed; player.dy = 0; break;
          default: break;
        }
      };

      const handleKeyUp = (e) => {
        if (game.current.status !== 'playing') return;
        const player = game.current.player;
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowDown': player.dy = 0; break;
          case 'ArrowLeft':
          case 'ArrowRight': player.dx = 0; break;
          default: break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      window.addEventListener('resize', initializeGame);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('resize', initializeGame);
        if (game.current.animationFrameId) {
          cancelAnimationFrame(game.current.animationFrameId);
        }
      };
    }, [initializeGame]);

    const handleTouchMove = (direction) => {
      if (game.current.status !== 'playing') return;
      const player = game.current.player;
      const speed = player.speed;

      switch (direction) {
        case 'up': player.dy = -speed; player.dx = 0; break;
        case 'down': player.dy = speed; player.dx = 0; break;
        case 'left': player.dx = -speed; player.dx = 0; break; // Corrected dx assignment
        case 'right': player.dx = speed; player.dy = 0; break;
        case 'stop': player.dx = 0; player.dy = 0; break;
        default: break;
      }
    };

    const handleNextGame = () => {
      navigateTo('game_snake');
    };

    return (
      <div className="page-container maze-page-bg">
        <div className="card game-card">
          <h2 className="card-title game-title-red animate-scale-in">
            لعبة المتاهة البسيطة
          </h2>
          <p className="game-instructions animate-fade-in-up">
            استخدمي الأسهم أو الأزرار لتحريك الكرة إلى النهاية!
          </p>

          <canvas
            ref={canvasRef}
            className="game-canvas game-canvas-red"
            width="400"
            height="440"
            style={{ touchAction: 'none' }}
          ></canvas>

          {displayGameStatus === 'won' && (
            <p className="game-message game-message-success animate-fade-in">
              تهانينا! لقد خرجتِ من المتاهة! 🎉
            </p>
          )}

          <div className="on-screen-controls">
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('up')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('up')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬆️
            </button>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('left')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('left')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬅️
            </button>
            <div className="control-spacer"></div>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('right')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('right')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ➡️
            </button>
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('down')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('down')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬇️
            </button>
          </div>

          <button
            onClick={handleNextGame}
            disabled={displayGameStatus !== 'won'}
            className={`button primary-button-red animate-bounce-short ${displayGameStatus !== 'won' ? 'button-disabled' : ''}`}
          >
            {displayGameStatus === 'won' ? 'اللعبة التالية (الثعبان)' : 'عرفتي درسك بدك تكملي كلشي لتنتقلي ليلي بعده'}
          </button>
        </div>
      </div>
    );
  };

  // Snake Game Component
  const SnakeGame = () => {
    const canvasRef = useRef(null);
    const game = useRef({
      snake: [{ x: 10, y: 10 }],
      food: { x: 0, y: 0 },
      direction: 'right',
      score: 0,
      status: 'playing',
      targetScore: 10,
      gridSize: 20,
      gameSpeed: 150,
      animationIntervalId: null,
      canvasWidth: 0,
      canvasHeight: 0,
    });

    const [displayScore, setDisplayScore] = useState(0);
    const [displayGameStatus, setDisplayGameStatus] = useState('playing');

    const drawSquare = (ctx, x, y, size, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#222';
      ctx.strokeRect(x, y, size, size);
    };

    // Use useCallback for generateFood to ensure its stability
    const generateFood = useCallback((canvasWidth, canvasHeight, gridSize, snake) => {
      let newFoodX, newFoodY;
      let collisionWithSnake;
      do {
        newFoodX = Math.floor(Math.random() * (canvasWidth / gridSize)) * gridSize;
        newFoodY = Math.floor(Math.random() * (canvasHeight / gridSize)) * gridSize;

        collisionWithSnake = snake.some(segment => segment.x === newFoodX && segment.y === newFoodY);
      } while (collisionWithSnake);

      game.current.food = { x: newFoodX, y: newFoodY };
    }, []); // generateFood depends only on its args which are passed to it

    // Wrapped gameTick in useCallback to make it stable
    const gameTick = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || game.current.status !== 'playing') {
        clearInterval(game.current.animationIntervalId);
        game.current.animationIntervalId = null;
        return;
      }
      const ctx = canvas.getContext('2d');
      // Destructure current game state once at the start of the tick
      const { snake, food, direction, gridSize, canvasWidth, canvasHeight, targetScore } = game.current;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const head = { ...snake[0] };
      switch (direction) {
        case 'up': head.y -= gridSize; break;
        case 'down': head.y += gridSize; break;
        case 'left': head.x -= gridSize; break;
        case 'right': head.x += gridSize; break;
        default: break;
      }

      if (head.x < 0 || head.x >= canvasWidth || head.y < 0 || head.y >= canvasHeight) {
        game.current.status = 'lost';
        setDisplayGameStatus('lost');
        clearInterval(game.current.animationIntervalId);
        game.current.animationIntervalId = null;
        return;
      }

      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          game.current.status = 'lost';
          setDisplayGameStatus('lost');
          clearInterval(game.current.animationIntervalId);
          game.current.animationIntervalId = null;
          return;
        }
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        game.current.score += 1;
        setDisplayScore(game.current.score);
        generateFood(canvasWidth, canvasHeight, gridSize, snake);
      } else {
        snake.pop();
      }

      if (game.current.score >= targetScore) {
        game.current.status = 'won';
        setDisplayGameStatus('won');
        clearInterval(game.current.animationIntervalId);
        game.current.animationIntervalId = null;
        return;
      }

      snake.forEach((segment, index) => {
        drawSquare(ctx, segment.x, segment.y, gridSize, index === 0 ? '#4CAF50' : '#8BC34A');
      });

      drawSquare(ctx, food.x, food.y, gridSize, '#FFC107');

      // Update score display in the canvas
      ctx.font = '16px Inter';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'left';
      ctx.fillText(`النقاط: ${displayScore}`, 10, 20);
      ctx.textAlign = 'right';
      ctx.fillText(`الهدف: ${targetScore}`, canvasWidth - 10, 20);
    }, [setDisplayScore, setDisplayGameStatus, generateFood]); // Minimal dependencies for stability


    // `initializeGame` function wrapped in `useCallback`
    const initializeGame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const snappedWidth = Math.floor(canvas.width / game.current.gridSize) * game.current.gridSize;
      const snappedHeight = Math.floor(canvas.height / game.current.gridSize) * game.current.gridSize;
      canvas.width = snappedWidth;
      canvas.height = snappedHeight;

      game.current.canvasWidth = snappedWidth;
      game.current.canvasHeight = snappedHeight;

      if (game.current.animationIntervalId) {
        clearInterval(game.current.animationIntervalId);
      }

      game.current.snake = [{ x: Math.floor(snappedWidth / 2 / game.current.gridSize) * game.current.gridSize, y: Math.floor(snappedHeight / 2 / game.current.gridSize) * game.current.gridSize }];
      game.current.direction = 'right';
      game.current.score = 0;
      game.current.status = 'playing';

      setDisplayScore(0);
      setDisplayGameStatus('playing');

      generateFood(game.current.canvasWidth, game.current.canvasHeight, game.current.gridSize, game.current.snake);

      game.current.animationIntervalId = setInterval(gameTick, game.current.gameSpeed);
    }, [gameTick, generateFood]); // Added gameTick and generateFood to dependency array

    useEffect(() => {
      initializeGame();

      const handleKeyDown = (e) => {
        if (game.current.status !== 'playing') return;
        const currentDirection = game.current.direction;

        switch (e.key) {
          case 'ArrowUp': if (currentDirection !== 'down') game.current.direction = 'up'; break;
          case 'ArrowDown': if (currentDirection !== 'up') game.current.direction = 'down'; break;
          case 'ArrowLeft': if (currentDirection !== 'right') game.current.direction = 'left'; break;
          case 'ArrowRight': if (currentDirection !== 'left') game.current.direction = 'right'; break;
          default: break;
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', initializeGame);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', initializeGame);
        if (game.current.animationIntervalId) {
          clearInterval(game.current.animationIntervalId);
        }
      };
    }, [initializeGame]);

    const handleTouchMove = (newDirection) => {
      if (game.current.status !== 'playing') return;
      const currentDirection = game.current.direction;

      switch (newDirection) {
        case 'up': if (currentDirection !== 'down') game.current.direction = 'up'; break;
        case 'down': if (currentDirection !== 'up') game.current.direction = 'down'; break;
        case 'left': if (currentDirection !== 'right') game.current.direction = 'left'; break;
        case 'right': if (currentDirection !== 'left') game.current.direction = 'right'; break;
        default: break;
      }
    };

    const handleNextGame = () => {
      navigateTo('treasure');
    };

    return (
      <div className="page-container snake-game-page-bg">
        <div className="card game-card">
          <h2 className="card-title game-title-pink animate-scale-in">
            لعبة الثعبان
          </h2>
          <p className="game-instructions animate-fade-in-up">
            استخدمي الأسهم أو الأزرار لجمع 10 تفاحات!
          </p>

          <canvas
            ref={canvasRef}
            className="game-canvas game-canvas-pink"
            width="400"
            height="400"
            style={{ touchAction: 'none' }}
          ></canvas>

          {displayGameStatus === 'won' && (
            <p className="game-message game-message-success animate-fade-in">
              تهانينا! لقد جمعتِ كل التفاحات! 🎉
            </p>
          )}
          {displayGameStatus === 'lost' && (
            <p className="game-message game-message-error animate-fade-in">
              انتهت اللعبة! حاولي مرة أخرى.
            </p>
          )}

          {/* Display current score */}
          <p className="game-score-display">النقاط: {displayScore} / {game.current.targetScore}</p>

          <div className="on-screen-controls">
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('up')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('up')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬆️
            </button>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('left')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('left')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬅️
            </button>
            <div className="control-spacer"></div>
            <button
              className="control-button"
              onTouchStart={() => handleTouchMove('right')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('right')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ➡️
            </button>
            <button
              className="control-button control-button-center"
              onTouchStart={() => handleTouchMove('down')}
              onTouchEnd={() => handleTouchMove('stop')}
              onMouseDown={() => handleTouchMove('down')}
              onMouseUp={() => handleTouchMove('stop')}
              onMouseLeave={() => handleTouchMove('stop')}
            >
              ⬇️
            </button>
          </div>

          <div className="button-group-bottom">
            <button
              onClick={initializeGame}
              className="button secondary-button-gray"
            >
              إعادة اللعب
            </button>
            <button
              onClick={handleNextGame}
              disabled={displayGameStatus !== 'won'}
              className={`button primary-button-pink animate-bounce-short ${displayGameStatus !== 'won' ? 'button-disabled' : ''}`}
            >
              {displayGameStatus === 'won' ? 'اذهبي إلى الكنز!' : 'كملي يا حلوة'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Component to display the final treasure message.
  const TreasurePage = () => {
    const [llmClosingStatement, setLlmClosingStatement] = useState('');
    const [isLoadingClosingStatement, setIsLoadingClosingStatement] = useState(false);

    const generateClosingStatement = async () => {
      setIsLoadingClosingStatement(true);
      setLlmClosingStatement('');
      try {
        // Changed prompt to request a single, direct closing statement
        const prompt = `Write a single, very short, poetic, and heartfelt closing statement (in Arabic) for a birthday message to a beloved girlfriend, focusing on love, future, or dreams. Keep it under 25 words. Do not provide options or any additional text, just the statement.`;
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = "AIzaSyB4GxqqBBTFbJ-A_UsLafA3qKzW_RIvzQY";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
          const text = result.candidates[0].content.parts[0].text;
          setLlmClosingStatement(text);
        } else {
          setLlmClosingStatement('عفوًا، لم أتمكن من توليد عبارة الآن.');
        }
      } catch (error) {
        console.error("Error generating closing statement:", error);
        setLlmClosingStatement('حدث خطأ أثناء توليد العبارة.');
      } finally {
        setIsLoadingClosingStatement(false);
      }
    };

    return (
      <div className="page-container treasure-page-bg">
        <div className="card treasure-card">
          <h2 className="treasure-title animate-fade-in-down">
           نجمتي الغالية 
          </h2>
          <div className="treasure-message-text animate-fade-in-up">
            {treasureMessage}
          </div>
          <button
            onClick={generateClosingStatement}
            disabled={isLoadingClosingStatement}
            className={`button primary-button-pink animate-bounce-short ${isLoadingClosingStatement ? 'button-disabled' : ''}`}
          >
            {isLoadingClosingStatement ? 'جاري التوليد...' : '✨ لمسة ختامية '}
          </button>
          {llmClosingStatement && (
            <p className="llm-message animate-fade-in-up">
              {llmClosingStatement}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <WelcomePage />;
      case 'question_1':
      case 'question_2':
      case 'question_3':
      case 'question_4':
      case 'question_5':
      case 'question_6':
      case 'question_7':
      case 'question_8':
      case 'question_9':
      case 'question_10': { // Added block for lexical declaration
        const qIndex = parseInt(currentPage.split('_')[1]);
        return <QuestionPage questionIndex={qIndex} questionAnswers={questionAnswers} setQuestionAnswers={setQuestionAnswers} />;
      }
      case 'game_sudoku':
        return <SudokuGame />;
      case 'game_ball':
        return <BallGame />;
      case 'game_maze':
        return <MazeGame />;
      case 'game_snake':
        return <SnakeGame />;
      case 'treasure':
        return <TreasurePage />;
      default:
        return <WelcomePage />;
    }
  };

  return (
    <div className="app-container">
      {renderPage()}
    </div>
  );
}

export default App;
