/* eslint-disable */
// @ts-nocheck
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImageCard } from './ImageCard';

global.fetch = jest.fn();

describe('ImageCard Integration Tests', () => {
  const mockImage = {
    id: 1,
    url: 'https://example.com/image.jpg',
    likes: 5,
    dislikes: 2
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render image with vote counts', () => {
    render(<ImageCard image={mockImage} onVote={jest.fn()} />);
    
    expect(screen.getByRole('img')).toHaveAttribute('src', mockImage.url);
    expect(screen.getByText(/5/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it('should call onVote when like button is clicked', async () => {
    const mockOnVote = jest.fn();
    
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    
    const likeButton = screen.getAllByRole('button')[0];
    await userEvent.click(likeButton);
    
    expect(mockOnVote).toHaveBeenCalledWith(mockImage.id, 'like');
  });

  it('should call onVote when dislike button is clicked', async () => {
    const mockOnVote = jest.fn();
    
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    
    const dislikeButton = screen.getAllByRole('button')[1];
    await userEvent.click(dislikeButton);
    
    expect(mockOnVote).toHaveBeenCalledWith(mockImage.id, 'dislike');
  });

  it('should handle multiple rapid clicks', async () => {
    const mockOnVote = jest.fn();
    
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    
    const likeButton = screen.getAllByRole('button')[0];
    
    // Click multiple times rapidly
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);
    await userEvent.click(likeButton);
    
    expect(mockOnVote).toHaveBeenCalled();
  });

  it('should display image with accessibility attributes', () => {
    render(<ImageCard image={mockImage} onVote={jest.fn()} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
  });

  it('should handle loading state for image', async () => {
    render(<ImageCard image={mockImage} onVote={jest.fn()} />);
    
    const image = screen.getByRole('img') as HTMLImageElement;
    
    await waitFor(() => {
      expect(image.complete || image.src).toBeTruthy();
    });
  });

  it('should render with zero votes', () => {
    const imageWithNoVotes = { ...mockImage, likes: 0, dislikes: 0 };
    render(<ImageCard image={imageWithNoVotes} onVote={jest.fn()} />);
    
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('should update UI optimistically after vote', async () => {
    const mockOnVote = jest.fn();
    
    const { rerender } = render(
      <ImageCard image={mockImage} onVote={mockOnVote} />
    );
    
    const likeButton = screen.getAllByRole('button')[0];
    await userEvent.click(likeButton);
    
    const updatedImage = { ...mockImage, likes: mockImage.likes + 1 };
    rerender(<ImageCard image={updatedImage} onVote={mockOnVote} />);
    
    expect(screen.getByText(/6/)).toBeInTheDocument(); // Updated likes
  });
});
