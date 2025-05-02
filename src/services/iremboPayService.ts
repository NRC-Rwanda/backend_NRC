import axios from 'axios';

interface IremboPayResponse {
  transactionId: string;
  status: 'success' | 'failed';
  paymentUrl?: string;
}

export const initiateIremboPayment = async (
  amount: number,
  email: string,
  phone: string,
  callbackUrl: string
): Promise<IremboPayResponse> => {
  try {
    const response = await axios.post('https://api.irembopay.com/payments/initiate', {
      amount,
      email,
      phone,
      callbackUrl,
      service: 'donation'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.IREMBO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const responseData = response.data as {
        transactionId: string;
        paymentUrl: string;
      };
      
      return {
        transactionId: responseData.transactionId,
        status: 'success',
        paymentUrl: responseData.paymentUrl,
      };
  } catch (error: any) {
    console.error('IremboPay Error:', error.response?.data || error.message);
    return {
      transactionId: '',
      status: 'failed'
    };
  }
};