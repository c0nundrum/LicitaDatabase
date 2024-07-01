"use client";

import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollTop = () => {
    if (!isVisible && window.scrollY > 300) {
      setIsVisible(true);
    } else if (isVisible && window.scrollY <= 300) {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScrollTop);
    return () => {
      window.removeEventListener("scroll", checkScrollTop);
    };
  }, [isVisible]);

  return (
    <div className="fixed bottom-2 right-2 md:bottom-6 md:right-6 md:z-50">
      {isVisible && (
        <Button
          className="w-12 h-12 rounded-full flex items-center justify-center"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp />
        </Button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
