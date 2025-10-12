import Joi from "joi";

export const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(), // ✅ include description
  category: Joi.string()
    .valid(
      "Work",
      "Personal",
      "Study",
      "Shopping",
      "Health",
      "Finance",
      "Travel",
      "Home",
      "Projects",
      "Events"
    )
    .required(),
  priority: Joi.string().valid("Low", "Medium", "High", "Urgent").required(),
  deadline: Joi.date().required(),
});
