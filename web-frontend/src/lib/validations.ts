import { z } from "zod";

// User validation schemas
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUserSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["ADMIN", "NORMAL"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Candidate validation schemas
export const candidateSchema = z.object({
  name: z.string().min(2, "Candidate name must be at least 2 characters"),
  code: z.number().int().positive("Candidate code must be a positive number"),
  party: z.string().min(2, "Party name must be at least 2 characters"),
  acronym: z
    .string()
    .min(1, "Acronym is required")
    .max(10, "Acronym must be at most 10 characters"),
  status: z.enum(["active", "inactive", "pending"]),
});

// Citizen/Voter validation schemas
export const citizenSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  electoralId: z.string().min(5, "Electoral ID must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  province: z.string().min(2, "Province is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  verification: z.enum(["verified", "pending", "rejected"]).optional(),
  status: z.enum(["active", "inactive", "suspended"]).optional(),
});

// Election announcement validation schemas
export const electionAnnouncementSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Transaction/Vote validation
export const voteSchema = z.object({
  identifier: z.string().min(5, "Identifier is required"),
  choiceCode: z.number().int().positive("Choice code must be valid"),
  secret: z.string().optional(),
});

// Export types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type CandidateInput = z.infer<typeof candidateSchema>;
export type CitizenInput = z.infer<typeof citizenSchema>;
export type ElectionAnnouncementInput = z.infer<
  typeof electionAnnouncementSchema
>;
export type VoteInput = z.infer<typeof voteSchema>;

// Utility function to format validation errors
export const formatValidationErrors = (error: z.ZodError) => {
  return error.errors.reduce(
    (acc, err) => {
      const path = err.path.join(".");
      acc[path] = err.message;
      return acc;
    },
    {} as Record<string, string>,
  );
};
