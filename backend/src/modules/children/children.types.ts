export interface Child {
  id: string;
  name: string;
  avatar?: string;
  birthdate?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateChildDto {
  name: string;
  avatar?: string;
  birthdate?: string;
  notes?: string;
}

export interface UpdateChildDto {
  name?: string;
  avatar?: string;
  birthdate?: string;
  notes?: string;
}
