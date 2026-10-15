'use client';

import React from 'react';
import ThemePackThumbnail from './ThemePackThumbnail';

interface PackWatermarkedThumbnailProps {
  packSlug: string;
  packName: string;
}

/**
 * Backward compatibility wrapper: now renders clean, un-watermarked, full-color ThemePackThumbnail.
 */
export default function PackWatermarkedThumbnail({
  packSlug,
  packName,
}: PackWatermarkedThumbnailProps) {
  return <ThemePackThumbnail packSlug={packSlug} packName={packName} />;
}
