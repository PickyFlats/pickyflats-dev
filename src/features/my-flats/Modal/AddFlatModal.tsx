import { Button, Dialog, IconButton } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { BsBuildingFillAdd } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';

import { createListing, saveListingCost } from '@/database/listings';

import { useFlatStore } from '@/store/flatStore';
import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import Loader from '../../../components/Loader/index';

const DynamicComp = (importRef) =>
  dynamic(() => importRef, {
    ssr: false,
    loading: () => <Loader />,
  });

const Purpose = DynamicComp(import('@/features/my-flats/steps/Purpose'));
const FeaturesAndPolicies = DynamicComp(
  import('@/features/my-flats/steps/Features')
);
const FlatTypesPage = DynamicComp(import('@/features/my-flats/steps/FlatType'));
const Gallery = DynamicComp(import('@/features/my-flats/steps/Gallery'));
const ContactAndLocation = DynamicComp(
  import('@/features/my-flats/steps/Location')
);
const Pricing = DynamicComp(import('@/features/my-flats/steps/Pricing'));

type Step = { key: string; title: string; component: React.ReactNode };

const steps: Step[] = [
  { key: 'choose', title: '', component: <Purpose /> },
  { key: 'type', title: 'Flat Type', component: <FlatTypesPage /> },
  {
    key: 'feature-policies',
    title: 'Features & Policies',
    component: <FeaturesAndPolicies />,
  },
  { key: 'galleries', title: 'Galleries', component: <Gallery /> },
  {
    key: 'contact-location',
    title: 'Contact & Location',
    component: <ContactAndLocation />,
  },
  { key: 'pricing', title: 'Pricing', component: <Pricing /> },
];

type FormData = {
  type: string;
  rate: number;
};

export const AddFlatModal = ({
  openListingModal = false,
  onListingCreated,
}: {
  openListingModal?: boolean;
  onListingCreated?: () => void;
}) => {
  const [open, setOpen] = useState(openListingModal);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    flatTypes,
    purpose,
    buildingAmenities,
    flatAmenities,
    flatPolicies,
    contactAndLocation,
    gallery,
    costs,
    basics,
    reset,
  } = useFlatStore();
  const { openSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();

  useEffect(() => {
    return () => setActiveStep(0);
  }, [open]);

  const plusStep = () => {
    if (activeStep < 5) {
      if (activeStep == 0 && purpose != 'rent' && purpose != 'sell') {
        alert('select the purpose');
        return;
      } else if (activeStep == 1 && flatTypes.length == 0) {
        openSnackbar('Select at least one flat type', 'info', {
          horizontal: 'center',
          vertical: 'top',
        });
        return;
      }

      setActiveStep((step) => step + 1);
    }
  };
  const minusStep = () => {
    if (activeStep > 0) setActiveStep((step) => step - 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const step = () => steps.find((item, i) => i === activeStep);
  const isLastStep = activeStep + 1 === steps.length;

  const methods = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {},
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FormData> = async () => {
    try {
      setLoading(true);
      // recreate list with name field only
      const _buildingAmenities = buildingAmenities.map((item) => item.name);
      const _flatAmenities = flatAmenities.map((item) => item.name);
      const _flatPolicies = flatPolicies.map((item) => item.name);
      const newListingID = await createListing({
        purpose,
        flatTypes,
        buildingAmenities: _buildingAmenities,
        flatAmenities: _flatAmenities,
        flatPolicies: _flatPolicies,
        ...basics,
        gallery: gallery,
        ...contactAndLocation,
      });

      await saveListingCost({
        listingID: newListingID,
        ...costs,
        negotiable: 'Negotiable',
      });

      openSnackbar('Listing posted successfully', 'success', {
        horizontal: 'center',
        vertical: 'top',
      });
      setOpen(false);
      onListingCreated?.();
      reset();
    } catch (error) {
      openSnackbar('Failed to save Listing!', 'error', {
        horizontal: 'center',
        vertical: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        className='capitalize'
        startIcon={<BsBuildingFillAdd />}
        onClick={() => setOpen(true)}
      >
        Add Flats
      </Button>
      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullScreen
          sx={{ marginTop: '40px' }}
          className=''
        >
          <div className='flex h-full w-full flex-col   '>
            <div className='m-auto flex  w-[80%] border-b-2 border-b-[#fee] py-3 md:max-h-[70px] md:min-h-[70px]'>
              <div className='flex-grow'>
                <h2 className=' text-primary-main text-[30px] font-bold'>
                  {step()?.title}
                </h2>
              </div>
              <div>
                <IconButton onClick={() => handleClose()}>
                  <CgClose />
                </IconButton>
              </div>
            </div>
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex  w-full flex-grow flex-col  overflow-y-scroll  '
              >
                {step()?.component}
              </form>
            </FormProvider>
            <div className='flex min-h-[100px] w-full   border-t-2  '>
              <div className='m-auto flex gap-5'>
                {!loading && (
                  <Button
                    variant='contained'
                    className=' m-auto h-[40px] w-[150px] rounded-[20px]'
                    onClick={() => minusStep()}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant='contained'
                  className={` m-auto h-[40px] w-[150px] rounded-[20px] ${
                    isLastStep ? 'bg-blue-700' : ''
                  }`}
                  onClick={isLastStep ? handleSubmit(onSubmit) : plusStep}
                  type={`${isLastStep ? 'submit' : 'button'}`}
                  disabled={loading}
                >
                  {isLastStep ? 'Save' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};
