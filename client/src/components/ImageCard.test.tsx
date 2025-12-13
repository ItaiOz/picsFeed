import { render, screen, fireEvent } from '@testing-library/react';
import { ImageCard } from './ImageCard';

describe('ImageCard', () => {
  const mockOnVote = jest.fn();
  const mockImage = {
    id: 1,
    url: 'https://example.com/image.jpg',
    likes: 5,
    dislikes: 2
  };

  beforeEach(() => {
    mockOnVote.mockClear();
  });

  test('renders image with correct URL', () => {
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', mockImage.url);
  });

  test('displays correct vote counts', () => {
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('calls onVote with correct parameters on like', () => {
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    const likeButton = screen.getAllByRole('button')[0];
    fireEvent.click(likeButton);
    expect(mockOnVote).toHaveBeenCalledWith(1, 'like');
  });

  test('calls onVote with correct parameters on dislike', () => {
    render(<ImageCard image={mockImage} onVote={mockOnVote} />);
    const dislikeButton = screen.getAllByRole('button')[1];
    fireEvent.click(dislikeButton);
    expect(mockOnVote).toHaveBeenCalledWith(1, 'dislike');
  });
});
