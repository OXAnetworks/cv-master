export type Resume = {
  id: string;
  created_at: string;
  s3_route: string;
  vacancy_id: string;
  result: CVResult;
};

export type CVResult = {
  id: string;
  name: string;
  skills: string[];
  experience: string[];
  summary: string;
  why: string;
  isApproved: boolean;
  stars: number;
  contact: {
    email: string;
    phone: string;
  };
};

export type Vacancy = {
  id: string;
  created_at: string;
  s3_route: string;
  name: string;
  requirements: any;
  user_id: string;
};
