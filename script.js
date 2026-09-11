    /* ==========================================================
       สคริปต์ 0: หน้าใส่รหัสผ่าน iPhone Passcode Lockscreen
       ========================================================== */
    const CORRECT_PASSCODE = (window.APP_CONFIG && window.APP_CONFIG.passcode) ? String(window.APP_CONFIG.passcode) : "230349";
    let enteredPasscode = "";
    let isPasscodeLocked = false;

    // ระบบเสียงเอฟเฟกต์นุ่มนวลจำลองปุ่มกด iOS (Web Audio API)
    function playKeySound(freq = 560, type = 'sine') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
      } catch (e) {}
    }

    function playUnlockSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
          gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.09);
          osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
        });
      } catch (e) {}
    }

    // 1. เสียงแกะตราครั่งและเปิดฝาซองจดหมาย (Wax Seal Pop & Paper Unfold)
    function playEnvelopeOpenSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);

        const chimeNotes = [783.99, 1046.50, 1318.51];
        chimeNotes.forEach((freq, idx) => {
          const chOsc = ctx.createOscillator();
          const chGain = ctx.createGain();
          chOsc.type = 'triangle';
          chOsc.frequency.setValueAtTime(freq, ctx.currentTime + 0.04 + idx * 0.06);
          chGain.gain.setValueAtTime(0.06, ctx.currentTime + 0.04 + idx * 0.06);
          chGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04 + idx * 0.06 + 0.25);
          chOsc.connect(chGain);
          chGain.connect(ctx.destination);
          chOsc.start(ctx.currentTime + 0.04 + idx * 0.06);
          chOsc.stop(ctx.currentTime + 0.04 + idx * 0.06 + 0.25);
        });
      } catch (e) {}
    }

    // 2. เสียงดึงจดหมายออกมาอ่าน (Magical Fairytale Harp Glide)
    function playLetterReadSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const harpNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        harpNotes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.05);
          osc.stop(ctx.currentTime + idx * 0.05 + 0.4);
        });
      } catch (e) {}
    }

    // 3. เสียงกดปุ่มทั่วไป (Next / Button Bubble Pop)
    function playButtonClickSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1250, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } catch (e) {}
    }

    // 4. เสียงปุ่ม No หลบหนี (Playful Cartoon Boing)
    function playButtonMoveSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(380, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.09);
        osc.frequency.exponentialRampToValueAtTime(520, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } catch (e) {}
    }

    // 5. เสียงกดรูปโพลารอยด์ที่ห้อยอยู่ (Crystal Bell Chime)
    function playHangingPhotoSound() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        [1046.50, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
          gain.gain.setValueAtTime(0.07, ctx.currentTime + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.06);
          osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
        });
      } catch (e) {}
    }

    function updatePasscodeDots() {
      const dots = document.querySelectorAll('.ios-dot');
      dots.forEach((dot, index) => {
        if (index < enteredPasscode.length) {
          dot.classList.add('filled');
        } else {
          dot.classList.remove('filled');
        }
      });
    }

    function handlePasscodeDigit(digit) {
      if (isPasscodeLocked || enteredPasscode.length >= 6) return;
      playKeySound(500 + Number(digit) * 35, 'sine');
      enteredPasscode += digit;
      updatePasscodeDots();

      if (enteredPasscode.length === 6) {
        checkPasscode();
      }
    }

    function deleteDigit() {
      if (isPasscodeLocked || enteredPasscode.length === 0) return;
      playKeySound(420, 'triangle');
      enteredPasscode = enteredPasscode.slice(0, -1);
      updatePasscodeDots();
    }

    function checkPasscode() {
      const expectedPasscode = (window.APP_CONFIG && window.APP_CONFIG.passcode) ? String(window.APP_CONFIG.passcode) : CORRECT_PASSCODE;
      if (enteredPasscode === expectedPasscode) {
        // รหัสถูกต้อง! ปลดล็อก
        isPasscodeLocked = true;
        playUnlockSound();

        const lockIcon = document.getElementById('ios-lock-icon');
        if (lockIcon) lockIcon.innerHTML = '<span class="lock-emoji unlock-anim">🔓</span>';

        const subtitle = document.getElementById('ios-passcode-subtitle');
        if (subtitle) {
          subtitle.textContent = "รหัสถูกต้องแล้ว! กำลังเปิดหัวใจ... 💕";
          subtitle.style.color = "#d73c60";
          subtitle.style.fontWeight = "600";
        }

        // เอฟเฟกต์จุดสีเขียวเรืองแสง
        document.querySelectorAll('.ios-dot').forEach(dot => {
          dot.style.background = '#2ec4b6';
          dot.style.borderColor = '#2ec4b6';
          dot.style.boxShadow = '0 0 12px #2ec4b6';
        });

        // ยิงพลุเฉลิมฉลอง
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.45 },
            colors: ['#ff4d6d', '#ff758f', '#ffccd5', '#ffd166', '#ffffff', '#e98b9b']
          });
        }

        // เริ่มเล่นเพลง BGM และแสดงเครื่องเล่นเพลง
        startMusic();
        if (musicWidget) musicWidget.classList.add('ready');

        setTimeout(() => {
          const passcodeScreen = document.getElementById('passcode-screen');
          if (passcodeScreen) {
            passcodeScreen.classList.add('unlocked');
            // ซ่อน display เพื่อคืนทรัพยากร GPU และ RAM ทั้งหมด
            setTimeout(() => {
              if (passcodeScreen.classList.contains('unlocked')) {
                passcodeScreen.style.display = 'none';
              }
            }, 720);
          }

          // แสดง animation รูปภาพห้อยเชือกและซองจดหมายลงมาทันทีหลังปลดล็อก!
          const hangingLeft = document.getElementById('hanging-photo-left');
          const hangingRight = document.getElementById('hanging-photo-right');
          if (hangingLeft) hangingLeft.classList.add('ready');
          if (hangingRight) hangingRight.classList.add('ready');
          if (envelope) envelope.classList.add('ready');

          appCurrentStep = 1;
          updateBackNavButton();
        }, 420);

      } else {
        // รหัสไม่ถูกต้อง
        isPasscodeLocked = true;
        playKeySound(220, 'sawtooth');

        const dotsContainer = document.getElementById('ios-dots-container');
        const dots = document.querySelectorAll('.ios-dot');
        const subtitle = document.getElementById('ios-passcode-subtitle');

        dots.forEach(dot => dot.classList.add('error'));
        if (dotsContainer) dotsContainer.classList.add('shake');

        if (subtitle) {
          subtitle.textContent = "รหัสไม่ถูกต้องนะอ้วน ลองใหม่อีกครั้ง 🥺";
          subtitle.style.color = "#e63946";
          subtitle.style.fontWeight = "600";
        }

        setTimeout(() => {
          if (dotsContainer) dotsContainer.classList.remove('shake');
          dots.forEach(dot => {
            dot.classList.remove('error');
            dot.style.background = '';
            dot.style.borderColor = '';
            dot.style.boxShadow = '';
          });
          enteredPasscode = "";
          updatePasscodeDots();
          isPasscodeLocked = false;
          if (subtitle) {
            subtitle.textContent = "ใส่รหัส 6 หลักเพื่อเปิดจดหมาย💌";
            subtitle.style.color = "";
            subtitle.style.fontWeight = "";
          }
        }, 750);
      }
    }

    function showHintModal() {
      playKeySound(650, 'sine');
      const hintPopup = document.getElementById('hint-popup');
      if (hintPopup) hintPopup.classList.add('show');
    }

    function hideHintModal() {
      const hintPopup = document.getElementById('hint-popup');
      if (hintPopup) hintPopup.classList.remove('show');
    }

    // Event listener สำหรับปุ่มกด Keypad
    document.querySelectorAll('.key-btn[data-key]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-key');
        btn.classList.add('key-pressed');
        setTimeout(() => btn.classList.remove('key-pressed'), 140);
        handlePasscodeDigit(key);
      });
    });

    // รองรับการพิมพ์ด้วยแป้นพิมพ์คอมพิวเตอร์ (Keyboard)
    document.addEventListener('keydown', (e) => {
      const passcodeScreen = document.getElementById('passcode-screen');
      if (passcodeScreen && !passcodeScreen.classList.contains('unlocked')) {
        if (/^[0-9]$/.test(e.key)) {
          const matchingBtn = document.querySelector(`.key-btn[data-key="${e.key}"]`);
          if (matchingBtn) {
            matchingBtn.classList.add('key-pressed');
            setTimeout(() => matchingBtn.classList.remove('key-pressed'), 140);
          }
          handlePasscodeDigit(e.key);
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          const delBtn = document.getElementById('btn-delete');
          if (delBtn) {
            delBtn.classList.add('key-pressed');
            setTimeout(() => delBtn.classList.remove('key-pressed'), 140);
          }
          deleteDigit();
        }
      }
    });

    /* ==========================================================
       ระบบควบคุมเพลงพื้นหลัง (Background Music Controller)
       ========================================================== */
    const bgMusic = document.getElementById('bg-music');
    const musicWidget = document.getElementById('music-widget');
    const vinylDisc = document.getElementById('vinyl-disc');
    const musicStatus = document.getElementById('music-status');
    let isMusicPlaying = false;

    function startMusic() {
      if (!bgMusic) return;
      bgMusic.volume = 0;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          isMusicPlaying = true;
          updateMusicUI(true);
          // ค่อยๆ ปรับระดับเสียง Fade-in นุ่มนวล
          let vol = 0;
          const fadeTimer = setInterval(() => {
            if (vol < 0.45) {
              vol += 0.03;
              bgMusic.volume = Math.min(0.45, vol);
            } else {
              clearInterval(fadeTimer);
            }
          }, 120);
        }).catch(err => {
          console.log("Audio play waiting for interaction:", err);
        });
      }
    }

    function toggleMusic() {
      if (!bgMusic) return;
      playButtonClickSound();
      if (isMusicPlaying) {
        bgMusic.pause();
        isMusicPlaying = false;
        updateMusicUI(false);
      } else {
        bgMusic.play().then(() => {
          isMusicPlaying = true;
          updateMusicUI(true);
        }).catch(err => console.log(err));
      }
    }

    function updateMusicUI(playing) {
      if (!musicWidget) return;
      if (playing) {
        musicWidget.classList.add('playing');
        if (vinylDisc) vinylDisc.classList.add('spinning');
        if (musicStatus) musicStatus.textContent = "กำลังเล่นเพลง ♫";
      } else {
        musicWidget.classList.remove('playing');
        if (vinylDisc) vinylDisc.classList.remove('spinning');
        if (musicStatus) musicStatus.textContent = "แตะเพื่อเล่นต่อ ▶";
      }
    }

    /* ==========================================================
       ระบบสลับธีม Day / Night Mode & หิ่งห้อย (Fireflies Engine)
       ========================================================== */
    let isNightMode = false;
    let nightSkyInitialized = false;

    function initNightSky() {
      if (nightSkyInitialized) return;
      nightSkyInitialized = true;
      const sky = document.getElementById('night-sky-layer');
      if (!sky) return;

      // 1. สร้างดวงดาวระยิบระยับ (Twinkling Stars)
      for (let i = 0; i < 48; i++) {
        const star = document.createElement('span');
        star.className = 'night-star';
        const size = 1.5 + Math.random() * 2.5;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--star-duration', `${2.2 + Math.random() * 3.5}s`);
        star.style.setProperty('--star-delay', `${Math.random() * 3}s`);
        sky.appendChild(star);
      }

      // 2. สร้างละอองหิ่งห้อยเรืองแสง (Glowing Fireflies)
      for (let i = 0; i < 30; i++) {
        const firefly = document.createElement('span');
        firefly.className = 'firefly';
        const size = 4.5 + Math.random() * 4.5;
        firefly.style.setProperty('--ff-size', `${size}px`);
        firefly.style.left = `${Math.random() * 100}%`;
        firefly.style.top = `${15 + Math.random() * 80}%`;

        firefly.style.setProperty('--ff-glow-dur', `${2.2 + Math.random() * 2.6}s`);
        firefly.style.setProperty('--ff-glow-delay', `${Math.random() * 3}s`);
        firefly.style.setProperty('--ff-float-dur', `${7 + Math.random() * 8}s`);
        firefly.style.setProperty('--ff-float-delay', `${Math.random() * 4}s`);

        firefly.style.setProperty('--ff-dx1', `${(Math.random() - 0.5) * 100}px`);
        firefly.style.setProperty('--ff-dy1', `${(Math.random() - 0.5) * 90}px`);
        firefly.style.setProperty('--ff-dx2', `${(Math.random() - 0.5) * 120}px`);
        firefly.style.setProperty('--ff-dy2', `${(Math.random() - 0.5) * 110}px`);
        firefly.style.setProperty('--ff-dx3', `${(Math.random() - 0.5) * 140}px`);
        firefly.style.setProperty('--ff-dy3', `${(Math.random() - 0.5) * 130}px`);

        sky.appendChild(firefly);
      }
    }

    function toggleTheme() {
      playButtonClickSound();
      isNightMode = !isNightMode;
      const body = document.body;
      const themeText = document.getElementById('theme-toggle-text');
      const themeIcon = document.getElementById('theme-toggle-icon');

      if (isNightMode) {
        body.classList.add('night-mode');
        initNightSky();
        if (themeText) themeText.textContent = "โหมดกลางคืน";
        if (themeIcon) themeIcon.textContent = "🌙";
      } else {
        body.classList.remove('night-mode');
        if (themeText) themeText.textContent = "โหมดกลางวัน";
        if (themeIcon) themeIcon.textContent = "☀️";
      }
    }

    /* ==========================================================
       สคริปต์ 1: จดหมายเดิม 
       ========================================================== */
    const envelope = document.querySelector('#envelope');
    const letter = document.querySelector('.letter-peek');
    const story = document.querySelector('#story');
        const hint = document.querySelector('.hint');
    const SVG_HEART_HTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" style="display:block;overflow:visible;" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

    function makeHeartRain() {
      const rain = document.querySelector('#heart-rain'), colors = ['#df6f91','#ef9eb5','#d85f82','#f3b2c2','#ff8fa3'];
      
      // 1. หัวใจร่วงหล่น (Falling Hearts - SVG Vector 100% หลากเฉดสีพาสเทล)
      for (let i = 0; i < 24; i++) {
        const heart = document.createElement('span'); 
        heart.className = 'rain-heart'; 
        heart.innerHTML = SVG_HEART_HTML;
        heart.style.left = `${Math.random() * 100}%`; 
        heart.style.setProperty('--rain-size', `${12 + Math.random() * 16}px`); 
        heart.style.setProperty('--rain-color', colors[i % colors.length]);
        heart.style.setProperty('--rain-duration', `${8 + Math.random() * 9}s`); 
        heart.style.setProperty('--rain-delay', `${-Math.random() * 16}s`); 
        heart.style.setProperty('--rain-drift', `${-45 + Math.random() * 90}px`); 
        rain.appendChild(heart);
      }

      // 2. ดอกและกลีบซากุระร่วงหล่น (Falling Sakura Blossoms & Petals)
      const sakuraIcons = ['🌸', '🌸', '🌸', '💮', '✿', '❀'];
      for (let i = 0; i < 26; i++) {
        const sakura = document.createElement('span'); sakura.className = 'rain-sakura';
        sakura.textContent = sakuraIcons[i % sakuraIcons.length];
        sakura.style.left = `${Math.random() * 100}%`;
        sakura.style.setProperty('--sakura-size', `${12 + Math.random() * 18}px`);
        sakura.style.setProperty('--sakura-opacity', `${0.45 + Math.random() * 0.4}`);
        sakura.style.setProperty('--sakura-duration', `${7.5 + Math.random() * 9.5}s`);
        sakura.style.setProperty('--sakura-delay', `${-Math.random() * 18}s`);
        sakura.style.setProperty('--sakura-drift', `${-65 + Math.random() * 130}px`);
        sakura.style.setProperty('--sakura-rot', `${(Math.random() > 0.5 ? 1 : -1) * (240 + Math.random() * 260)}deg`);
        rain.appendChild(sakura);
      }
    }

    function openEnvelope() {
      if (envelope.classList.contains('open')) return;
      playEnvelopeOpenSound();
      envelope.classList.add('open');
      createHeartBurst();
      setTimeout(() => { 
        envelope.classList.add('letter-ready'); 
        hint.textContent = 'กดที่จดหมายเพื่ออ่าน'; 
      }, 420);
    }

    function createHeartBurst() {
      const box = envelope.getBoundingClientRect(), colors = ['#d83a60','#ef7c9c','#ffb4c4','#b94e6a'];
      for (let i = 0; i < 18; i++) {
        const heart = document.createElement('span'), angle = (Math.PI * 2 * i) / 18 + (Math.random() - .5) * .32, distance = 70 + Math.random() * 130;
        heart.className = 'heart-burst'; 
        if (i % 3 === 0) {
          heart.textContent = '✦';
        } else {
          heart.innerHTML = SVG_HEART_HTML;
        }
        heart.style.setProperty('--start-x', `${box.left + box.width / 2}px`); heart.style.setProperty('--start-y', `${box.top + box.height / 2}px`);
        heart.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`); heart.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
        heart.style.setProperty('--spin', `${Math.round((Math.random() - .5) * 220)}deg`); heart.style.setProperty('--heart-size', `${16 + Math.random() * 16}px`); heart.style.setProperty('--heart-color', colors[i % colors.length]);
        document.body.appendChild(heart); setTimeout(() => heart.remove(), 950);
      }
    }

    // จัดการรูปภาพทรงหัวใจลอยขึ้นมาสลับซ้าย-ขวา (ใช้ทุกรูปยกเว้น photo7.jpg)
    const heartPhotos = (window.APP_CONFIG && window.APP_CONFIG.floatingPhotos && window.APP_CONFIG.floatingPhotos.length > 0)
      ? window.APP_CONFIG.floatingPhotos
      : [
        'public/images/photo1.jpg',
        'public/images/photo2.jpg',
        'public/images/photo3.jpg',
        'public/images/photo4.jpg',
        'public/images/photo5.jpg',
        'public/images/photo6.jpg',
        'public/images/photo8.jpg',
        'public/images/photo9.jpg'
      ];
    let heartPhotoIndex = 0;
    let isLeftHeartTurn = true;
    let floatingHeartsTimer = null;

    function createSingleHeartPhoto(side, size, shape = 'heart', xOffset = 0) {
      const heartWrap = document.createElement('div');
      const shapeClass = shape === 'circle' ? 'shape-circle' : 'shape-heart';
      heartWrap.className = `floating-photo-heart ${side} ${shapeClass}`;
      heartWrap.style.setProperty('--photo-size', size);
      if (xOffset !== 0) {
        if (side.includes('left')) {
          heartWrap.style.marginLeft = `${xOffset}px`;
        } else {
          heartWrap.style.marginRight = `${xOffset}px`;
        }
      }

      const imgSrc = heartPhotos[heartPhotoIndex];
      heartPhotoIndex = (heartPhotoIndex + 1) % heartPhotos.length;

      heartWrap.innerHTML = `
        <div class="heart-frame-outer">
          <div class="heart-frame-inner">
            <img src="${imgSrc}" alt="Hanbee & Love" />
          </div>
          <div class="heart-tip-glow"></div>
        </div>
      `;

      document.body.appendChild(heartWrap);

      // สร้างเอฟเฟกต์ละอองประกายดาวและหัวใจตามหลังปลายแหลม
      const trailColors = shape === 'circle'
        ? ['#ff758f', '#ff8fa3', '#ffccd5', '#ffd166', '#ffffff', '#f472b6', '#ffc2d1']
        : ['#ff758f', '#ff8fa3', '#ffccd5', '#ffd166', '#ffffff', '#f472b6'];
      const trailIcons = shape === 'circle'
        ? ['🌸', '♥', '•', '✦', '✧', '♥']
        : ['✦', '♥', '•', '✧', '♥'];
      
      const trailInterval = setInterval(() => {
        if (!heartWrap.parentNode || heartWrap.style.opacity === '0' || heartWrap.classList.contains('fading-out')) {
          clearInterval(trailInterval);
          return;
        }
        const rect = heartWrap.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight + 120) {
          clearInterval(trailInterval);
          return;
        }

        // พิกัดปลายแหลม/ขอบล่างของรูปทรง
        const tipX = rect.left + rect.width * 0.5 + (Math.random() - 0.5) * 8;
        const tipY = rect.top + rect.height * (shape === 'circle' ? 0.92 : 0.88) + (Math.random() - 0.5) * 4;

        const particle = document.createElement('span');
        particle.className = 'heart-trail-particle';
        const color = trailColors[Math.floor(Math.random() * trailColors.length)];
        const icon = trailIcons[Math.floor(Math.random() * trailIcons.length)];

        particle.textContent = icon;
        particle.style.setProperty('--trail-x', `${tipX}px`);
        particle.style.setProperty('--trail-y', `${tipY}px`);
        particle.style.setProperty('--trail-size', icon === '•' ? `${12 + Math.random() * 6}px` : `${10 + Math.random() * 10}px`);
        particle.style.setProperty('--trail-color', color);
        particle.style.setProperty('--trail-glow', color);
        particle.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 26}px`);
        particle.style.setProperty('--drift-y', `${20 + Math.random() * 30}px`);
        particle.style.setProperty('--trail-dur', `${0.85 + Math.random() * 0.35}s`);
        particle.style.setProperty('--trail-rot', `${(Math.random() - 0.5) * 180}deg`);

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
      }, 120);

      setTimeout(() => {
        clearInterval(trailInterval);
        if (heartWrap && heartWrap.parentNode) {
          heartWrap.remove();
        }
      }, 7800);
    }

    function spawnFloatingHeartPhoto() {
      const isMobile = window.innerWidth <= 600;
      const sizeVariants = isMobile
        ? ['65px', '80px', '95px', '110px']
        : ['clamp(76px, 9.5vw, 92px)', 'clamp(98px, 12vw, 118px)', 'clamp(124px, 15vw, 145px)', 'clamp(150px, 18vw, 175px)'];

      // สลับฝั่งในแต่ละรอบ (ซ้าย หรือ ขวา)
      const isLeft = isLeftHeartTurn;
      isLeftHeartTurn = !isLeftHeartTurn;

      const shapes = ['heart', 'circle'];

      // สุ่มจำนวนรูปที่จะขึ้นพร้อมกันในรอบนี้: 50% สำหรับ 1 รูป และ 50% สำหรับ 2 รูป
      const count = Math.random() < 0.5 ? 2 : 1;

      if (count === 2) {
        // สุ่ม 2 ขนาดที่ต่างกันอย่างชัดเจน
        const idx1 = Math.floor(Math.random() * sizeVariants.length);
        let idx2 = Math.floor(Math.random() * (sizeVariants.length - 1));
        if (idx2 >= idx1) idx2++;

        // สุ่มรูปทรง (หัวใจ หรือ วงกลม)
        const shape1 = shapes[Math.floor(Math.random() * shapes.length)];
        const shape2 = shapes[Math.floor(Math.random() * shapes.length)];

        // จัดให้อยู่ฝั่งเดียวกัน แต่แยกเลนนอก (outer) และเลนใน (inner) เพื่อไม่ให้บังกัน 100%
        const outerClass = isLeft ? 'side-left-outer' : 'side-right-outer';
        const innerClass = isLeft ? 'side-left-inner' : 'side-right-inner';

        createSingleHeartPhoto(outerClass, sizeVariants[idx1], shape1);
        setTimeout(() => {
          createSingleHeartPhoto(innerClass, sizeVariants[idx2], shape2);
        }, 220 + Math.random() * 200);
      } else {
        // ขึ้น 1 รูปตรงกลางเลนฝั่งนั้น
        const singleClass = isLeft ? 'side-left' : 'side-right';
        const randomSize = sizeVariants[Math.floor(Math.random() * sizeVariants.length)];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        createSingleHeartPhoto(singleClass, randomSize, randomShape);
      }
    }

    function startFloatingHearts() {
      if (floatingHeartsTimer) return;
      spawnFloatingHeartPhoto();
      floatingHeartsTimer = setInterval(spawnFloatingHeartPhoto, 2200);
    }

    function stopFloatingHearts() {
      if (floatingHeartsTimer) {
        clearInterval(floatingHeartsTimer);
        floatingHeartsTimer = null;
      }
      document.querySelectorAll('.floating-photo-heart').forEach(el => {
        el.classList.add('fading-out');
        setTimeout(() => el.remove(), 900);
      });
    }

    function readLetter(event) {
      event.stopPropagation();
      if (!envelope.classList.contains('letter-ready')) return;
      playLetterReadSound();
      createHeartBurst(); 

      // ทำอนิเมชันเปิดเรื่องราวอย่างนุ่มนวล (เฟดซองจดหมายและเลื่อนจอลงมาหาเนื้อความ)
      const letterPage = document.getElementById('letter-page');
      if (letterPage) {
        letterPage.style.transition = 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
        letterPage.style.opacity = '0.35';
        letterPage.style.transform = 'translate3d(0, -15px, 0) scale(0.98)';
      }

      story.classList.add('show');
      startFloatingHearts();
      appCurrentStep = 2;
      updateBackNavButton();
      setTimeout(() => story.scrollIntoView({ behavior:'smooth', block:'start' }), 140);
    }

    makeHeartRain();
    envelope.addEventListener('click', openEnvelope); 
    envelope.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); openEnvelope(); }});
    letter.addEventListener('click', readLetter); letter.setAttribute('role','button'); letter.setAttribute('tabindex','0');
    letter.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); readLetter(e); }});

    // เอฟเฟกต์ประกายหัวใจวิบวับเมื่อนำเมาส์ไปชี้ที่ซองจดหมาย
    let hoverSparkleTimer = null;
    envelope.addEventListener('mouseenter', () => {
      if (envelope.classList.contains('open') || hoverSparkleTimer) return;
      hoverSparkleTimer = setInterval(() => {
        if (envelope.classList.contains('open')) {
          clearInterval(hoverSparkleTimer);
          hoverSparkleTimer = null;
          return;
        }
        const box = envelope.getBoundingClientRect();
        const sparkle = document.createElement('span');
        sparkle.className = 'heart-burst';
        sparkle.textContent = Math.random() > 0.4 ? '✦' : '♥';
        sparkle.style.setProperty('--start-x', `${box.left + 30 + Math.random() * (box.width - 60)}px`);
        sparkle.style.setProperty('--start-y', `${box.top + 20 + Math.random() * (box.height - 40)}px`);
        sparkle.style.setProperty('--burst-x', `${(Math.random() - 0.5) * 50}px`);
        sparkle.style.setProperty('--burst-y', `${-25 - Math.random() * 40}px`);
        sparkle.style.setProperty('--spin', `${Math.round((Math.random() - 0.5) * 140)}deg`);
        sparkle.style.setProperty('--heart-size', `${10 + Math.random() * 12}px`);
        sparkle.style.setProperty('--heart-color', ['#ff8fa3', '#ffccd5', '#f472b6', '#ffd166', '#fff'][Math.floor(Math.random() * 5)]);
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 900);
      }, 160);
    });
    envelope.addEventListener('mouseleave', () => {
      if (hoverSparkleTimer) {
        clearInterval(hoverSparkleTimer);
        hoverSparkleTimer = null;
      }
    });

    document.querySelectorAll('.hanging-frame-wrap').forEach(frame => {
      frame.addEventListener('click', (e) => {
        e.stopPropagation();
        playHangingPhotoSound();
        const box = frame.getBoundingClientRect(), colors = ['#df6f91','#ef9eb5','#d85f82','#f3b2c2','#ffd166'];
        for (let i = 0; i < 12; i++) {
          const heart = document.createElement('span'), angle = (Math.PI * 2 * i) / 12 + (Math.random() - .5) * .32, distance = 55 + Math.random() * 95;
          heart.className = 'heart-burst'; 
          if (i % 3 === 0) {
            heart.textContent = '✨';
          } else {
            heart.innerHTML = SVG_HEART_HTML;
          }
          heart.style.setProperty('--start-x', `${box.left + box.width / 2}px`); heart.style.setProperty('--start-y', `${box.top + box.height / 2}px`);
          heart.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`); heart.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
          heart.style.setProperty('--spin', `${Math.round((Math.random() - .5) * 180)}deg`); heart.style.setProperty('--heart-size', `${14 + Math.random() * 14}px`); heart.style.setProperty('--heart-color', colors[i % colors.length]);
          document.body.appendChild(heart); setTimeout(() => heart.remove(), 950);
        }
      });
    });

    const garden = document.querySelector('#flower-layer');
    const flowers = [];
    const flowerColors = ['#e85e83','#f28dac','#ffc0cf','#fff7fb','#cf3f67'];
    const flowerSizes = [[20,30],[34,48],[54,76],[88,120]];
    const petalAngles = [0,45,90,135,180,225,270,315];
    let activePointer = null, pendingPoint = null, flowerFrame = null, lastFlowerPoint = null;

    // ตรวจสอบว่าพิกัดหรือเป้าหมายกำลังกดโดนรูปถ่าย ช่อดอกไม้ หรือปุ่ม/การ์ดสำคัญหรือไม่ เพื่อไม่ให้สร้างดอกไม้ขึ้นมาบัง
    function shouldIgnoreFlowerSpawn(target, clientX, clientY) {
      const selector = '.hanging-frame-wrap, .floating-photo-heart, .polaroid-frame, .photo-inner, .prop-img-wrap, img, #flower-bouquet-left, .flower-bouquet-wrap, .bouquet-badge, #envelope, button, .btn-choice, #yes-btn, #no-btn, #btn-next, .music-widget, .theme-toggle-btn, .back-nav-btn, #back-nav-btn, .counter-box, .love-counter-card';
      if (target && target.closest && target.closest(selector)) return true;
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        const el = document.elementFromPoint(clientX, clientY);
        if (el && el.closest && el.closest(selector)) return true;
      }
      return false;
    }

    function addFlower(point) {
      const flower = document.createElement('span');
      const [minSize,maxSize] = flowerSizes[Math.floor(Math.random() * flowerSizes.length)];
      const size = minSize + Math.random() * (maxSize - minSize);
      flower.className = 'flower'; flower.style.left = `${point.x}px`; flower.style.top = `${point.y}px`;
      flower.style.setProperty('--flower-size', `${size}px`); flower.style.setProperty('--flower-rotation', `${Math.round(Math.random() * 360)}deg`);
      flower.style.setProperty('--petal-color', flowerColors[Math.floor(Math.random() * flowerColors.length)]);
      petalAngles.forEach((angle,index) => { const petal = document.createElement('span'); petal.className = 'flower-petal'; petal.style.setProperty('--petal-angle', `${angle}deg`); petal.style.setProperty('--petal-delay', `${index * 35}ms`); flower.appendChild(petal); });
      const core = document.createElement('span'); core.className = 'flower-core'; flower.appendChild(core);
      garden.appendChild(flower); flowers.push(flower);
      flower.addEventListener('animationend', event => { if (event.target !== flower) return; flower.remove(); const index = flowers.indexOf(flower); if (index > -1) flowers.splice(index,1); }, { once:true });
      while (flowers.length > 72) flowers.shift().remove();
    }
    function flushFlower() {
      flowerFrame = null;
      if (!pendingPoint) return;
      const point = pendingPoint; pendingPoint = null;
      if (!lastFlowerPoint || Math.hypot(point.x-lastFlowerPoint.x,point.y-lastFlowerPoint.y) > 24) { addFlower(point); lastFlowerPoint = point; }
    }
    function queueFlower(event, force = false) {
      if (shouldIgnoreFlowerSpawn(event.target, event.clientX, event.clientY)) return;
      const box = garden.getBoundingClientRect(); pendingPoint = { x:event.clientX-box.left, y:event.clientY-box.top };
      if (force) { if (flowerFrame) cancelAnimationFrame(flowerFrame); flowerFrame = null; addFlower(pendingPoint); lastFlowerPoint = pendingPoint; pendingPoint = null; return; }
      if (!flowerFrame) flowerFrame = requestAnimationFrame(flushFlower);
    }
    document.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (shouldIgnoreFlowerSpawn(event.target, event.clientX, event.clientY)) return;
      activePointer = event.pointerId;
      queueFlower(event,true);
    }, { passive: true });
    document.addEventListener('pointermove', event => {
      if (event.pointerId !== activePointer) return;
      if (shouldIgnoreFlowerSpawn(event.target, event.clientX, event.clientY)) return;
      queueFlower(event);
    }, { passive: true });
    ['pointerup','pointercancel'].forEach(type => document.addEventListener(type, event => { 
      if (event.pointerId === activePointer) { activePointer = null; pendingPoint = null; } 
    }, { passive: true }));


    /* ==========================================================
       สคริปต์ 2: ส่วนควบคุมหน้าขอเป็นแฟน 
       ========================================================== */
    function createProposalEntranceBurst() {
      const colors = ['#ff4d6d', '#ff758f', '#ff8fa3', '#ffccd5', '#ffd166', '#ffffff', '#f472b6'];
      const icons = ['♥', '💖', '✨', '✦', '🌸', '💕', '♥'];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.42;

      for (let i = 0; i < 32; i++) {
        const heart = document.createElement('span');
        const angle = (Math.PI * 2 * i) / 32 + (Math.random() - 0.5) * 0.4;
        const distance = 80 + Math.random() * 220;
        heart.className = 'heart-burst';
        heart.textContent = icons[i % icons.length];
        heart.style.setProperty('--start-x', `${centerX}px`);
        heart.style.setProperty('--start-y', `${centerY}px`);
        heart.style.setProperty('--burst-x', `${Math.cos(angle) * distance}px`);
        heart.style.setProperty('--burst-y', `${Math.sin(angle) * distance}px`);
        heart.style.setProperty('--spin', `${Math.round((Math.random() - 0.5) * 360)}deg`);
        heart.style.setProperty('--heart-size', `${14 + Math.random() * 22}px`);
        heart.style.setProperty('--heart-color', colors[i % colors.length]);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1100);
      }
    }

    function goToProposal() {
        playButtonClickSound();
        stopFloatingHearts();
        const letterPage = document.getElementById('letter-page');
        if (letterPage) {
          letterPage.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          letterPage.style.opacity = '0';
          letterPage.style.transform = 'translate3d(0, -20px, 0) scale(0.96)';
        }

        story.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        story.style.opacity = '0'; 
        story.style.transform = 'translate3d(0, -20px, 0) scale(0.96)';

        setTimeout(() => {
            if (letterPage) letterPage.style.display = 'none';
            story.style.display = 'none';
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            const proposal = document.getElementById('proposal-section');
            if (proposal) {
              proposal.classList.add('show');
            }
            appCurrentStep = 3;
            updateBackNavButton();
            setTimeout(createProposalEntranceBurst, 180);
        }, 550);
    }

    const noBtn = document.getElementById("no-btn");
    const yesBtn = document.getElementById("yes-btn");
    const btnContainer = document.getElementById("prop-btn-container");
    
    let yesFontSize = 1.15; 

    const noMessages = [
        "แน่ใจเหรอ? 😢", "คิดดีๆ น้าาา", "ใจร้ายจัง 💔",
        "ให้โอกาสอีกที", "กดปุ่มนู้นสิ!", "ทำไมอ่ะ 🥺",
        "กดตกลงเถอะน้า", "หนีแล้วนะ 🏃‍♂️", "จับให้ได้สิ 😜", "ยอมแพ้เถอะ!"
    ];
    let messageIndex = 0;

    // ฟังก์ชันสร้างบอลลูนคำแซวน่ารักๆ เมื่อพยายามกดปุ่ม No แสดงออกด้านข้าง (ข้อ 5)
    function spawnTauntToast() {
      if (!btnContainer) return;
      // ลบข้อความเดิมออกก่อน เพื่อแสดงอันใหม่อันเดียวอย่างชัดเจน
      const existing = btnContainer.querySelectorAll('.no-taunt-toast');
      existing.forEach(el => el.remove());

      const taunts = [
        "แน่ะ! จะกด No เหรออ้วน 😝",
        "ปุ่มนี้กดไม่ได้หรอกก 5555 🏃‍♂️💨",
        "คิดดีๆ น้าาา อย่าน้าาา ♡🥺",
        "เค้ารู้ว่าอ้วนอยากกด Yes! 💖",
        "หนีเก่งมั้ยล่ะ จับให้ได้สิ 😜",
        "ปุ่ม No พังแล้ว เหลือแต่ Yes นะคะ 💕",
        "อย่าน้าาา รักเค้าแล้วห้าม No! 🥰"
      ];
      const text = taunts[Math.floor(Math.random() * taunts.length)];
      const toast = document.createElement('div');
      toast.className = 'no-taunt-toast';
      toast.textContent = text;
      btnContainer.appendChild(toast);
      setTimeout(() => toast.remove(), 2100);
    }

    function moveButton() {
        playButtonMoveSound();

        // แสดงบอลลูนคำแซวลอยออกทางด้านข้าง
        spawnTauntToast();

        // เปลี่ยนข้อความ
        noBtn.innerText = noMessages[messageIndex];
        messageIndex = (messageIndex + 1) % noMessages.length;

        // ขยายปุ่มตกลง (Yes)
        yesFontSize += 0.35;
        yesBtn.style.fontSize = `${yesFontSize}rem`;

        // ให้ปุ่มตกลงอยู่ตรงกลางกล่องเสมอ
        yesBtn.style.left = '50%';
        yesBtn.style.top = '50%';
        yesBtn.style.transform = 'translate(-50%, -50%)';
        noBtn.style.transform = 'none';

        // วัดขนาดจริงขององค์ประกอบ
        const containerRect = btnContainer.getBoundingClientRect();
        const yesRectScreen = yesBtn.getBoundingClientRect();
        const noRectScreen = noBtn.getBoundingClientRect();

        const noWidth = noRectScreen.width || noBtn.offsetWidth || 85;
        const noHeight = noRectScreen.height || noBtn.offsetHeight || 42;

        // ปรับความสูงกล่องอัตโนมัติเมื่อปุ่มตกลงขยายใหญ่ขึ้น
        const minRequiredHeight = Math.max(260, yesRectScreen.height + noHeight * 2 + 70);
        btnContainer.style.minHeight = `${minRequiredHeight}px`;

        const cWidth = containerRect.width;
        const cHeight = Math.max(containerRect.height, minRequiredHeight);

        // ตำแหน่งปุ่มตกลงเทียบกับ container
        const yesLeft = (cWidth - yesRectScreen.width) / 2;
        const yesRight = yesLeft + yesRectScreen.width;
        const yesTop = (cHeight - yesRectScreen.height) / 2;
        const yesBottom = yesTop + yesRectScreen.height;

        const pad = 12; // ระยะห่างจากขอบกล่อง
        const safeGap = 20; // ระยะห่างขั้นต่ำจากปุ่มตกลง (กันซ้อนทับ 100%)

        // หา 4 โซนปลอดภัยรอบปุ่มตกลง
        const zones = [];

        // 1. โซนด้านบน
        const topMaxY = yesTop - safeGap - noHeight;
        if (topMaxY >= pad) {
            zones.push({
                minX: pad,
                maxX: Math.max(pad, cWidth - noWidth - pad),
                minY: pad,
                maxY: topMaxY
            });
        }

        // 2. โซนด้านล่าง
        const bottomMinY = yesBottom + safeGap;
        const bottomMaxY = cHeight - pad - noHeight;
        if (bottomMaxY >= bottomMinY) {
            zones.push({
                minX: pad,
                maxX: Math.max(pad, cWidth - noWidth - pad),
                minY: bottomMinY,
                maxY: bottomMaxY
            });
        }

        // 3. โซนด้านซ้าย
        const leftMaxX = yesLeft - safeGap - noWidth;
        if (leftMaxX >= pad) {
            zones.push({
                minX: pad,
                maxX: leftMaxX,
                minY: pad,
                maxY: Math.max(pad, cHeight - noHeight - pad)
            });
        }

        // 4. โซนด้านขวา
        const rightMinX = yesRight + safeGap;
        const rightMaxX = cWidth - pad - noWidth;
        if (rightMaxX >= rightMinX) {
            zones.push({
                minX: rightMinX,
                maxX: rightMaxX,
                minY: pad,
                maxY: Math.max(pad, cHeight - noHeight - pad)
            });
        }

        let posX, posY;

        if (zones.length > 0) {
            // สุ่ม 1 โซนที่ปลอดภัย
            const z = zones[Math.floor(Math.random() * zones.length)];
            posX = z.minX + Math.random() * Math.max(0, z.maxX - z.minX);
            posY = z.minY + Math.random() * Math.max(0, z.maxY - z.minY);
        } else {
            // กรณีขอบเขตจำกัดมาก ให้วางด้านบนสุดหรือล่างสุด
            posX = Math.max(pad, (cWidth - noWidth) / 2);
            posY = pad;
        }

        noBtn.style.left = `${Math.round(posX)}px`;
        noBtn.style.top = `${Math.round(posY)}px`;
    }

    /* ==========================================================
       ระบบเรนเดอร์สไปรต์ความเร็วสูง 60-120 FPS & ฟิสิกส์ไหลลื่น (Ultra-Smooth Flower Engine)
       ========================================================== */
    let flowerCanvasAnimId = null;
    let cachedFlowerSprites = null;

    function initFlowerBloomCanvas() {
      const canvas = document.getElementById('flower-bloom-canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d', { alpha: true });
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { canvas, ctx, width: window.innerWidth, height: window.innerHeight };
    }

    window.addEventListener('resize', () => {
      const canvas = document.getElementById('flower-bloom-canvas');
      if (canvas && canvas.classList.contains('show')) {
        initFlowerBloomCanvas();
      }
    });

    // สร้าง Offscreen Canvas สำหรับพรีเรนเดอร์สไปรต์ดอกไม้ความละเอียดสูงล่วงหน้า (Zero GPU/CPU Lag)
    function createOffscreenCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function generateAllFlowerSprites() {
      if (cachedFlowerSprites) return cachedFlowerSprites;

      const spriteSize = 300;
      const half = spriteSize / 2;
      const sprites = {};

      // จานสีโทนชมพู-ขาวสดใส เปล่งประกาย (Vibrant Pink & White Palette)
      const palettes = {
        freshRose: { inner: 'rgba(235, 47, 90, 0.96)', mid: 'rgba(255, 115, 145, 0.9)', outer: 'rgba(255, 255, 255, 0.98)', core: '#ffd166' },
        sakura: { inner: 'rgba(244, 63, 110, 0.95)', mid: 'rgba(255, 150, 175, 0.9)', outer: 'rgba(255, 252, 254, 0.98)', core: '#ffe066' },
        snowWhitePeony: { inner: 'rgba(255, 107, 138, 0.85)', mid: 'rgba(255, 210, 222, 0.92)', outer: 'rgba(255, 255, 255, 0.99)', core: '#fff0a6' },
        magentaPeony: { inner: 'rgba(219, 28, 86, 0.96)', mid: 'rgba(251, 98, 140, 0.92)', outer: 'rgba(255, 245, 248, 0.98)', core: '#ffcc00' },
        babyPinkRose: { inner: 'rgba(247, 85, 126, 0.92)', mid: 'rgba(255, 175, 195, 0.9)', outer: 'rgba(255, 255, 255, 0.99)', core: '#ffe480' },
        coralBlush: { inner: 'rgba(240, 52, 95, 0.95)', mid: 'rgba(255, 130, 155, 0.9)', outer: 'rgba(255, 255, 255, 0.98)', core: '#ffd875' }
      };

      // ฟังก์ชันวาดกลีบสไปรต์
      function drawSpritePetal(ctx, len, w, cInner, cMid, cOuter, curl = 0) {
        ctx.save();
        const grad = ctx.createLinearGradient(0, 0, 0, -len);
        grad.addColorStop(0, cInner);
        grad.addColorStop(0.55, cMid);
        grad.addColorStop(1, cOuter);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-w * 0.75 + curl, -len * 0.35, -w + curl * 1.5, -len * 0.75, 0, -len);
        ctx.bezierCurveTo(w + curl * 1.5, -len * 0.75, w * 0.75 + curl, -len * 0.35, 0, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = Math.max(0.6, w * 0.04);
        ctx.stroke();
        ctx.restore();
      }

      // 1. สไปรต์กุหลาบ/โบตั๋น
      function renderRoseSprite(pal) {
        const c = createOffscreenCanvas(spriteSize, spriteSize);
        const ctx = c.getContext('2d');
        ctx.translate(half, half);
        const maxR = half * 0.88;
        const layers = 5;
        const petalsPerLayer = [4, 5, 6, 7, 8];

        for (let l = layers - 1; l >= 0; l--) {
          const count = petalsPerLayer[l];
          const len = maxR * ((l + 1) / layers);
          const w = len * 0.75;
          const step = (Math.PI * 2) / count;
          const off = l * 0.45;
          for (let i = 0; i < count; i++) {
            ctx.save();
            ctx.rotate(i * step + off);
            const curl = Math.sin(i * 1.7 + l) * (w * 0.18);
            drawSpritePetal(ctx, len, w, pal.inner, pal.mid, pal.outer, curl);
            ctx.restore();
          }
        }
        // เกสรกลาง
        const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR * 0.22);
        coreGrad.addColorStop(0, pal.core);
        coreGrad.addColorStop(0.6, '#f59e0b');
        coreGrad.addColorStop(1, pal.inner);
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 0, maxR * 0.18, 0, Math.PI * 2);
        ctx.fill();

        for (let s = 0; s < 7; s++) {
          const a = (s * Math.PI * 2) / 7;
          const r = maxR * 0.1;
          ctx.fillStyle = '#fff4bd';
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        return c;
      }

      // 2. สไปรต์ลิลลี่
      function renderLilySprite(pal) {
        const c = createOffscreenCanvas(spriteSize, spriteSize);
        const ctx = c.getContext('2d');
        ctx.translate(half, half);
        const len = half * 0.88;
        const w = len * 0.42;

        for (let i = 0; i < 6; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / 6);
          const grad = ctx.createLinearGradient(0, 0, 0, -len);
          grad.addColorStop(0, pal.inner);
          grad.addColorStop(0.45, pal.mid);
          grad.addColorStop(1, pal.outer);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-w, -len * 0.55, 0, -len);
          ctx.quadraticCurveTo(w, -len * 0.55, 0, 0);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -len * 0.9);
          ctx.stroke();

          for (let d = 1; d <= 4; d++) {
            ctx.fillStyle = 'rgba(180, 20, 50, 0.7)';
            ctx.beginPath();
            ctx.arc((Math.sin(d * 3) * w * 0.22), -len * (0.2 + d * 0.12), 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        for (let st = 0; st < 6; st++) {
          const sAngle = (st * Math.PI * 2) / 6 + 0.26;
          const stLen = len * 0.48;
          const tipX = Math.cos(sAngle) * stLen;
          const tipY = Math.sin(sAngle) * stLen;
          ctx.strokeStyle = 'rgba(180, 230, 175, 0.9)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(tipX, tipY, 4.5, 2.2, sAngle, 0, Math.PI * 2);
          ctx.fill();
        }
        return c;
      }

      // 3. สไปรต์ซากุระ
      function renderSakuraSprite(pal) {
        const c = createOffscreenCanvas(spriteSize, spriteSize);
        const ctx = c.getContext('2d');
        ctx.translate(half, half);
        const len = half * 0.85;
        const w = len * 0.65;

        for (let i = 0; i < 5; i++) {
          ctx.save();
          ctx.rotate((i * Math.PI * 2) / 5);
          const grad = ctx.createRadialGradient(0, 0, 0, 0, -len * 0.6, len);
          grad.addColorStop(0, pal.inner);
          grad.addColorStop(0.65, pal.mid);
          grad.addColorStop(1, pal.outer);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-w * 0.8, -len * 0.4, -w, -len * 0.85, -w * 0.4, -len);
          ctx.lineTo(0, -len * 0.88);
          ctx.lineTo(w * 0.4, -len);
          ctx.bezierCurveTo(w, -len * 0.85, w * 0.8, -len * 0.4, 0, 0);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = '#f59e0b';
        for (let s = 0; s < 8; s++) {
          const a = (s * Math.PI * 2) / 8;
          const r = len * 0.28;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        return c;
      }

      // 4. สไปรต์ไฮเดรนเยีย
      function renderHydrangeaSprite(pal) {
        const c = createOffscreenCanvas(spriteSize, spriteSize);
        const ctx = c.getContext('2d');
        ctx.translate(half, half);
        const clusterR = half * 0.82;
        const count = 16;

        for (let f = 0; f < count; f++) {
          ctx.save();
          const fAngle = f * 2.39996 + f * 0.1;
          const fDist = (Math.sqrt(f + 1) / Math.sqrt(count)) * clusterR;
          ctx.translate(Math.cos(fAngle) * fDist, Math.sin(fAngle) * fDist);
          ctx.rotate(f * 0.8);
          const fSize = 28;
          const fColor = f % 2 === 0 ? pal.mid : pal.outer;
          for (let p = 0; p < 4; p++) {
            ctx.save();
            ctx.rotate((p * Math.PI) / 2);
            ctx.fillStyle = fColor;
            ctx.beginPath();
            ctx.ellipse(0, -fSize * 0.55, fSize * 0.45, fSize * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = '#fff8db';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        return c;
      }

      // 5. สไปรต์ใบไม้
      function renderLeafSprite() {
        const c = createOffscreenCanvas(spriteSize, spriteSize);
        const ctx = c.getContext('2d');
        ctx.translate(half, half);
        const len = half * 0.9;
        const w = len * 0.44;
        const grad = ctx.createLinearGradient(0, 0, 0, -len);
        grad.addColorStop(0, 'rgba(46, 125, 50, 0.95)');
        grad.addColorStop(0.5, 'rgba(76, 175, 80, 0.9)');
        grad.addColorStop(1, 'rgba(165, 214, 167, 0.85)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-w, -len * 0.5, 0, -len);
        ctx.quadraticCurveTo(w, -len * 0.5, 0, 0);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len * 0.9);
        ctx.stroke();
        return c;
      }

      // 6. สไปรต์กลีบเดี่ยว
      function renderPetalSprite(pal) {
        const c = createOffscreenCanvas(100, 100);
        const ctx = c.getContext('2d');
        ctx.translate(50, 50);
        drawSpritePetal(ctx, 42, 28, pal.inner, pal.mid, pal.outer, 3);
        return c;
      }

      sprites.roseFresh = renderRoseSprite(palettes.freshRose);
      sprites.sakura = renderSakuraSprite(palettes.sakura);
      sprites.whitePeony = renderRoseSprite(palettes.snowWhitePeony);
      sprites.magentaPeony = renderRoseSprite(palettes.magentaPeony);
      sprites.babyPinkRose = renderRoseSprite(palettes.babyPinkRose);
      sprites.lily = renderLilySprite(palettes.snowWhitePeony);
      sprites.hydrangea = renderHydrangeaSprite(palettes.freshRose);
      sprites.leaf = renderLeafSprite();
      sprites.petalPink = renderPetalSprite(palettes.freshRose);
      sprites.petalWhite = renderPetalSprite(palettes.snowWhitePeony);

      cachedFlowerSprites = sprites;
      return sprites;
    }

    // ฟังก์ชันระเบิดดอกไม้แบบ Procedural Bloom 60-120 FPS
    function playFlowerExplosion(onComplete) {
      const canvasInfo = initFlowerBloomCanvas();
      if (!canvasInfo) {
        if (onComplete) onComplete();
        return;
      }

      const { canvas, ctx, width, height } = canvasInfo;
      canvas.classList.add('show');

      const cx = width / 2;
      const cy = height / 2;
      const sprites = generateAllFlowerSprites();

      const spriteTypes = [
        sprites.roseFresh,
        sprites.sakura,
        sprites.whitePeony,
        sprites.magentaPeony,
        sprites.babyPinkRose,
        sprites.lily,
        sprites.hydrangea
      ];

      const isMobile = window.innerWidth < 600;
      const wave1Count = isMobile ? 14 : 20;
      const wave2Count = isMobile ? 18 : 26;
      const flowers = [];

      // ==========================================
      // ระลอกที่ 1 (Wave 1): ดอกไม้ระเบิดพุ่งกลุ่มแรก กระจายกว้างขึ้นสวยงาม (t = 0s)
      // ==========================================
      for (let i = 0; i < wave1Count; i++) {
        const angle = (i / wave1Count) * Math.PI * 2 + (Math.random() - 0.5) * 0.32;
        const distTarget = (Math.min(width, height) * 0.27) + Math.random() * (Math.min(width, height) * 0.27);
        const speed = distTarget * (2.4 + Math.random() * 0.7);

        const isLeaf = Math.random() < 0.16;
        const sprite = isLeaf ? sprites.leaf : spriteTypes[Math.floor(Math.random() * spriteTypes.length)];
        const targetScale = (isMobile ? 1.02 : 1.22) * (0.92 + Math.random() * 0.35);
        const baseSize = (isMobile ? 112 : 158) + Math.random() * 55;

        flowers.push({
          wave: 1,
          x: cx + (Math.random() - 0.5) * 15,
          y: cy + (Math.random() - 0.5) * 15,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          scale: 0,
          targetScale,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 1.5,
          sprite,
          size: baseSize,
          delay: Math.random() * 0.08,
          swaySpeed: 1.6 + Math.random() * 1.4,
          swayAmp: 18 + Math.random() * 22,
          swayPhase: Math.random() * Math.PI * 2,
          hasBackLeaf: !isLeaf && Math.random() < 0.45
        });
      }

      // ==========================================
      // ระลอกที่ 2 (Wave 2): ดอกไม้ระเบิดพุ่งระลอกสอง อลังการเต็มจอทุกทิศทาง (t = 0.85s)
      // ==========================================
      for (let i = 0; i < wave2Count; i++) {
        const angle = (i / wave2Count) * Math.PI * 2 + (Math.random() - 0.5) * 0.35 + 0.3;
        const distTarget = (Math.min(width, height) * 0.36) + Math.random() * (Math.max(width, height) * 0.46);
        const speed = distTarget * (2.5 + Math.random() * 0.8);

        const isLeaf = Math.random() < 0.2;
        const sprite = isLeaf ? sprites.leaf : spriteTypes[Math.floor(Math.random() * spriteTypes.length)];
        const targetScale = (isMobile ? 1.08 : 1.3) * (0.95 + Math.random() * 0.38);
        const baseSize = (isMobile ? 120 : 165) + Math.random() * 65;

        flowers.push({
          wave: 2,
          x: cx + (Math.random() - 0.5) * 20,
          y: cy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          scale: 0,
          targetScale,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 1.6,
          sprite,
          size: baseSize,
          delay: 0.85 + Math.random() * 0.1, // เริ่มระเบิดรอบที่สองหลังจากรอบแรก 0.85 วินาที
          swaySpeed: 1.7 + Math.random() * 1.5,
          swayAmp: 22 + Math.random() * 26,
          swayPhase: Math.random() * Math.PI * 2,
          hasBackLeaf: !isLeaf && Math.random() < 0.48
        });
      }

      // กลีบดอกไม้ปลิว 2 ระลอก
      const petalsFlutter = [];
      const totalPetals = 26;
      for (let p = 0; p < totalPetals; p++) {
        const isWave2 = p >= 12;
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = (isWave2 ? 250 : 190) + Math.random() * 380;
        petalsFlutter.push({
          x: cx,
          y: cy,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed - 30,
          size: 28 + Math.random() * 24,
          scale: 0,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 3,
          sprite: Math.random() > 0.5 ? sprites.petalPink : sprites.petalWhite,
          delay: (isWave2 ? 0.85 : 0) + Math.random() * 0.15
        });
      }

      // ละอองประกายดาวทอง 2 ระลอก
      const sparkles = [];
      const totalSparkles = 40;
      for (let s = 0; s < totalSparkles; s++) {
        const isWave2 = s >= 18;
        const sAngle = Math.random() * Math.PI * 2;
        const sSpeed = (isWave2 ? 200 : 150) + Math.random() * 420;
        sparkles.push({
          x: cx,
          y: cy,
          vx: Math.cos(sAngle) * sSpeed,
          vy: Math.sin(sAngle) * sSpeed,
          size: 2.5 + Math.random() * 4,
          color: Math.random() > 0.4 ? '#ffd166' : '#ffffff',
          delay: (isWave2 ? 0.85 : 0) + Math.random() * 0.2,
          life: 1.2 + Math.random() * 0.8
        });
      }

      let startTime = null;
      let lastTime = null;
      let isCompleted = false;
      let wave2SoundPlayed = false;
      const bloomPhaseDuration = 1.85; // จบการระเบิดและบานสะพรั่งเต็มที่ที่ 1.85 วินาที
      const totalAnimDuration = 3.6;   // ร่วงหล่นและจางหายไปจบการระเบิดพลุที่ 3.6 วินาที

      function renderFrame(timestamp) {
        if (!startTime) {
          startTime = timestamp;
          lastTime = timestamp;
        }

        const elapsed = (timestamp - startTime) / 1000;
        const dt = Math.min(0.033, (timestamp - lastTime) / 1000);
        lastTime = timestamp;

        // เสียงระเบิดรอบที่ 2
        if (elapsed >= 0.85 && !wave2SoundPlayed) {
          wave2SoundPlayed = true;
          playUnlockSound();
        }

        ctx.clearRect(0, 0, width, height);

        // คำนวณความโปร่งใสและระยะการร่วงหล่น (Fall & Fade Out)
        let fadeAlpha = 1.0;
        let fallElapsed = 0;
        if (elapsed > bloomPhaseDuration) {
          fallElapsed = elapsed - bloomPhaseDuration;
          const fadeProgress = fallElapsed / (totalAnimDuration - bloomPhaseDuration);
          fadeAlpha = Math.max(0, 1 - Math.pow(fadeProgress, 1.2));
        }

        // วาดพื้นหลังโทนกระดาษสีน้ำวินเทจ (Ivory Parchment Glow)
        if (fadeAlpha > 0.005) {
          const bgAlpha = Math.min(0.92, elapsed * 1.8) * fadeAlpha;
          const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, Math.max(width, height) * 0.85);
          bgGrad.addColorStop(0, `rgba(255, 248, 242, ${bgAlpha * 0.95})`);
          bgGrad.addColorStop(0.6, `rgba(253, 243, 235, ${bgAlpha * 0.96})`);
          bgGrad.addColorStop(1, `rgba(247, 233, 226, ${bgAlpha * 0.98})`);
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, width, height);
        }

        // 1. วาดดอกไม้และใบไม้ทั้งหมดด้วย GPU Sprite DrawImage
        flowers.forEach(f => {
          if (elapsed < f.delay) return;

          // ฟิสิกส์การเคลื่อนที่ต่อเนื่อง
          f.vx *= Math.pow(0.05, dt);
          f.vy *= Math.pow(0.05, dt);

          if (elapsed > bloomPhaseDuration) {
            f.vy += 55 * dt; // แรงโน้มถ่วงพาร่วงหล่น
          }

          f.x += (f.vx + Math.sin(elapsed * f.swaySpeed + f.swayPhase) * (fallElapsed > 0 ? f.swayAmp : 8)) * dt;
          f.y += f.vy * dt;

          // สปริงขยายกลีบดอกไม้อย่างนุ่มนวล
          f.scale += (f.targetScale - f.scale) * Math.min(1, 9.5 * dt);
          f.rot += f.rotV * dt;

          ctx.save();
          ctx.globalAlpha = fadeAlpha;
          ctx.translate(f.x, f.y);
          ctx.rotate(f.rot);

          const curSize = f.size * f.scale;

          // ถ้ามีใบไม้เสริมด้านหลังดอก
          if (f.hasBackLeaf) {
            ctx.save();
            ctx.rotate(0.5);
            ctx.drawImage(sprites.leaf, -curSize * 0.45, -curSize * 0.45, curSize * 0.9, curSize * 0.9);
            ctx.rotate(2.1);
            ctx.drawImage(sprites.leaf, -curSize * 0.42, -curSize * 0.42, curSize * 0.85, curSize * 0.85);
            ctx.restore();
          }

          ctx.drawImage(f.sprite, -curSize * 0.5, -curSize * 0.5, curSize, curSize);
          ctx.restore();
        });

        // 2. วาดกลีบดอกไม้ปลิวและร่วงหล่น
        petalsFlutter.forEach(p => {
          if (elapsed < p.delay) return;
          p.vx *= Math.pow(0.1, dt);
          p.vy *= Math.pow(0.1, dt);
          if (elapsed > bloomPhaseDuration) p.vy += 45 * dt;

          p.x += (p.vx + Math.sin(elapsed * 2.5 + p.delay) * 15) * dt;
          p.y += p.vy * dt;
          p.scale += (1 - p.scale) * Math.min(1, 8 * dt);
          p.rot += p.rotV * dt;

          const pSize = p.size * p.scale;
          ctx.save();
          ctx.globalAlpha = fadeAlpha * 0.9;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.drawImage(p.sprite, -pSize * 0.5, -pSize * 0.5, pSize, pSize);
          ctx.restore();
        });

        // 3. วาดละอองเกสรประกายดาวทอง
        sparkles.forEach(s => {
          if (elapsed < s.delay) return;
          s.vx *= Math.pow(0.12, dt);
          s.vy *= Math.pow(0.12, dt);
          s.x += s.vx * dt;
          s.y += s.vy * dt;

          const sProg = Math.min(1, (elapsed - s.delay) / s.life);
          const alpha = Math.max(0, (1 - sProg) * fadeAlpha);

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          const rad = s.size * (1 - sProg * 0.35);
          ctx.arc(s.x, s.y, Math.max(0.5, rad), 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        // จังหวะเมื่อพลุดอกไม้ระเบิดและร่วงหล่นเสร็จสิ้นสมบูรณ์ ค่อยแสดงการ์ดข้อความและช่อดอกไม้
        if ((elapsed >= totalAnimDuration - 0.25 || fadeAlpha < 0.05) && !isCompleted) {
          isCompleted = true;
          if (onComplete) onComplete();
        }

        // วนลูปจนกว่าจะจางหายไปจนหมด
        if (elapsed < totalAnimDuration && fadeAlpha > 0.002) {
          flowerCanvasAnimId = requestAnimationFrame(renderFrame);
        } else {
          ctx.clearRect(0, 0, width, height);
          canvas.classList.remove('show');
          if (!isCompleted) {
            isCompleted = true;
            if (onComplete) onComplete();
          }
        }
      }

      flowerCanvasAnimId = requestAnimationFrame(renderFrame);
    }

    /* ==========================================================
       ระบบเคาน์เตอร์นับเวลาความรักแบบ Real-Time (Love Journey Counter)
       ========================================================== */
    // วันที่เริ่มต้น: โหลดจาก Config หรือใช้วันเริ่มต้นตั้งต้น (14 เมษายน 2026)
    const knownStartDate = (window.APP_CONFIG && window.APP_CONFIG.startDate)
      ? new Date(window.APP_CONFIG.startDate)
      : new Date(2026, 3, 14, 0, 0, 0);
    let loveCounterInterval = null;

    function updateLoveCounter() {
      const now = new Date();
      const diffMs = now - knownStartDate;
      
      if (diffMs < 0) {
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const daysEl = document.getElementById('counter-days');
      const hoursEl = document.getElementById('counter-hours');
      const minsEl = document.getElementById('counter-minutes');
      const secsEl = document.getElementById('counter-seconds');

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    }

    function startLoveCounter() {
      updateLoveCounter();
      if (!loveCounterInterval) {
        loveCounterInterval = setInterval(updateLoveCounter, 1000);
      }
    }

    // เริ่มต้นคำนวณเคาน์เตอร์เวลาไว้ล่วงหน้า
    startLoveCounter();

    function tapBouquet(event) {
      if (event && event.stopPropagation) event.stopPropagation();
      playButtonClickSound();
      const bouquet = document.getElementById("flower-bouquet-left");
      if (bouquet) {
        // ละอองประกายดอกไม้และหัวใจระเบิดกระจายรอบช่อดอกไม้
        const box = bouquet.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height * 0.35;
        const colors = ['#ff4d6d', '#ff758f', '#ffffff', '#ffd166', '#ff8fa3'];
        const icons = ['🌸', '💖', '🤍', '✨', '💐', '♥'];
        for (let i = 0; i < 14; i++) {
          const spark = document.createElement('span');
          spark.className = 'heart-burst';
          spark.textContent = icons[i % icons.length];
          const angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.4;
          const dist = 45 + Math.random() * 95;
          spark.style.setProperty('--start-x', `${centerX}px`);
          spark.style.setProperty('--start-y', `${centerY}px`);
          spark.style.setProperty('--burst-x', `${Math.cos(angle) * dist}px`);
          spark.style.setProperty('--burst-y', `${Math.sin(angle) * dist - 25}px`);
          spark.style.setProperty('--spin', `${Math.round((Math.random() - 0.5) * 200)}deg`);
          spark.style.setProperty('--heart-size', `${14 + Math.random() * 14}px`);
          spark.style.setProperty('--heart-color', colors[i % colors.length]);
          document.body.appendChild(spark);
          setTimeout(() => spark.remove(), 950);
        }
      }
    }

    function sayYes() {
      // 1. ซ่อนกล่องคำถามแบบ fade out นุ่มนวล
      const questionContainer = document.getElementById("question-container");
      if (questionContainer) {
        questionContainer.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        questionContainer.style.opacity = '0';
        questionContainer.style.transform = 'scale(0.9)';
        setTimeout(() => {
          questionContainer.style.display = "none";
        }, 350);
      }
      appCurrentStep = 4;
      updateBackNavButton();

      // 2. เล่นเสียงปลดล็อกหวานๆ
      playUnlockSound();

      // 3. เริ่มเล่นแอนิเมชันดอกไม้ระเบิดบานเต็มจอสร้างด้วยโค้ด 100%
      playFlowerExplosion(() => {
        // 4. เมื่อดอกไม้บานเต็มจอแล้ว แสดงการ์ดยินดีสำเร็จ พร้อมเคาน์เตอร์เวลา
        startLoveCounter();
        const successMsg = document.getElementById("success-message");
        if (successMsg) {
          successMsg.style.display = "";
          successMsg.classList.add("show");
          createProposalEntranceBurst();
        }

        // แสดงช่อดอกไม้สีขาวชมพูช่อใหญ่ด้านซ้าย
        const bouquet = document.getElementById("flower-bouquet-left");
        if (bouquet) {
          setTimeout(() => bouquet.classList.add("show"), 200);
        }

        // 5. ยิงพลุกระดาษ Confetti เฉลิมฉลอง
        var duration = 3.5 * 1000;
        var animationEnd = Date.now() + duration;
        var defaults = { startVelocity: 32, spread: 360, ticks: 65, zIndex: 100, colors: ['#df6f91','#ef9eb5','#d85f82','#f3b2c2','#ffd166','#ffffff'] };

        var interval = setInterval(function() {
          var timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          var particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
        }, 220);
      });
    }

    /* ==========================================================
       ระบบปุ่มย้อนกลับมุมซ้ายล่าง (Back Navigation Controller)
       ========================================================== */
    let appCurrentStep = 0; // 0 = lockscreen, 1 = letter, 2 = story, 3 = proposal, 4 = success

    function updateBackNavButton() {
      const btn = document.getElementById('back-nav-btn');
      if (!btn) return;
      if (appCurrentStep >= 1) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    }

    function goBackStep() {
      playButtonClickSound();

      if (appCurrentStep === 4) {
        // จากหน้าตอบตกลง (Success) ย้อนกลับมาหน้าคำถาม (Proposal Question)
        const bouquet = document.getElementById('flower-bouquet-left');
        if (bouquet) bouquet.classList.remove('show');

        const successMsg = document.getElementById("success-message");
        if (successMsg) {
          successMsg.classList.remove("show");
          successMsg.style.display = "none";
        }

        const questionContainer = document.getElementById("question-container");
        if (questionContainer) {
          questionContainer.style.display = "flex";
          questionContainer.style.opacity = "1";
          questionContainer.style.transform = "scale(1)";
        }

        // รีเซ็ตขนาดและตำแหน่งปุ่ม Yes / No
        yesFontSize = 1.15;
        if (yesBtn) {
          yesBtn.style.fontSize = '1.15rem';
          yesBtn.style.left = '50%';
          yesBtn.style.top = '50%';
          yesBtn.style.transform = 'translate(calc(-100% - 10px), -50%)';
        }
        if (noBtn) {
          noBtn.innerText = 'No 😝';
          noBtn.style.transform = 'none';
          noBtn.style.left = '';
          noBtn.style.top = '';
        }
        messageIndex = 0;

        appCurrentStep = 3;
        updateBackNavButton();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      if (appCurrentStep === 3) {
        // จากหน้าขอเป็นแฟน ย้อนกลับมาหน้าเรื่องราว (Story)
        const proposal = document.getElementById('proposal-section');
        if (proposal) proposal.classList.remove('show');

        const letterPage = document.getElementById('letter-page');
        if (letterPage) {
          letterPage.style.display = 'block';
          letterPage.style.opacity = '1';
          letterPage.style.transform = 'none';
        }

        const story = document.getElementById('story');
        if (story) {
          story.style.display = 'block';
          story.style.opacity = '1';
          story.style.transform = 'none';
          story.classList.add('show');
        }

        startFloatingHearts();
        appCurrentStep = 2;
        updateBackNavButton();
        setTimeout(() => {
          if (story) story.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return;
      }

      if (appCurrentStep === 2) {
        // จากหน้าเรื่องราว (Story) ย้อนกลับมาหน้าซองจดหมาย (Letter)
        stopFloatingHearts();
        const letterPage = document.getElementById('letter-page');
        if (letterPage) {
          letterPage.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          letterPage.style.opacity = '1';
          letterPage.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
        const story = document.getElementById('story');
        if (story) {
          story.classList.remove('show');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        appCurrentStep = 1;
        updateBackNavButton();
        return;
      }

      if (appCurrentStep === 1) {
        // จากหน้าซองจดหมาย ย้อนกลับไปล็อคหน้าจอ Passcode
        const lockScreen = document.getElementById('passcode-screen');
        if (lockScreen) {
          lockScreen.style.display = 'flex';
          void lockScreen.offsetWidth; // Force reflow
          lockScreen.classList.remove('unlocked');
          const lockIcon = document.getElementById('ios-lock-icon');
          if (lockIcon) lockIcon.innerHTML = '<span class="lock-emoji">🔒</span>';
          const subtitle = document.getElementById('ios-passcode-subtitle');
          if (subtitle) {
            subtitle.textContent = "ใส่รหัส 6 หลักเพื่อเปิดจดหมาย💌";
            subtitle.style.color = "";
            subtitle.style.fontWeight = "";
          }
          enteredPasscode = "";
          updatePasscodeDots();
          isPasscodeLocked = false;
        }
        appCurrentStep = 0;
        updateBackNavButton();
        return;
      }
    }
