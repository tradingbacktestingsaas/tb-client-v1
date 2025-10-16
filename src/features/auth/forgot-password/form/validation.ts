import { z } from "zod";

const forgotPassSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export { forgotPassSchema };
