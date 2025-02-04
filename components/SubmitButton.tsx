// src/components/fragments/SubmitButton.tsx
import { Button } from "@/components/ui/button";

export const SubmitButton = ({ isLoading }: { isLoading: boolean }) => (
  <Button
    type="submit"
    className="w-full bg-orange-500 hover:bg-orange-600 transition-colors"
    disabled={isLoading}
  >
    {isLoading ? 'Creating...' : 'Create Fragment'}
  </Button>
);