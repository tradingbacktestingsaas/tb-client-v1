import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string().min(1, "id is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export { updateUserSchema };
