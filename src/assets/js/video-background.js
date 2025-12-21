// Video Background Controller for Project Pages
class VideoBackgroundController {
  constructor() {
    this.hero = document.querySelector('.project-hero');
    if (!this.hero) return;

    this.scrollThreshold = window.innerHeight * 0.5;
    this.ticking = false;
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateOpacity();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Initial state
    this.updateOpacity();
  }

  updateOpacity() {
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / this.scrollThreshold, 1);
    const opacity = 100 - (progress * 85);

    this.hero.style.setProperty('--hero-opacity', opacity);
    this.hero.classList.toggle('has-scrolled', scrollY > 50);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new VideoBackgroundController();
});
