/* ================================================================
   ASHVANTH P S — script.js
   Phase 1: Mobile Navigation Toggle
   Future phases will add: IntersectionObserver, live clock, etc.
================================================================ */

'use strict';

/* ----------------------------------------------------------------
   MOBILE NAV TOGGLE
   querySelector() finds the first element matching a CSS selector.
   We store references to both the button and the drawer so we can
   read/change their attributes and classes.
---------------------------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {

  /* addEventListener() listens for a specific event on an element.
     'click' fires every time the user clicks the button. */
  navToggle.addEventListener('click', () => {

    /* getAttribute() reads the current value of an HTML attribute.
       We use aria-expanded to track open/closed state — this also
       communicates the state to screen readers. */
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

    /* Toggle: if it was open, close it; if closed, open it. */
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.setAttribute('aria-hidden',   String(isOpen));

    /* classList.toggle() adds the class if missing, removes if present. */
    mobileNav.classList.toggle('is-open', !isOpen);

    /* Update accessible label so screen readers announce the action */
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Open navigation menu' : 'Close navigation menu'
    );
  });

  /* Close the mobile nav when any link inside it is clicked.
     querySelectorAll() returns ALL matching elements as a NodeList.
     forEach() runs the callback for each one. */
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden',   'true');
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  /* Close on Escape key press — keyboard accessibility */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden',   'true');
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      /* Return focus to the toggle button so keyboard users aren't lost */
      navToggle.focus();
    }
  });
}
