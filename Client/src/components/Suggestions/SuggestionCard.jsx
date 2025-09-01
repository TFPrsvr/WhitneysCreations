import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/card';
import { Button } from '@/lib/ui/button';

const SuggestionCard = ({ suggestion, onEdit, onDelete }) => {
  const handleDelete = () => {
    const suggestionId = suggestion._id;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found. Cannot delete suggestion');
      return;
    }
    
    axios({
      method: 'delete',
      url: `http://localhost:3002/api/delete/suggestions/${suggestionId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      onDelete(suggestionId);
    })
    .catch(error => {
      console.error('Error deleting suggestion:', error);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{suggestion.title}</CardTitle>
        <CardDescription>{suggestion.description}</CardDescription>
      </CardHeader>
      
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => onEdit(suggestion)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionCard;
