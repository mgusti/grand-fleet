<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Grand Fleet - Play Now</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,600,700,800,900&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="{{ asset('css/game.css') }}">
</head>
<body>
    <div id="game-wrapper">
        <!-- HUD -->
        <div id="hud">
            <div class="hud-left">
                <div class="hud-health">
                    <span class="hud-label">HP</span>
                    <div class="hud-bar">
                        <div class="hud-bar__fill hud-bar__fill--hp" id="hp-bar"></div>
                    </div>
                    <span class="hud-value" id="hp-text">100</span>
                </div>
                <div class="hud-shield">
                    <span class="hud-label">SHIELD</span>
                    <div class="hud-bar">
                        <div class="hud-bar__fill hud-bar__fill--shield" id="shield-bar"></div>
                    </div>
                    <span class="hud-value" id="shield-text">50</span>
                </div>
            </div>
            <div class="hud-center">
                <span class="hud-score-label">SCORE</span>
                <span class="hud-score" id="score">0</span>
            </div>
            <div class="hud-right">
                <div class="hud-wave">
                    <span class="hud-label">WAVE</span>
                    <span class="hud-wave-value" id="wave">1</span>
                </div>
                <a href="/" class="hud-back" title="Back to Home">✕</a>
            </div>
        </div>

        <!-- Canvas -->
        <canvas id="game-canvas"></canvas>

        <!-- Start Screen -->
        <div id="start-screen" class="overlay">
            <div class="overlay__content overlay__content--wide">
                <h1 class="overlay__title">⚓ Grand Fleet</h1>
                <p class="overlay__subtitle">Side-Scrolling Naval Battle</p>

                <!-- Ship Selection -->
                <div class="select-section">
                    <h3 class="select-section__title">Choose Your Ship</h3>
                    <div class="ship-select" id="ship-select">
                        <button class="ship-option active" data-ship="destroyer">
                            <div class="ship-option__preview ship-option__preview--destroyer">
                                <canvas class="ship-preview-canvas" data-ship-type="destroyer" width="80" height="50"></canvas>
                            </div>
                            <span class="ship-option__name">Destroyer</span>
                            <div class="ship-option__stats">
                                <div class="mini-stat"><span>SPD</span><div class="mini-bar"><div class="mini-fill" style="width:95%"></div></div></div>
                                <div class="mini-stat"><span>ATK</span><div class="mini-bar"><div class="mini-fill" style="width:50%"></div></div></div>
                                <div class="mini-stat"><span>DEF</span><div class="mini-bar"><div class="mini-fill" style="width:30%"></div></div></div>
                            </div>
                            <span class="ship-option__desc">Fast & agile. High fire rate, low armor.</span>
                        </button>
                        <button class="ship-option" data-ship="cruiser">
                            <div class="ship-option__preview ship-option__preview--cruiser">
                                <canvas class="ship-preview-canvas" data-ship-type="cruiser" width="80" height="50"></canvas>
                            </div>
                            <span class="ship-option__name">Cruiser</span>
                            <div class="ship-option__stats">
                                <div class="mini-stat"><span>SPD</span><div class="mini-bar"><div class="mini-fill" style="width:65%"></div></div></div>
                                <div class="mini-stat"><span>ATK</span><div class="mini-bar"><div class="mini-fill" style="width:70%"></div></div></div>
                                <div class="mini-stat"><span>DEF</span><div class="mini-bar"><div class="mini-fill" style="width:65%"></div></div></div>
                            </div>
                            <span class="ship-option__desc">Balanced all-rounder. Good for beginners.</span>
                        </button>
                        <button class="ship-option" data-ship="battleship">
                            <div class="ship-option__preview ship-option__preview--battleship">
                                <canvas class="ship-preview-canvas" data-ship-type="battleship" width="80" height="50"></canvas>
                            </div>
                            <span class="ship-option__name">Battleship</span>
                            <div class="ship-option__stats">
                                <div class="mini-stat"><span>SPD</span><div class="mini-bar"><div class="mini-fill" style="width:35%"></div></div></div>
                                <div class="mini-stat"><span>ATK</span><div class="mini-bar"><div class="mini-fill" style="width:95%"></div></div></div>
                                <div class="mini-stat"><span>DEF</span><div class="mini-bar"><div class="mini-fill" style="width:90%"></div></div></div>
                            </div>
                            <span class="ship-option__desc">Heavy firepower & armor. Slow but devastating.</span>
                        </button>
                        <button class="ship-option" data-ship="carrier">
                            <div class="ship-option__preview ship-option__preview--carrier">
                                <canvas class="ship-preview-canvas" data-ship-type="carrier" width="80" height="50"></canvas>
                            </div>
                            <span class="ship-option__name">Carrier</span>
                            <div class="ship-option__stats">
                                <div class="mini-stat"><span>SPD</span><div class="mini-bar"><div class="mini-fill" style="width:50%"></div></div></div>
                                <div class="mini-stat"><span>ATK</span><div class="mini-bar"><div class="mini-fill" style="width:85%"></div></div></div>
                                <div class="mini-stat"><span>DEF</span><div class="mini-bar"><div class="mini-fill" style="width:50%"></div></div></div>
                            </div>
                            <span class="ship-option__desc">Launches drones. Wide special attack range.</span>
                        </button>
                    </div>
                </div>

                <!-- Difficulty Selection -->
                <div class="select-section">
                    <h3 class="select-section__title">Difficulty</h3>
                    <div class="difficulty-select" id="difficulty-select">
                        <button class="diff-option" data-diff="easy">
                            <span class="diff-option__icon">🌊</span>
                            <span class="diff-option__name">Easy</span>
                            <span class="diff-option__desc">Calm seas. Fewer enemies, slower pace.</span>
                        </button>
                        <button class="diff-option active" data-diff="normal">
                            <span class="diff-option__icon">⚔️</span>
                            <span class="diff-option__name">Normal</span>
                            <span class="diff-option__desc">Standard battle. Balanced challenge.</span>
                        </button>
                        <button class="diff-option" data-diff="hard">
                            <span class="diff-option__icon">🔥</span>
                            <span class="diff-option__name">Hard</span>
                            <span class="diff-option__desc">Storm ahead! More enemies, faster, smarter.</span>
                        </button>
                        <button class="diff-option" data-diff="nightmare">
                            <span class="diff-option__icon">💀</span>
                            <span class="diff-option__name">Nightmare</span>
                            <span class="diff-option__desc">Certain death. Only legends survive.</span>
                        </button>
                    </div>
                </div>

                <!-- Controls Info -->
                <div class="overlay__instructions">
                    <div class="key-row"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> or <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> Move</div>
                    <div class="key-row"><kbd>SPACE</kbd> Shoot &nbsp;&nbsp; <kbd>E</kbd> Special Attack</div>
                </div>

                <!-- Legend -->
                <div class="select-section">
                    <h3 class="select-section__title">Legend</h3>
                    <div class="legend-grid">
                        <div class="legend-group">
                            <h4 class="legend-group__title legend-group__title--good">✓ Collect</h4>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--health"></span>
                                <span class="legend-text"><strong>Health Pack</strong> — Restores 25 HP</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--shield"></span>
                                <span class="legend-text"><strong>Shield Boost</strong> — Restores 25 Shield</span>
                            </div>
                        </div>
                        <div class="legend-group">
                            <h4 class="legend-group__title legend-group__title--bad">✕ Avoid</h4>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--enemy-basic"></span>
                                <span class="legend-text"><strong>Scout</strong> — Basic enemy, no weapons</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--enemy-fast"></span>
                                <span class="legend-text"><strong>Interceptor</strong> — Fast, hard to hit</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--enemy-tank"></span>
                                <span class="legend-text"><strong>Warship</strong> — Heavy armor, shoots back</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--enemy-boss"></span>
                                <span class="legend-text"><strong>Boss</strong> — Massive HP, rapid fire</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-icon legend-icon--bullet-enemy"></span>
                                <span class="legend-text"><strong>Enemy Fire</strong> — Red projectiles, deals damage</span>
                            </div>
                        </div>
                    </div>
                </div>

                <button class="overlay__btn" id="start-btn">⚓ Start Battle</button>
                <p class="overlay__note">Mobile: Use on-screen controls</p>
            </div>
        </div>

        <!-- Game Over Screen -->
        <div id="gameover-screen" class="overlay overlay--hidden">
            <div class="overlay__content">
                <h1 class="overlay__title overlay__title--over">Fleet Destroyed</h1>
                <p class="overlay__subtitle">Final Score: <span id="final-score">0</span></p>
                <p class="overlay__subtitle">Waves Survived: <span id="final-wave">0</span></p>
                <button class="overlay__btn" id="restart-btn">Try Again</button>
                <a href="/" class="overlay__link">← Back to Home</a>
            </div>
        </div>

        <!-- Mobile Controls -->
        <div id="mobile-controls">
            <div class="mobile-dpad">
                <button class="mobile-btn mobile-btn--up" data-dir="up">▲</button>
                <button class="mobile-btn mobile-btn--left" data-dir="left">◀</button>
                <button class="mobile-btn mobile-btn--right" data-dir="right">▶</button>
                <button class="mobile-btn mobile-btn--down" data-dir="down">▼</button>
            </div>
            <div class="mobile-actions">
                <button class="mobile-btn mobile-btn--fire" id="mobile-fire">FIRE</button>
                <button class="mobile-btn mobile-btn--special" id="mobile-special">SP</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/game.js') }}"></script>
</body>
</html>
