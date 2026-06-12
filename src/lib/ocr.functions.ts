import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateObject } from "ai";
import { z } from "zod";
import { getLovableAi } from "./ai-gateway.server";

const PassportSchema = z.object({
  full_name: z.string().nullable().describe("الاسم الكامل كما يظهر في الجواز (لاتيني)"),
  full_name_ar: z.string().nullable().describe("الاسم بالعربية إن وُجد"),
  passport_no: z.string().nullable(),
  nationality: z.string().nullable(),
  dob: z.string().nullable().describe("تاريخ الميلاد YYYY-MM-DD"),
  gender: z.string().nullable(),
  issue_date: z.string().nullable(),
  expiry_date: z.string().nullable(),
  place_of_birth: z.string().nullable(),
  mrz: z.string().nullable().describe("خطي MRZ كاملين مفصولين بـ \\n"),
});

export type PassportExtraction = z.infer<typeof PassportSchema>;

export const extractPassport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { imageDataUrl: string }) => {
    if (!input?.imageDataUrl?.startsWith("data:")) throw new Error("invalid image");
    return input;
  })
  .handler(async ({ data }) => {
    const ai = getLovableAi();
    const { object } = await generateObject({
      model: ai("google/gemini-2.5-flash"),
      schema: PassportSchema,
      messages: [
        {
          role: "system",
          content:
            "أنت محرك OCR متخصص بجوازات السفر. استخرج البيانات بدقة من الصورة. التواريخ بصيغة ISO YYYY-MM-DD. إن لم تتوفر قيمة اتركها null.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "استخرج بيانات الجواز من هذه الصورة." },
            { type: "image", image: data.imageDataUrl },
          ],
        },
      ],
    });
    return object;
  });
