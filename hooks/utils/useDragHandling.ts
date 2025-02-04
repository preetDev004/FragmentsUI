// src/hooks/utils/useDragHandling.ts
import { useState, useCallback } from "react";

export const useDragHandling = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragover');
  }, []);

  return { isDragging, handleDrag };
};