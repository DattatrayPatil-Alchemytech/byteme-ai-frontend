"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Throttle function to limit scroll event frequency
function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
        // Performance optimizations
        root: null,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  return { ref, isVisible };
}

export function useScrollAnimationWithDelay(delay = 0, threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          });
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px",
        // Performance optimizations
        root: null,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  return { ref, isVisible };
}

// Optimized scroll hook for performance
export function useOptimizedScroll() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(
    throttle(() => {
      setScrollY(window.scrollY);
    }, 16), // ~60fps
    []
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollY;
}
