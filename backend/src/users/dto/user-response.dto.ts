import { Role } from '@prisma/client';

// Réponse API utilisateur: format public des données.
export class UserResponseDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  role: Role;
  isCreator: boolean;
}
