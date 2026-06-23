'use client';

import { useRouter } from 'next/navigation';
import { useExtraSignupForm } from './useExtraSignupForm';
import { authApi } from '@libs/api_front/auth.api';
import { ExtraInput } from './extraSchema';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import OtpInput from '@/(anon)/_components/common/forms/OtpInput';
import { styles } from '@/(anon)/_components/common/forms/Forms.styles';
import { useCheckNickname } from '@/hooks/useCheckNickname';
import { useUserStore } from '@libs/stores/userStore';

export default function ExtraSignupForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const { form, onSubmit: handleExtraSubmit } = useExtraSignupForm();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const setNickname = useUserStore((state) => state.setNickname);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
    setError,
    trigger,
  } = form;

  const nickname = watch('nickname');
  const [triggerNicknameCheck, setTriggerNicknameCheck] = useState(false);
  const [nicknameAvailable, setNicknameAvailable] = useState<
    boolean | undefined
  >(undefined);
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);

  const {
    data: nicknameData,
    isFetching: isNicknameFetching,
    isSuccess: isNicknameSuccess,
    isError: isNicknameError,
  } = useCheckNickname(nickname, triggerNicknameCheck);

  // ✅ 닉네임 중복 확인 결과 처리
  useEffect(() => {
    if (triggerNicknameCheck && isNicknameSuccess) {
      const available = nicknameData?.available ?? false;
      if (available) {
        setNicknameAvailable(true);
        clearErrors('nickname');
        setNicknameMessage('사용 가능한 닉네임입니다.');
      } else {
        setNicknameAvailable(false);
        setError('nickname', {
          type: 'manual',
          message: '이미 사용 중인 닉네임입니다.',
        });
        setNicknameMessage(null);
      }
      setTriggerNicknameCheck(false);
    }
  }, [triggerNicknameCheck, isNicknameSuccess, nicknameData]);

  const onSubmit = async (data: ExtraInput) => {
    try {
      // ✅ 세션 업데이트 (nickname 최신화)
      await update();

      // ✅ 세션에서 닉네임 가져와서 userStore에 저장
      const updatedSession = await fetch('/api/auth/session').then((res) =>
        res.json()
      );
      if (updatedSession?.user?.nickname) {
        setNickname(updatedSession.user.nickname);
      }

      // ✅ 메인 페이지로 이동
      router.push('/main');
    } catch (err) {
      console.error(err);
      setSubmitError('알 수 없는 오류가 발생했습니다.');
    }
  };

  if (!session?.user) return null;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      {/* 이름 (읽기 전용) */}
      <Field id='name' label='이름'>
        <TextInput id='name' value={session.user.name || ''} readOnly />
      </Field>

      {/* 아이디 (읽기 전용) */}
      <Field id='username' label='아이디'>
        <TextInput id='username' value={session.user.username || ''} readOnly />
      </Field>

      {/* 닉네임 */}
      <Field id='nickname' label='닉네임'>
        <TextInput
          id='nickname'
          {...register('nickname')}
          placeholder='별명'
          rightAddon={
            <button
              type='button'
              className={
                nicknameAvailable
                  ? styles.addonRightDisabled
                  : styles.addonRight
              }
              onClick={() => {
                const currentNickname = form.getValues('nickname');
                if (currentNickname.trim().length < 2) {
                  setError('nickname', {
                    type: 'manual',
                    message: '닉네임은 최소 2자 이상 입력해주세요.',
                  });
                  return;
                }
                setTriggerNicknameCheck(true);
              }}
              disabled={nicknameAvailable}
            >
              {isNicknameFetching ? '확인 중' : '중복확인'}
            </button>
          }
          onChange={() => {
            setNicknameAvailable(undefined);
            setNicknameMessage(null);
            setTriggerNicknameCheck(false);
            clearErrors('nickname');
          }}
        />
        {isNicknameError && (
          <p className={styles.error}>중복 확인 중 오류가 발생했습니다.</p>
        )}
        {nicknameMessage && !errors.nickname && (
          <p className={styles.success}>{nicknameMessage}</p>
        )}
        {errors.nickname && (
          <p className={styles.error}>{errors.nickname.message}</p>
        )}
      </Field>

      {/* 핀번호 */}
      <Field id='pinNumber' label='핀번호 (4자리)' hint='간편 인증 번호'>
        <OtpInput
          length={4}
          onChange={(v) => {
            setValue('pinNumber', v);
            trigger('pinNumber');
            clearErrors('pinNumber');
          }}
        />
        {errors.pinNumber && (
          <p className={styles.error}>{errors.pinNumber.message}</p>
        )}
      </Field>

      {/* 전화번호 */}
      <Field id='phoneNumber' label='전화번호'>
        <TextInput
          id='phoneNumber'
          {...register('phoneNumber')}
          placeholder='010-1234-5678'
          onChange={() => clearErrors('phoneNumber')}
        />
        {errors.phoneNumber && (
          <p className={styles.error}>{errors.phoneNumber.message}</p>
        )}
      </Field>

      {/* 서버 에러 메시지 */}
      {submitError && <p className={styles.error}>{submitError}</p>}

      <button type='submit' className='btn btn-primary w-full'>
        정보 제출
      </button>
    </form>
  );
}
