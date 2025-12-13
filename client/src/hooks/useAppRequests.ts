import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

interface Image {
  id: number;
  url: string;
  likes: number;
  dislikes: number;
}

interface UseAppRequestsReturn {
  images: Image[];
  loading: boolean;
  error: string | null;
  handleVote: (imageId: number, voteType: string) => Promise<void>;
  handleExport: () => Promise<void>;
}

export const useAppRequests = (): UseAppRequestsReturn => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/images`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data: Image[] = await response.json();
      setImages(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  // eslint-disable-next-line max-len
  const handleVote = async (imageId: number, voteType: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_id: imageId, vote_type: voteType }),
      });

      if (!response.ok) throw new Error('Failed to vote');

      // Refresh images to get updated counts
      fetchImages();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Vote error:', err);
    }
  };

  const handleExport = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'votes.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Export error:', err);
    }
  };

  return {
    images,
    loading,
    error,
    handleVote,
    handleExport,
  };
}
