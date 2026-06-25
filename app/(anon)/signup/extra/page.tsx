'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExtraSignupForm from './_components/ExtraSignupForm';
import { styles } from '@/(anon)/signup/Signup.styles';
import { ChevronLeft } from 'lucide-react';
import { useRootStep } from '@libs/stores/rootStepStore';

export default function ExtraSignupPage() {
  const router = useRouter();
  const setStep = useRootStep((state) => state.setStep);

  // 페이지 타이틀 설정
  useEffect(() => {
    document.title = '추가 정보 입력 - Bogam';
  }, []);

  const handleBack = () => {
    setStep('auth');
    sessionStorage.setItem('step', 'auth');
    router.push('/');
  };

  return (
    <>
      <section className={styles.intro}>
        <div className={`edge-container ${styles.header}`}>
          <div className={styles.center}>
            <h2 className={styles.title}>추가 정보 입력</h2>
            <p className={styles.desc}>
              회원가입을 완료하기 위해 아래 정보를 입력해주세요.
            </p>
          </div>
          <button onClick={handleBack} aria-label='이전'>
            <ChevronLeft
              className={`${styles.icon} ${styles.arrow}`}
              aria-hidden
            />
          </button>
        </div>
      </section>

      <ExtraSignupForm />
    </>
  );
}
