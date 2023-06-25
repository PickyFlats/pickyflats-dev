import { Button, Dialog, IconButton } from '@mui/material';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { CgClose } from 'react-icons/cg';
import { FaEdit } from 'react-icons/fa';

import { updateListingById, updateListingCost } from '@/database/listing';

import { useFlatStore } from '@/store/flatStore';
import { Icosts } from '@/store/flatStore';
import useAuthStore from '@/store/useAuthStore';
import useListingsStore from '@/store/useListingsStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import { Listing } from '../../../types/listing';

const Purpose = dynamic(() => import('@/features/my-flats/steps/Purpose'), {
  ssr: false,
});
const FeaturesAndPolicies = dynamic(
  () => import('@/features/my-flats/steps/Features'),
  { ssr: false }
);
const FlatTypesPage = dynamic(
  () => import('@/features/my-flats/steps/FlatType'),
  { ssr: false }
);
const Gallery = dynamic(() => import('@/features/my-flats/steps/Gallery'), {
  ssr: false,
});
const ContactAndLocation = dynamic(
  () => import('@/features/my-flats/steps/Location'),
  { ssr: false }
);
const Pricing = dynamic(() => import('@/features/my-flats/steps/Pricing'), {
  ssr: false,
});

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

export const UpdateFlatModalContents = ({
  listingID,
  open = false,
  onListingSaved,
  onClose,
}: {
  listingID: string;
  open?: boolean;
  onListingSaved?: () => void;
  onClose?: () => void;
}) => {
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
  } = useFlatStore();
  const { openSnackbar } = useSnackbarStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // return () => setActiveStep(0);
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

  const handleClose = () => onClose?.();

  const step = () => steps.find((item, i) => i === activeStep);
  const isLastStep = activeStep + 1 === steps.length;

  const methods = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {},
  });
  const { handleSubmit } = methods;

  // Update API here
  const onSubmit: SubmitHandler<FormData> = async () => {
    try {
      setLoading(true);
      // recreate list with name field only
      const _buildingAmenities = buildingAmenities.map((item) => item.name);
      const _flatAmenities = flatAmenities.map((item) => item.name);
      const _flatPolicies = flatPolicies.map((item) => item.name);
      await updateListingById(listingID, {
        purpose,
        flatTypes,
        buildingAmenities: _buildingAmenities,
        flatAmenities: _flatAmenities,
        flatPolicies: _flatPolicies,
        ...basics,
        gallery: gallery, //!TODO: gallery
        ...contactAndLocation,
      });

      await updateListingCost(listingID, {
        // ...costs, // !either clear default meta fields provied by appwrite
        negotiable: 'Negotiable',
        cleaningFee: costs.cleaningFee,
        communalFacilityFee: costs.communalFacilityFee,
        currency: costs.currency,
        furnitureAppliances: costs.furnitureAppliances,
        homeImprovement: costs.homeImprovement,
        homeOfficeSetup: costs.homeOfficeSetup,
        insuranceCost: costs.insuranceCost,
        internetCost: costs.internetCost,
        legalFees: costs.legalFees,
        maintenanceRepairs: costs.maintenanceRepairs,
        monthlyCost: costs.monthlyCost,
        mortgagePayments: costs.mortgagePayments,
        movingCost: costs.movingCost,
        otherCost: costs.otherCost,
        parkingFee: costs.parkingFee,
        petFee: costs.petFee,
        propertyTax: costs.propertyTax,
        purchaseCost: costs.purchaseCost,
        securitySystem: costs.securitySystem,
        utilityCost: costs.utilityCost,
        yearlyCost: costs.yearlyCost,
      });

      openSnackbar('Listing data updated successfully', 'success', {
        horizontal: 'center',
        vertical: 'top',
      });
      onClose?.();
      onListingSaved?.();
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
      <Dialog
        open={open}
        onClose={onClose}
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
                {isLastStep ? 'Update' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export const UpdateFlatModal = ({ data }: { data: Listing }) => {
  const { refresh } = useListingsStore();
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

    setPurpose,
    setFlatTypes,
    setBuildingAmenities,
    setFlatAmenities,
    setFlatPolicies,
    setBasic,
    setGallery,
    setContactAndLocation,
    setCosts,
    // reset,
  } = useFlatStore();

  const [editModal, setEditModal] = useState(false);

  const handleEditClick = () => {
    // update store data first
    setPurpose(data.purpose);
    setFlatTypes(data.flatTypes);

    // filter amentities
    const _buildingAmenities = buildingAmenities
      .filter((am) => data.buildingAmenities.includes(am.name))
      .map((item) => ({ ...item, checked: true }));
    const _flatAmenities = flatAmenities.filter((item) =>
      data.flatAmenities.includes(item.name)
    );
    const _flatPolicies = flatPolicies.filter((item) =>
      data.flatPolicies.includes(item.name)
    );
    setBuildingAmenities(_buildingAmenities);
    setFlatAmenities(_flatAmenities);
    setFlatPolicies(_flatPolicies);

    // basic data
    setBasic({
      kitchen: data.kitchen,
      bathroom: data.bathroom,
      room: data.room,
    });

    // ! todo; with file uploading
    setGallery(data.gallery || []);
    // setGallery(JSON.parse(data.gallery as string));

    setContactAndLocation({
      flatCity: data.flatCity,
      flatCountry: data.flatCountry,
      flatGeo: data.flatGeo,
      flatStreet1: data.flatStreet1,
      flatStreet2: data.flatStreet2,
      sellerCity: data.sellerCity,
      sellerCountry: data.sellerCountry,
      sellerContact: data.sellerContact,
      sellerEmail: data.sellerEmail,
    });

    setCosts(data.costs as Icosts);
    setEditModal(true);
  };

  const handleClose = () => {
    setEditModal(false);
    // reset();
  };

  return (
    <>
      <div>
        <IconButton
          onClick={handleEditClick}
          className='bg-gray-200 hover:bg-gray-100'
        >
          <FaEdit />
        </IconButton>
      </div>

      {editModal && (
        <>
          <UpdateFlatModalContents
            listingID={data.$id}
            open={true}
            onClose={handleClose}
            onListingSaved={refresh}
          />
        </>
      )}
    </>
  );
};
