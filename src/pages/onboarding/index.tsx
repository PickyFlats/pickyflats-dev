import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { updateCurrentUserProfile } from '@/database/user';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import StepsCard from '@/features/StepsCard';
import withAuth, { WithAuthProps } from '@/hoc/withAuth';

const Step1Component = dynamic(
  () => import('@/pageComponents/onboarding/Step1')
);

const Step2Component = dynamic(
  () => import('@/pageComponents/onboarding/Step2')
);

const Step3Component = dynamic(
  () => import('@/pageComponents/onboarding/Step3')
);

const AllDoneComponent = dynamic(
  () => import('@/pageComponents/onboarding/Allcaught')
);

const steps = [
  {
    title: 'What are you looking for?',
    step: 1,
  },
  {
    title: 'How do you know us?',
    step: 2,
  },
  {
    title: 'Where are you from?',
    step: 3,
  },
];

type FormData = {
  buyFlat: boolean;
  sellFlat: boolean;
  findRoomMate: boolean;
  rentFlates: boolean;
  google: boolean;
  facebook: boolean;
  instagram: boolean;
  twitter: boolean;
  country: string | any;
  city: string;
};

const Onboarding = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbarStore();
  const [step, setStep] = useState(1);

  const method = useForm<FormData>({
    defaultValues: {
      buyFlat: false,
      sellFlat: false,
      findRoomMate: false,
      rentFlates: false,
      google: false,
      facebook: false,
      instagram: false,
      twitter: false,
      country: '',
      // city: 'kathmandu',
      city: '',
    },
  });

  const { handleSubmit } = method;
  const SubmitForm = async (data: FormData) => {
    try {
      setLoading(true);

      const personalInterests: string[] = [];
      if (data.buyFlat) personalInterests.push('BuyFlat');
      if (data.sellFlat) personalInterests.push('SellFlat');
      if (data.findRoomMate) personalInterests.push('FindFlatMate');
      if (data.rentFlates) personalInterests.push('RentFlat');

      const referredSources: string[] = [];
      if (data.google) referredSources.push('Google');
      if (data.facebook) referredSources.push('Facebook');
      if (data.instagram) referredSources.push('Instagram');
      if (data.twitter) referredSources.push('Twitter');

      await updateCurrentUserProfile({
        personalInterests,
        referredSources,
        country: data.country?.value, //! TODO: pass value only
        city: data.city,
      });
      // move to final caught screen step
      setStep(step + 1);
    } catch (error) {
      openSnackbar(
        'Looks like something went wrong, please try again',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const isLastStep = step === 3;

  return (
    <div className='bg-flex  h-screen flex-col   p-8'>
      <div className='mt-4 flex w-full items-center  justify-evenly'>
        {steps.map((item, index) => {
          if (step == 4) return null;
          return (
            <div
              key={index}
              onClick={() => setStep(item.step)}
              className='cursor-pointer'
            >
              <StepsCard title={item.title} isActive={item.step === step} />
            </div>
          );
        })}
      </div>
      <div className='flex items-center justify-between'>
        <FormProvider {...method}>
          <form
            onSubmit={handleSubmit(SubmitForm)}
            className=' mx-auto mt-10  flex max-w-[800px] flex-col items-center justify-center   py-6 '
          >
            <div className='m-8 flex items-center justify-center '>
              {step === 1 && <Step1Component />}
              {step === 2 && <Step2Component />}
              {step === 3 && <Step3Component />}
              {step === 4 && <AllDoneComponent />}
            </div>
            {step !== 4 && (
              <div className=' flex w-full items-center justify-end gap-4'>
                {!loading && (
                  <Button
                    variant='outlined'
                    className='w-[150px]'
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1 ? true : false}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant='contained'
                  className='w-[150px]'
                  onClick={
                    isLastStep
                      ? handleSubmit(SubmitForm)
                      : () => setStep(step + 1)
                  }
                  // type={isLastStep ? 'submit' : 'button'}
                  type='button'
                  disabled={loading}
                >
                  {isLastStep ? 'Submit' : 'Next'}
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

function LayoutWrapper(props: WithAuthProps) {
  return <>{props.page}</>;
}

const PageWrapper: React.FC<{ page: React.ReactElement }> = withAuth(
  LayoutWrapper,
  'all'
);
Onboarding.getLayout = function getLayout(page: React.ReactElement) {
  return <PageWrapper page={page} />;
};

export default Onboarding;
