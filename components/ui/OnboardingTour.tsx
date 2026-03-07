'use client';

import { useEffect, useRef } from 'react';

const TOUR_STORAGE_KEY = 'monroe-resource-hub-tour-done';

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
        doneBtnText: 'Done',
        steps: [
          {
            element: '[data-tour="search"]',
            popover: {
              title: 'Search',
              description: 'Search across resources, events, and more. Use ⌘K anytime to open search.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tour="categories"]',
            popover: {
              title: 'Browse by category',
              description: 'Find food, healthcare, housing, education, and other local help by category.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tour="resume-builder"]',
            popover: {
              title: 'Resume Builder',
              description: 'Build a professional resume for free. Great for job applications in Monroe and Union County.',
              side: 'bottom',
              align: 'center',
            },
          },
          {
            element: '[data-tour="share-resource"]',
            popover: {
              title: 'Share a resource',
              description: 'Know an organization we should list? Submit it here so others can find it.',
              side: 'bottom',
              align: 'center',
            },
          },
        ],
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
