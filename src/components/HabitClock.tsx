import React, { useMemo } from 'react';

interface HabitClockProps {
  timestamps: number[];
}

const CLOCK_RADIUS = 100;
const CENTER = CLOCK_RADIUS + 10; // Add padding

export const HabitClock: React.FC<HabitClockProps> = ({ timestamps }) => {
  const { amPoints, pmPoints } = useMemo(() => {
    const am: { x: number; y: number; key: number }[] = [];
    const pm: { x: number; y: number; key: number }[] = [];
    
    timestamps.forEach(ts => {
      const date = new Date(ts);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      const isAM = hours < 12;
      const hoursIn12 = hours % 12;
      
      // Map 720 minutes (12 hours) to 360 degrees
      const totalMinutesIn12HourCycle = hoursIn12 * 60 + minutes;
      const angle = (totalMinutesIn12HourCycle / 720) * 360 - 90; 
      const angleInRadians = (angle * Math.PI) / 180;
      
      const x = CENTER + Math.cos(angleInRadians) * CLOCK_RADIUS;
      const y = CENTER + Math.sin(angleInRadians) * CLOCK_RADIUS;
      
      const point = { x, y, key: ts };
      if (isAM) {
        am.push(point);
      } else {
        pm.push(point);
      }
    });
    return { amPoints: am, pmPoints: pm };
  }, [timestamps]);

  // Generate ticks for the clock face
  const ticks = useMemo(() => {
    const tickData = [];
    for (let i = 1; i <= 12; i++) {
      const isMajorTick = i % 3 === 0;
      const angle = (i / 12) * 360 - 90;
      const angleInRadians = (angle * Math.PI) / 180;
      
      const startRadius = isMajorTick ? CLOCK_RADIUS - 10 : CLOCK_RADIUS - 5;
      const endRadius = CLOCK_RADIUS;

      const x1 = CENTER + Math.cos(angleInRadians) * startRadius;
      const y1 = CENTER + Math.sin(angleInRadians) * startRadius;
      const x2 = CENTER + Math.cos(angleInRadians) * endRadius;
      const y2 = CENTER + Math.sin(angleInRadians) * endRadius;

      // Position for labels
      const labelRadius = CLOCK_RADIUS - 22;
      const lx = CENTER + Math.cos(angleInRadians) * labelRadius;
      const ly = CENTER + Math.sin(angleInRadians) * labelRadius;
      
      tickData.push({ x1, y1, x2, y2, isMajorTick, label: i, lx, ly });
    }
    return tickData;
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      {timestamps.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center text-habico-text-secondary dark:text-dark-habico-text-secondary">
          <p>Your slip-ups will be plotted here on the clock as you log them.</p>
        </div>
      ) : (
        <>
            <div className="w-full aspect-square p-4">
                <svg viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`} className="w-full h-full">
                    {/* Clock Face */}
                    <circle cx={CENTER} cy={CENTER} r={CLOCK_RADIUS} className="fill-habico-border/30 dark:fill-dark-habico-border/30" />

                    {/* Ticks and Labels */}
                    {ticks.map((tick) => (
                    <g key={tick.label}>
                        <line x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} className="stroke-habico-text-secondary/40 dark:stroke-dark-habico-text-secondary/40" strokeWidth="1.5" />
                        {tick.isMajorTick && (
                            <text x={tick.lx} y={tick.ly} dy="0.35em" textAnchor="middle" className="text-[12px] fill-habico-text-secondary dark:fill-dark-habico-text-secondary font-semibold">
                                {tick.label}
                            </text>
                        )}
                    </g>
                    ))}

                    {/* AM Slip-up points (Orange) */}
                    <g>
                        {amPoints.map(point => (
                            <circle 
                                key={point.key} 
                                cx={point.x} 
                                cy={point.y} 
                                r="8" 
                                className="fill-orange-500/30 dark:fill-orange-400/30 habit-dot"
                            />
                        ))}
                    </g>
                     {/* PM Slip-up points (Red) */}
                    <g>
                        {pmPoints.map(point => (
                            <circle 
                                key={point.key} 
                                cx={point.x} 
                                cy={point.y} 
                                r="8" 
                                className="fill-habico-red/40 dark:fill-dark-habico-red/40 habit-dot"
                            />
                        ))}
                    </g>

                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <g filter="url(#glow)">
                        {amPoints.map(point => (
                            <circle 
                                key={`${point.key}-glow`} 
                                cx={point.x} 
                                cy={point.y} 
                                r="3" 
                                className="fill-orange-500 dark:fill-orange-400 habit-dot-center"
                            />
                        ))}
                        {pmPoints.map(point => (
                            <circle 
                                key={`${point.key}-glow`} 
                                cx={point.x} 
                                cy={point.y} 
                                r="3" 
                                className="fill-habico-red dark:fill-dark-habico-red habit-dot-center"
                            />
                        ))}
                    </g>
                </svg>
            </div>
            <div className="flex justify-center items-center space-x-4 -mt-2">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500/80 dark:bg-orange-400/80"></div>
                    <span className="text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">AM</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-habico-red/80 dark:bg-dark-habico-red/80"></div>
                    <span className="text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">PM</span>
                </div>
            </div>
        </>
      )}
    </div>
  );
};