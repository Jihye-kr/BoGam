import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { extraSchema, ExtraInput } from './extraSchema';
import authApi from '@libs/api_front/auth.api';
import { useRouter } from 'next/navigation';

export function useExtraSignupForm() {
  const form = useForm<ExtraInput>({
    resolver: zodResolver(extraSchema),
    mode: 'onChange',
  });

  const router = useRouter();

  const onSubmit = async (data: ExtraInput) => {
    try {
      const result = await authApi.updateKakaoUser(data);
      if (result.success) {
        router.push('/');
      } else {
        alert(result.message ?? '추가 정보 등록 실패');
      }
    } catch (err) {
      console.error(err);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return {
    form,
    onSubmit,
  };
}
