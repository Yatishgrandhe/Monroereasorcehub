export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      resources: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category_id: string;
          contact_info: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website: string | null;
          address: string | null;
          services_offered: string[] | null;
          population_served: string[] | null;
          hours_of_operation: {
            monday?: { open: string; close: string; closed?: boolean };
            tuesday?: { open: string; close: string; closed?: boolean };
            wednesday?: { open: string; close: string; closed?: boolean };
            thursday?: { open: string; close: string; closed?: boolean };
            friday?: { open: string; close: string; closed?: boolean };
            saturday?: { open: string; close: string; closed?: boolean };
            sunday?: { open: string; close: string; closed?: boolean };
          } | null;
          is_approved: boolean;
          is_spotlighted: boolean;
          spotlight_image_url: string | null;
          spotlight_story: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category_id: string;
          contact_info?: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website?: string | null;
          address?: string | null;
          services_offered?: string[] | null;
          population_served?: string[] | null;
          hours_of_operation?: {
            monday?: { open: string; close: string; closed?: boolean };
            tuesday?: { open: string; close: string; closed?: boolean };
            wednesday?: { open: string; close: string; closed?: boolean };
            thursday?: { open: string; close: string; closed?: boolean };
            friday?: { open: string; close: string; closed?: boolean };
            saturday?: { open: string; close: string; closed?: boolean };
            sunday?: { open: string; close: string; closed?: boolean };
          } | null;
          is_approved?: boolean;
          is_spotlighted?: boolean;
          spotlight_image_url?: string | null;
          spotlight_story?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category_id?: string;
          contact_info?: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website?: string | null;
          address?: string | null;
          services_offered?: string[] | null;
          population_served?: string[] | null;
          hours_of_operation?: {
            monday?: { open: string; close: string; closed?: boolean };
            tuesday?: { open: string; close: string; closed?: boolean };
            wednesday?: { open: string; close: string; closed?: boolean };
            thursday?: { open: string; close: string; closed?: boolean };
            friday?: { open: string; close: string; closed?: boolean };
            saturday?: { open: string; close: string; closed?: boolean };
            sunday?: { open: string; close: string; closed?: boolean };
          } | null;
          is_approved?: boolean;
          is_spotlighted?: boolean;
          spotlight_image_url?: string | null;
          spotlight_story?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          organization_name: string;
          category_id: string;
          description: string | null;
          contact_info: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website: string | null;
          submitter_name: string;
          submitter_email: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
        };
        Insert: {
          id?: string;
          organization_name: string;
          category_id: string;
          description?: string | null;
          contact_info?: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website?: string | null;
          submitter_name: string;
          submitter_email: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          organization_name?: string;
          category_id?: string;
          description?: string | null;
          contact_info?: {
            phone?: string;
            email?: string;
            address?: string;
          } | null;
          website?: string | null;
          submitter_name?: string;
          submitter_email?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      resumes: {
        Row: {
          id: string;
          user_id: string;
          resume_data: {
            personalInfo: {
              firstName: string;
              lastName: string;
              email: string;
              phone: string;
              address: string;
              linkedin?: string;
              website?: string;
            };
            summary: string;
            experience: Array<{
              id: string;
              company: string;
              position: string;
              startDate: string;
              endDate: string;
              current: boolean;
              description: string;
              achievements: string[];
            }>;
            education: Array<{
              id: string;
              institution: string;
              degree: string;
              field: string;
              startDate: string;
              endDate: string;
              gpa?: string;
            }>;
            skills: string[];
            certifications: Array<{
              id: string;
              name: string;
              issuer: string;
              date: string;
              expiryDate?: string;
            }>;
            languages: Array<{
              id: string;
              language: string;
              proficiency: string;
            }>;
          };
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resume_data: {
            personalInfo: {
              firstName: string;
              lastName: string;
              email: string;
              phone: string;
              address: string;
              linkedin?: string;
              website?: string;
            };
            summary: string;
            experience: Array<{
              id: string;
              company: string;
              position: string;
              startDate: string;
              endDate: string;
              current: boolean;
              description: string;
              achievements: string[];
            }>;
            education: Array<{
              id: string;
              institution: string;
              degree: string;
              field: string;
              startDate: string;
              endDate: string;
              gpa?: string;
            }>;
            skills: string[];
            certifications: Array<{
              id: string;
              name: string;
              issuer: string;
              date: string;
              expiryDate?: string;
            }>;
            languages: Array<{
              id: string;
              language: string;
              proficiency: string;
            }>;
          };
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          resume_data?: {
            personalInfo: {
              firstName: string;
              lastName: string;
              email: string;
              phone: string;
              address: string;
              linkedin?: string;
              website?: string;
            };
            summary: string;
            experience: Array<{
              id: string;
              company: string;
              position: string;
              startDate: string;
              endDate: string;
              current: boolean;
              description: string;
              achievements: string[];
            }>;
            education: Array<{
              id: string;
              institution: string;
              degree: string;
              field: string;
              startDate: string;
              endDate: string;
              gpa?: string;
            }>;
            skills: string[];
            certifications: Array<{
              id: string;
              name: string;
              issuer: string;
              date: string;
              expiryDate?: string;
            }>;
            languages: Array<{
              id: string;
              language: string;
              proficiency: string;
            }>;
          };
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          location: string | null;
          organizer: string | null;
          contact_info: {
            phone?: string;
            email?: string;
            website?: string;
          } | null;
          category: string | null;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          location?: string | null;
          organizer?: string | null;
          contact_info?: {
            phone?: string;
            email?: string;
            website?: string;
          } | null;
          category?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          location?: string | null;
          organizer?: string | null;
          contact_info?: {
            phone?: string;
            email?: string;
            website?: string;
          } | null;
          category?: string | null;
          is_approved?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
