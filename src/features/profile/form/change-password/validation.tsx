import { z } from "zod";

const changePassSchema = z.object({
  password: z.string().min(8, "Password is required"),
});

export { changePassSchema };
