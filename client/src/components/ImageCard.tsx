import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';

interface Image {
  id: number;
  url: string;
  likes: number;
  dislikes: number;
}

interface ImageCardProps {
  image: Image;
  onVote: (imageId: number, voteType: string) => void;
}

export const ImageCard = ({ image, onVote }: ImageCardProps) => {
  return (
    <Card
      data-testid="image-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image.url}
        alt={`Image ${image.id}`}
        loading="lazy"
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Image #{image.id}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <IconButton
          color="success"
          onClick={() => onVote(image.id, 'like')}
          size="small"
          aria-label="like"
        >
          <ThumbUp />
          <Chip
            label={image.likes}
            size="small"
            color="success"
            sx={{ ml: 1 }}
          />
        </IconButton>
        <IconButton
          color="error"
          onClick={() => onVote(image.id, 'dislike')}
          size="small"
          aria-label="dislike"
        >
          <ThumbDown />
          <Chip
            label={image.dislikes}
            size="small"
            color="error"
            sx={{ ml: 1 }}
          />
        </IconButton>
      </CardActions>
    </Card>
  );
};
