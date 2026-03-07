'use client';

import { useEffect, useRef } from 'react';

const TOUR_STORAGE_KEY = 'monroe-resource-hub-tour-done';

const NAVBAR_TOUR_STEPS = [
  { element: '[data-tour="tour-logo"]', title: 'Logo / Home', description: 'This takes you back to the homepage.' },
  { element: '[data-tour="tour-resources"]', title: 'Resources', description: 'Browse 70+ verified local services: food, housing, healthcare, and more.' },
  { element: '[data-tour="tour-events"]', title: 'Events', description: 'See upcoming community events in Monroe & Union County.' },
  { element: '[data-tour="tour-career"]', title: 'Career', description: 'Access the job board, AI resume builder, and saved resumes.' },
  { element: '[data-tour="tour-volunteer"]', title: 'Volunteer', description: 'Find volunteer opportunities with local organizations.' },
  { element: '[data-tour="tour-about"]', title: 'About', description: 'Learn how Monroe Resource Hub is built and maintained.' },
  { element: '[data-tour="tour-info"]', title: 'Information', description: 'FAQs, guides, and how to use this site.' },
  { element: '[data-tour="tour-share-resource"]', title: 'Share Resource', description: 'Submit a new organization or resource to the directory.' },
  { element: '[data-tour="tour-auth"]', title: 'Login / Sign Up', description: 'Create a free account to save resumes and sync your data.' },
];

export function OnboardingTour() {
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || started.current) return;
    if (sessionStorage.getItem(TOUR_STORAGE_KEY)) return;

    const runTour = async () => {
      const { driver } = await import('driver.js');
      await import('driver.js/dist/driver.css');

      const driverObj = driver({
        showProgress: true,
        allowClose: true,
        overlayColor: 'rgba(0,0,0,0.5)',
        nextBtnText: 'Next →',
        prevBtnText: '← Back',
        doneBtnText: 'Finish',
        popoverClass: 'monroe-tour-popover',
        steps: NAVBAR_TOUR_STEPS.map(({ element, title, description }) => ({
          element,
          popover: {
            title,
            description,
            side: 'bottom' as const,
            align: 'center' as const,
          },
        })),
        onPopoverRender: (popover, opts) => {
          const skipBtn = document.createElement('button');
          skipBtn.type = 'button';
          skipBtn.className = 'driver-popover-skip-tour';
          skipBtn.textContent = 'Skip Tour';
          skipBtn.setAttribute('aria-label', 'Skip tour');
          skipBtn.addEventListener('click', () => {
            sessionStorage.setItem(TOUR_STORAGE_KEY, '1');
            opts.driver.destroy();
          });
          popover.footer.insertBefore(skipBtn, popover.footer.firstChild);
        },
        onDestroyStarted: (_element, _step, opts) => {
          sessionStorage.setItem(TOUR_STORAGE_KEY, '1');
          opts.driver.destroy();
        },
        onCloseClick: (_element, _step, opts) => {
          sessionStorage.setItem(TOUR_STORAGE_KEY, '1');
          opts.driver.destroy();
        },
      });

      started.current = true;
      driverObj.drive();
    };

    const t = setTimeout(runTour, 800);
    return () => clearTimeout(t);
  }, []);

  return null;
}
