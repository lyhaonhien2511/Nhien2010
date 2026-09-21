export const STANDALONE_TUG_OF_WAR_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kéo Co Đố Vui - Game Giáo Dục 3 Cột</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0c0a09;
      color: #f5f5f4;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
    }
    .app-container {
      width: 100%;
      max-width: 1380px;
      background: #1c1917;
      border: 1px solid #292524;
      border-radius: 24px;
      padding: 16px 20px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    /* Header */
    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border-bottom: 1px solid #292524;
      padding-bottom: 12px;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
    }
    .title-text h1 {
      font-size: 19px;
      font-weight: 900;
      color: #fafaf9;
      letter-spacing: -0.5px;
    }
    .title-text p {
      font-size: 11px;
      color: #a8a29e;
      font-weight: 600;
    }
    .top-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button, select {
      font-family: inherit;
      border: none;
      outline: none;
      cursor: pointer;
      font-weight: 700;
      border-radius: 10px;
    }
    .btn-action {
      background: #292524;
      color: #d6d3d1;
      padding: 7px 14px;
      font-size: 12px;
      border: 1px solid #44403c;
      transition: all 0.15s;
    }
    .btn-action.active {
      background: #4f46e5;
      color: #fff;
      border-color: #6366f1;
    }
    .btn-start {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 900;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      transition: all 0.15s;
    }
    .btn-start:hover {
      transform: scale(1.03);
    }

    /* 3 Cột Giao Diện Chính */
    .battle-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }
    @media (min-width: 1024px) {
      .battle-grid {
        grid-template-columns: 320px 1fr 320px;
      }
    }
    @media (min-width: 1280px) {
      .battle-grid {
        grid-template-columns: 340px 1fr 340px;
      }
    }

    /* Bảng câu hỏi Quiz Card */
    .quiz-card {
      background: #141211;
      border-radius: 20px;
      padding: 16px;
      border: 1px solid #292524;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 440px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
    }
    .quiz-card.red {
      border-color: rgba(239, 68, 68, 0.3);
      background: linear-gradient(180deg, rgba(69, 10, 10, 0.35) 0%, #141211 100%);
    }
    .quiz-card.blue {
      border-color: rgba(59, 130, 246, 0.3);
      background: linear-gradient(180deg, rgba(10, 37, 64, 0.35) 0%, #141211 100%);
    }
    .team-badge {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #292524;
      margin-bottom: 10px;
    }
    .team-title {
      font-size: 15px;
      font-weight: 900;
      letter-spacing: 0.5px;
    }
    .team-title.red { color: #f87171; }
    .team-title.blue { color: #60a5fa; }
    .score-badge {
      font-size: 12px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 8px;
      background: #292524;
      color: #e7e5e4;
    }

    /* Thanh tiến độ 10 câu */
    .progress-bar {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 4px;
      margin-bottom: 12px;
    }
    .progress-dot {
      height: 6px;
      border-radius: 3px;
      background: #292524;
      transition: all 0.3s;
    }
    .progress-dot.active {
      background: #f59e0b;
      transform: scaleY(1.3);
    }
    .progress-dot.correct { background: #10b981; }
    .progress-dot.wrong { background: #ef4444; }

    /* Nội dung câu hỏi */
    .question-box {
      margin-bottom: 14px;
      flex: 1;
    }
    .q-meta {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      color: #a8a29e;
      margin-bottom: 6px;
      font-weight: 700;
    }
    .q-text {
      font-size: 14px;
      font-weight: 700;
      color: #fafaf9;
      line-height: 1.45;
      min-height: 48px;
    }

    /* 4 Lựa chọn A, B, C, D */
    .options-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .btn-opt {
      width: 100%;
      background: #292524;
      color: #f5f5f4;
      border: 1px solid #44403c;
      padding: 10px 12px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      text-align: left;
      transition: all 0.15s;
    }
    .btn-opt:hover:not(:disabled) {
      background: #3c3836;
      border-color: #78716c;
      transform: translateY(-1px);
    }
    .opt-key {
      width: 26px;
      height: 26px;
      border-radius: 8px;
      background: #1c1917;
      color: #d6d3d1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .opt-text {
      flex: 1;
      line-height: 1.3;
    }

    /* Hiệu ứng Đúng (Green) / Sai (Red) trong 0.5s */
    .btn-opt.correct {
      background: #059669 !important;
      border-color: #34d399 !important;
      color: #fff !important;
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.5);
      transform: scale(1.02);
    }
    .btn-opt.correct .opt-key {
      background: #047857;
      color: #fff;
    }
    .btn-opt.wrong {
      background: #dc2626 !important;
      border-color: #f87171 !important;
      color: #fff !important;
      box-shadow: 0 0 14px rgba(239, 68, 68, 0.5);
    }
    .btn-opt.wrong .opt-key {
      background: #b91c1c;
      color: #fff;
    }

    /* Feedback text */
    .feedback-msg {
      height: 22px;
      font-size: 12px;
      font-weight: 800;
      text-align: center;
      margin-top: 8px;
    }

    /* Sân Kéo Co Ở Giữa */
    .center-column {
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: space-between;
    }
    .arena {
      position: relative;
      width: 100%;
      height: 290px;
      background: linear-gradient(180deg, #38bdf8 0%, #bae6fd 60%, #15803d 60%, #166534 100%);
      border-radius: 18px;
      border: 3px solid #334155;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .center-line {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 3px;
      background: rgba(255, 255, 255, 0.95);
      transform: translateX(-50%);
      z-index: 5;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
    }
    .foul-line {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      border-right: 2px dashed rgba(255, 255, 255, 0.6);
      z-index: 5;
    }
    .foul-left { left: calc(50% - 150px); border-color: #ef4444; }
    .foul-right { left: calc(50% + 150px); border-color: #3b82f6; }

    /* Dây thừng & Nhân vật */
    .tug-rig {
      position: absolute;
      bottom: 60px;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.3, 1);
      z-index: 10;
    }
    .rope {
      width: 480px;
      height: 14px;
      background: repeating-linear-gradient(45deg, #78350f, #78350f 6px, #b45309 6px, #b45309 12px);
      border-radius: 7px;
      border: 1px solid #451a03;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      position: relative;
    }
    .ribbon {
      position: absolute;
      top: -16px;
      left: 50%;
      transform: translateX(-50%);
      width: 14px;
      height: 24px;
      background: #dc2626;
      border-radius: 2px;
    }
    .ribbon::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 2px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #dc2626;
    }

    .team {
      display: flex;
      gap: 4px;
      align-items: flex-end;
    }
    .team-red { margin-right: -10px; }
    .team-blue { margin-left: -10px; }
    .character {
      width: 44px;
      height: 68px;
      transform-origin: bottom center;
      transition: transform 0.1s ease;
    }
    .char-red { transform: rotate(-22deg); }
    .char-blue { transform: rotate(22deg); }
    .char-red.pulling { transform: rotate(-34deg) translateY(-4px); }
    .char-blue.pulling { transform: rotate(34deg) translateY(-4px); }

    /* Thanh đo vị trí dây */
    .balance-card {
      background: #141211;
      border: 1px solid #292524;
      border-radius: 16px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .balance-labels {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 800;
    }
    .track {
      position: relative;
      height: 14px;
      background: #292524;
      border-radius: 7px;
      overflow: hidden;
      display: flex;
    }
    .track-fill-red {
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #f87171);
      transition: width 0.2s ease;
      margin-left: auto;
    }
    .track-fill-blue {
      height: 100%;
      background: linear-gradient(90deg, #60a5fa, #3b82f6);
      transition: width 0.2s ease;
    }
    .track-half {
      width: 50%;
      height: 100%;
      display: flex;
    }
    .meter-center-pin {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #fbbf24;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }

    /* Footer & Hotkey note */
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: #78716c;
      padding-top: 10px;
      border-top: 1px solid #292524;
    }

    /* Modal kết quả */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }
    .modal-overlay.active { display: flex; }
    .modal {
      background: #1c1917;
      color: #fafaf9;
      border: 1px solid #44403c;
      padding: 24px;
      border-radius: 24px;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      animation: pop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes pop {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .modal h2 {
      font-size: 22px;
      font-weight: 900;
      margin: 10px 0 6px;
    }
    .modal-stats {
      background: #141211;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid #292524;
      margin: 14px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 13px;
    }
  </style>
</head>
<body>

  <div class="app-container">
    <!-- Header -->
    <header class="header">
      <div class="logo-area">
        <div class="logo-badge">🧠</div>
        <div class="title-text">
          <h1>KÉO CO ĐỐ VUI 3 CỘT</h1>
          <p>Game Giáo Dục: Đội Đỏ vs Đội Xanh (10 Câu Hỏi Trắc Nghiệm)</p>
        </div>
      </div>

      <div class="top-controls">
        <div id="globalTimer" class="btn-action" style="font-family: monospace; font-weight: 800; color: #f59e0b; border-color: rgba(245, 158, 11, 0.4);">⏱ 02:00</div>
        <button id="btnModePvP" class="btn-action active" onclick="setMode('pvp')">👥 2 Người chơi</button>
        <button id="btnModeCpu" class="btn-action" onclick="setMode('cpu')">🤖 Đấu với Máy</button>
        <button id="btnSound" class="btn-action" onclick="toggleSound()">🔊 Bật âm</button>
        <button class="btn-start" onclick="startNewGame()">▶ BẮT ĐẦU</button>
      </div>
    </header>

    <!-- 3 CỘT: Cột Trái (Đỏ) - Cột Giữa (Kéo Co) - Cột Phải (Xanh) -->
    <main class="battle-grid">

      <!-- ================= CỘT 1: ĐỘI ĐỎ (P1) ================= -->
      <section class="quiz-card red" id="redCard">
        <div>
          <div class="team-badge" style="display: flex; align-items: center; justify-content: space-between;">
            <span class="team-title red">🚩 ĐỘI ĐỎ (P1)</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span id="redTimerBadge" style="font-size: 11px; font-weight: 800; color: #f87171; background: rgba(239, 68, 68, 0.15); padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(239, 68, 68, 0.3);">⏱ 15s</span>
              <span class="score-badge" id="redScore">Đúng: 0/10</span>
            </div>
          </div>

          <div class="progress-bar" id="redProgress"></div>

          <div class="question-box">
            <div class="q-meta">
              <span id="redCat">Địa lý</span>
              <span id="redCount">Câu 1/10</span>
            </div>
            <div class="q-text" id="redQuestion">Đang tải câu hỏi...</div>
          </div>
        </div>

        <div>
          <div class="options-grid" id="redOptions"></div>
          <div class="feedback-msg" id="redFeedback"></div>
        </div>
      </section>

      <!-- ================= CỘT 2: SÂN KÉO CO (GIỮA) ================= -->
      <section class="center-column">
        <div class="arena">
          <div class="center-line"></div>
          <div class="foul-line foul-left"></div>
          <div class="foul-line foul-right"></div>

          <!-- Giàn kéo co: Dây và nhân vật -->
          <div id="tugRig" class="tug-rig">
            <!-- Đội Đỏ -->
            <div class="team team-red">
              <svg class="character char-red red-c1" viewBox="0 0 50 80">
                <circle cx="25" cy="18" r="12" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>
                <rect x="15" y="14" width="20" height="5" fill="#dc2626"/>
                <path d="M 17 30 L 33 30 L 30 52 L 18 52 Z" fill="#ef4444" stroke="#1e293b" stroke-width="2"/>
                <line x1="20" y1="52" x2="12" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="28" y1="52" x2="22" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="22" y1="36" x2="42" y2="44" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
              </svg>
              <svg class="character char-red red-c2" viewBox="0 0 50 80">
                <circle cx="25" cy="18" r="12" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>
                <rect x="15" y="14" width="20" height="5" fill="#dc2626"/>
                <path d="M 17 30 L 33 30 L 30 52 L 18 52 Z" fill="#ef4444" stroke="#1e293b" stroke-width="2"/>
                <line x1="20" y1="52" x2="12" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="28" y1="52" x2="22" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="22" y1="36" x2="42" y2="44" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>

            <!-- Dây thừng -->
            <div class="rope">
              <div class="ribbon"></div>
            </div>

            <!-- Đội Xanh -->
            <div class="team team-blue">
              <svg class="character char-blue blue-c1" viewBox="0 0 50 80">
                <circle cx="25" cy="18" r="12" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>
                <rect x="15" y="14" width="20" height="5" fill="#2563eb"/>
                <path d="M 17 30 L 33 30 L 32 52 L 20 52 Z" fill="#3b82f6" stroke="#1e293b" stroke-width="2"/>
                <line x1="22" y1="52" x2="28" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="30" y1="52" x2="38" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="28" y1="36" x2="8" y2="44" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
              </svg>
              <svg class="character char-blue blue-c2" viewBox="0 0 50 80">
                <circle cx="25" cy="18" r="12" fill="#fed7aa" stroke="#9a3412" stroke-width="2"/>
                <rect x="15" y="14" width="20" height="5" fill="#2563eb"/>
                <path d="M 17 30 L 33 30 L 32 52 L 20 52 Z" fill="#3b82f6" stroke="#1e293b" stroke-width="2"/>
                <line x1="22" y1="52" x2="28" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="30" y1="52" x2="38" y2="74" stroke="#9a3412" stroke-width="3"/>
                <line x1="28" y1="36" x2="8" y2="44" stroke="#fed7aa" stroke-width="4" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Thanh cân bằng lực kéo -->
        <div class="balance-card">
          <div class="balance-labels">
            <span style="color: #f87171;">ĐỎ: <span id="posRed">50%</span></span>
            <span id="leadStatus" style="color: #a8a29e;">Cân bằng (0%)</span>
            <span style="color: #60a5fa;">XANH: <span id="posBlue">50%</span></span>
          </div>
          <div class="track">
            <div class="track-half">
              <div id="fillRed" class="track-fill-red" style="width: 0%;"></div>
            </div>
            <div class="meter-center-pin"></div>
            <div class="track-half">
              <div id="fillBlue" class="track-fill-blue" style="width: 0%;"></div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #78716c; margin-top: 2px;">
            <span>⚡ Trả lời ĐÚNG: Kéo +20%</span>
            <span>❌ Trả lời SAI: Trượt lùi -8%</span>
            <span>🎯 100% là chiến thắng</span>
          </div>
        </div>
      </section>

      <!-- ================= CỘT 3: ĐỘI XANH (P2 / MÁY) ================= -->
      <section class="quiz-card blue" id="blueCard">
        <div>
          <div class="team-badge" style="display: flex; align-items: center; justify-content: space-between;">
            <span class="team-title blue" id="blueTeamTitle">🚩 ĐỘI XANH (P2)</span>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span id="blueTimerBadge" style="font-size: 11px; font-weight: 800; color: #38bdf8; background: rgba(56, 189, 248, 0.15); padding: 2px 8px; border-radius: 9999px; border: 1px solid rgba(56, 189, 248, 0.3);">⏱ 15s</span>
              <span class="score-badge" id="blueScore">Đúng: 0/10</span>
            </div>
          </div>

          <div class="progress-bar" id="blueProgress"></div>

          <div class="question-box">
            <div class="q-meta">
              <span id="blueCat">Thiên văn</span>
              <span id="blueCount">Câu 1/10</span>
            </div>
            <div class="q-text" id="blueQuestion">Đang tải câu hỏi...</div>
          </div>
        </div>

        <div>
          <div class="options-grid" id="blueOptions"></div>
          <div class="feedback-msg" id="blueFeedback"></div>
        </div>
      </section>

    </main>

    <!-- Footer hướng dẫn phím tắt -->
    <footer class="footer">
      <div>
        <strong>Phím tắt:</strong> Đội Đỏ: <strong>[1, 2, 3, 4]</strong> | Đội Xanh: <strong>[7, 8, 9, 0]</strong> hoặc phím mũi tên. Có thể bấm trực tiếp vào nút đáp án.
      </div>
      <div>
        Quy tắc: Đúng kéo mạnh (+20%), Sai bị phạt (-8%). Hết 10 câu ai kéo nhiều hơn sẽ thắng!
      </div>
    </footer>
  </div>

  <!-- Modal Kết Thúc Trận -->
  <div id="modalResult" class="modal-overlay">
    <div class="modal">
      <span id="modalIcon" style="font-size: 50px;">🏆</span>
      <h2 id="modalWinner">ĐỘI ĐỎ CHIẾN THẮNG!</h2>
      <p id="modalDesc" style="color: #a8a29e; font-size: 13px;">Đã hoàn thành 10 câu đố và kéo áp đảo</p>
      
      <div class="modal-stats">
        <div>
          <div style="color: #f87171; font-weight: 800;">ĐỘI ĐỎ</div>
          <div id="mRedRes" style="font-size: 18px; font-weight: 900; margin-top: 4px;">0/10 Đúng</div>
        </div>
        <div>
          <div style="color: #60a5fa; font-weight: 800;">ĐỘI XANH</div>
          <div id="mBlueRes" style="font-size: 18px; font-weight: 900; margin-top: 4px;">0/10 Đúng</div>
        </div>
      </div>

      <button class="btn-start" style="width: 100%; padding: 12px;" onclick="startNewGame()">CHƠI LẠI TRẬN MỚI</button>
    </div>
  </div>

  <script>
    // BỘ 10 CÂU HỎI CHO ĐỘI ĐỎ
    const RED_QUESTIONS = [
      { q: "Mặt Trời mọc ở hướng nào vào mỗi buổi sáng?", opts: ["Hướng Đông", "Hướng Tây", "Hướng Nam", "Hướng Bắc"], ans: 0, cat: "Địa lý" },
      { q: "Loài động vật nào được mệnh danh là 'Chúa sơn lâm'?", opts: ["Sư tử", "Hổ (Cọp)", "Báo đốm", "Gấu bắc cực"], ans: 1, cat: "Sinh học" },
      { q: "Ở áp suất tiêu chuẩn, nước sôi ở bao nhiêu độ C?", opts: ["80°C", "90°C", "100°C", "120°C"], ans: 2, cat: "Vật lý" },
      { q: "Hành tinh nào có kích thước lớn nhất trong Hệ Mặt Trời?", opts: ["Sao Hỏa", "Sao Thổ", "Sao Hải Vương", "Sao Mộc"], ans: 3, cat: "Thiên văn" },
      { q: "Việt Nam có bao nhiêu tỉnh thành giáp biển?", opts: ["24 tỉnh", "26 tỉnh", "28 tỉnh", "32 tỉnh"], ans: 2, cat: "Địa lý VN" },
      { q: "Người trưởng thành thông thường có bao nhiêu chiếc răng vĩnh viễn?", opts: ["28 chiếc", "30 chiếc", "32 chiếc", "36 chiếc"], ans: 2, cat: "Y học" },
      { q: "Kim loại nào dẫn điện tốt nhất ở điều kiện thường?", opts: ["Bạc (Ag)", "Đồng (Cu)", "Vàng (Au)", "Nhôm (Al)"], ans: 0, cat: "Hóa học" },
      { q: "Quốc gia nào có diện tích lãnh thổ lớn nhất thế giới?", opts: ["Canada", "Hoa Kỳ", "Trung Quốc", "Nga"], ans: 3, cat: "Địa lý" },
      { q: "Tam giác có 3 cạnh bằng nhau gọi là tam giác gì?", opts: ["Tam giác vuông", "Tam giác cân", "Tam giác đều", "Tam giác tù"], ans: 2, cat: "Toán học" },
      { q: "Ai là tác giả của truyện 'Dế Mèn phiêu lưu ký'?", opts: ["Nam Cao", "Tô Hoài", "Nguyễn Nhật Ánh", "Xuân Quỳnh"], ans: 1, cat: "Văn học" }
    ];

    // BỘ 10 CÂU HỎI CHO ĐỘI XANH
    const BLUE_QUESTIONS = [
      { q: "Đỉnh núi nào được mệnh danh là 'Nóc nhà Đông Dương'?", opts: ["Fansipan", "Tây Côn Lĩnh", "Bạch Mộc Lương Tử", "Pu Si Lung"], ans: 0, cat: "Địa lý" },
      { q: "Hành tinh nào gần Mặt Trời nhất trong Hệ Mặt Trời?", opts: ["Sao Kim", "Sao Thủy", "Trái Đất", "Sao Hỏa"], ans: 1, cat: "Thiên văn" },
      { q: "Động vật lớn nhất còn sống trên Trái Đất hiện nay là gì?", opts: ["Voi châu Phi", "Cá mập trắng", "Cá voi xanh", "Mực khổng lồ"], ans: 2, cat: "Sinh học" },
      { q: "Châu lục nào có diện tích và dân số lớn nhất thế giới?", opts: ["Châu Mỹ", "Châu Phi", "Châu Âu", "Châu Á"], ans: 3, cat: "Địa lý" },
      { q: "Khí nào chiếm thể tích nhiều nhất trong khí quyển Trái Đất?", opts: ["Khí Oxy", "Khí Nitơ", "Khí Cacbonic", "Khí Argon"], ans: 1, cat: "Hóa học" },
      { q: "Thủ đô chính thức của đất nước Nhật Bản là gì?", opts: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], ans: 2, cat: "Văn hóa" },
      { q: "Cơ quan nội tạng nào đóng vai trò chính trong lọc máu?", opts: ["Gan", "Tim", "Thận", "Dạ dày"], ans: 2, cat: "Y học" },
      { q: "Hình vuông có tổng cộng bao nhiêu trục đối xứng?", opts: ["2 trục", "3 trục", "4 trục", "8 trục"], ans: 2, cat: "Toán học" },
      { q: "Ánh sáng Mặt Trời mất khoảng bao lâu để tới Trái Đất?", opts: ["8 giây", "Khoảng 8 phút", "8 giờ", "Tức thì (0s)"], ans: 1, cat: "Vật lý" },
      { q: "Kim cương tự nhiên được cấu tạo từ nguyên tố nào?", opts: ["Silic", "Sắt", "Carbon", "Lưu huỳnh"], ans: 2, cat: "Hóa học" }
    ];

    // Trạng thái game
    let gameMode = 'pvp'; // 'pvp' (2 người) hoặc 'cpu' (đấu với máy)
    let isPlaying = false;
    let ropePos = 0; // -100 (Đỏ thắng) đến +100 (Xanh thắng)
    const MAX_SHIFT_PX = 150;
    let soundOn = true;

    let redIndex = 0;
    let redCorrect = 0;
    let redWrong = 0;
    let redLocked = false;
    let redDone = false;

    let blueIndex = 0;
    let blueCorrect = 0;
    let blueWrong = 0;
    let blueLocked = false;
    let blueDone = false;

    let cpuTimer = null;
    let matchTimer = null;
    let totalMatchTime = 120; // 2 phút (120s)
    let redQTime = 15; // 15 giây mỗi câu
    let blueQTime = 15;

    function formatTime(secs) {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s);
    }

    function updateTimersUI() {
      const el = document.getElementById('globalTimer');
      if (el) el.innerText = '⏱ ' + formatTime(totalMatchTime);
    }

    function updateRedTimerUI() {
      const el = document.getElementById('redTimerBadge');
      if (el) el.innerText = '⏱ ' + redQTime + 's';
    }

    function updateBlueTimerUI() {
      const el = document.getElementById('blueTimerBadge');
      if (el) el.innerText = '⏱ ' + blueQTime + 's';
    }

    // Web Audio synthesizer
    let audioCtx = null;
    function initAudio() {
      if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playTone(freq, duration, type = 'sine', gainVal = 0.2) {
      if (!soundOn) return;
      try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch(e) {}
    }

    function playCorrectSound() {
      if (!soundOn) return;
      playTone(523.25, 0.15, 'sine', 0.25);
      setTimeout(() => playTone(659.25, 0.15, 'sine', 0.25), 70);
      setTimeout(() => playTone(783.99, 0.25, 'sine', 0.25), 140);
    }

    function playWrongSound() {
      if (!soundOn) return;
      playTone(160, 0.25, 'sawtooth', 0.2);
    }

    function playTimeoutSound() {
      if (!soundOn) return;
      playTone(220, 0.12, 'sawtooth', 0.2);
      setTimeout(() => playTone(160, 0.25, 'sawtooth', 0.25), 100);
    }

    function playTugSound() {
      if (!soundOn) return;
      playTone(100, 0.12, 'triangle', 0.25);
    }

    function toggleSound() {
      soundOn = !soundOn;
      document.getElementById('btnSound').innerText = soundOn ? '🔊 Bật âm' : '🔇 Tắt âm';
    }

    function setMode(mode) {
      gameMode = mode;
      document.getElementById('btnModeCpu').classList.toggle('active', mode === 'cpu');
      document.getElementById('btnModePvP').classList.toggle('active', mode === 'pvp');
      document.getElementById('blueTeamTitle').innerText = mode === 'cpu' ? '🚩 ĐỘI XANH (MÁY AI)' : '🚩 ĐỘI XANH (P2)';
      startNewGame();
    }

    // Bắt đầu game mới
    function startNewGame() {
      clearTimeout(cpuTimer);
      clearInterval(matchTimer);
      document.getElementById('modalResult').classList.remove('active');

      isPlaying = true;
      ropePos = 0;
      redIndex = 0;
      redCorrect = 0;
      redWrong = 0;
      redLocked = false;
      redDone = false;

      blueIndex = 0;
      blueCorrect = 0;
      blueWrong = 0;
      blueLocked = false;
      blueDone = false;

      totalMatchTime = 120;
      redQTime = 15;
      blueQTime = 15;
      updateTimersUI();
      updateRedTimerUI();
      updateBlueTimerUI();

      renderProgress('red');
      renderProgress('blue');
      renderQuestion('red');
      renderQuestion('blue');
      updateTugUI();

      // Bộ đếm ngược thời gian tổng (2 phút) và mỗi câu hỏi (15s)
      matchTimer = setInterval(() => {
        if (!isPlaying) return;

        totalMatchTime--;
        updateTimersUI();
        if (totalMatchTime <= 0) {
          endGame('timeout');
          return;
        }

        if (!redLocked && !redDone) {
          redQTime--;
          updateRedTimerUI();
          if (redQTime <= 0) {
            handleTimeout('red');
          }
        }

        if (!blueLocked && !blueDone) {
          blueQTime--;
          updateBlueTimerUI();
          if (blueQTime <= 0) {
            handleTimeout('blue');
          }
        }
      }, 1000);

      if (gameMode === 'cpu') {
        scheduleCpuAnswer();
      }
    }

    // Xử lý hết giờ câu hỏi 15 giây
    function handleTimeout(team) {
      if (!isPlaying) return;
      const isRed = team === 'red';
      if (isRed && (redLocked || redDone)) return;
      if (!isRed && (blueLocked || blueDone)) return;

      if (isRed) {
        redLocked = true;
        redWrong++;
        playTimeoutSound();
        const dot = document.getElementById('red-dot-' + redIndex);
        if (dot) dot.className = 'progress-dot wrong';
        const feedbackEl = document.getElementById('redFeedback');
        feedbackEl.innerText = '⏱ HẾT GIỜ (15s)! Bị phạt trượt lùi (-8%)';
        feedbackEl.style.color = '#f87171';
        ropePos = Math.min(100, ropePos + 8);
        updateTugUI();

        setTimeout(() => {
          redIndex++;
          redLocked = false;
          redQTime = 15;
          updateRedTimerUI();
          renderQuestion('red');
        }, 1000);
      } else {
        blueLocked = true;
        blueWrong++;
        playTimeoutSound();
        const dot = document.getElementById('blue-dot-' + blueIndex);
        if (dot) dot.className = 'progress-dot wrong';
        const feedbackEl = document.getElementById('blueFeedback');
        feedbackEl.innerText = '⏱ HẾT GIỜ (15s)! Bị phạt trượt lùi (-8%)';
        feedbackEl.style.color = '#f87171';
        ropePos = Math.max(-100, ropePos - 8);
        updateTugUI();

        setTimeout(() => {
          blueIndex++;
          blueLocked = false;
          blueQTime = 15;
          updateBlueTimerUI();
          renderQuestion('blue');
          if (gameMode === 'cpu' && isPlaying && !blueDone) {
            scheduleCpuAnswer();
          }
        }, 1000);
      }
    }

    function renderProgress(team) {
      const container = document.getElementById(team === 'red' ? 'redProgress' : 'blueProgress');
      container.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.id = \`\${team}-dot-\${i}\`;
        container.appendChild(dot);
      }
      updateProgressDots(team);
    }

    function updateProgressDots(team) {
      const curIdx = team === 'red' ? redIndex : blueIndex;
      for (let i = 0; i < 10; i++) {
        const dot = document.getElementById(\`\${team}-dot-\${i}\`);
        if (!dot) continue;
        if (i < curIdx) {
          // done
        } else if (i === curIdx) {
          dot.className = 'progress-dot active';
        } else {
          dot.className = 'progress-dot';
        }
      }
    }

    // Hiển thị câu hỏi cho đội
    function renderQuestion(team) {
      const isRed = team === 'red';
      const curIdx = isRed ? redIndex : blueIndex;
      const questions = isRed ? RED_QUESTIONS : BLUE_QUESTIONS;
      const total = questions.length;

      const scoreEl = document.getElementById(isRed ? 'redScore' : 'blueScore');
      scoreEl.innerText = \`Đúng: \${isRed ? redCorrect : blueCorrect}/\${total}\`;

      const feedbackEl = document.getElementById(isRed ? 'redFeedback' : 'blueFeedback');
      feedbackEl.innerText = '';

      if (curIdx >= total) {
        if (isRed) redDone = true;
        else blueDone = true;

        document.getElementById(isRed ? 'redQuestion' : 'blueQuestion').innerText = '🎉 ĐÃ HOÀN THÀNH 10 CÂU HỎI!';
        document.getElementById(isRed ? 'redOptions' : 'blueOptions').innerHTML = '<div style="text-align:center; padding: 24px 0; color: #a8a29e; font-size: 13px;">Chờ đối thủ kết thúc lượt kéo...</div>';
        checkGameEnd();
        return;
      }

      updateProgressDots(team);

      const qObj = questions[curIdx];
      document.getElementById(isRed ? 'redCat' : 'blueCat').innerText = qObj.cat || 'Đố vui';
      document.getElementById(isRed ? 'redCount' : 'blueCount').innerText = \`Câu \${curIdx + 1}/\${total}\`;
      document.getElementById(isRed ? 'redQuestion' : 'blueQuestion').innerText = qObj.q;

      const optsContainer = document.getElementById(isRed ? 'redOptions' : 'blueOptions');
      optsContainer.innerHTML = '';

      const letters = ['A', 'B', 'C', 'D'];
      const keyHints = isRed ? ['1', '2', '3', '4'] : (gameMode === 'cpu' ? ['', '', '', ''] : ['7', '8', '9', '0']);

      qObj.opts.forEach((optText, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opt';
        btn.id = \`\${team}-opt-\${optIdx}\`;
        btn.onclick = () => handleAnswer(team, optIdx);

        btn.innerHTML = \`
          <span class="opt-key">\${keyHints[optIdx] ? keyHints[optIdx] : letters[optIdx]}</span>
          <span class="opt-text">\${optText}</span>
        \`;
        optsContainer.appendChild(btn);
      });
    }

    // Xử lý câu trả lời
    function handleAnswer(team, selectedIdx) {
      if (!isPlaying) return;
      const isRed = team === 'red';
      if (isRed && (redLocked || redDone)) return;
      if (!isRed && (blueLocked || blueDone)) return;

      if (isRed) redLocked = true;
      else blueLocked = true;

      const curIdx = isRed ? redIndex : blueIndex;
      const questions = isRed ? RED_QUESTIONS : BLUE_QUESTIONS;
      const qObj = questions[curIdx];
      const isCorrect = selectedIdx === qObj.ans;

      // Cập nhật điểm và tiến độ dot
      const dot = document.getElementById(\`\${team}-dot-\${curIdx}\`);
      if (dot) dot.className = isCorrect ? 'progress-dot correct' : 'progress-dot wrong';

      const selectedBtn = document.getElementById(\`\${team}-opt-\${selectedIdx}\`);
      const feedbackEl = document.getElementById(isRed ? 'redFeedback' : 'blueFeedback');

      if (isCorrect) {
        if (isRed) redCorrect++;
        else blueCorrect++;

        if (selectedBtn) selectedBtn.classList.add('correct');
        feedbackEl.innerText = '✓ CHÍNH XÁC! Kéo mạnh về phía bạn (+20%)';
        feedbackEl.style.color = '#34d399';
        playCorrectSound();
        playTugSound();

        // Kéo mạnh +20%
        if (isRed) ropePos = Math.max(-100, ropePos - 20);
        else ropePos = Math.min(100, ropePos + 20);

        animateCharacters(team);
      } else {
        if (isRed) redWrong++;
        else blueWrong++;

        if (selectedBtn) selectedBtn.classList.add('wrong');
        // Hiện đáp án đúng màu xanh lá để người chơi nhận biết
        const correctBtn = document.getElementById(\`\${team}-opt-\${qObj.ans}\`);
        if (correctBtn) correctBtn.classList.add('correct');

        feedbackEl.innerText = '✗ SAI RỒI! Bị trượt lùi (-8%)';
        feedbackEl.style.color = '#f87171';
        playWrongSound();

        // Trượt lùi -8%
        if (isRed) ropePos = Math.min(100, ropePos + 8);
        else ropePos = Math.max(-100, ropePos - 8);
      }

      updateTugUI();

      // Kiểm tra xem đã chạm vạch thắng ngay chưa
      if (ropePos <= -100 || ropePos >= 100) {
        setTimeout(() => endGame('boundary'), 400);
        return;
      }

      // Đổi màu xanh/đỏ trong 0.5s rồi chuyển câu tiếp theo
      setTimeout(() => {
        if (isRed) {
          redIndex++;
          redLocked = false;
          redQTime = 15;
          updateRedTimerUI();
          renderQuestion('red');
        } else {
          blueIndex++;
          blueLocked = false;
          blueQTime = 15;
          updateBlueTimerUI();
          renderQuestion('blue');
          if (gameMode === 'cpu' && isPlaying && !blueDone) {
            scheduleCpuAnswer();
          }
        }
      }, 550);
    }

    // AI Máy tự trả lời
    function scheduleCpuAnswer() {
      if (!isPlaying || blueDone || gameMode !== 'cpu') return;
      const delay = 2400 + Math.random() * 800; // 2.4s - 3.2s
      cpuTimer = setTimeout(() => {
        if (!isPlaying || blueDone) return;
        const curQ = BLUE_QUESTIONS[blueIndex];
        if (!curQ) return;
        // 75% cơ hội trả lời đúng
        const isRight = Math.random() < 0.75;
        let choice = curQ.ans;
        if (!isRight) {
          const wrongList = [0, 1, 2, 3].filter(i => i !== curQ.ans);
          choice = wrongList[Math.floor(Math.random() * wrongList.length)];
        }
        handleAnswer('blue', choice);
      }, delay);
    }

    function animateCharacters(team) {
      const chars = document.querySelectorAll(team === 'red' ? '.char-red' : '.char-blue');
      chars.forEach(c => c.classList.add('pulling'));
      setTimeout(() => {
        chars.forEach(c => c.classList.remove('pulling'));
      }, 150);
    }

    // Cập nhật hiển thị giàn kéo co và thanh lực
    function updateTugUI() {
      const shiftPx = (ropePos / 100) * MAX_SHIFT_PX;
      document.getElementById('tugRig').style.transform = \`translateX(\${shiftPx}px)\`;

      const fillRed = document.getElementById('fillRed');
      const fillBlue = document.getElementById('fillBlue');
      const posRed = document.getElementById('posRed');
      const posBlue = document.getElementById('posBlue');
      const lead = document.getElementById('leadStatus');

      if (ropePos < 0) {
        fillRed.style.width = \`\${Math.abs(ropePos)}%\`;
        fillBlue.style.width = '0%';
        lead.innerText = \`Đỏ dẫn trước \${Math.round(Math.abs(ropePos))}%\`;
        lead.style.color = '#f87171';
      } else if (ropePos > 0) {
        fillRed.style.width = '0%';
        fillBlue.style.width = \`\${ropePos}%\`;
        lead.innerText = \`Xanh dẫn trước \${Math.round(ropePos)}%\`;
        lead.style.color = '#60a5fa';
      } else {
        fillRed.style.width = '0%';
        fillBlue.style.width = '0%';
        lead.innerText = 'Cân bằng (0%)';
        lead.style.color = '#a8a29e';
      }

      posRed.innerText = \`\${Math.max(0, 50 - Math.round(ropePos/2))}%\`;
      posBlue.innerText = \`\${Math.max(0, 50 + Math.round(ropePos/2))}%\`;
    }

    function checkGameEnd() {
      if (redDone && blueDone) {
        setTimeout(() => endGame('completed'), 500);
      }
    }

    function endGame(reason) {
      isPlaying = false;
      clearTimeout(cpuTimer);
      clearInterval(matchTimer);

      let winner = 'draw';
      if (ropePos < -3) winner = 'red';
      else if (ropePos > 3) winner = 'blue';
      else {
        if (redCorrect > blueCorrect) winner = 'red';
        else if (blueCorrect > redCorrect) winner = 'blue';
      }

      const modal = document.getElementById('modalResult');
      const title = document.getElementById('modalWinner');
      const desc = document.getElementById('modalDesc');

      let reasonText = 'Trả lời đúng nhiều hơn và kéo dây áp đảo!';
      if (reason === 'boundary') {
        reasonText = 'Hạ gục đối thủ: Kéo chạm vạch thắng 100%!';
      } else if (reason === 'timeout') {
        reasonText = 'Hết thời gian trận đấu (2 phút)! Đội kéo xa hơn chiến thắng.';
      }

      if (winner === 'red') {
        title.innerText = '🏆 ĐỘI ĐỎ CHIẾN THẮNG!';
        title.style.color = '#f87171';
        desc.innerText = reasonText;
        playCorrectSound();
      } else if (winner === 'blue') {
        title.innerText = (gameMode === 'cpu' ? '🤖 MÁY (CPU)' : '🏆 ĐỘI XANH') + ' CHIẾN THẮNG!';
        title.style.color = '#60a5fa';
        desc.innerText = reasonText;
        playCorrectSound();
      } else {
        title.innerText = '🤝 TRẬN ĐẤU HÒA!';
        title.style.color = '#e7e5e4';
        desc.innerText = 'Cả hai đội có lực kéo và số câu trả lời cân bằng!';
      }

      document.getElementById('mRedRes').innerText = \`\${redCorrect}/10 Đúng\`;
      document.getElementById('mBlueRes').innerText = \`\${blueCorrect}/10 Đúng\`;
      modal.classList.add('active');
    }

    // BẮT PHÍM TẮT BÀN PHÍM
    window.addEventListener('keydown', (e) => {
      if (!isPlaying) return;

      // ĐỘI ĐỎ: 1, 2, 3, 4 tương ứng A, B, C, D
      if (e.key === '1') handleAnswer('red', 0);
      else if (e.key === '2') handleAnswer('red', 1);
      else if (e.key === '3') handleAnswer('red', 2);
      else if (e.key === '4') handleAnswer('red', 3);

      // ĐỘI XANH: 7, 8, 9, 0 (hoặc phím mũi tên) trong chế độ 2 người chơi
      if (gameMode === 'pvp') {
        if (e.key === '7' || e.code === 'ArrowLeft') handleAnswer('blue', 0);
        else if (e.key === '8' || e.code === 'ArrowUp') handleAnswer('blue', 1);
        else if (e.key === '9' || e.code === 'ArrowDown') handleAnswer('blue', 2);
        else if (e.key === '0' || e.code === 'ArrowRight') handleAnswer('blue', 3);
      }
    });

    // Tự động khởi động trận đấu đầu tiên
    startNewGame();
  </script>
</body>
</html>`;

import { Question } from '../types';

export function getStandaloneHtml(customRed?: Question[], customBlue?: Question[]): string {
  if (!customRed && !customBlue) return STANDALONE_TUG_OF_WAR_HTML;

  let html = STANDALONE_TUG_OF_WAR_HTML;

  if (customRed && customRed.length > 0) {
    const formattedRed = customRed.map((q) => ({
      q: q.question,
      opts: q.options,
      ans: q.correctIndex,
      cat: q.category || 'Đố vui',
    }));
    html = html.replace(
      /const RED_QUESTIONS = \[[\s\S]*?\];/,
      `const RED_QUESTIONS = ${JSON.stringify(formattedRed, null, 2)};`
    );
  }

  if (customBlue && customBlue.length > 0) {
    const formattedBlue = customBlue.map((q) => ({
      q: q.question,
      opts: q.options,
      ans: q.correctIndex,
      cat: q.category || 'Đố vui',
    }));
    html = html.replace(
      /const BLUE_QUESTIONS = \[[\s\S]*?\];/,
      `const BLUE_QUESTIONS = ${JSON.stringify(formattedBlue, null, 2)};`
    );
  }

  return html;
}
