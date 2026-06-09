@extends('layouts.app')

@section('title', 'Grand Fleet - Command Your Fleet, Conquer The Seas')

@section('content')

{{-- Hero Section --}}
<section class="hero" id="home">
    <div class="hero__particles" id="particles"></div>
    <div class="hero__overlay"></div>
    <div class="hero__water">
        <div class="hero__water-wave hero__water-wave--1"></div>
        <div class="hero__water-wave hero__water-wave--2"></div>
        <div class="hero__water-wave hero__water-wave--3"></div>
    </div>
    <div class="container hero__container">
        <div class="hero__content">
            <h1 class="hero__title">
                <span class="hero__title-sub">Command Your Fleet</span>
                <span class="hero__title-main">Conquer The Seas</span>
            </h1>
            <p class="hero__desc">Lead your armada through treacherous waters, engage in epic naval battles, and build the most powerful fleet the world has ever seen.</p>
            <div class="hero__actions">
                <a href="/play" class="btn btn--primary btn--lg">
                    <span>Play Free Now</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#gameplay" class="btn btn--outline btn--lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    <span>Watch Trailer</span>
                </a>
            </div>
            <div class="hero__stats">
                <div class="hero__stat">
                    <span class="hero__stat-value">2M+</span>
                    <span class="hero__stat-label">Active Players</span>
                </div>
                <div class="hero__stat">
                    <span class="hero__stat-value">150+</span>
                    <span class="hero__stat-label">Warships</span>
                </div>
                <div class="hero__stat">
                    <span class="hero__stat-value">4.8</span>
                    <span class="hero__stat-label">Player Rating</span>
                </div>
            </div>
        </div>
    </div>
    <div class="hero__scroll">
        <a href="#features" class="hero__scroll-btn" aria-label="Scroll down">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        </a>
    </div>
</section>

{{-- Features Section --}}
<section class="features" id="features">
    <div class="container">
        <div class="section-header">
            <span class="section-header__tag">Why Grand Fleet?</span>
            <h2 class="section-header__title">Unmatched Naval Warfare</h2>
            <p class="section-header__desc">Experience the most immersive naval combat game with stunning graphics and deep strategic gameplay.</p>
        </div>

        <div class="features__grid">
            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                </div>
                <h3 class="feature-card__title">Real-Time Combat</h3>
                <p class="feature-card__desc">Engage in intense real-time naval battles with dynamic weather systems and realistic physics.</p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                </div>
                <h3 class="feature-card__title">Fleet Customization</h3>
                <p class="feature-card__desc">Build and customize your fleet with hundreds of historical and futuristic warships, each with unique abilities.</p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
                </div>
                <h3 class="feature-card__title">Clan Battles</h3>
                <p class="feature-card__desc">Form alliances, join clans, and compete in massive fleet battles with players worldwide.</p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.75 3.03v.568c0 .334.148.65.405.864a11.04 11.04 0 012.649 2.645c.209.251.52.396.847.396h.556M12.75 3.03A9.001 9.001 0 003.75 12a9.001 9.001 0 009 9 9.001 9.001 0 009-9 9 9 0 00-9-8.97M12.75 3.03A9 9 0 0117.207 4.5M3.75 12h.008v.008H3.75V12zm0 0a9 9 0 004.955 8.03"/></svg>
                </div>
                <h3 class="feature-card__title">Open World</h3>
                <p class="feature-card__desc">Explore vast oceans with dynamic events, hidden treasures, and strategic control points.</p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.966.396-2.91.651A1 1 0 002 5.875v.386a1 1 0 00.59.912c3.862 1.737 8.072 2.712 12.41 2.712 4.338 0 8.548-.975 12.41-2.712a1 1 0 00.59-.912v-.386a1 1 0 00-.34-.988 49.51 49.51 0 00-2.91-.651"/></svg>
                </div>
                <h3 class="feature-card__title">Ranked Seasons</h3>
                <p class="feature-card__desc">Climb the competitive ladder with seasonal rankings, exclusive rewards, and tournament events.</p>
            </div>

            <div class="feature-card">
                <div class="feature-card__icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"/></svg>
                </div>
                <h3 class="feature-card__title">Regular Updates</h3>
                <p class="feature-card__desc">New ships, maps, and game modes added every month to keep the experience fresh and exciting.</p>
            </div>
        </div>
    </div>
</section>

{{-- Ships Section --}}
<section class="ships" id="ships">
    <div class="container">
        <div class="section-header">
            <span class="section-header__tag">Your Arsenal</span>
            <h2 class="section-header__title">Legendary Warships</h2>
            <p class="section-header__desc">Choose from over 150 historically accurate warships across multiple classes.</p>
        </div>

        <div class="ships__grid">
            <div class="ship-card">
                <div class="ship-card__image">
                    <div class="ship-card__placeholder">🚢</div>
                </div>
                <div class="ship-card__content">
                    <span class="ship-card__class">Battleship</span>
                    <h3 class="ship-card__name">Yamato</h3>
                    <p class="ship-card__desc">The largest battleship ever built. Devastating firepower with 18.1-inch main guns.</p>
                    <div class="ship-card__stats">
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Firepower</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 95%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Armor</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 90%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Speed</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 50%"></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ship-card">
                <div class="ship-card__image">
                    <div class="ship-card__placeholder">✈️</div>
                </div>
                <div class="ship-card__content">
                    <span class="ship-card__class">Aircraft Carrier</span>
                    <h3 class="ship-card__name">Enterprise</h3>
                    <p class="ship-card__desc">Legendary carrier that turned the tide. Deploy squadrons to dominate the skies.</p>
                    <div class="ship-card__stats">
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Air Power</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 98%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Armor</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 45%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Speed</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 70%"></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="ship-card">
                <div class="ship-card__image">
                    <div class="ship-card__placeholder">⚡</div>
                </div>
                <div class="ship-card__content">
                    <span class="ship-card__class">Destroyer</span>
                    <h3 class="ship-card__name">Shimakaze</h3>
                    <p class="ship-card__desc">Speed demon of the seas. Unleash devastating torpedo salvos from the shadows.</p>
                    <div class="ship-card__stats">
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Torpedoes</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 97%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Armor</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 25%"></div></div>
                        </div>
                        <div class="ship-card__stat">
                            <span class="ship-card__stat-label">Speed</span>
                            <div class="ship-card__stat-bar"><div class="ship-card__stat-fill" style="width: 95%"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- Gameplay Section --}}
<section class="gameplay" id="gameplay">
    <div class="container">
        <div class="gameplay__wrapper">
            <div class="gameplay__content">
                <span class="section-header__tag">How It Works</span>
                <h2 class="section-header__title">Strategic Depth</h2>
                <p class="gameplay__text">Grand Fleet combines real-time action with deep strategic planning. Every decision matters — from fleet composition to positioning and timing.</p>

                <div class="gameplay__steps">
                    <div class="gameplay__step">
                        <span class="gameplay__step-num">01</span>
                        <div>
                            <h4 class="gameplay__step-title">Build Your Fleet</h4>
                            <p class="gameplay__step-desc">Research and unlock ships, customize loadouts, and assemble your perfect fleet composition.</p>
                        </div>
                    </div>
                    <div class="gameplay__step">
                        <span class="gameplay__step-num">02</span>
                        <div>
                            <h4 class="gameplay__step-title">Plan Your Strategy</h4>
                            <p class="gameplay__step-desc">Study the map, coordinate with allies, and develop tactics to outmaneuver your opponents.</p>
                        </div>
                    </div>
                    <div class="gameplay__step">
                        <span class="gameplay__step-num">03</span>
                        <div>
                            <h4 class="gameplay__step-title">Dominate The Seas</h4>
                            <p class="gameplay__step-desc">Execute your plan in real-time combat, adapt to changing conditions, and claim victory.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="gameplay__visual">
                <div class="gameplay__video-placeholder">
                    <div class="gameplay__play-btn">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                    </div>
                    <span>Gameplay Trailer</span>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- Community / CTA Section --}}
<section class="cta" id="community">
    <div class="container">
        <div class="cta__content">
            <h2 class="cta__title">Join The Armada</h2>
            <p class="cta__desc">Over 2 million admirals are already commanding their fleets. Set sail today — it's free to play.</p>
            <div class="cta__actions">
                <a href="/play" class="btn btn--primary btn--lg">
                    <span>Start Playing Free</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <a href="#" class="btn btn--ghost btn--lg">Join Discord</a>
            </div>
            <div class="cta__platforms">
                <span>Available on:</span>
                <div class="cta__platform-icons">
                    <span class="cta__platform">🖥️ PC</span>
                    <span class="cta__platform">🎮 Console</span>
                    <span class="cta__platform">📱 Mobile</span>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
