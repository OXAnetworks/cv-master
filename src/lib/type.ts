export type CVResult = {
  name: string;
  skills: string[];
  experience: string[];
  resume: string;
  why: string;
  isApproved: boolean;
  stars: number;
};

export type Vacancy = {
  id: string;
  created_at: string;
  s3_route: string;
  name: string;
  requirements: any;
  user_id: string;
};
