import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface WisdomCardProps {
  text: string;
  onShare?: () => void;
}

const downloadImage = (blob: Blob, fileName: string) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const WisdomCard: React.FC<WisdomCardProps> = ({ text }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || isSharing) return;
    setIsSharing(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // Use transparent background
        scale: 2, // Increase resolution for better quality
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Could not generate image. Please try again.');
          setIsSharing(false);
          return;
        }
        
        const file = new File([blob], 'habico-wisdom.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Habit Wisdom from Habico',
            text: `"${text}" - A little wisdom from the Habico app.`,
          });
        } else {
          downloadImage(blob, 'habico-wisdom.png');
        }
        
        setIsSharing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Sharing failed:', error);
      alert('Oops, sharing is not supported on your browser or something went wrong.');
      setIsSharing(false);
    }
  };

  return (
     <div className="w-full h-full p-6 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900 shadow-xl border border-habico-border dark:border-dark-habico-border" ref={cardRef}>
        {/* Card Content */}
        <div>
            <div className="flex items-center space-x-2 mb-6">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" className="fill-habico-blue dark:fill-dark-habico-blue"/>
                    <path d="M16.5116 11.2326C14.7791 11.2326 13.3488 12.6628 13.3488 14.3953C13.3488 17.5814 16.5116 21.6047 16.5116 21.6047C16.5116 21.6047 19.6744 17.5814 19.6744 14.3953C19.6744 12.6628 18.2442 11.2326 16.5116 11.2326Z" fill="white"/>
                </svg>
                <h2 className="text-lg font-bold text-habico-blue dark:text-dark-habico-blue">Habico Wisdom</h2>
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-habico-text-primary dark:text-dark-habico-text-primary leading-tight">
                "{text}"
            </p>
        </div>

        {/* Footer and Share Button */}
        <div className="flex justify-between items-center mt-8">
            <p className="text-xs text-habico-text-secondary dark:text-dark-habico-text-secondary">Made with Habico</p>
            <button
                onClick={handleShare}
                disabled={isSharing}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-habico-blue dark:bg-dark-habico-blue text-white disabled:opacity-50 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-habico-blue"
                aria-label="Share Wisdom Card"
            >
                {isSharing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                )}
            </button>
        </div>
    </div>
  );
};