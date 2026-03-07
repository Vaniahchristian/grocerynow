"use client"

import React, { useEffect, useRef, useState } from "react"

interface FadeInProps {
  children: React.ReactNode
  /** Delay in ms before animating after entering view */
  delay?: number
  /** Optional additional className applied to the wrapper */
  className?: string
}

/**
 * Minimal in-view fade/slide animation without external deps.
 * - Starts slightly translated and transparent
 * - On enter viewport, transitions to visible
 * - Respects prefers-reduced-motion
 */
interface ExtendedFadeInProps extends FadeInProps {
  /** Direction to slide from */
  direction?: "up" | "down" | "left" | "right"
  /** Distance of the initial slide */
  distance?: "sm" | "md" | "lg"
}

export function FadeIn({
  children,
  delay = 0,
  className = "",
  direction = "up",
  distance = "md",
}: ExtendedFadeInProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReduced) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Small delay for subtle staggering
            if (delay) {
              const id = window.setTimeout(() => setInView(true), delay)
              // Cleanup timeout if unmounts early
              return () => window.clearTimeout(id)
            }
            setInView(true)
          }
        })
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    )

    observer.observe(node)
    return () => observer.unobserve(node)
  }, [delay])

  // Use literal Tailwind classes so JIT picks them up
  const startTranslateClass = (() => {
    if (direction === "up") {
      if (distance === "sm") return "translate-y-3"
      if (distance === "lg") return "translate-y-10"
      return "translate-y-6"
    }
    if (direction === "down") {
      if (distance === "sm") return "-translate-y-3"
      if (distance === "lg") return "-translate-y-10"
      return "-translate-y-6"
    }
    if (direction === "left") {
      if (distance === "sm") return "translate-x-3"
      if (distance === "lg") return "translate-x-10"
      return "translate-x-6"
    }
    // right
    if (distance === "sm") return "-translate-x-3"
    if (distance === "lg") return "-translate-x-10"
    return "-translate-x-6"
  })()

  return (
    <div
      ref={ref}
      className={[
        // Base layout and transition
        "transition-all duration-700 ease-out will-change-transform will-change-opacity",
        // Start state
        inView
          ? "opacity-100 translate-y-0 translate-x-0"
          : `opacity-0 ${startTranslateClass}`,
        className,
      ].join(" ")}
    >
      {children}
    </div>
  )
}
