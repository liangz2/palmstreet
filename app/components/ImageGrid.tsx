'use client'

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { PicsumImage } from "../types";
import styles from "./ImageGrid.module.css";
import InstagramLogo from "./InstagramLogo";
import InstagramCameraIcon from "./InstagramCameraIcon";
import { X } from 'lucide-react'

interface ImageGridProps {
  initialImages: PicsumImage[];
}

export default function ImageGrid({ initialImages }: ImageGridProps) {
  const [images, setImages] = useState<PicsumImage[]>(initialImages);
  const [page, setPage] = useState(2); // Start from page 2 since page 1 is initial
  const [loading, setLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [showFooter, setShowFooter] = useState(true);
  const fetchImages = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${pageNum}&limit=10`
      );
      const newImages = await response.json();
      setImages((prevImages) => [...prevImages, ...newImages]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setLoading(false);
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (page > 2) { // Only fetch if we're past the initial page
      fetchImages(page);
    }
  }, [page]);

  return (
    <>
      <section className={styles.header}>
        <InstagramLogo />
        <section className={styles.loginSection}>
          <button type="button" className={styles.loginButton}>Login</button>
          <button type="button" className={styles.signupButton}>Sign up</button>
        </section>
      </section>
      <div className={styles.devider} />
      <section className={styles.tagContainer}>
        <div className={styles.tagDetailContainer}>
          <div className={styles.tagImage}>
            <Image src="https://images.unsplash.com/photo-1594135010399-ec5edf72f34f?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tag" fill className="object-cover" />
          </div>
          <div className={styles.tagText}>
            <p className="font-bold text-xl">#houseplants</p>
            <p><span className="font-[500]">10,690,626</span> posts</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-500 pt-8">Top posts</p>
      </section>
      <section className={styles.gridWrapper}>
        {images.map((image) => {
          const isLargeImage = image.width * image.height > 2000000;

          return (
            <div key={`${image.id}-${image.author}`} className="relative aspect-square">
              <Image
                src={image.download_url}
                alt={`Photo by ${image.author}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={isLargeImage}
              />
              <div className={styles.imageWrapper}>
                <p className={styles.imageWrapperText}>By - {image.author}</p>
              </div>
            </div>
          )
        })}
      </section>

      <div
        ref={observerTarget}
        className={styles.imageLoader}
      >
        {loading && <p>Loading more images...</p>}
      </div>

      {showFooter && (
        <footer className={styles.stickyFooter}>
          <div className={styles.footerContent}>
            <div className={styles.footerLeft}>
              <div className={styles.footerIcon}>
                <InstagramCameraIcon />
              </div>
              <p className={styles.footerText}>
                Log in to see photos and videos from friends and discover other accounts you'll love.
              </p>
            </div>
            <div className={styles.footerButtons}>
              <button type="button" className={styles.footerLoginButton}>
                Log in
              </button>
              <button type="button" className={styles.footerSignUpButton}>
                Sign Up
              </button>
            </div>
          </div>
          <button type="button" className={styles.footerCloseButton}>
            <X size={20} color="gray" onClick={() => setShowFooter(false)} />
          </button>
        </footer>
      )}
    </>
  );
} 