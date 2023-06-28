import { Button } from '@mui/material';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { differenceInCalendarDays } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { DateRange, Range } from 'react-date-range';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import { createListingReservation } from '@/database/booking';

import useAuthStore from '@/store/useAuthStore';
import useSnackbarStore from '@/store/useSnackbarStore';

import { Listing } from '@/types/listing';

// Initialize Stripe with your public API key
const stripePromise = loadStripe(
  'pk_test_51N0N4GI0ho0pbppLkehcxc1R3PmL2mAXKPgpFU9PHanDsyhMVFwqchmDPkROHjEwfGtn1ZbsKZP8LyMRLnpi1rCD00FxZqnSAR'
);

interface ModalProps {
  listing: Listing;
  listingID?: string;
  onClose: () => void;
}

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

export default function ReserveModal({
  listing,
  listingID,
  onClose,
}: ModalProps) {
  const { user } = useAuthStore();
  // const disabledDates = [];

  const [paymentScreen, setPaymentScreen] = useState(false);

  const [selectedDateRange, setSelectedDateRange] =
    useState<Range>(initialDateRange);
  const [totalPrice, setTotalPrice] = useState(listing.costs?.monthlyCost ?? 0);
  const [reservationID, setReservationID] = useState('');
  const { openSnackbar } = useSnackbarStore();
  const { push } = useRouter();

  useEffect(() => {
    const dateRange = selectedDateRange;
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.costs?.monthlyCost) {
        //TODO: count same day rate?
        const _totalPrice = (dayCount + 1) * listing.costs.monthlyCost;
        setTotalPrice((_totalPrice * 10) / 100);
      } else {
        setTotalPrice(
          listing.costs?.monthlyCost
            ? (listing.costs?.monthlyCost * 10) / 100
            : 0
        );
      }
    }
  }, [selectedDateRange]);

  const handleReservation = async () => {
    if (!user) {
      openSnackbar('Please login to reserve your space!', 'info', {
        horizontal: 'center',
        vertical: 'top',
      });
      // push login page
      push('/auth/login');
      return;
    }

    // save reservation data and open payment screen
    const newReservationID = await createListingReservation({
      userID: user?.$id,
      listingID: listingID,
      totalPrice,
      reservationStatus: 'draft',
      startDate: selectedDateRange.startDate,
      endDate: selectedDateRange.endDate,
    });
    setReservationID(newReservationID);
    setPaymentScreen(true);
  };

  return (
    <div className='w-full space-y-3 max-md:w-[340px]'>
      <h2 className=' text-primary-main text-2xl font-semibold'>
        Reserve Your Space
      </h2>
      {!paymentScreen && (
        <div className='space-y-3'>
          <DateRange
            className='w-full'
            ranges={[selectedDateRange]}
            showDateDisplay={false}
            minDate={new Date()}
            direction='vertical'
            // disabledDates={disabledDates}
            onChange={(ranges) => setSelectedDateRange(ranges.selection)}
          />
          <h2 className=' flex justify-between text-2xl font-semibold'>
            <span className='text-secondary-main'>Total</span>
            <span>
              {listing.costs?.currency} {totalPrice}
            </span>
          </h2>
          <Button
            variant='contained'
            className='w-full'
            onClick={handleReservation}
          >
            Reserve
          </Button>
        </div>
      )}

      {paymentScreen && reservationID && (
        <PaymentScreen
          total={totalPrice}
          listingID={listing?.$id}
          reservationID={reservationID}
        />
      )}

      <p>Please note that reservations are non-refundable.</p>
    </div>
  );
}

function PaymentScreen({ total, listingID, reservationID }) {
  const { user } = useAuthStore();

  const [clientSecret, setClientSecret] = React.useState('');
  const [initialized, setInitialized] = useState(false);

  React.useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `${user?.firstName}${user?.lastName}`,
        email: user?.email,
        total,
        listingID,
        reservationID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setInitialized(true);
      });
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options: any = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {!initialized && (
        <div className='h-1 w-full overflow-hidden bg-gray-200'>
          <div className='bg-secondary-main h-full animate-pulse'></div>
        </div>
      )}

      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm reservationID={reservationID} />
        </Elements>
      )}
    </>
  );
}

function CheckoutForm({ reservationID }) {
  const stripe = useStripe();
  const elements = useElements();

  // const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!');
            break;
          case 'processing':
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setMessage('Something went wrong.');
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error }: any = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `http://localhost:3000?reserved=true&reservationID=${reservationID}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: 'tabs',
  };

  return (
    <form id='payment-form' className='space-y-2' onSubmit={handleSubmit}>
      {/* <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.target.value)}
      /> */}

      <PaymentElement id='payment-element' options={paymentElementOptions} />
      <Button
        variant='contained'
        disabled={isLoading || !stripe || !elements}
        type='submit'
        className='bg-secondary-main w-full normal-case'
      >
        <span id='button-text'>
          {isLoading ? <div className='spinner' id='spinner'></div> : 'Pay now'}
        </span>
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <div id='payment-message' className='text-red-500'>
          {message}
        </div>
      )}
    </form>
  );
}
