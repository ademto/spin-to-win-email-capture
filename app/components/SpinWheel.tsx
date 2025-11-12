'use client';

import { useEffect, useRef, useState } from 'react';
import { prizes, Prize, segmentAngle } from '@/lib/prizes';

interface SpinWheelProps {
  onSpinComplete: (prize: Prize) => void;
  canSpin: boolean;
}

export default function SpinWheel({ onSpinComplete, canSpin }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context and rotate
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw segments
    // Offset by half a segment so segments are centered with the pointer at top
    const angleOffset = -segmentAngle / 2;
    
    prizes.forEach((prize, index) => {
      const startAngle = ((index * segmentAngle + angleOffset) * Math.PI) / 180;
      const endAngle = (((index + 1) * segmentAngle + angleOffset) * Math.PI) / 180;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + (segmentAngle * Math.PI) / 360);
      ctx.textAlign = 'center';
      ctx.fillStyle = prize.textColor || '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(prize.label, radius * 0.65, 10);
      ctx.restore();
    });

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#2C3E50';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Draw pointer/arrow at top
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    ctx.fillStyle = '#FF0000';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [rotation]);

  const spinWheel = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);

    // Determine winning segment (random)
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[winningIndex];

    // Calculate target rotation to land pointer in center of winning segment
    // The pointer is at the top (0 degrees), and segments are drawn from 0
    const baseRotation = 360 * 5; // 5 full spins for effect
    
    // Calculate the angle to the CENTER of the winning segment
    const segmentCenterAngle = winningIndex * segmentAngle + (segmentAngle / 2);
    
    // We need to rotate so that the segment center aligns with the pointer (top)
    // Since pointer is at top (0°) and wheel rotates clockwise, we need to rotate
    // the wheel so the segment comes to the top
    const targetRotation = baseRotation + (360 - segmentCenterAngle);

    // Animation parameters
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startRotation = rotation % 360;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + (targetRotation - startRotation) * easeOut;
      setRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setTimeout(() => onSpinComplete(winningPrize), 500);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Auto-spin when canSpin becomes true
  useEffect(() => {
    if (canSpin && !isSpinning) {
      // Small delay to show the wheel first
      const timer = setTimeout(() => {
        spinWheel();
      }, 500);
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canSpin]);

  // Cleanup animation
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Auto-spin when canSpin becomes true
  useEffect(() => {
    if (canSpin && !isSpinning) {
      // Small delay to show the wheel first
      const timer = setTimeout(() => {
        spinWheel();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [canSpin]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="max-w-full h-auto"
        />
        {isSpinning && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 text-white px-6 py-3 rounded-full text-xl font-bold">
              SPINNING...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
