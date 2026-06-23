import { z } from 'zod';

export const extraSchema = z.object({
  nickname: z.string().min(2, '닉네임은 최소 2자 이상이어야 합니다.'),
  phoneNumber: z
    .string()
    .regex(/^\d{3}-\d{3,4}-\d{4}$/, '유효한 전화번호 형식이어야 합니다.'),
  pinNumber: z.string().length(4, '핀번호는 4자리여야 합니다.'),
});

export type ExtraInput = z.infer<typeof extraSchema>;
